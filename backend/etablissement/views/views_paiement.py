from django.forms import ValidationError
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework import status

from etablissement.models import Etablissement,FraisScolarite,Paiement
from Messagerie.permissions import EstPersonnelEtablissement



# ===================== VUES PAIEMENT =====================

@api_view(['GET'])
def get_all_paiements_by_etablissement(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    paiements = Paiement.objects.filter(etablissement=etab)
    data = []
    for p in paiements:
        data.append({
            'id': p.id,
            'frais': p.frais.id,
            'montant': p.montant,
            'date_paiement': p.date_paiement,
            'methode_paiement': p.methode_paiement,
            'numero_transaction': p.numero_transaction,
            'notes': p.notes,
        })
    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([EstPersonnelEtablissement])
def create_paiement(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    frais_id = request.data.get('frais_id')
    montant = request.data.get('montant')
    date_paiement = request.data.get('date_paiement')
    methode_paiement = request.data.get('methode_paiement')
    numero_transaction = request.data.get('numero_transaction')
    notes = request.data.get('notes', '')
    if not all([frais_id, montant, date_paiement, methode_paiement, numero_transaction]):
        return Response({'error': 'Tous les champs requis doivent être fournis.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        frais = FraisScolarite.objects.get(id=frais_id, etablissement=etab)
    except FraisScolarite.DoesNotExist:
        return Response({'error': 'Frais de scolarité introuvable'}, status=status.HTTP_404_NOT_FOUND)
    paiement = Paiement(
        etablissement=etab,
        frais=frais,
        montant=montant,
        date_paiement=date_paiement,
        methode_paiement=methode_paiement,
        numero_transaction=numero_transaction,
        notes=notes
    )
    try:
        paiement.full_clean()
        paiement.save()
    except ValidationError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'message': 'Paiement créé avec succès', 'id': paiement.id}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
@permission_classes([EstPersonnelEtablissement])
def update_paiement_by_id(request, slug, paiement_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        paiement = Paiement.objects.get(id=paiement_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Paiement.DoesNotExist):
        return Response({'error': 'Paiement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    frais_id = request.data.get('frais_id')
    if frais_id:
        try:
            frais = FraisScolarite.objects.get(id=frais_id, etablissement=etab)
            paiement.frais = frais
        except FraisScolarite.DoesNotExist:
            return Response({'error': 'Frais de scolarité introuvable'}, status=status.HTTP_404_NOT_FOUND)
    paiement.montant = request.data.get('montant', paiement.montant)
    paiement.date_paiement = request.data.get('date_paiement', paiement.date_paiement)
    paiement.methode_paiement = request.data.get('methode_paiement', paiement.methode_paiement)
    paiement.numero_transaction = request.data.get('numero_transaction', paiement.numero_transaction)
    paiement.notes = request.data.get('notes', paiement.notes)
    try:
        paiement.full_clean()
        paiement.save()
    except ValidationError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'message': 'Paiement mis à jour avec succès'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([EstPersonnelEtablissement])
def delete_paiement_by_id(request, slug, paiement_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        paiement = Paiement.objects.get(id=paiement_id, etablissement=etab)
        paiement.delete()
        return Response({'message': 'Paiement supprimé avec succès'}, status=status.HTTP_204_NO_CONTENT)
    except (Etablissement.DoesNotExist, Paiement.DoesNotExist):
        return Response({'error': 'Paiement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET'])
def get_paiement_by_id(request, slug, paiement_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        paiement = Paiement.objects.get(id=paiement_id, etablissement=etab)
    except (Etablissement.DoesNotExist, Paiement.DoesNotExist):
        return Response({'error': 'Paiement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    data = {
        'id': paiement.id,
        'frais': paiement.frais.id,
        'montant': paiement.montant,
        'date_paiement': paiement.date_paiement,
        'methode_paiement': paiement.methode_paiement,
        'numero_transaction': paiement.numero_transaction,
        'notes': paiement.notes,
    }
    return Response(data, status=status.HTTP_200_OK)