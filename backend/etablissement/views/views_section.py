from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework import status

from etablissement.models import Etablissement
from etablissement.models import Cours, Session, Section,Enseignant
from Messagerie.permissions import EstPersonnelEtablissement



# ===================== VUES SECTION =====================

@api_view(['GET'])
def get_all_sections_by_etablissement(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)

    sections = Section.objects.filter(etablissement=etab)
    data = []
    for s in sections:
        data.append({
            'id': s.id,
            'cours': s.cours.nom,
            'enseignant': s.enseignant.utilisateur.nom_complet,
            'session': s.session.nom,
            'numero_section': s.numero_section,
            'max_etudiants': s.max_etudiants,
            'nombre_inscrits': s.nombre_inscrits,
            'mode_livraison': s.mode_livraison,
            'notes_section': s.notes_section,
            'taux_remplissage': s.taux_remplissage,
            'est_complete': s.est_complete,
        })
    return Response(data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_section_by_id(request, slug, section_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        section = Section.objects.get(id=section_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Section.DoesNotExist):
        return Response({'error': 'Section introuvable'}, status=status.HTTP_404_NOT_FOUND)

    data = {
        'id': section.id,
        'cours': section.cours.nom,
        'enseignant': section.enseignant.utilisateur.nom_complet,
        'session': section.session.nom,
        'numero_section': section.numero_section,
        'max_etudiants': section.max_etudiants,
        'nombre_inscrits': section.nombre_inscrits,
        'mode_livraison': section.mode_livraison,
        'notes_section': section.notes_section,
        'taux_remplissage': section.taux_remplissage,
        'est_complete': section.est_complete,
    }
    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([EstPersonnelEtablissement])
def create_section(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)

    cours_id = request.data.get('cours_id')
    enseignant_id = request.data.get('enseignant_id')
    session_id = request.data.get('session_id')
    numero_section = request.data.get('numero_section')
    max_etudiants = request.data.get('max_etudiants')
    mode_livraison = request.data.get('mode_livraison')
    notes_section = request.data.get('notes_section', '')

    if not all([cours_id, enseignant_id, session_id, numero_section, max_etudiants,mode_livraison]):
        return Response({'error': 'Tous les champs requis doivent être fournis.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        cours = Cours.objects.get(id=cours_id, etablissement=etab)
        enseignant = Enseignant.objects.get(id=enseignant_id, etablissement=etab)
        session = Session.objects.get(id=session_id, etablissement=etab)
    except (Cours.DoesNotExist, Enseignant.DoesNotExist, Session.DoesNotExist):
        return Response({'error': 'Cours, enseignant ou session introuvable'}, status=status.HTTP_404_NOT_FOUND)

    section = Section(
        etablissement=etab,
        cours=cours,
        enseignant=enseignant,
        session=session,
        numero_section=numero_section,
        max_etudiants=max_etudiants,
        mode_livraison=mode_livraison,
        notes_section=notes_section
    )
    section.save()
    return Response({'message': 'Section créée avec succès', 'id': section.id}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
@permission_classes([EstPersonnelEtablissement])
def update_section_by_id(request, slug, section_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        section = Section.objects.get(id=section_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Section.DoesNotExist):
        return Response({'error': 'Section introuvable'}, status=status.HTTP_404_NOT_FOUND)

    section.numero_section = request.data.get('numero_section', section.numero_section)
    section.max_etudiants = request.data.get('max_etudiants', section.max_etudiants)
    section.mode_livraison = request.data.get('mode_livraison', section.mode_livraison)
    section.notes_section = request.data.get('notes_section', section.notes_section)

    cours_id = request.data.get('cours_id')
    if cours_id:
        try:
            cours = Cours.objects.get(id=cours_id, etablissement=etab)
            section.cours = cours
        except Cours.DoesNotExist:
            return Response({'error': 'Cours introuvable'}, status=status.HTTP_404_NOT_FOUND)

    enseignant_id = request.data.get('enseignant_id')
    if enseignant_id:
        try:
            enseignant = Enseignant.objects.get(id=enseignant_id, etablissement=etab)
            section.enseignant = enseignant
        except Enseignant.DoesNotExist:
            return Response({'error': 'Enseignant introuvable'}, status=status.HTTP_404_NOT_FOUND)

    session_id = request.data.get('session_id')
    if session_id:
        try:
            session = Session.objects.get(id=session_id, etablissement=etab)
            section.session = session
        except Session.DoesNotExist:
            return Response({'error': 'Session introuvable'}, status=status.HTTP_404_NOT_FOUND)

    section.save()
    return Response({'message': 'Section mise à jour avec succès'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([EstPersonnelEtablissement])
def delete_section_by_id(request, slug, section_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        section = Section.objects.get(id=section_id, etablissement=etab)
        section.delete()
        return Response({'message': 'Section supprimée avec succès'}, status=status.HTTP_204_NO_CONTENT)
    except (Etablissement.DoesNotExist, Section.DoesNotExist):
        return Response({'error': 'Section introuvable'}, status=status.HTTP_404_NOT_FOUND)
