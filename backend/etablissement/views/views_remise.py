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



# ===================== VUES REMISE =====================

@api_view(['GET'])
def get_all_remises_by_etablissement(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    remises = Remise.objects.filter(etablissement=etab)
    data = []
    for r in remises:
        data.append({
            'id': r.id,
            'travail': r.travail.id,
            'etudiant': r.etudiant.id,
            'contenu': r.contenu.url if r.contenu else None,
            'date_remise': r.date_remise,
            'note': r.note,
            'commentaires_enseignant': r.commentaires_enseignant,
            'commentaires_etudiant': r.commentaires_etudiant,
            'est_en_retard': r.est_en_retard,
        })
    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([EstPersonnelEtablissement])
def create_remise(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    travail_id = request.data.get('travail_id')
    etudiant_id = request.data.get('etudiant_id')
    contenu = request.FILES.get('contenu')
    date_remise = request.data.get('date_remise')
    note = request.data.get('note')
    commentaires_enseignant = request.data.get('commentaires_enseignant', '')
    commentaires_etudiant = request.data.get('commentaires_etudiant', '')
    est_en_retard = request.data.get('est_en_retard', False)
    if not all([travail_id, etudiant_id, date_remise]):
        return Response({'error': 'Tous les champs requis doivent être fournis.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        travail = Travail.objects.get(id=travail_id, etablissement=etab)
        etudiant = Etudiant.objects.get(id=etudiant_id, etablissement=etab)
    except (Travail.DoesNotExist, Etudiant.DoesNotExist):
        return Response({'error': 'Travail ou étudiant introuvable'}, status=status.HTTP_404_NOT_FOUND)
    remise = Remise(
        etablissement=etab,
        travail=travail,
        etudiant=etudiant,
        contenu=contenu,
        date_remise=date_remise,
        note=note,
        commentaires_enseignant=commentaires_enseignant,
        commentaires_etudiant=commentaires_etudiant,
        est_en_retard=est_en_retard
    )
    remise.save()
    return Response({'message': 'Remise créée avec succès', 'id': remise.id}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
@permission_classes([EstPersonnelEtablissement])
def update_remise_by_id(request, slug, remise_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        remise = Remise.objects.get(id=remise_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Remise.DoesNotExist):
        return Response({'error': 'Remise introuvable'}, status=status.HTTP_404_NOT_FOUND)
    travail_id = request.data.get('travail_id')
    etudiant_id = request.data.get('etudiant_id')
    if travail_id:
        try:
            travail = Travail.objects.get(id=travail_id, etablissement=etab)
            remise.travail = travail
        except Travail.DoesNotExist:
            return Response({'error': 'Travail introuvable'}, status=status.HTTP_404_NOT_FOUND)
    if etudiant_id:
        try:
            etudiant = Etudiant.objects.get(id=etudiant_id, etablissement=etab)
            remise.etudiant = etudiant
        except Etudiant.DoesNotExist:
            return Response({'error': 'Étudiant introuvable'}, status=status.HTTP_404_NOT_FOUND)
    if 'contenu' in request.FILES:
        remise.contenu = request.FILES['contenu']
    remise.date_remise = request.data.get('date_remise', remise.date_remise)
    remise.note = request.data.get('note', remise.note)
    remise.commentaires_enseignant = request.data.get('commentaires_enseignant', remise.commentaires_enseignant)
    remise.commentaires_etudiant = request.data.get('commentaires_etudiant', remise.commentaires_etudiant)
    remise.est_en_retard = request.data.get('est_en_retard', remise.est_en_retard)
    remise.save()
    return Response({'message': 'Remise mise à jour avec succès'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([EstPersonnelEtablissement])
def delete_remise_by_id(request, slug, remise_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        remise = Remise.objects.get(id=remise_id, etablissement=etab)
        remise.delete()
        return Response({'message': 'Remise supprimée avec succès'}, status=status.HTTP_204_NO_CONTENT)
    except (Etablissement.DoesNotExist, Remise.DoesNotExist):
        return Response({'error': 'Remise introuvable'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([EstPersonnelEtablissement])
def get_remise_by_id(request, slug, remise_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        remise = Remise.objects.get(id=remise_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Remise.DoesNotExist):
        return Response({'error': 'Remise introuvable'}, status=status.HTTP_404_NOT_FOUND)

    data = {
        'id': remise.id,
        'travail': remise.travail.id,
        'etudiant': remise.etudiant.id,
        'contenu': remise.contenu.url if remise.contenu else None,
        'date_remise': remise.date_remise,
        'note': remise.note,
        'commentaires_enseignant': remise.commentaires_enseignant,
        'commentaires_etudiant': remise.commentaires_etudiant,
        'est_en_retard': remise.est_en_retard,
    }
    return Response(data, status=status.HTTP_200_OK)