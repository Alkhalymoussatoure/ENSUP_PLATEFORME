from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework import status

from etablissement.models import  Document,Section,Etablissement, Etudiant, Inscription
from Messagerie.permissions import EstPersonnelEtablissement, EstEtudiantDansEtablissement



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

# la liste des documents d'un étudiant par cours
 
 
# @api_view(['GET'])
# @permission_classes([EstEtudiantDansEtablissement])
# def get_documents_par_cours_etudiant(request, slug):
#     utilisateur = request.utilisateur

#     try:
#         etab = Etablissement.objects.get(slug=slug)
#         etudiant = Etudiant.objects.get(utilisateur=utilisateur, etablissement=etab)
#     except (Etablissement.DoesNotExist, Etudiant.DoesNotExist):
#         return Response({'error': 'Établissement ou étudiant introuvable'}, status=status.HTTP_404_NOT_FOUND)

#     inscriptions = Inscription.objects.filter(etudiant=etudiant, etablissement=etab)
#     cours_sections = {}

#     # Regrouper les sections par ID de cours
#     for inscription in inscriptions:
#         section = inscription.section
#         cours = section.cours
#         cours_id = cours.id
#         if cours_id not in cours_sections:
#             cours_sections[cours_id] = {
#                 'cours': {
#                     'id': cours.id,
#                     'code': cours.code,
#                     'nom': cours.nom,
#                 },
#                 'sections': []
#             }
#         cours_sections[cours_id]['sections'].append(section)

#     resultat = []

#     for cours_id, data in cours_sections.items():
#         sections = data['sections']
#         cours_info = data['cours']
#         documents = Document.objects.filter(section__in=sections, est_public=True).order_by('-date_telechargement')
#         nb_documents = documents.count()
#         dernier_document = documents.first()

#         resultat.append({
#             'cours': cours_info,
#             'dernier_document': {
#                 'id': dernier_document.id,
#                 'titre': dernier_document.titre,
#                 'fichier': request.build_absolute_uri(dernier_document.fichier.url) if dernier_document.fichier else None,
#                 'date_telechargement': dernier_document.date_telechargement,
#             } if dernier_document else None,
#             'nb_documents': nb_documents
#         })

#     return Response(resultat, status=status.HTTP_200_OK)

# # endpoint documents-par-cours-details
# @api_view(['GET'])
# @permission_classes([EstEtudiantDansEtablissement])
# def documents_par_cours_details(request, slug):
#     utilisateur = request.utilisateur
#     cours_id = request.GET.get('cours_id')
#     type_fichier = request.GET.get('type')

#     if not cours_id:
#         return Response({'error': 'ID du cours requis'}, status=status.HTTP_400_BAD_REQUEST)

#     try:
#         etab = Etablissement.objects.get(slug=slug)
#         etudiant = Etudiant.objects.get(utilisateur=utilisateur, etablissement=etab)
#     except (Etablissement.DoesNotExist, Etudiant.DoesNotExist):
#         return Response({'error': 'Établissement ou étudiant introuvable'}, status=status.HTTP_404_NOT_FOUND)

#     inscriptions = Inscription.objects.filter(etudiant=etudiant, etablissement=etab)
#     sections_cours = []

#     for inscription in inscriptions:
#         section = inscription.section
#         cours = section.cours
#         if str(cours.id) == cours_id:
#             sections_cours.append(section)

#     documents = Document.objects.filter(section__in=sections_cours, est_public=True)
#     if type_fichier:
#         documents = documents.filter(type_fichier__iexact=type_fichier)

#     documents = documents.order_by('-date_telechargement')

#     resultat = [{
#         'id': d.id,
#         'titre': d.titre,
#         'fichier': request.build_absolute_uri(d.fichier.url) if d.fichier else None,
#         'date_telechargement': d.date_telechargement,
#         'type_fichier': d.type_fichier,
#     } for d in documents]

#     return Response(resultat, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([EstEtudiantDansEtablissement])
def get_documents_par_section_etudiant(request, slug):
    utilisateur = request.utilisateur

    try:
        etab = Etablissement.objects.get(slug=slug)
        etudiant = Etudiant.objects.get(utilisateur=utilisateur, etablissement=etab)
    except (Etablissement.DoesNotExist, Etudiant.DoesNotExist):
        return Response({'error': 'Établissement ou étudiant introuvable'}, status=status.HTTP_404_NOT_FOUND)

    inscriptions = Inscription.objects.filter(
        etudiant=etudiant,
        etablissement=etab
    ).select_related(
        'section__cours',
        'section__enseignant__utilisateur',
        'section__enseignant__departement',
        'section__enseignant__bureau',
        'section__session'
    )

    resultat = []

    for inscription in inscriptions:
        section = inscription.section
        cours = section.cours
        enseignant = section.enseignant
        session = section.session

        documents = Document.objects.filter(section=section, est_public=True).order_by('-date_telechargement')
        nb_documents = documents.count()
        dernier_document = documents.first()

        resultat.append({
            'section_id': section.id,
            'cours': f"{cours.code} - {cours.nom}",
            'enseignant': {
                'nom': enseignant.utilisateur.nom_complet if enseignant else None,
                'photo': request.build_absolute_uri(enseignant.enseignant_photo.url) if enseignant and enseignant.enseignant_photo else None,
                'specialite': enseignant.specialite if enseignant else None,
                'departement': enseignant.departement.nom if enseignant and enseignant.departement else None,
                'telephone': enseignant.enseignant_telephone if enseignant else None,
                'bureau': enseignant.bureau.numero_local if enseignant and enseignant.bureau else None
            },
            'session': session.nom if session else None,
            'nb_documents': nb_documents,
            'dernier_document': {
                'id': dernier_document.id,
                'titre': dernier_document.titre,
                'fichier': request.build_absolute_uri(dernier_document.fichier.url) if dernier_document.fichier else None,
                'date_telechargement': dernier_document.date_telechargement,
            } if dernier_document else None
        })

    return Response(resultat, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([EstEtudiantDansEtablissement])
def documents_par_section_details(request, slug):
    utilisateur = request.utilisateur
    section_id = request.GET.get('section_id')
    type_fichier = request.GET.get('type')

    if not section_id:
        return Response({'error': 'ID de la section requis'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        etab = Etablissement.objects.get(slug=slug)
        etudiant = Etudiant.objects.get(utilisateur=utilisateur, etablissement=etab)
    except (Etablissement.DoesNotExist, Etudiant.DoesNotExist):
        return Response({'error': 'Établissement ou étudiant introuvable'}, status=status.HTTP_404_NOT_FOUND)

    try:
        section = Section.objects.select_related(
            'cours',
            'enseignant__utilisateur',
            'enseignant__bureau',
            'session'
        ).get(id=section_id, etablissement=etab)
    except Section.DoesNotExist:
        return Response({'error': 'Section introuvable'}, status=status.HTTP_404_NOT_FOUND)

    if not Inscription.objects.filter(etudiant=etudiant, section=section).exists():
        return Response({'error': 'Accès non autorisé à cette section'}, status=status.HTTP_403_FORBIDDEN)

    documents = Document.objects.filter(section=section, est_public=True)
    if type_fichier:
        documents = documents.filter(type_fichier__iexact=type_fichier)

    documents = documents.order_by('-date_telechargement')

    resultat = [{
        'id': d.id,
        'titre': d.titre,
        'fichier': request.build_absolute_uri(d.fichier.url) if d.fichier else None,
        'date_telechargement': d.date_telechargement,
        'type_fichier': d.type_fichier,
    } for d in documents]

    return Response(resultat, status=status.HTTP_200_OK)
