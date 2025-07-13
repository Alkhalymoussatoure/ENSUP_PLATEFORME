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


# ===================== VUES FRAIS SCOLARITE =====================

@api_view(['GET'])
def get_all_frais_scolarite_by_etablissement(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    frais = FraisScolarite.objects.filter(etablissement=etab)
    data = []
    for f in frais:
        data.append({
            'id': f.id,
            'etudiant': f.etudiant.utilisateur.nom_complet,
            'session': f.session.id,
            'montant_total': f.montant_total,
            'montant_paye': f.montant_paye,
            'date_echeance': f.date_echeance,
            'statut': f.statut,
            'description': f.description,
            'statut_auto': f.statut_auto,
            'solde': f.solde,
        })
    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([EstPersonnelEtablissement])
def create_frais_scolarite(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    etudiant_id = request.data.get('etudiant_id')
    session_id = request.data.get('session_id')
    montant_total = request.data.get('montant_total')
    montant_paye = request.data.get('montant_paye')
    date_echeance = request.data.get('date_echeance')
    statut = request.data.get('statut')
    description = request.data.get('description', '')
    if not all([etudiant_id, session_id, montant_total, montant_paye, date_echeance, statut]):
        return Response({'error': 'Tous les champs requis doivent être fournis.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        etudiant = Etudiant.objects.get(id=etudiant_id, etablissement=etab)
        session = Session.objects.get(id=session_id, etablissement=etab)
    except (Etudiant.DoesNotExist, Session.DoesNotExist):
        return Response({'error': 'Étudiant ou session introuvable'}, status=status.HTTP_404_NOT_FOUND)
    frais = FraisScolarite(
        etablissement=etab,
        etudiant=etudiant,
        session=session,
        montant_total=montant_total,
        montant_paye=montant_paye,
        date_echeance=date_echeance,
        statut=statut,
        description=description
    )
    frais.save()
    return Response({'message': 'Frais de scolarité créé avec succès', 'id': frais.id}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
@permission_classes([EstPersonnelEtablissement])
def update_frais_scolarite_by_id(request, slug, frais_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        frais = FraisScolarite.objects.get(id=frais_id, etablissement=etab)
    except (Etablissement.DoesNotExist, FraisScolarite.DoesNotExist):
        return Response({'error': 'Frais de scolarité introuvable'}, status=status.HTTP_404_NOT_FOUND)
    etudiant_id = request.data.get('etudiant_id')
    session_id = request.data.get('session_id')
    if etudiant_id:
        try:
            etudiant = Etudiant.objects.get(id=etudiant_id, etablissement=etab)
            frais.etudiant = etudiant
        except Etudiant.DoesNotExist:
            return Response({'error': 'Étudiant introuvable'}, status=status.HTTP_404_NOT_FOUND)
    if session_id:
        try:
            session = Session.objects.get(id=session_id, etablissement=etab)
            frais.session = session
        except Session.DoesNotExist:
            return Response({'error': 'Session introuvable'}, status=status.HTTP_404_NOT_FOUND)
    frais.montant_total = request.data.get('montant_total', frais.montant_total)
    frais.montant_paye = request.data.get('montant_paye', frais.montant_paye)
    frais.date_echeance = request.data.get('date_echeance', frais.date_echeance)
    frais.statut = request.data.get('statut', frais.statut)
    frais.description = request.data.get('description', frais.description)
    frais.save()
    return Response({'message': 'Frais de scolarité mis à jour avec succès'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([EstPersonnelEtablissement])
def delete_frais_scolarite_by_id(request, slug, frais_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        frais = FraisScolarite.objects.get(id=frais_id, etablissement=etab)
        frais.delete()
        return Response({'message': 'Frais de scolarité supprimé avec succès'}, status=status.HTTP_204_NO_CONTENT)
    except (Etablissement.DoesNotExist, FraisScolarite.DoesNotExist):
        return Response({'error': 'Frais de scolarité introuvable'}, status=status.HTTP_404_NOT_FOUND)
    


@api_view(['GET'])
def get_frais_scolarite_by_id(request, slug, frais_id):
    try:
        etab = Etablissement.objects.get(slug=slug)
        frais = FraisScolarite.objects.get(id=frais_id, etablissement=etab)
    except (Etablissement.DoesNotExist, FraisScolarite.DoesNotExist):
        return Response({'error': 'Frais de scolarité introuvable'}, status=status.HTTP_404_NOT_FOUND)

    data = {
        'id': frais.id,
        'etudiant': frais.etudiant.id if frais.etudiant else None,
        'session': frais.session.id if frais.session else None,
        'montant_total': frais.montant_total,
        'montant_paye': frais.montant_paye,
        'date_echeance': frais.date_echeance,
        'statut': frais.statut,
        'description': frais.description,
    }
    return Response(data, status=status.HTTP_200_OK)
