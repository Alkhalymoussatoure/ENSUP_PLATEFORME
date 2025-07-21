from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework import status

from etablissement.models import  Document,Section,Etablissement
from Messagerie.permissions import EstPersonnelEtablissement



# ===================== VUES DOCUMENT =====================

@api_view(['GET'])
def get_all_documents_by_etablissement(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    documents = Document.objects.filter(etablissement=etab)
    data = []
    for d in documents:
        data.append({
            'id': d.id,
            'section': d.section.id if d.section else None,
            'titre': d.titre,
            'fichier': d.fichier.url if d.fichier else None,
            'tags': d.tags,
            'date_telechargement': d.date_telechargement,
            'est_public': d.est_public,
            'description': d.description,
        })
    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([EstPersonnelEtablissement])
def create_document(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    section_id = request.data.get('section_id')
    titre = request.data.get('titre')
    fichier = request.FILES.get('fichier')
    tags = request.data.get('tags', '')
    est_public = request.data.get('est_public', False)
    description = request.data.get('description', '')
    if not all([titre, fichier]):
        return Response({'error': 'titre et fichier sont requis.'}, status=status.HTTP_400_BAD_REQUEST)
    section = None
    if section_id:
        try:
            section = Section.objects.get(id=section_id, etablissement=etab)
        except Section.DoesNotExist:
            pass
   
    document = Document(
        etablissement=etab,
        section=section,
        titre=titre,
        fichier=fichier,
        tags=tags,
        est_public=est_public,
        description=description
    )
    document.save()
    return Response({'message': 'Document créé avec succès', 'id': document.id}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
@permission_classes([EstPersonnelEtablissement])
def update_document_by_id(request, slug, document_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        document = Document.objects.get(id=document_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Document.DoesNotExist):
        return Response({'error': 'Document introuvable'}, status=status.HTTP_404_NOT_FOUND)
    section_id = request.data.get('section_id')
    if section_id:
        try:
            section = Section.objects.get(id=section_id, etablissement=etab)
            document.section = section
        except Section.DoesNotExist:
            document.section = None
            
    document.titre = request.data.get('titre', document.titre)
    if 'fichier' in request.FILES:
        document.fichier = request.FILES['fichier']
    document.tags = request.data.get('tags', document.tags)
    document.est_public = request.data.get('est_public', document.est_public)
    document.description = request.data.get('description', document.description)
    document.save()
    return Response({'message': 'Document mis à jour avec succès'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([EstPersonnelEtablissement])
def delete_document_by_id(request, slug, document_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        document = Document.objects.get(id=document_id, etablissement=etab)
        document.delete()
        return Response({'message': 'Document supprimé avec succès'}, status=status.HTTP_204_NO_CONTENT)
    except (Etablissement.DoesNotExist, Document.DoesNotExist):
        return Response({'error': 'Document introuvable'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_document_by_id(request, slug, document_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        document = Document.objects.get(id=document_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Document.DoesNotExist):
        return Response({'error': 'Document introuvable'}, status=status.HTTP_404_NOT_FOUND)

    data = {
        'id': document.id,
        'section': document.section.id if document.section else None,
        'titre': document.titre,
        'fichier': document.fichier.url if document.fichier else None,
        'tags': document.tags,
        'est_public': document.est_public,
        'description': document.description,
    }
    return Response(data, status=status.HTTP_200_OK)