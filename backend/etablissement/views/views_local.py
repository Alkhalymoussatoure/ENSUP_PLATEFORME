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


# ===================== VUES LOCAL =====================

@api_view(['GET'])
def get_all_locaux_by_etablissement(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    locaux = Local.objects.filter(etablissement=etab)
    data = []
    for l in locaux:
        data.append({
            'id': l.id,
            'numero_local': l.numero_local,
            'batiment': l.batiment,
            'capacite': l.capacite,
            'equipement': l.equipement,
            'responsables': [u.nom_complet for u in l.responsables.all()],
            'est_disponible': l.est_disponible,
            'type_local': l.type_local,
        })
    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([EstPersonnelEtablissement])
def create_local(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    numero_local = request.data.get('numero_local')
    batiment = request.data.get('batiment')
    capacite = request.data.get('capacite')
    equipement = request.data.get('equipement', '')
    responsables_ids = request.data.get('responsables_ids', [])
    est_disponible = request.data.get('est_disponible', True)
    type_local = request.data.get('type_local')
    if not all([numero_local, batiment, capacite, type_local]):
        return Response({'error': 'Tous les champs requis doivent être fournis.'}, status=status.HTTP_400_BAD_REQUEST)
    local = Local(
        etablissement=etab,
        numero_local=numero_local,
        batiment=batiment,
        capacite=capacite,
        equipement=equipement,
        est_disponible=est_disponible,
        type_local=type_local
    )
    local.save()
    if responsables_ids:
        responsables = Utilisateur.objects.filter(id__in=responsables_ids, etablissement=etab)
        local.responsables.set(responsables)
    return Response({'message': 'Local créé avec succès', 'id': local.id}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
@permission_classes([EstPersonnelEtablissement])
def update_local_by_id(request, slug, local_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        local = Local.objects.get(id=local_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Local.DoesNotExist):
        return Response({'error': 'Local introuvable'}, status=status.HTTP_404_NOT_FOUND)
    local.numero_local = request.data.get('numero_local', local.numero_local)
    local.batiment = request.data.get('batiment', local.batiment)
    local.capacite = request.data.get('capacite', local.capacite)
    local.equipement = request.data.get('equipement', local.equipement)
    local.est_disponible = request.data.get('est_disponible', local.est_disponible)
    local.type_local = request.data.get('type_local', local.type_local)
    responsables_ids = request.data.get('responsables_ids')
    if responsables_ids:
        responsables = Utilisateur.objects.filter(id__in=responsables_ids, etablissement=etab)
        local.responsables.set(responsables)
    local.save()
    return Response({'message': 'Local mis à jour avec succès'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([EstPersonnelEtablissement])
def delete_local_by_id(request, slug, local_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        local = Local.objects.get(id=local_id, etablissement=etab)
        local.delete()
        return Response({'message': 'Local supprimé avec succès'}, status=status.HTTP_204_NO_CONTENT)
    except (Etablissement.DoesNotExist, Local.DoesNotExist):
        return Response({'error': 'Local introuvable'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_local_by_id(request, slug, local_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        local = Local.objects.get(id=local_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Local.DoesNotExist):
        return Response({'error': 'Local introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
    data = {
        'id': local.id,
        'numero_local': local.numero_local,
        'batiment': local.batiment,
        'capacite': local.capacite,
        'equipement': local.equipement,
        'responsables': [u.nom_complet for u in local.responsables.all()],
        'est_disponible': local.est_disponible,
        'type_local': local.type_local,
    }
    return Response(data, status=status.HTTP_200_OK)