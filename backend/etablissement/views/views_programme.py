from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework import status

from etablissement.models import Etablissement,Programme,Departement
from Messagerie.permissions import EstPersonnelEtablissement
from rest_framework.views import APIView



# ===================== VUES PROGRAMME =====================

@api_view(['GET'])
def get_all_programmes_by_etablissement(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)

    programmes = Programme.objects.filter(etablissement=etab)
    data = []
    for prog in programmes:
        data.append({
            'id': prog.id,
            'code': prog.code,
            'nom': prog.nom,
            'niveau': prog.niveau,
            'description': prog.description,
            'duree_semestres': prog.duree_semestres,
            'type': prog.type,
            'conditions_admission': prog.conditions_admission,
            'est_actif': prog.est_actif,
            'departement': prog.departement.nom if prog.departement else None
        })
    return Response(data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_programme_by_code(request, slug, code):
    try:
        etab = Etablissement.objects.get(slug=slug)
        prog = Programme.objects.get(code=code, etablissement=etab)
    except (Etablissement.DoesNotExist, Programme.DoesNotExist):
        return Response({'error': 'Programme introuvable'}, status=status.HTTP_404_NOT_FOUND)

    data = {
        'id': prog.id,
        'code': prog.code,
        'nom': prog.nom,
        'niveau': prog.niveau,
        'description': prog.description,
        'duree_semestres': prog.duree_semestres,
        'type': prog.type,
        'conditions_admission': prog.conditions_admission,
        'est_actif': prog.est_actif,
        'departement': prog.departement.nom if prog.departement else None
    }
    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([EstPersonnelEtablissement])
def create_programme(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)

    code = request.data.get('code')
    nom = request.data.get('nom')
    niveau = request.data.get('niveau')
    description = request.data.get('description')
    duree_semestres = request.data.get('duree_semestres')
    type_programme = request.data.get('type')
    conditions_admission = request.data.get('conditions_admission')
    departement_id = request.data.get('departement_id')

    if not all([code, nom, description, duree_semestres, type_programme, conditions_admission]):
        return Response({'error': 'Tous les champs requis doivent être fournis.'}, status=status.HTTP_400_BAD_REQUEST)

    # Vérifier si le code existe déjà
    if Programme.objects.filter(code=code, etablissement=etab).exists():
        return Response({'error': 'Un programme avec ce code existe déjà.'}, status=status.HTTP_400_BAD_REQUEST)

    # Récupération du département si fourni
    departement = None
    if departement_id:
        try:
            departement = Departement.objects.get(id=departement_id, etablissement=etab)
        except Departement.DoesNotExist:
            return Response({'error': 'Département introuvable'}, status=status.HTTP_404_NOT_FOUND)

    programme = Programme(
        etablissement=etab,
        departement=departement,
        code=code,
        nom=nom,
        niveau=niveau,
        description=description,
        duree_semestres=duree_semestres,
        type=type_programme,
        conditions_admission=conditions_admission
    )
    programme.save()

    return Response({'message': 'Programme créé avec succès', 'id': programme.id}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
@permission_classes([EstPersonnelEtablissement])
def update_programme_by_code(request, slug, code):
    try:
        etab = Etablissement.objects.get(slug=slug)
        prog = Programme.objects.get(code=code, etablissement=etab)
    except (Etablissement.DoesNotExist, Programme.DoesNotExist):
        return Response({'error': 'Programme introuvable'}, status=status.HTTP_404_NOT_FOUND)

    prog.nom = request.data.get('nom', prog.nom)
    prog.niveau = request.data.get('niveau', prog.niveau)
    prog.description = request.data.get('description', prog.description)
    prog.duree_semestres = request.data.get('duree_semestres', prog.duree_semestres)
    prog.type = request.data.get('type', prog.type)
    prog.conditions_admission = request.data.get('conditions_admission', prog.conditions_admission)
    prog.est_actif = request.data.get('est_actif', prog.est_actif)

    departement_id = request.data.get('departement_id')
    if departement_id:
        try:
            departement = Departement.objects.get(id=departement_id, etablissement=etab)
            prog.departement = departement
        except Departement.DoesNotExist:
            return Response({'error': 'Département introuvable'}, status=status.HTTP_404_NOT_FOUND)

    prog.save()
    return Response({'message': 'Programme mis à jour avec succès'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([EstPersonnelEtablissement])
def delete_programme_by_code(request, slug, code):
    try:
        etab = Etablissement.objects.get(slug=slug)
        prog = Programme.objects.get(code=code, etablissement=etab)
        prog.delete()
        return Response({'message': 'Programme supprimé avec succès'}, status=status.HTTP_204_NO_CONTENT)
    except (Etablissement.DoesNotExist, Programme.DoesNotExist):
        return Response({'error': 'Programme introuvable'}, status=status.HTTP_404_NOT_FOUND)
