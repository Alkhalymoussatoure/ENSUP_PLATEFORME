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



# ===================== VUES DEPARTEMENT =====================

@api_view(['GET'])
def get_all_departements_by_etablissement(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)

    departements = Departement.objects.filter(etablissement=etab)
    data = []
    for dept in departements:
        data.append({
            'id': dept.id,
            'nom': dept.nom,
            'code': dept.code,
            'description': dept.description,
            'chef_departement': dept.chef_departement.nom_complet if dept.chef_departement else None,
            'bureau': dept.bureau,
            'telephone': dept.telephone
        })
    return Response(data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_departement_by_code(request, slug, code):
    try:
        etab = Etablissement.objects.get(slug=slug)
        dept = Departement.objects.get(code=code, etablissement=etab)
    except (Etablissement.DoesNotExist, Departement.DoesNotExist):
        return Response({'error': 'Département introuvable'}, status=status.HTTP_404_NOT_FOUND)

    data = {
        'id': dept.id,
        'nom': dept.nom,
        'code': dept.code,
        'description': dept.description,
        'chef_departement': dept.chef_departement.nom_complet if dept.chef_departement else None,
        'bureau': dept.bureau,
        'telephone': dept.telephone
    }
    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([EstPersonnelEtablissement])
def create_departement(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)

    nom = request.data.get('nom')
    code = request.data.get('code')
    description = request.data.get('description', '')
    chef_departement_id = request.data.get('chef_departement_id')
    bureau = request.data.get('bureau')
    telephone = request.data.get('telephone')

    if not all([nom, code, bureau, telephone]):
        return Response({'error': 'Les champs nom, code, bureau et téléphone sont requis.'}, status=status.HTTP_400_BAD_REQUEST)

    # Vérifier si le code existe déjà
    if Departement.objects.filter(code=code, etablissement=etab).exists():
        return Response({'error': 'Un département avec ce code existe déjà.'}, status=status.HTTP_400_BAD_REQUEST)

    # Récupération du chef de département si fourni
    chef_departement = None
    if chef_departement_id:
        try:
            chef_departement = Utilisateur.objects.get(id=chef_departement_id, etablissement=etab, role__in=['administrateur', 'directeur'])
        except Utilisateur.DoesNotExist:
            return Response({'error': 'Chef de département introuvable'}, status=status.HTTP_404_NOT_FOUND)

    departement = Departement(
        etablissement=etab,
        nom=nom,
        code=code,
        description=description,
        chef_departement=chef_departement,
        bureau=bureau,
        telephone=telephone
    )
    departement.save()

    return Response({'message': 'Département créé avec succès', 'id': departement.id}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
@permission_classes([EstPersonnelEtablissement])
def update_departement_by_code(request, slug, code):
    try:
        etab = Etablissement.objects.get(slug=slug)
        dept = Departement.objects.get(code=code, etablissement=etab)
    except (Etablissement.DoesNotExist, Departement.DoesNotExist):
        return Response({'error': 'Département introuvable'}, status=status.HTTP_404_NOT_FOUND)

    dept.nom = request.data.get('nom', dept.nom)
    dept.description = request.data.get('description', dept.description)
    dept.bureau = request.data.get('bureau', dept.bureau)
    dept.telephone = request.data.get('telephone', dept.telephone)

    chef_departement_id = request.data.get('chef_departement_id')
    if chef_departement_id:
        try:
            chef_departement = Utilisateur.objects.get(id=chef_departement_id, etablissement=etab, role__in=['administrateur', 'directeur'])
            dept.chef_departement = chef_departement
        except Utilisateur.DoesNotExist:
            return Response({'error': 'Chef de département introuvable'}, status=status.HTTP_404_NOT_FOUND)

    dept.save()
    return Response({'message': 'Département mis à jour avec succès'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([EstPersonnelEtablissement])
def delete_departement_by_code(request, slug, code):
    try:
        etab = Etablissement.objects.get(slug=slug)
        dept = Departement.objects.get(code=code, etablissement=etab)
        dept.delete()
        return Response({'message': 'Département supprimé avec succès'}, status=status.HTTP_204_NO_CONTENT)
    except (Etablissement.DoesNotExist, Departement.DoesNotExist):
        return Response({'error': 'Département introuvable'}, status=status.HTTP_404_NOT_FOUND)

