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




# ===================== VUES HORAIRE =====================

@api_view(['GET'])
def get_all_horaires_by_etablissement(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)

    horaires = Horaire.objects.filter(etablissement=etab)
    data = []
    for h in horaires:
        data.append({
            'id': h.id,
            'section': h.section.numero_section,
            'cours': h.cours.nom,
            'enseignant': h.enseignant.nom_complet if h.enseignant else None,
            'jour_semaine': h.jour_semaine,
            'heure_debut': h.heure_debut,
            'heure_fin': h.heure_fin,
            'local': h.local,
            'type_horaire': h.type_horaire,
            'recurrence_semaines': h.recurrence_semaines,
        })
    return Response(data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_horaire_by_id(request, slug, horaire_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        horaire = Horaire.objects.get(id=horaire_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Horaire.DoesNotExist):
        return Response({'error': 'Horaire introuvable'}, status=status.HTTP_404_NOT_FOUND)

    data = {
        'id': horaire.id,
        'section': horaire.section.numero_section,
        'cours': horaire.cours.nom,
        'enseignant': horaire.enseignant.nom_complet if horaire.enseignant else None,
        'jour_semaine': horaire.jour_semaine,
        'heure_debut': horaire.heure_debut,
        'heure_fin': horaire.heure_fin,
        'local': horaire.local,
        'type_horaire': horaire.type_horaire,
        'recurrence_semaines': horaire.recurrence_semaines,
    }
    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([EstPersonnelEtablissement])
def create_horaire(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)

    section_id = request.data.get('section_id')
    cours_id = request.data.get('cours_id')
    enseignant_id = request.data.get('enseignant_id')
    jour_semaine = request.data.get('jour_semaine')
    heure_debut = request.data.get('heure_debut')
    heure_fin = request.data.get('heure_fin')
    local = request.data.get('local')
    type_horaire = request.data.get('type_horaire')
    recurrence_semaines = request.data.get('recurrence_semaines')

    if not all([section_id, cours_id, jour_semaine, heure_debut, heure_fin, local, type_horaire, recurrence_semaines]):
        return Response({'error': 'Tous les champs requis doivent être fournis.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        section = Section.objects.get(id=section_id, etablissement=etab)
        cours = Cours.objects.get(id=cours_id, etablissement=etab)
        enseignant = Utilisateur.objects.get(id=enseignant_id, etablissement=etab, role='enseignant') if enseignant_id else None
    except (Section.DoesNotExist, Cours.DoesNotExist, Utilisateur.DoesNotExist):
        return Response({'error': 'Section, cours ou enseignant introuvable'}, status=status.HTTP_404_NOT_FOUND)

    horaire = Horaire(
        etablissement=etab,
        section=section,
        cours=cours,
        enseignant=enseignant,
        jour_semaine=jour_semaine,
        heure_debut=heure_debut,
        heure_fin=heure_fin,
        local=local,
        type_horaire=type_horaire,
        recurrence_semaines=recurrence_semaines
    )
    horaire.save()
    return Response({'message': 'Horaire créé avec succès', 'id': horaire.id}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
@permission_classes([EstPersonnelEtablissement])
def update_horaire_by_id(request, slug, horaire_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        horaire = Horaire.objects.get(id=horaire_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Horaire.DoesNotExist):
        return Response({'error': 'Horaire introuvable'}, status=status.HTTP_404_NOT_FOUND)

    section_id = request.data.get('section_id')
    cours_id = request.data.get('cours_id')
    enseignant_id = request.data.get('enseignant_id')

    if section_id:
        try:
            section = Section.objects.get(id=section_id, etablissement=etab)
            horaire.section = section
        except Section.DoesNotExist:
            return Response({'error': 'Section introuvable'}, status=status.HTTP_404_NOT_FOUND)
    if cours_id:
        try:
            cours = Cours.objects.get(id=cours_id, etablissement=etab)
            horaire.cours = cours
        except Cours.DoesNotExist:
            return Response({'error': 'Cours introuvable'}, status=status.HTTP_404_NOT_FOUND)
    if enseignant_id:
        try:
            enseignant = Utilisateur.objects.get(id=enseignant_id, etablissement=etab, role='enseignant')
            horaire.enseignant = enseignant
        except Utilisateur.DoesNotExist:
            return Response({'error': 'Enseignant introuvable'}, status=status.HTTP_404_NOT_FOUND)

    horaire.jour_semaine = request.data.get('jour_semaine', horaire.jour_semaine)
    horaire.heure_debut = request.data.get('heure_debut', horaire.heure_debut)
    horaire.heure_fin = request.data.get('heure_fin', horaire.heure_fin)
    horaire.local = request.data.get('local', horaire.local)
    horaire.type_horaire = request.data.get('type_horaire', horaire.type_horaire)
    horaire.recurrence_semaines = request.data.get('recurrence_semaines', horaire.recurrence_semaines)
    horaire.save()
    return Response({'message': 'Horaire mis à jour avec succès'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([EstPersonnelEtablissement])
def delete_horaire_by_id(request, slug, horaire_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        horaire = Horaire.objects.get(id=horaire_id, etablissement=etab)
        horaire.delete()
        return Response({'message': 'Horaire supprimé avec succès'}, status=status.HTTP_204_NO_CONTENT)
    except (Etablissement.DoesNotExist, Horaire.DoesNotExist):
        return Response({'error': 'Horaire introuvable'}, status=status.HTTP_404_NOT_FOUND)


