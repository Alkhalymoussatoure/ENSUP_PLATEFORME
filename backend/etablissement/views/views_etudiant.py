from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework import status

from etablissement.models import Etudiant,Utilisateur,Etablissement
from Messagerie.permissions import EstPersonnelEtablissement





#creer une vue pour lister les étudiants d'un établissement
@api_view(['GET'])
@permission_classes([EstPersonnelEtablissement])
def get_All_etudiantsByEtablissementSlug(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)

    etudiants = Etudiant.objects.filter(utilisateur__etablissement=etab)
    data = []
    for etudiant in etudiants:
        utilisateur = etudiant.utilisateur
        data.append({
            'nom': utilisateur.nom_complet,
            'matricule': utilisateur.matricule,
            'email': utilisateur.email,
            'date_admission': etudiant.date_admission,
            'courriel_etudiant': etudiant.courriel_etudiant,
            'statut': etudiant.statut,
            'etudiant_telephone': etudiant.etudiant_telephone,
            'adresse': etudiant.adresse,
            'tuteur_nom': etudiant.tuteur_nom,
            'tuteur_telephone': etudiant.tuteur_telephone,
            'programme_id': etudiant.programme_id
        })
    
    return Response(data, status=status.HTTP_200_OK)


#recuperer un etudiant par son matricule
@api_view(['GET'])
@permission_classes([EstPersonnelEtablissement])
def get_etudiant_by_matricule(request, slug, matricule):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)

    try:
        utilisateur = Utilisateur.objects.get(matricule=matricule, etablissement=etab, role='etudiant')
        etudiant = Etudiant.objects.get(utilisateur=utilisateur)
    except (Utilisateur.DoesNotExist, Etudiant.DoesNotExist):
        return Response({'error': 'Étudiant introuvable'}, status=status.HTTP_404_NOT_FOUND)

    data = {
        'nom': utilisateur.nom_complet,
        'matricule': utilisateur.matricule,
        'email': utilisateur.email,
        'date_admission': etudiant.date_admission,
        'courriel_etudiant': etudiant.courriel_etudiant,
        'statut': etudiant.statut,
        'etudiant_telephone': etudiant.etudiant_telephone,
        'adresse': etudiant.adresse,
        'tuteur_nom': etudiant.tuteur_nom,
        'tuteur_telephone': etudiant.tuteur_telephone,
        'programme_id': etudiant.programme_id
    }
    
    return Response(data, status=status.HTTP_200_OK)




# Modifier un etudiant par son matricule
@api_view(['PUT'])
@permission_classes([EstPersonnelEtablissement])
def update_etudiantByMatricule(request, slug, matricule):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)

    try:
        utilisateur = Utilisateur.objects.get(matricule=matricule, etablissement=etab, role='etudiant')
        etudiant = Etudiant.objects.get(utilisateur=utilisateur)
    except (Utilisateur.DoesNotExist, Etudiant.DoesNotExist):
        return Response({'error': 'Étudiant introuvable'}, status=status.HTTP_404_NOT_FOUND)

    # Modification des infos Utilisateur
    utilisateur.nom_complet = request.data.get('nom_complet', utilisateur.nom_complet)
    utilisateur.email = request.data.get('email', utilisateur.email)
    nouveau_mdp = request.data.get('mot_de_passe')
    if nouveau_mdp:
        utilisateur.set_mot_de_passe(nouveau_mdp)
    utilisateur.save()

    # Modification des infos Etudiant
    etudiant.date_admission = request.data.get('date_admission', etudiant.date_admission)
    etudiant.courriel_etudiant = request.data.get('courriel_etudiant', etudiant.courriel_etudiant)
    etudiant.statut = request.data.get('statut', etudiant.statut)
    etudiant.etudiant_telephone = request.data.get('etudiant_telephone', etudiant.etudiant_telephone)
    etudiant.adresse = request.data.get('adresse', etudiant.adresse)
    etudiant.tuteur_nom = request.data.get('tuteur_nom', etudiant.tuteur_nom)
    etudiant.tuteur_telephone = request.data.get('tuteur_telephone', etudiant.tuteur_telephone)
    
    # Programme si fourni
    programme_id = request.data.get('programme_id')
    if programme_id:
        etudiant.programme_id = programme_id

    etudiant.save()

    return Response({'message': 'Étudiant mis à jour avec succès'}, status=status.HTTP_200_OK)

  # Supprimer un étudiant par son matricule


@api_view(['DELETE'])
@permission_classes([EstPersonnelEtablissement])
def delete_etudiantByMatricule(request, slug, matricule):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)

    try:
        utilisateur = Utilisateur.objects.get(matricule=matricule, etablissement=etab, role='etudiant')
        etudiant = Etudiant.objects.get(utilisateur=utilisateur)
        utilisateur.delete()  # Supprimer l'utilisateur
        etudiant.delete()  # Supprimer l'étudiant
        return Response({'message': 'Étudiant supprimé avec succès'}, status=status.HTTP_204_NO_CONTENT)
    except (Utilisateur.DoesNotExist, Etudiant.DoesNotExist):
        return Response({'error': 'Étudiant introuvable'}, status=status.HTTP_404_NOT_FOUND)
    

# Ajouter un étudiant à un établissement
@api_view(['POST'])
@permission_classes([EstPersonnelEtablissement])
def add_etudiant_to_etablissement(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)

    # Récupération des données
    nom_complet = request.data.get('nom_complet')
    matricule = request.data.get('matricule')
    email = request.data.get('email')
    mot_de_passe = request.data.get('mot_de_passe')
    date_admission = request.data.get('date_admission')
    courriel_etudiant = request.data.get('courriel_etudiant')
    statut = request.data.get('statut', 'actif')
    etudiant_telephone = request.data.get('etudiant_telephone')
    adresse = request.data.get('adresse')
    tuteur_nom = request.data.get('tuteur_nom')
    tuteur_telephone = request.data.get('tuteur_telephone')
    programme_id = request.data.get('programme_id')

    # Vérification des champs requis
    if not all([nom_complet, matricule, email, mot_de_passe, date_admission,
                courriel_etudiant, etudiant_telephone, adresse, tuteur_nom, tuteur_telephone]):
        return Response({'error': 'Tous les champs requis doivent être fournis.'}, status=status.HTTP_400_BAD_REQUEST)

    # Création de l'utilisateur
    utilisateur = Utilisateur(
        nom_complet=nom_complet,
        matricule=matricule,
        email=email,
        mot_de_passe=mot_de_passe,
        etablissement=etab,
        role='etudiant'
    )
    utilisateur.set_mot_de_passe(mot_de_passe)  # Hachage du mot de passe
    utilisateur.save()

    # Création de l'étudiant
    etudiant = Etudiant(
        utilisateur=utilisateur,
        etablissement=etab,
        date_admission=date_admission,
        courriel_etudiant=courriel_etudiant,
        statut=statut,
        etudiant_telephone=etudiant_telephone,
        adresse=adresse,
        tuteur_nom=tuteur_nom,
        tuteur_telephone=tuteur_telephone,
        programme_id=programme_id  # Peut être None
    )
    etudiant.save()

    return Response({'message': 'Étudiant ajouté avec succès'}, status=status.HTTP_201_CREATED)
