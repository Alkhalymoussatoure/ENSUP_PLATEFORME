from datetime import timezone
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
from rest_framework import status

from Messagerie.permissions import EstConnecteEtDansEtablissement, EstPersonnelEtablissement
from etablissement.models import  MessageForum,Message,Notification, Section, Inscription, Utilisateur,Etablissement,Forum

# Create your views here.

@api_view(['POST'])
@permission_classes([EstPersonnelEtablissement])
def envoyer_message_unifie(request, slug):
    try:
        etablissement = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)

    expediteur = request.utilisateur
    mode = request.POST.get('mode_envoi')  # 'prive', 'section', 'departement'
    sujet = request.POST.get('sujet')
    contenu = request.POST.get('contenu', '')
    fichier_joint = request.FILES.get('fichier_joint')
    parent_id = request.POST.get('message_parent')
    type_message = request.POST.get('type_message', 'prive')  # 'prive', 'groupe', 'annonce'
    destinataires = []

    #  Mode "prive"
    if mode == 'prive':
        matricules = request.POST.getlist('destinataires', [])
        destinataires = Utilisateur.objects.filter(
            matricule__in=matricules,
            etablissement=etablissement
        )

    #  Mode "section"
    elif mode == 'section':
        section_id = request.POST.get('section_id')
        inscriptions = Inscription.objects.filter(section_id=section_id)
        destinataires = [ins.etudiant.utilisateur for ins in inscriptions]

    #  Mode "departement"
    elif mode == 'departement':
        departement_id = request.POST.get('departement_id')
        sections = Section.objects.filter(departement_id=departement_id)
        inscriptions = Inscription.objects.filter(section__in=sections)
        destinataires = [ins.etudiant.utilisateur for ins in inscriptions]

    else:
        return Response({'error': 'Mode d’envoi invalide.'}, status=status.HTTP_400_BAD_REQUEST)

    #  Validation minimale
    if not sujet or not type_message or not destinataires:
        return Response({'error': 'Sujet, type_message et destinataires requis.'}, status=status.HTTP_400_BAD_REQUEST)

    #  Réponse à un message existant
    parent = None
    if parent_id:
        parent = Message.objects.filter(id=parent_id, etablissement=etablissement).first()

    #  Création du message
    message = Message.objects.create(
        expediteur=expediteur,
        etablissement=etablissement,
        sujet=sujet,
        contenu=contenu,
        fichier_joint=fichier_joint,
        type_message=type_message,
        message_parent=parent
    )
    message.destinataires.set(destinataires)

    return Response({
        'message': 'Message envoyé avec succès.',
        'id': message.id,
        'mode': mode,
        'type_message': type_message,
        'destinataires': [u.nom_complet for u in destinataires],
        'reply_to': parent.id if parent else None,
        'piece_jointe': bool(fichier_joint)
    }, status=status.HTTP_201_CREATED)
    
    
# liste des  Message reçu
@api_view(['GET'])
@permission_classes([EstConnecteEtDansEtablissement])
def message_boite_reception(request, slug):
    utilisateur = request.utilisateur
    messages = utilisateur.messages_recus.filter(etablissement__slug=slug).order_by('-date_envoi')

    resultat = [
        {
            'id': msg.id,
            'sujet': msg.sujet,
            'expediteur': msg.expediteur.nom_complet,
            'date_envoi': msg.date_envoi,
            'lu': msg.est_lu,
            'date_lecture': msg.date_lecture,
            'type': msg.type_message,
            'reply_to': msg.message_parent.id if msg.message_parent else None,
            'piece_jointe': msg.fichier_joint.url if msg.fichier_joint else None
        }
        for msg in messages
    ]

    non_lus = messages.filter(est_lu=False).count()

    return Response({
        'messages': resultat,
        'messages_non_lus': non_lus
    })

@api_view(['POST'])
@permission_classes([EstConnecteEtDansEtablissement])
def message_marquer_lu(request, slug):
    utilisateur = request.utilisateur
    message_id = request.data.get('id')

    try:
        msg = Message.objects.get(id=message_id, etablissement__slug=slug, destinataires=utilisateur)
    except Message.DoesNotExist:
        return Response({'error': 'Message introuvable ou non autorisé'}, status=status.HTTP_404_NOT_FOUND)

    if not msg.est_lu:
        msg.est_lu = True
        msg.date_lecture = timezone.now()
        msg.save()

    return Response({'message': 'Message marqué comme lu'})


@api_view(['GET'])
@permission_classes([EstConnecteEtDansEtablissement])
def message_boite_envoi(request, slug):
    utilisateur = request.utilisateur
    messages = utilisateur.messages_envoyes.filter(etablissement__slug=slug).order_by('-date_envoi')

    resultat = [
        {
            'id': msg.id,
            'sujet': msg.sujet,
            'destinataires': [u.nom_complet for u in msg.destinataires.all()],
            'date_envoi': msg.date_envoi,
            'type': msg.type_message,
            'reply_to': msg.message_parent.id if msg.message_parent else None,
            'piece_jointe': msg.fichier_joint.url if msg.fichier_joint else None
        }
        for msg in messages
    ]

    return Response(resultat)


@api_view(['POST'])
@permission_classes([EstPersonnelEtablissement])
def publier_message_forum(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)

    forum_id = request.data.get('forum_id')
    auteur_id = request.data.get('auteur_id')
    titre = request.data.get('titre')
    contenu = request.data.get('contenu')
    message_parent_id = request.data.get('message_parent_id')
    est_epingle = request.data.get('est_epingle', False)
    nombre_vues = request.data.get('nombre_vues', 0)

    if not all([forum_id, auteur_id, titre, contenu]):
        return Response({'error': 'forum_id, auteur_id, titre et contenu sont requis.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        forum = Forum.objects.get(id=forum_id, etablissement=etab)
        auteur = Utilisateur.objects.get(id=auteur_id, etablissement=etab)
    except (Forum.DoesNotExist, Utilisateur.DoesNotExist):
        return Response({'error': 'Forum ou auteur introuvable'}, status=status.HTTP_404_NOT_FOUND)

    # 🔐 Bloc ajouté ici pour restreindre l’accès
    if forum.est_prive and auteur.role != 'enseignant':
        return Response({'error': "Accès refusé à ce forum privé"}, status=status.HTTP_403_FORBIDDEN)

    message_parent = None
    if message_parent_id:
        try:
            message_parent = MessageForum.objects.get(id=message_parent_id, etablissement=etab)
        except MessageForum.DoesNotExist:
            pass

    message = MessageForum.objects.create(
        forum=forum,
        etablissement=etab,
        auteur=auteur,
        titre=titre,
        contenu=contenu,
        message_parent=message_parent,
        est_epingle=est_epingle,
        nombre_vues=nombre_vues
    )

    return Response({'message': 'Message de forum créé avec succès', 'id': message.id}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def rechercher_utilisateur(request, slug):
    query = request.GET.get('q', '')
    if not query:
        return Response([]) 
    
    utilisateurs = Utilisateur.objects.filter(
        etablissement__slug=slug,
        est_actif=True
    ).filter(
        Q(nom_complet__icontains=query) | Q(matricule__icontains=query)
    )[:10]

    resultat = [{'nom': u.nom_complet, 'matricule': u.matricule, 'role': u.role} for u in utilisateurs]
    return Response(resultat)


@api_view(['GET'])
def liste_notifications(request, slug):
    utilisateur = request.utilisateur
    notifications = utilisateur.notifications.order_by('-date_creation')[:20]
    resultat = [
        {
            'titre': n.titre,
            'texte': n.texte,
            'lien': n.lien_associe,
            'est_lue': n.est_lue,
            'date': n.date_creation
        }
        for n in notifications
    ]
    return Response(resultat)

# notifiction 
@api_view(['PATCH'])
@permission_classes([EstConnecteEtDansEtablissement])
def marquer_notification_lue(request, slug, notification_id):
    utilisateur = request.utilisateur

    try:
        notification = utilisateur.notifications.get(id=notification_id)
    except Notification.DoesNotExist:
        return Response({'error': 'Notification introuvable.'}, status=404)

    notification.est_lue = True
    notification.save()

    return Response({'message': 'Notification marquée comme lue.'}, status=200)

@api_view(['DELETE'])
@permission_classes([EstConnecteEtDansEtablissement])
def supprimer_notification(request, slug, notification_id):
    utilisateur = request.utilisateur

    try:
        notification = utilisateur.notifications.get(id=notification_id)
    except Notification.DoesNotExist:
        return Response({'error': 'Notification introuvable.'}, status=404)

    notification.delete()
    return Response({'message': 'Notification supprimée.'}, status=204)



# ===================== VUES MESSAGE =====================


@api_view(['GET'])
def get_all_messages_by_etablissement(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    messages = Message.objects.filter(etablissement=etab)
    data = []
    for m in messages:
        data.append({
            'id': m.id,
            'expediteur': m.expediteur.nom_complet,
            'destinataires': [u.nom_complet for u in m.destinataires.all()],
            'sujet': m.sujet,
            'contenu': m.contenu,
            'fichier_joint': m.fichier_joint.url if m.fichier_joint else None,
            'date_envoi': m.date_envoi,
            'est_lu': m.est_lu,
            'date_lecture': m.date_lecture,
            'message_parent': m.message_parent.id if m.message_parent else None,
            'type_message': m.type_message,
        })
    return Response(data, status=status.HTTP_200_OK)



@api_view(['PUT'])
@permission_classes([EstPersonnelEtablissement])
def update_message_by_id(request, slug, message_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        message = Message.objects.get(id=message_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Message.DoesNotExist):
        return Response({'error': 'Message introuvable'}, status=status.HTTP_404_NOT_FOUND)
    expediteur_id = request.data.get('expediteur_id')
    destinataires_ids = request.data.get('destinataires_ids')
    if expediteur_id:
        try:
            expediteur = Utilisateur.objects.get(id=expediteur_id, etablissement=etab)
            message.expediteur = expediteur
        except Utilisateur.DoesNotExist:
            return Response({'error': 'Expéditeur introuvable'}, status=status.HTTP_404_NOT_FOUND)
    if destinataires_ids:
        destinataires = Utilisateur.objects.filter(id__in=destinataires_ids, etablissement=etab)
        message.destinataires.set(destinataires)
    message.sujet = request.data.get('sujet', message.sujet)
    message.contenu = request.data.get('contenu', message.contenu)
    if 'fichier_joint' in request.FILES:
        message.fichier_joint = request.FILES['fichier_joint']
    message.est_lu = request.data.get('est_lu', message.est_lu)
    message.date_lecture = request.data.get('date_lecture', message.date_lecture)
    message.type_message = request.data.get('type_message', message.type_message)
    message.save()
    return Response({'message': 'Message mis à jour avec succès'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([EstPersonnelEtablissement])
def delete_message_by_id(request, slug, message_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        message = Message.objects.get(id=message_id, etablissement=etab)
        message.delete()
        return Response({'message': 'Message supprimé avec succès'}, status=status.HTTP_204_NO_CONTENT)
    except (Etablissement.DoesNotExist, Message.DoesNotExist):
        return Response({'error': 'Message introuvable'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_message_by_id(request, slug, message_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        message = Message.objects.get(id=message_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Message.DoesNotExist):
        return Response({'error': 'Message introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
    data = {
        'id': message.id,
        'expediteur': message.expediteur.nom_complet,
        'destinataires': [u.nom_complet for u in message.destinataires.all()],
        'sujet': message.sujet,
        'contenu': message.contenu,
        'fichier_joint': message.fichier_joint.url if message.fichier_joint else None,
        'date_envoi': message.date_envoi,
        'est_lu': message.est_lu,
        'date_lecture': message.date_lecture,
        'message_parent': message.message_parent.id if message.message_parent else None,
        'type_message': message.type_message,
    }
    
    return Response(data, status=status.HTTP_200_OK)



# ===================== VUES MESSAGEFORUM =====================

@api_view(['GET'])
def get_all_messages_forum_by_etablissement(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    messages = MessageForum.objects.filter(etablissement=etab)
    data = []
    for m in messages:
        data.append({
            'id': m.id,
            'forum': m.forum.id,
            'auteur': m.auteur.nom_complet,
            'titre': m.titre,
            'contenu': m.contenu,
            'date_publication': m.date_publication,
            'message_parent': m.message_parent.id if m.message_parent else None,
            'est_epingle': m.est_epingle,
            'nombre_vues': m.nombre_vues,
        })
    return Response(data, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([EstPersonnelEtablissement])
def update_message_forum_by_id(request, slug, message_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        message = MessageForum.objects.get(id=message_id, etablissement=etab)
    except (Etablissement.DoesNotExist, MessageForum.DoesNotExist):
        return Response({'error': 'Message de forum introuvable'}, status=status.HTTP_404_NOT_FOUND)
    forum_id = request.data.get('forum_id')
    auteur_id = request.data.get('auteur_id')
    if forum_id:
        try:
            forum = Forum.objects.get(id=forum_id, etablissement=etab)
            message.forum = forum
        except Forum.DoesNotExist:
            pass
    if auteur_id:
        try:
            auteur = Utilisateur.objects.get(id=auteur_id, etablissement=etab)
            message.auteur = auteur
        except Utilisateur.DoesNotExist:
            pass
    message.titre = request.data.get('titre', message.titre)
    message.contenu = request.data.get('contenu', message.contenu)
    message.est_epingle = request.data.get('est_epingle', message.est_epingle)
    message.nombre_vues = request.data.get('nombre_vues', message.nombre_vues)
    message.save()
    return Response({'message': 'Message de forum mis à jour avec succès'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([EstPersonnelEtablissement])
def delete_message_forum_by_id(request, slug, message_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        message = MessageForum.objects.get(id=message_id, etablissement=etab)
        message.delete()
        return Response({'message': 'Message de forum supprimé avec succès'}, status=status.HTTP_204_NO_CONTENT)
    except (Etablissement.DoesNotExist, MessageForum.DoesNotExist):
        return Response({'error': 'Message de forum introuvable'}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET'])
def get_message_forum_by_id(request, slug, message_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        message = MessageForum.objects.get(id=message_id, etablissement=etab)
    except (Etablissement.DoesNotExist, MessageForum.DoesNotExist):
        return Response({'error': 'Message de forum introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
    data = {
        'id': message.id,
        'forum': message.forum.id,
        'auteur': message.auteur.nom_complet,
        'titre': message.titre,
        'contenu': message.contenu,
        'date_publication': message.date_publication,
        'message_parent': message.message_parent.id if message.message_parent else None,
        'est_epingle': message.est_epingle,
        'nombre_vues': message.nombre_vues,
    }
    return Response(data, status=status.HTTP_200_OK)