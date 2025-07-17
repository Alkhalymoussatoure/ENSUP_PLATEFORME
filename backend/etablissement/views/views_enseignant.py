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


# ===================== VUES ENSEIGNANT =====================

@api_view(['GET'])
@permission_classes([EstPersonnelEtablissement])
def get_all_enseignants_by_etablissement(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)

    enseignants = Enseignant.objects.filter(etablissement=etab)
    data = []
    for enseignant in enseignants:
        utilisateur = enseignant.utilisateur
        data.append({
            'id': enseignant.id,
            'nom_complet': utilisateur.nom_complet,
            'matricule': utilisateur.matricule,
            'email': utilisateur.email,
            'courriel_employe': enseignant.courriel_employe,
            'departement': enseignant.departement.nom if enseignant.departement else None,
            'specialite': enseignant.specialite,
            'date_embauche': enseignant.date_embauche,
            'qualifications': enseignant.qualifications,
            'bureau': enseignant.bureau,
            'enseignant_telephone': enseignant.enseignant_telephone
        })
    return Response(data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([EstPersonnelEtablissement])
def get_enseignant_by_matricule(request, slug, matricule):
    try:
        etab = Etablissement.objects.get(slug=slug)
        utilisateur = Utilisateur.objects.get(matricule=matricule, etablissement=etab, role='enseignant')
        enseignant = Enseignant.objects.get(utilisateur=utilisateur)
    except (Etablissement.DoesNotExist, Utilisateur.DoesNotExist, Enseignant.DoesNotExist):
        return Response({'error': 'Enseignant introuvable'}, status=status.HTTP_404_NOT_FOUND)

    data = {
        'id': enseignant.id,
        'nom_complet': utilisateur.nom_complet,
        'matricule': utilisateur.matricule,
        'email': utilisateur.email,
        'courriel_employe': enseignant.courriel_employe,
        'departement': enseignant.departement.nom if enseignant.departement else None,
        'specialite': enseignant.specialite,
        'date_embauche': enseignant.date_embauche,
        'qualifications': enseignant.qualifications,
        'bureau': enseignant.bureau,
        'enseignant_telephone': enseignant.enseignant_telephone
    }
    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([EstPersonnelEtablissement])
def add_enseignant_to_etablissement(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)

    # Récupération des données
    nom_complet = request.data.get('nom_complet')
    matricule = request.data.get('matricule')
    email = request.data.get('email')
    mot_de_passe = request.data.get('mot_de_passe')
    courriel_employe = request.data.get('courriel_employe')
    departement_id = request.data.get('departement_id')
    specialite = request.data.get('specialite')
    date_embauche = request.data.get('date_embauche')
    qualifications = request.data.get('qualifications')
    bureau = request.data.get('bureau')
    enseignant_telephone = request.data.get('enseignant_telephone')

    # Vérification des champs requis
    if not all([nom_complet, matricule, email, mot_de_passe, specialite, qualifications]):
        return Response({'error': 'Tous les champs requis doivent être fournis.'}, status=status.HTTP_400_BAD_REQUEST)

    # Création de l'utilisateur
    utilisateur = Utilisateur(
        nom_complet=nom_complet,
        matricule=matricule,
        email=email,
        etablissement=etab,
        role='enseignant'
    )
    utilisateur.set_mot_de_passe(mot_de_passe)
    utilisateur.save()

    # Récupération du département si fourni
    departement = None
    if departement_id:
        try:
            departement = Departement.objects.get(id=departement_id, etablissement=etab)
        except Departement.DoesNotExist:
            return Response({'error': 'Département introuvable'}, status=status.HTTP_404_NOT_FOUND)

    # Création de l'enseignant
    enseignant = Enseignant(
        utilisateur=utilisateur,
        etablissement=etab,
        courriel_employe=courriel_employe,
        departement=departement,
        specialite=specialite,
        date_embauche=date_embauche,
        qualifications=qualifications,
        bureau=bureau,
        enseignant_telephone=enseignant_telephone
    )
    enseignant.save()

    return Response({'message': 'Enseignant ajouté avec succès'}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
@permission_classes([EstPersonnelEtablissement])
def update_enseignant_by_matricule(request, slug, matricule):
    try:
        etab = Etablissement.objects.get(slug=slug)
        utilisateur = Utilisateur.objects.get(matricule=matricule, etablissement=etab, role='enseignant')
        enseignant = Enseignant.objects.get(utilisateur=utilisateur)
    except (Etablissement.DoesNotExist, Utilisateur.DoesNotExist, Enseignant.DoesNotExist):
        return Response({'error': 'Enseignant introuvable'}, status=status.HTTP_404_NOT_FOUND)

    # Modification des infos Utilisateur
    utilisateur.nom_complet = request.data.get('nom_complet', utilisateur.nom_complet)
    utilisateur.email = request.data.get('email', utilisateur.email)
    nouveau_mdp = request.data.get('mot_de_passe')
    if nouveau_mdp:
        utilisateur.set_mot_de_passe(nouveau_mdp)
    utilisateur.save()

    # Modification des infos Enseignant
    enseignant.courriel_employe = request.data.get('courriel_employe', enseignant.courriel_employe)
    enseignant.specialite = request.data.get('specialite', enseignant.specialite)
    enseignant.date_embauche = request.data.get('date_embauche', enseignant.date_embauche)
    enseignant.qualifications = request.data.get('qualifications', enseignant.qualifications)
    enseignant.bureau = request.data.get('bureau', enseignant.bureau)
    
    # Département si fourni
    departement_id = request.data.get('departement_id')
    if departement_id:
        try:
            departement = Departement.objects.get(id=departement_id, etablissement=etab)
            enseignant.departement = departement
        except Departement.DoesNotExist:
            return Response({'error': 'Département introuvable'}, status=status.HTTP_404_NOT_FOUND)

    enseignant.save()

    return Response({'message': 'Enseignant mis à jour avec succès'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([EstPersonnelEtablissement])
def delete_enseignant_by_matricule(request, slug, matricule):
    try:
        etab = Etablissement.objects.get(slug=slug)
        utilisateur = Utilisateur.objects.get(matricule=matricule, etablissement=etab, role='enseignant')
        enseignant = Enseignant.objects.get(utilisateur=utilisateur)
        utilisateur.delete()
        enseignant.delete()
        return Response({'message': 'Enseignant supprimé avec succès'}, status=status.HTTP_204_NO_CONTENT)
    except (Etablissement.DoesNotExist, Utilisateur.DoesNotExist, Enseignant.DoesNotExist):
        return Response({'error': 'Enseignant introuvable'}, status=status.HTTP_404_NOT_FOUND)
