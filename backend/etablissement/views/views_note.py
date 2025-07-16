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



# ===================== VUES_NOTE=====================

@api_view(['GET'])
def get_all_notes_by_etablissement(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    notes = Note.objects.filter(etablissement=etab)
    data = []
    for n in notes:
        data.append({
            'id': n.id,
            'inscription': n.inscription.id,
            'travail': n.travail.id,
            'points_obtenus': n.points_obtenus,
            'points_possibles': n.points_possibles,
            'coefficient': n.coefficient,
            'date_notation': n.date_notation,
            'commentaires': n.commentaires,
            'est_finale': n.est_finale,
            'note_ponderee': n.note_ponderee,
        })
    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([EstPersonnelEtablissement])
def create_note(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    inscription_id = request.data.get('inscription_id')
    travail_id = request.data.get('travail_id')
    points_obtenus = request.data.get('points_obtenus')
    points_possibles = request.data.get('points_possibles')
    coefficient = request.data.get('coefficient', 1.00)
    date_notation = request.data.get('date_notation')
    commentaires = request.data.get('commentaires', '')
    est_finale = request.data.get('est_finale', False)
    if not all([inscription_id, travail_id, points_obtenus, points_possibles, date_notation]):
        return Response({'error': 'Tous les champs requis doivent être fournis.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        inscription = Inscription.objects.get(id=inscription_id, etablissement=etab)
        travail = Travail.objects.get(id=travail_id, etablissement=etab)
    except (Inscription.DoesNotExist, Travail.DoesNotExist):
        return Response({'error': 'Inscription ou travail introuvable'}, status=status.HTTP_404_NOT_FOUND)
    note = Note(
        etablissement=etab,
        inscription=inscription,
        travail=travail,
        points_obtenus=points_obtenus,
        points_possibles=points_possibles,
        coefficient=coefficient,
        date_notation=date_notation,
        commentaires=commentaires,
        est_finale=est_finale
    )
    note.save()
    return Response({'message': 'Note créée avec succès', 'id': note.id}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
@permission_classes([EstPersonnelEtablissement])
def update_note_by_id(request, slug, note_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        note = Note.objects.get(id=note_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Note.DoesNotExist):
        return Response({'error': 'Note introuvable'}, status=status.HTTP_404_NOT_FOUND)
    inscription_id = request.data.get('inscription_id')
    travail_id = request.data.get('travail_id')
    if inscription_id:
        try:
            inscription = Inscription.objects.get(id=inscription_id, etablissement=etab)
            note.inscription = inscription
        except Inscription.DoesNotExist:
            return Response({'error': 'Inscription introuvable'}, status=status.HTTP_404_NOT_FOUND)
    if travail_id:
        try:
            travail = Travail.objects.get(id=travail_id, etablissement=etab)
            note.travail = travail
        except Travail.DoesNotExist:
            return Response({'error': 'Travail introuvable'}, status=status.HTTP_404_NOT_FOUND)
    note.points_obtenus = request.data.get('points_obtenus', note.points_obtenus)
    note.points_possibles = request.data.get('points_possibles', note.points_possibles)
    note.coefficient = request.data.get('coefficient', note.coefficient)
    note.date_notation = request.data.get('date_notation', note.date_notation)
    note.commentaires = request.data.get('commentaires', note.commentaires)
    note.est_finale = request.data.get('est_finale', note.est_finale)
    note.save()
    return Response({'message': 'Note mise à jour avec succès'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([EstPersonnelEtablissement])
def delete_note_by_id(request, slug, note_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        note = Note.objects.get(id=note_id, etablissement=etab)
        note.delete()
        return Response({'message': 'Note supprimée avec succès'}, status=status.HTTP_204_NO_CONTENT)
    except (Etablissement.DoesNotExist, Note.DoesNotExist):
        return Response({'error': 'Note introuvable'}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET'])
def get_note_by_id(request, slug, note_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        note = Note.objects.get(id=note_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Note.DoesNotExist):
        return Response({'error': 'Note introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
    data = {
        'id': note.id,
        'inscription': note.inscription.id,
        'travail': note.travail.id,
        'points_obtenus': note.points_obtenus,
        'points_possibles': note.points_possibles,
        'coefficient': note.coefficient,
        'date_notation': note.date_notation,
        'commentaires': note.commentaires,
        'est_finale': note.est_finale,
        'note_ponderee': note.note_ponderee,
    }
    return Response(data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([EstPersonnelEtablissement])
def get_note_by_id (request, slug, note_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        note = Note.objects.get(id=note_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Note.DoesNotExist):
        return Response({'error': 'Note introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
    data = {
        'id': note.id,
        'inscription': note.inscription.id,
        'travail': note.travail.id,
        'points_obtenus': note.points_obtenus,
        'points_possibles': note.points_possibles,
        'coefficient': note.coefficient,
        'date_notation': note.date_notation,
        'commentaires': note.commentaires,
        'est_finale': note.est_finale,
        'note_ponderee': note.note_ponderee,
    }
    return Response(data, status=status.HTTP_200_OK)