from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework import status


from etablissement.models import  Section,Etablissement,Forum
from Messagerie.permissions import EstPersonnelEtablissement




# ===================== VUES FORUM =====================

@api_view(['GET'])
def get_all_forums_by_etablissement(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    forums = Forum.objects.filter(etablissement=etab)
    data = []
    for f in forums:
        data.append({
            'id': f.id,
            'section': f.section.id if f.section else None,
            'titre': f.titre,
            'description': f.description,
            'date_creation': f.date_creation,
            'est_actif': f.est_actif,
            'est_prive': f.est_prive,
            'type_forum': f.type_forum,
            'slug': f.slug,
        })
    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([EstPersonnelEtablissement])
def create_forum(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    section_id = request.data.get('section_id')
    titre = request.data.get('titre')
    description = request.data.get('description')
    est_actif = request.data.get('est_actif', True)
    est_prive = request.data.get('est_prive', False)
    type_forum = request.data.get('type_forum')
    slug_forum = request.data.get('slug', '')
    if not all([titre, description, type_forum]):
        return Response({'error': 'titre, description et type_forum sont requis.'}, status=status.HTTP_400_BAD_REQUEST)
    section = None
    if section_id:
        try:
            section = Section.objects.get(id=section_id, etablissement=etab)
        except Section.DoesNotExist:
            pass
    forum = Forum(
        etablissement=etab,
        section=section,
        titre=titre,
        description=description,
        est_actif=est_actif,
        est_prive=est_prive,
        type_forum=type_forum,
        slug=slug_forum
    )
    forum.save()
    return Response({'message': 'Forum créé avec succès', 'id': forum.id}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
@permission_classes([EstPersonnelEtablissement])
def update_forum_by_id(request, slug, forum_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        forum = Forum.objects.get(id=forum_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Forum.DoesNotExist):
        return Response({'error': 'Forum introuvable'}, status=status.HTTP_404_NOT_FOUND)
    section_id = request.data.get('section_id')
    if section_id:
        try:
            section = Section.objects.get(id=section_id, etablissement=etab)
            forum.section = section
        except Section.DoesNotExist:
            forum.section = None
    forum.titre = request.data.get('titre', forum.titre)
    forum.description = request.data.get('description', forum.description)
    forum.est_actif = request.data.get('est_actif', forum.est_actif)
    forum.est_prive = request.data.get('est_prive', forum.est_prive)
    forum.type_forum = request.data.get('type_forum', forum.type_forum)
    forum.slug = request.data.get('slug', forum.slug)
    forum.save()
    return Response({'message': 'Forum mis à jour avec succès'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([EstPersonnelEtablissement])
def delete_forum_by_id(request, slug, forum_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        forum = Forum.objects.get(id=forum_id, etablissement=etab)
        forum.delete()
        return Response({'message': 'Forum supprimé avec succès'}, status=status.HTTP_204_NO_CONTENT)
    except (Etablissement.DoesNotExist, Forum.DoesNotExist):
        return Response({'error': 'Forum introuvable'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_forum_by_id(request, slug, forum_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        forum = Forum.objects.get(id=forum_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Forum.DoesNotExist):
        return Response({'error': 'Forum introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
    data = {
        'id': forum.id,
        'section': forum.section.id if forum.section else None,
        'titre': forum.titre,
        'description': forum.description,
        'date_creation': forum.date_creation,
        'est_actif': forum.est_actif,
        'est_prive': forum.est_prive,
        'type_forum': forum.type_forum,
        'slug': forum.slug,
    }
    return Response(data, status=status.HTTP_200_OK)