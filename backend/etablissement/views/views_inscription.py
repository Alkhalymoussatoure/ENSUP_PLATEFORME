from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework import status

from etablissement.models import Inscription,Section,Etablissement,Etudiant
from Messagerie.permissions import EstPersonnelEtablissement



# ===================== VUES INSCRIPTION =====================

@api_view(['GET'])
def get_all_inscriptions_by_etablissement(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)

    inscriptions = Inscription.objects.filter(etablissement=etab)
    data = []
    for ins in inscriptions:
        data.append({
            'id': ins.id,
            'etudiant': ins.etudiant.utilisateur.nom_complet,
            'section': ins.section.numero_section,
            'date_inscription': ins.date_inscription,
            'statut': ins.statut,
            'note_finale': ins.note_finale,
            'note_lettre': ins.note_lettre,
            'frais_section': ins.frais_section,
            'frais_payes': ins.frais_payes,
        })
    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([EstPersonnelEtablissement])
def create_inscription(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)

    etudiant_id = request.data.get('etudiant_id')
    section_id = request.data.get('section_id')
    date_inscription = request.data.get('date_inscription')
    statut = request.data.get('statut')
    note_finale = request.data.get('note_finale')
    note_lettre = request.data.get('note_lettre', '')
    frais_section = request.data.get('frais_section')
    frais_payes = request.data.get('frais_payes', False)

    if not all([etudiant_id, section_id, date_inscription, statut, frais_section]):
        return Response({'error': 'Tous les champs requis doivent être fournis.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        etudiant = Etudiant.objects.get(id=etudiant_id, etablissement=etab)
        section = Section.objects.get(id=section_id, etablissement=etab)
    except (Etudiant.DoesNotExist, Section.DoesNotExist):
        return Response({'error': 'Étudiant ou section introuvable'}, status=status.HTTP_404_NOT_FOUND)

    inscription = Inscription(
        etablissement=etab,
        etudiant=etudiant,
        section=section,
        date_inscription=date_inscription,
        statut=statut,
        note_finale=note_finale,
        note_lettre=note_lettre,
        frais_section=frais_section,
        frais_payes=frais_payes
    )
    inscription.save()
    return Response({'message': 'Inscription créée avec succès', 'id': inscription.id}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
@permission_classes([EstPersonnelEtablissement])
def update_inscription_by_id(request, slug, inscription_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        inscription = Inscription.objects.get(id=inscription_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Inscription.DoesNotExist):
        return Response({'error': 'Inscription introuvable'}, status=status.HTTP_404_NOT_FOUND)

    etudiant_id = request.data.get('etudiant_id')
    section_id = request.data.get('section_id')

    if etudiant_id:
        try:
            etudiant = Etudiant.objects.get(id=etudiant_id, etablissement=etab)
            inscription.etudiant = etudiant
        except Etudiant.DoesNotExist:
            return Response({'error': 'Étudiant introuvable'}, status=status.HTTP_404_NOT_FOUND)
    if section_id:
        try:
            section = Section.objects.get(id=section_id, etablissement=etab)
            inscription.section = section
        except Section.DoesNotExist:
            return Response({'error': 'Section introuvable'}, status=status.HTTP_404_NOT_FOUND)

    inscription.date_inscription = request.data.get('date_inscription', inscription.date_inscription)
    inscription.statut = request.data.get('statut', inscription.statut)
    inscription.note_finale = request.data.get('note_finale', inscription.note_finale)
    inscription.note_lettre = request.data.get('note_lettre', inscription.note_lettre)
    inscription.frais_section = request.data.get('frais_section', inscription.frais_section)
    inscription.frais_payes = request.data.get('frais_payes', inscription.frais_payes)
    inscription.save()
    return Response({'message': 'Inscription mise à jour avec succès'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([EstPersonnelEtablissement])
def delete_inscription_by_id(request, slug, inscription_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        inscription = Inscription.objects.get(id=inscription_id, etablissement=etab)
        inscription.delete()
        return Response({'message': 'Inscription supprimée avec succès'}, status=status.HTTP_204_NO_CONTENT)
    except (Etablissement.DoesNotExist, Inscription.DoesNotExist):
        return Response({'error': 'Inscription introuvable'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([EstPersonnelEtablissement])
def get_inscription_by_id(request, slug, inscription_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        inscription = Inscription.objects.get(id=inscription_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Inscription.DoesNotExist):
        return Response({'error': 'Inscription introuvable'}, status=status.HTTP_404_NOT_FOUND)

    data = {
        'id': inscription.id,
        'etudiant': inscription.etudiant.utilisateur.nom_complet,
        'section': inscription.section.numero_section,
        'date_inscription': inscription.date_inscription,
        'statut': inscription.statut,
        'note_finale': inscription.note_finale,
        'note_lettre': inscription.note_lettre,
        'frais_section': inscription.frais_section,
        'frais_payes': inscription.frais_payes,
    }
    return Response(data, status=status.HTTP_200_OK)