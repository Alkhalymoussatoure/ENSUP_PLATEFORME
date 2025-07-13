from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q

from Messagerie.permissions import EstConnecteEtDansEtablissement, EstPersonnelEtablissement
from etablissement.models import  MessageForum,Message,Notification, Section, Inscription, Utilisateur

# Create your views here.

@api_view(['POST'])
@permission_classes([EstConnecteEtDansEtablissement])
def envoyer_message(request, slug):
    expediteur = request.utilisateur
    sujet = request.data.get('sujet')
    contenu = request.data.get('contenu', '')
    matricules = request.data.get('destinataires', [])  # liste attendue

    if not sujet or not matricules:
        return Response({'error': 'Sujet et destinataires requis'}, status=400)

    # Récupérer les utilisateurs
    from authentification.models import Utilisateur
    destinataires = Utilisateur.objects.filter(matricule__in=matricules, etablissement__slug=slug)

    if not destinataires.exists():
        return Response({'error': 'Aucun destinataire valide'}, status=404)

    # Créer et sauvegarder le message
    message = Message.objects.create(
        expediteur=expediteur,
        etablissement=expediteur.etablissement,
        sujet=sujet,
        contenu=contenu,
        type_message='prive'
    )
    message.destinataires.set(destinataires)

    return Response({'message': 'Message envoyé avec succès'}, status=201)


@api_view(['POST'])
@permission_classes([EstPersonnelEtablissement])  # Enseignant / Directeur / Admin
def envoyer_message_groupe(request, slug):
    expediteur = request.utilisateur
    data = request.data

    sujet = data.get('sujet')
    contenu = data.get('contenu', '')
    groupe_type = data.get('groupe_type')
    groupe_id = data.get('groupe_id')

    if not sujet or not groupe_type or not groupe_id:
        return Response({'error': 'Sujet, groupe_type et groupe_id requis.'}, status=400)

    #  Récupération des utilisateurs ciblés

    destinataires = []

    if groupe_type == 'section':
     
        inscriptions = Inscription.objects.filter(section_id=groupe_id)
        destinataires = [ins.etudiant.utilisateur for ins in inscriptions]

    elif groupe_type == 'departement':
    
        sections = Section.objects.filter(departement_id=groupe_id)
        inscriptions = Inscription.objects.filter(section__in=sections)
        destinataires = [ins.etudiant.utilisateur for ins in inscriptions]

    else:
        return Response({'error': 'Type de groupe invalide.'}, status=400)

    if not destinataires:
        return Response({'error': 'Aucun utilisateur trouvé pour ce groupe.'}, status=404)

    #  Création du message
    message = Message.objects.create(
        expediteur=expediteur,
        etablissement=expediteur.etablissement,
        sujet=sujet,
        contenu=contenu,
        type_message='groupe'
    )
    message.destinataires.set(destinataires)

    return Response({'message': f'Message envoyé à {len(destinataires)} personnes.'}, status=201)




# liste des  Message reçu
@api_view(['GET'])
@permission_classes([EstConnecteEtDansEtablissement])
def boite_reception(request, slug):
    utilisateur = request.utilisateur
    messages = utilisateur.messages_recus.filter(etablissement__slug=slug).order_by('-date_envoi')

    resultat = [
        {
            'id': msg.id,
            'sujet': msg.sujet,
            'expediteur': msg.expediteur.nom_complet,
            'date_envoi': msg.date_envoi,
            'lu': msg.est_lu
        }
        for msg in messages
    ]

    return Response(resultat)


@api_view(['GET'])
def rechercher_utilisateur(request, slug):
    query = request.GET.get('q', '')
    if not query:
        return Response([])

    from authentification.models import Utilisateur
    utilisateurs = Utilisateur.objects.filter(
        etablissement__slug=slug,
        est_actif=True
    ).filter(
        Q(nom_complet__icontains=query) | Q(matricule__icontains=query)
    )[:10]

    resultat = [{'nom': u.nom_complet, 'matricule': u.matricule, 'role': u.role} for u in utilisateurs]
    return Response(resultat)


#forum message 
@api_view(['POST'])
@permission_classes([EstConnecteEtDansEtablissement])
def publier_message_forum(request, slug, forum_slug):
    from .models import Forum

    utilisateur = request.utilisateur
    forum = Forum.objects.get(slug=forum_slug, etablissement__slug=slug)

    titre = request.data.get('titre')
    contenu = request.data.get('contenu')

    if not titre or not contenu:
        return Response({'error': 'Titre et contenu requis'}, status=400)

    message = MessageForum.objects.create(
        forum=forum,
        etablissement=forum.etablissement,
        auteur=utilisateur,
        titre=titre,
        contenu=contenu
    )

    return Response({'message': 'Message posté dans le forum'}, status=201)



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
