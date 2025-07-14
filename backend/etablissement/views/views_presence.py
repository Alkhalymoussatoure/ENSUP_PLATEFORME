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



# ===================== VUES PRESENCE =====================

@api_view(['GET'])
def get_all_presences_by_etablissement(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    presences = Presence.objects.filter(etablissement=etab)
    data = []
    for p in presences:
        data.append({
            'id': p.id,
            'inscription': p.inscription.id,
            'date_cours': p.date_cours,
            'statut': p.statut,
            'notes': p.notes,
            'heure_arrivee': p.heure_arrivee,
            'heure_depart': p.heure_depart,
        })
    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([EstPersonnelEtablissement])
def create_presence(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    inscription_id = request.data.get('inscription_id')
    date_cours = request.data.get('date_cours')
    statut = request.data.get('statut')
    notes = request.data.get('notes', '')
    heure_arrivee = request.data.get('heure_arrivee')
    heure_depart = request.data.get('heure_depart')
    if not all([inscription_id, date_cours, statut]):
        return Response({'error': 'Tous les champs requis doivent être fournis.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        inscription = Inscription.objects.get(id=inscription_id, etablissement=etab)
    except Inscription.DoesNotExist:
        return Response({'error': 'Inscription introuvable'}, status=status.HTTP_404_NOT_FOUND)
    presence = Presence(
        etablissement=etab,
        inscription=inscription,
        date_cours=date_cours,
        statut=statut,
        notes=notes,
        heure_arrivee=heure_arrivee,
        heure_depart=heure_depart
    )
    presence.save()
    return Response({'message': 'Présence créée avec succès', 'id': presence.id}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
@permission_classes([EstPersonnelEtablissement])
def update_presence_by_id(request, slug, presence_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        presence = Presence.objects.get(id=presence_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Presence.DoesNotExist):
        return Response({'error': 'Présence introuvable'}, status=status.HTTP_404_NOT_FOUND)
    inscription_id = request.data.get('inscription_id')
    if inscription_id:
        try:
            inscription = Inscription.objects.get(id=inscription_id, etablissement=etab)
            presence.inscription = inscription
        except Inscription.DoesNotExist:
            return Response({'error': 'Inscription introuvable'}, status=status.HTTP_404_NOT_FOUND)
    presence.date_cours = request.data.get('date_cours', presence.date_cours)
    presence.statut = request.data.get('statut', presence.statut)
    presence.notes = request.data.get('notes', presence.notes)
    presence.heure_arrivee = request.data.get('heure_arrivee', presence.heure_arrivee)
    presence.heure_depart = request.data.get('heure_depart', presence.heure_depart)
    presence.save()
    return Response({'message': 'Présence mise à jour avec succès'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([EstPersonnelEtablissement])
def delete_presence_by_id(request, slug, presence_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        presence = Presence.objects.get(id=presence_id, etablissement=etab)
        presence.delete()
        return Response({'message': 'Présence supprimée avec succès'}, status=status.HTTP_204_NO_CONTENT)
    except (Etablissement.DoesNotExist, Presence.DoesNotExist):
        return Response({'error': 'Présence introuvable'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_presence_by_id(request, slug, presence_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        presence = Presence.objects.get(id=presence_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Presence.DoesNotExist):
        return Response({'error': 'Présence introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
    data = {
        'id': presence.id,
        'inscription': presence.inscription.id,
        'date_cours': presence.date_cours,
        'statut': presence.statut,
        'notes': presence.notes,
        'heure_arrivee': presence.heure_arrivee,
        'heure_depart': presence.heure_depart,
    }
    return Response(data, status=status.HTTP_200_OK)