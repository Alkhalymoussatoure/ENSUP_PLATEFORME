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



# ===================== VUES SESSION =====================


@api_view(['GET'])
def get_all_sessions_by_etablissement(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)

    sessions = Session.objects.filter(etablissement=etab)
    data = []
    for s in sessions:
        data.append({
            'id': s.id,
            'nom': s.nom,
            'saison': s.saison,
            'annee': s.annee,
            'date_debut': s.date_debut,
            'date_fin': s.date_fin,
            'date_limite_inscription': s.date_limite_inscription,
            'date_limite_abandon': s.date_limite_abandon,
            'est_courante': s.est_courante,
        })
    return Response(data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_session_by_id(request, slug, session_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        session = Session.objects.get(id=session_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Session.DoesNotExist):
        return Response({'error': 'Session introuvable'}, status=status.HTTP_404_NOT_FOUND)

    data = {
        'id': session.id,
        'nom': session.nom,
        'saison': session.saison,
        'annee': session.annee,
        'date_debut': session.date_debut,
        'date_fin': session.date_fin,
        'date_limite_inscription': session.date_limite_inscription,
        'date_limite_abandon': session.date_limite_abandon,
        'est_courante': session.est_courante,
    }
    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([EstPersonnelEtablissement])
def create_session(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)

    nom = request.data.get('nom')
    saison = request.data.get('saison')
    annee = request.data.get('annee')
    date_debut = request.data.get('date_debut')
    date_fin = request.data.get('date_fin')
    date_limite_inscription = request.data.get('date_limite_inscription')
    date_limite_abandon = request.data.get('date_limite_abandon')
    est_courante = request.data.get('est_courante', False)

    if not all([nom, saison, annee, date_debut, date_fin, date_limite_inscription, date_limite_abandon]):
        return Response({'error': 'Tous les champs requis doivent être fournis.'}, status=status.HTTP_400_BAD_REQUEST)

    session = Session(
        etablissement=etab,
        nom=nom,
        saison=saison,
        annee=annee,
        date_debut=date_debut,
        date_fin=date_fin,
        date_limite_inscription=date_limite_inscription,
        date_limite_abandon=date_limite_abandon,
        est_courante=est_courante
    )
    session.save()
    return Response({'message': 'Session créée avec succès', 'id': session.id}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
@permission_classes([EstPersonnelEtablissement])
def update_session_by_id(request, slug, session_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        session = Session.objects.get(id=session_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Session.DoesNotExist):
        return Response({'error': 'Session introuvable'}, status=status.HTTP_404_NOT_FOUND)

    session.nom = request.data.get('nom', session.nom)
    session.saison = request.data.get('saison', session.saison)
    session.annee = request.data.get('annee', session.annee)
    session.date_debut = request.data.get('date_debut', session.date_debut)
    session.date_fin = request.data.get('date_fin', session.date_fin)
    session.date_limite_inscription = request.data.get('date_limite_inscription', session.date_limite_inscription)
    session.date_limite_abandon = request.data.get('date_limite_abandon', session.date_limite_abandon)
    session.est_courante = request.data.get('est_courante', session.est_courante)
    session.save()
    return Response({'message': 'Session mise à jour avec succès'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([EstPersonnelEtablissement])
def delete_session_by_id(request, slug, session_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        session = Session.objects.get(id=session_id, etablissement=etab)
        session.delete()
        return Response({'message': 'Session supprimée avec succès'}, status=status.HTTP_204_NO_CONTENT)
    except (Etablissement.DoesNotExist, Session.DoesNotExist):
        return Response({'error': 'Session introuvable'}, status=status.HTTP_404_NOT_FOUND)
