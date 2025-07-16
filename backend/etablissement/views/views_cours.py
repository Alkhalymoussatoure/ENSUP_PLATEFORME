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



# ===================== VUES COURS =====================

@api_view(['GET'])
def get_all_cours_by_etablissement(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)

    cours = Cours.objects.filter(etablissement=etab)
    data = []
    for c in cours:
        data.append({
            'id': c.id,
            'code': c.code,
            'nom': c.nom,
            'description': c.description,
            'credits': c.credits,
            'prerequis': c.prerequis,
            'objectifs': c.objectifs,
            'est_actif': c.est_actif,
            'programme': c.programme.nom if c.programme else None
        })
    return Response(data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_cours_by_code(request, slug, code):
    try:
        etab = Etablissement.objects.get(slug=slug)
        cours = Cours.objects.get(code=code, etablissement=etab)
    except (Etablissement.DoesNotExist, Cours.DoesNotExist):
        return Response({'error': 'Cours introuvable'}, status=status.HTTP_404_NOT_FOUND)

    data = {
        'id': cours.id,
        'code': cours.code,
        'nom': cours.nom,
        'description': cours.description,
        'credits': cours.credits,
        'prerequis': cours.prerequis,
        'objectifs': cours.objectifs,
        'est_actif': cours.est_actif,
        'programme': cours.programme.nom if cours.programme else None
    }
    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([EstPersonnelEtablissement])
def create_cours(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)

    code = request.data.get('code')
    nom = request.data.get('nom')
    description = request.data.get('description')
    credits = request.data.get('credits')
    prerequis = request.data.get('prerequis', '')
    objectifs = request.data.get('objectifs')
    programme_id = request.data.get('programme_id')

    if not all([code, nom, description, objectifs]):
        return Response({'error': 'Les champs code, nom, description et objectifs sont requis.'}, status=status.HTTP_400_BAD_REQUEST)

    # Vérifier si le code existe déjà
    if Cours.objects.filter(code=code, etablissement=etab).exists():
        return Response({'error': 'Un cours avec ce code existe déjà.'}, status=status.HTTP_400_BAD_REQUEST)

    # Récupération du programme si fourni
    programme = None
    if programme_id:
        try:
            programme = Programme.objects.get(id=programme_id, etablissement=etab)
        except Programme.DoesNotExist:
            return Response({'error': 'Programme introuvable'}, status=status.HTTP_404_NOT_FOUND)

    cours = Cours(
        etablissement=etab,
        programme=programme,
        code=code,
        nom=nom,
        description=description,
        credits=credits,
        prerequis=prerequis,
        objectifs=objectifs
    )
    cours.save()

    return Response({'message': 'Cours créé avec succès', 'id': cours.id}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
@permission_classes([EstPersonnelEtablissement])
def update_cours_by_code(request, slug, code):
    try:
        etab = Etablissement.objects.get(slug=slug)
        cours = Cours.objects.get(code=code, etablissement=etab)
    except (Etablissement.DoesNotExist, Cours.DoesNotExist):
        return Response({'error': 'Cours introuvable'}, status=status.HTTP_404_NOT_FOUND)

    cours.nom = request.data.get('nom', cours.nom)
    cours.description = request.data.get('description', cours.description)
    cours.credits = request.data.get('credits', cours.credits)
    cours.prerequis = request.data.get('prerequis', cours.prerequis)
    cours.objectifs = request.data.get('objectifs', cours.objectifs)
    cours.est_actif = request.data.get('est_actif', cours.est_actif)

    programme_id = request.data.get('programme_id')
    if programme_id:
        try:
            programme = Programme.objects.get(id=programme_id, etablissement=etab)
            cours.programme = programme
        except Programme.DoesNotExist:
            return Response({'error': 'Programme introuvable'}, status=status.HTTP_404_NOT_FOUND)

    cours.save()
    return Response({'message': 'Cours mis à jour avec succès'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([EstPersonnelEtablissement])
def delete_cours_by_code(request, slug, code):
    try:
        etab = Etablissement.objects.get(slug=slug)
        cours = Cours.objects.get(code=code, etablissement=etab)
        cours.delete()
        return Response({'message': 'Cours supprimé avec succès'}, status=status.HTTP_204_NO_CONTENT)
    except (Etablissement.DoesNotExist, Cours.DoesNotExist):
        return Response({'error': 'Cours introuvable'}, status=status.HTTP_404_NOT_FOUND)
