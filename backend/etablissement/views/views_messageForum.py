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

@api_view(['POST'])
@permission_classes([EstPersonnelEtablissement])
def create_message_forum(request, slug):
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
    message_parent = None
    if message_parent_id:
        try:
            message_parent = MessageForum.objects.get(id=message_parent_id, etablissement=etab)
        except MessageForum.DoesNotExist:
            pass
    message = MessageForum(
        forum=forum,
        etablissement=etab,
        auteur=auteur,
        titre=titre,
        contenu=contenu,
        message_parent=message_parent,
        est_epingle=est_epingle,
        nombre_vues=nombre_vues
    )
    message.save()
    return Response({'message': 'Message de forum créé avec succès', 'id': message.id}, status=status.HTTP_201_CREATED)

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