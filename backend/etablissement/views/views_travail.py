from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework import status

from etablissement.models import Etablissement,Section, Travail
from Messagerie.permissions import EstPersonnelEtablissement



# ===================== VUES TRAVAIL =====================

@api_view(['GET'])
def get_all_travaux_by_etablissement(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    travaux = Travail.objects.filter(etablissement=etab)
    data = []
    for t in travaux:
        data.append({
            'id': t.id,
            'section': t.section.id,
            'titre': t.titre,
            'description': t.description,
            'instructions': t.instructions,
            'date_echeance': t.date_echeance,
            'heure_echeance': t.heure_echeance,
            'points_max': t.points_max,
            'type': t.type,
            'est_publie': t.est_publie,
            'remise_en_ligne': t.remise_en_ligne,
            'fichier_joint': t.fichier_joint.url if t.fichier_joint else None,
        })
    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([EstPersonnelEtablissement])
def create_travail(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    section_id = request.data.get('section_id')
    titre = request.data.get('titre')
    description = request.data.get('description')
    instructions = request.data.get('instructions')
    date_echeance = request.data.get('date_echeance')
    heure_echeance = request.data.get('heure_echeance')
    points_max = request.data.get('points_max')
    type_travail = request.data.get('type')
    est_publie = request.data.get('est_publie', False)
    remise_en_ligne = request.data.get('remise_en_ligne', True)
    fichier_joint = request.FILES.get('fichier_joint')
    if not all([section_id, titre, description, instructions, date_echeance, heure_echeance, points_max, type_travail]):
        return Response({'error': 'Tous les champs requis doivent être fournis.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        section = Section.objects.get(id=section_id, etablissement=etab)
    except Section.DoesNotExist:
        return Response({'error': 'Section introuvable'}, status=status.HTTP_404_NOT_FOUND)
    travail = Travail(
        etablissement=etab,
        section=section,
        titre=titre,
        description=description,
        instructions=instructions,
        date_echeance=date_echeance,
        heure_echeance=heure_echeance,
        points_max=points_max,
        type=type_travail,
        est_publie=est_publie,
        remise_en_ligne=remise_en_ligne,
        fichier_joint=fichier_joint
    )
    travail.save()
    return Response({'message': 'Travail créé avec succès', 'id': travail.id}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
@permission_classes([EstPersonnelEtablissement])
def update_travail_by_id(request, slug, travail_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        travail = Travail.objects.get(id=travail_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Travail.DoesNotExist):
        return Response({'error': 'Travail introuvable'}, status=status.HTTP_404_NOT_FOUND)
    section_id = request.data.get('section_id')
    if section_id:
        try:
            section = Section.objects.get(id=section_id, etablissement=etab)
            travail.section = section
        except Section.DoesNotExist:
            return Response({'error': 'Section introuvable'}, status=status.HTTP_404_NOT_FOUND)
    travail.titre = request.data.get('titre', travail.titre)
    travail.description = request.data.get('description', travail.description)
    travail.instructions = request.data.get('instructions', travail.instructions)
    travail.date_echeance = request.data.get('date_echeance', travail.date_echeance)
    travail.heure_echeance = request.data.get('heure_echeance', travail.heure_echeance)
    travail.points_max = request.data.get('points_max', travail.points_max)
    travail.type = request.data.get('type', travail.type)
    travail.est_publie = request.data.get('est_publie', travail.est_publie)
    travail.remise_en_ligne = request.data.get('remise_en_ligne', travail.remise_en_ligne)
    if 'fichier_joint' in request.FILES:
        travail.fichier_joint = request.FILES['fichier_joint']
    travail.save()
    return Response({'message': 'Travail mis à jour avec succès'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([EstPersonnelEtablissement])
def delete_travail_by_id(request, slug, travail_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        travail = Travail.objects.get(id=travail_id, etablissement=etab)
        travail.delete()
        return Response({'message': 'Travail supprimé avec succès'}, status=status.HTTP_204_NO_CONTENT)
    except (Etablissement.DoesNotExist, Travail.DoesNotExist):
        return Response({'error': 'Travail introuvable'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([EstPersonnelEtablissement])
def get_travail_by_id(request, slug, travail_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        travail = Travail.objects.get(id=travail_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Travail.DoesNotExist):
        return Response({'error': 'Travail introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
    data = {
        'id': travail.id,
        'section': travail.section.id,
        'titre': travail.titre,
        'description': travail.description,
        'instructions': travail.instructions,
        'date_echeance': travail.date_echeance,
        'heure_echeance': travail.heure_echeance,
        'points_max': travail.points_max,
        'type': travail.type,
        'est_publie': travail.est_publie,
        'remise_en_ligne': travail.remise_en_ligne,
        'fichier_joint': travail.fichier_joint.url if travail.fichier_joint else None,
    }
    return Response(data, status=status.HTTP_200_OK)
