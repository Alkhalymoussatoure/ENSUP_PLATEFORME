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
from permissions.permissions import EstPersonnelEtablissement
from rest_framework.views import APIView



# ===================== VUES FACTURE =====================
    
@api_view(['GET'])
def get_all_factures_by_etablissement(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    factures = Facture.objects.filter(inscription__etablissement=etab)
    data = []
    for f in factures:
        data.append({
            'id': f.id,
            'inscription_id': f.inscription.id,
            'montant': f.montant,
            'date_emission': f.date_emission,
            'payee': f.payee,
            'numero_facture': f.numero_facture,
            'notes': f.notes,
        })
    return Response(data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_facture_by_id(request, slug, facture_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        facture = Facture.objects.get(id=facture_id, inscription__etablissement=etab)
    except (Etablissement.DoesNotExist, Facture.DoesNotExist):
        return Response({'error': 'Facture introuvable'}, status=status.HTTP_404_NOT_FOUND)
    data = {
        'id': facture.id,
        'inscription_id': facture.inscription.id,
        'montant': facture.montant,
        'date_emission': facture.date_emission,
        'payee': facture.payee,
        'numero_facture': facture.numero_facture,
        'notes': facture.notes,
    }
    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([EstPersonnelEtablissement])
def create_facture(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    inscription_id = request.data.get('inscription_id')
    montant = request.data.get('montant')
    payee = request.data.get('payee', False)
    numero_facture = request.data.get('numero_facture', '')
    notes = request.data.get('notes', '')
    if not all([inscription_id, montant]):
        return Response({'error': 'Les champs inscription_id et montant sont requis.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        inscription = Inscription.objects.get(id=inscription_id, etablissement=etab)
    except Inscription.DoesNotExist:
        return Response({'error': 'Inscription introuvable'}, status=status.HTTP_404_NOT_FOUND)
    facture = Facture(
        inscription=inscription,
        montant=montant,
        payee=payee,
        numero_facture=numero_facture,
        notes=notes
    )
    facture.save()
    return Response({'message': 'Facture créée avec succès', 'id': facture.id}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
@permission_classes([EstPersonnelEtablissement])
def update_facture_by_id(request, slug, facture_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        facture = Facture.objects.get(id=facture_id, inscription__etablissement=etab)
    except (Etablissement.DoesNotExist, Facture.DoesNotExist):
        return Response({'error': 'Facture introuvable'}, status=status.HTTP_404_NOT_FOUND)
    facture.montant = request.data.get('montant', facture.montant)
    facture.payee = request.data.get('payee', facture.payee)
    facture.numero_facture = request.data.get('numero_facture', facture.numero_facture)
    facture.notes = request.data.get('notes', facture.notes)
    facture.save()
    return Response({'message': 'Facture mise à jour avec succès'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([EstPersonnelEtablissement])
def delete_facture_by_id(request, slug, facture_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        facture = Facture.objects.get(id=facture_id, inscription__etablissement=etab)
        facture.delete()
        return Response({'message': 'Facture supprimée avec succès'}, status=status.HTTP_204_NO_CONTENT)
    except (Etablissement.DoesNotExist, Facture.DoesNotExist):
        return Response({'error': 'Facture introuvable'}, status=status.HTTP_404_NOT_FOUND)
