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



# ===================== VUES EVENEMENT CALENDRIER =====================

@api_view(['GET'])
def get_all_evenements_by_etablissement(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    evenements = EvenementCalendrier.objects.filter(etablissement=etab)
    data = []
    for e in evenements:
        data.append({
            'id': e.id,
            'titre': e.titre,
            'description': e.description,
            'heure_debut': e.heure_debut,
            'heure_fin': e.heure_fin,
            'type_evenement': e.type_evenement,
            'est_public': e.est_public,
            'cree_par': e.cree_par.nom_complet if e.cree_par else None,
            'lieu': e.lieu,
            'participants': [u.nom_complet for u in e.participants.all()],
        })
    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([EstPersonnelEtablissement])
def create_evenement(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    titre = request.data.get('titre')
    description = request.data.get('description')
    heure_debut = request.data.get('heure_debut')
    heure_fin = request.data.get('heure_fin')
    type_evenement = request.data.get('type_evenement')
    est_public = request.data.get('est_public', True)
    cree_par_id = request.data.get('cree_par_id')
    lieu = request.data.get('lieu')
    participants_ids = request.data.get('participants_ids', [])
    if not all([titre, description, heure_debut, heure_fin, type_evenement, lieu]):
        return Response({'error': 'Tous les champs requis doivent être fournis.'}, status=status.HTTP_400_BAD_REQUEST)
    cree_par = None
    if cree_par_id:
        try:
            cree_par = Utilisateur.objects.get(id=cree_par_id, etablissement=etab)
        except Utilisateur.DoesNotExist:
            pass
    evenement = EvenementCalendrier(
        etablissement=etab,
        titre=titre,
        description=description,
        heure_debut=heure_debut,
        heure_fin=heure_fin,
        type_evenement=type_evenement,
        est_public=est_public,
        cree_par=cree_par,
        lieu=lieu
    )
    evenement.save()
    if participants_ids:
        participants = Utilisateur.objects.filter(id__in=participants_ids, etablissement=etab)
        evenement.participants.set(participants)
    return Response({'message': 'Événement créé avec succès', 'id': evenement.id}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
@permission_classes([EstPersonnelEtablissement])
def update_evenement_by_id(request, slug, evenement_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        evenement = EvenementCalendrier.objects.get(id=evenement_id, etablissement=etab)
    except (Etablissement.DoesNotExist, EvenementCalendrier.DoesNotExist):
        return Response({'error': 'Événement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    titre = request.data.get('titre')
    description = request.data.get('description')
    heure_debut = request.data.get('heure_debut')
    heure_fin = request.data.get('heure_fin')
    type_evenement = request.data.get('type_evenement')
    est_public = request.data.get('est_public')
    cree_par_id = request.data.get('cree_par_id')
    lieu = request.data.get('lieu')
    participants_ids = request.data.get('participants_ids')
    if titre: evenement.titre = titre
    if description: evenement.description = description
    if heure_debut: evenement.heure_debut = heure_debut
    if heure_fin: evenement.heure_fin = heure_fin
    if type_evenement: evenement.type_evenement = type_evenement
    if est_public is not None: evenement.est_public = est_public
    if cree_par_id:
        try:
            cree_par = Utilisateur.objects.get(id=cree_par_id, etablissement=etab)
            evenement.cree_par = cree_par
        except Utilisateur.DoesNotExist:
            evenement.cree_par = None
    if lieu: evenement.lieu = lieu
    if participants_ids:
        participants = Utilisateur.objects.filter(id__in=participants_ids, etablissement=etab)
        evenement.participants.set(participants)
    evenement.save()
    return Response({'message': 'Événement mis à jour avec succès'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([EstPersonnelEtablissement])
def delete_evenement_by_id(request, slug, evenement_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        evenement = EvenementCalendrier.objects.get(id=evenement_id, etablissement=etab)
        evenement.delete()
        return Response({'message': 'Événement supprimé avec succès'}, status=status.HTTP_204_NO_CONTENT)
    except (Etablissement.DoesNotExist, EvenementCalendrier.DoesNotExist):
        return Response({'error': 'Événement introuvable'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_evenement_by_id(request, slug, evenement_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        evenement = EvenementCalendrier.objects.get(id=evenement_id, etablissement=etab)
    except (Etablissement.DoesNotExist, EvenementCalendrier.DoesNotExist):
        return Response({'error': 'Événement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
    data = {
        'id': evenement.id,
        'titre': evenement.titre,
        'description': evenement.description,
        'heure_debut': evenement.heure_debut,
        'heure_fin': evenement.heure_fin,
        'type_evenement': evenement.type_evenement,
        'est_public': evenement.est_public,
        'cree_par': evenement.cree_par.nom_complet if evenement.cree_par else None,
        'lieu': evenement.lieu,
        'participants': [u.nom_complet for u in evenement.participants.all()],
    }
    return Response(data, status=status.HTTP_200_OK)