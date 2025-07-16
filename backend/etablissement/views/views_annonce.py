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
from Messagerie.permissions import EstPersonnelEtablissement
from rest_framework.views import APIView



# ===================== VUES ANNONCE =====================

@api_view(['GET'])
def get_all_annonces_by_etablissement(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    annonces = Annonce.objects.filter(etablissement=etab)
    data = []
    for a in annonces:
        data.append({
            'id': a.id,
            'auteur': a.auteur.nom_complet,
            'section': a.section.id if a.section else None,
            'titre': a.titre,
            'contenu': a.contenu,
            'date_publication': a.date_publication,
            'date_expiration': a.date_expiration,
            'est_urgent': a.est_urgent,
            'est_generale': a.est_generale,
            'destinataires': a.destinataires,
        })
    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([EstPersonnelEtablissement])
def create_annonce(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    auteur_id = request.data.get('auteur_id')
    section_id = request.data.get('section_id')
    titre = request.data.get('titre')
    contenu = request.data.get('contenu')
    date_expiration = request.data.get('date_expiration')
    est_urgent = request.data.get('est_urgent', False)
    est_generale = request.data.get('est_generale', False)
    destinataires = request.data.get('destinataires', '')
    if not all([auteur_id, titre, contenu]):
        return Response({'error': 'auteur_id, titre et contenu sont requis.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        auteur = Utilisateur.objects.get(id=auteur_id, etablissement=etab)
    except Utilisateur.DoesNotExist:
        return Response({'error': 'Auteur introuvable'}, status=status.HTTP_404_NOT_FOUND)
    section = None
    if section_id:
        try:
            section = Section.objects.get(id=section_id, etablissement=etab)
        except Section.DoesNotExist:
            pass
    annonce = Annonce(
        etablissement=etab,
        auteur=auteur,
        section=section,
        titre=titre,
        contenu=contenu,
        date_expiration=date_expiration,
        est_urgent=est_urgent,
        est_generale=est_generale,
        destinataires=destinataires
    )
    annonce.save()
    return Response({'message': 'Annonce créée avec succès', 'id': annonce.id}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
@permission_classes([EstPersonnelEtablissement])
def update_annonce_by_id(request, slug, annonce_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        annonce = Annonce.objects.get(id=annonce_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Annonce.DoesNotExist):
        return Response({'error': 'Annonce introuvable'}, status=status.HTTP_404_NOT_FOUND)
    auteur_id = request.data.get('auteur_id')
    section_id = request.data.get('section_id')
    if auteur_id:
        try:
            auteur = Utilisateur.objects.get(id=auteur_id, etablissement=etab)
            annonce.auteur = auteur
        except Utilisateur.DoesNotExist:
            return Response({'error': 'Auteur introuvable'}, status=status.HTTP_404_NOT_FOUND)
    if section_id:
        try:
            section = Section.objects.get(id=section_id, etablissement=etab)
            annonce.section = section
        except Section.DoesNotExist:
            annonce.section = None
    annonce.titre = request.data.get('titre', annonce.titre)
    annonce.contenu = request.data.get('contenu', annonce.contenu)
    annonce.date_expiration = request.data.get('date_expiration', annonce.date_expiration)
    annonce.est_urgent = request.data.get('est_urgent', annonce.est_urgent)
    annonce.est_generale = request.data.get('est_generale', annonce.est_generale)
    annonce.destinataires = request.data.get('destinataires', annonce.destinataires)
    annonce.save()
    return Response({'message': 'Annonce mise à jour avec succès'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([EstPersonnelEtablissement])
def delete_annonce_by_id(request, slug, annonce_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        annonce = Annonce.objects.get(id=annonce_id, etablissement=etab)
        annonce.delete()
        return Response({'message': 'Annonce supprimée avec succès'}, status=status.HTTP_204_NO_CONTENT)
    except (Etablissement.DoesNotExist, Annonce.DoesNotExist):
        return Response({'error': 'Annonce introuvable'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_annonce_by_id(request, slug, annonce_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        annonce = Annonce.objects.get(id=annonce_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Annonce.DoesNotExist):
        return Response({'error': 'Annonce introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
    data = {
        'id': annonce.id,
        'auteur': annonce.auteur.nom_complet,
        'section': annonce.section.id if annonce.section else None,
        'titre': annonce.titre,
        'contenu': annonce.contenu,
        'date_publication': annonce.date_publication,
        'date_expiration': annonce.date_expiration,
        'est_urgent': annonce.est_urgent,
        'est_generale': annonce.est_generale,
        'destinataires': annonce.destinataires,
    }
    return Response(data, status=status.HTTP_200_OK)