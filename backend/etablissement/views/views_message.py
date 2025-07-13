from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework import status

from etablissement.models import Etablissement
from authentification.models import Utilisateur
from etablissement.models import Etudiant,Enseignant,Programme,Departement
from etablissement.models import Cours, Session, Section, Horaire
from etablissement.models import Inscription, Facture, Travail, Remise
from etablissement.models import Note, Presence, Message, Annonce
from etablissement.models import Forum, MessageForum,Local, Document
from etablissement.models import EvenementCalendrier,FraisScolarite,Paiement
from permissions.permissions import EstPersonnelEtablissement
from rest_framework.views import APIView



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

@api_view(['POST'])
@permission_classes([EstPersonnelEtablissement])
def create_message(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    expediteur_id = request.data.get('expediteur_id')
    destinataires_ids = request.data.get('destinataires_ids', [])
    sujet = request.data.get('sujet')
    contenu = request.data.get('contenu', '')
    fichier_joint = request.FILES.get('fichier_joint')
    message_parent_id = request.data.get('message_parent_id')
    type_message = request.data.get('type_message')
    if not all([expediteur_id, sujet, type_message]):
        return Response({'error': 'expediteur_id, sujet et type_message sont requis.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        expediteur = Utilisateur.objects.get(id=expediteur_id, etablissement=etab)
    except Utilisateur.DoesNotExist:
        return Response({'error': 'Expéditeur introuvable'}, status=status.HTTP_404_NOT_FOUND)
    message = Message(
        etablissement=etab,
        expediteur=expediteur,
        sujet=sujet,
        contenu=contenu,
        fichier_joint=fichier_joint,
        type_message=type_message
    )
    if message_parent_id:
        try:
            parent = Message.objects.get(id=message_parent_id, etablissement=etab)
            message.message_parent = parent
        except Message.DoesNotExist:
            pass
    message.save()
    if destinataires_ids:
        destinataires = Utilisateur.objects.filter(id__in=destinataires_ids, etablissement=etab)
        message.destinataires.set(destinataires)
    return Response({'message': 'Message créé avec succès', 'id': message.id}, status=status.HTTP_201_CREATED)

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