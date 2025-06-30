from .models import Etablissement
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework import status

from etablissement.models import Etablissement
from authentification.models import Utilisateur
from etablissement.models import Etudiant
from permissions.permissions import EstPersonnelEtablissement
from rest_framework.views import APIView

#Recuperer un etablissement par son slug
@api_view(['GET'])
def get_etablissementBySlug(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
        return Response({
            'nom': etab.nom_etablissement,
            'domaine': etab.domaine,
            'slug': etab.slug,
            # 'logo':etab.logo,
            'description':etab.description,
            'adresse': etab.adresse,
            'tel_etablissement':etab.tel_etablissement ,
            'courriel_contact':etab.courriel_contact,
            'type_etablissement':etab.type_etablissement,
            'site_web':etab.site_web,
            'statut':etab.statut,
            'date_creation':etab.date_creation,
            'date_modification':etab.date_modification
        })
    except Etablissement.DoesNotExist:
       return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)
    

      
 # recuperer la liste des etablissements
@api_view(['GET'])
def get_all_etablissements(request):
    etablissements = Etablissement.objects.all()
    data = [
        {
            'id': etab.id,
            'nom': etab.nom_etablissement,
            'slug': etab.slug,
            'domaine': etab.domaine,
            'description': etab.description,
            'adresse': etab.adresse,
            'tel_etablissement': etab.tel_etablissement,
            'courriel_contact': etab.courriel_contact,
            'type_etablissement': etab.type_etablissement,
            'site_web': etab.site_web,
            'statut': etab.statut,
            'date_creation': etab.date_creation,
            'date_modification': etab.date_modification
        } for etab in etablissements
    ]
    return Response(data, status=status.HTTP_200_OK)

# # Créer un nouvel établissement
@api_view(['POST'])
def create_etablissement(request):
    # Récupérer toutes les données nécessaires avec des valeurs par défaut si possible
    nom = request.data.get('nom')
    slug = request.data.get('slug')
    domaine = request.data.get('domaine', '')
    description = request.data.get('description', '')
    adresse = request.data.get('adresse', '')
    telephone = request.data.get('telephone', '')
    courriel_contact = request.data.get('courriel_contact', '')
    type_etablissement = request.data.get('type_etablissement', 'universite')  # ou autre défaut
    statut = request.data.get('statut', 'actif')  # ou autre défaut
    logo_url = request.data.get('logo_url', '')
    theme_config = request.data.get('theme_config', {})
    

    # Vérification des champs obligatoires
    if not all([nom, slug, description, adresse, telephone, courriel_contact]):
        return Response({'error': 'Les champs nom, slug, description, adresse, téléphone et courriel_contact sont requis.'},
                        status=status.HTTP_400_BAD_REQUEST)

    # Vérifier si le slug est déjà utilisé
    if Etablissement.objects.filter(slug=slug).exists():
        return Response({'error': 'Un établissement avec ce slug existe déjà.'},
                        status=status.HTTP_400_BAD_REQUEST)

    # Créer et sauvegarder le nouvel établissement
    new_etab = Etablissement(
        nom=nom,
        slug=slug,
        domaine=domaine,
        description=description,
        adresse=adresse,
        telephone=telephone,
        courriel_contact=courriel_contact,
        type_etablissement=type_etablissement,
        statut=statut,
        logo_url=logo_url,
        theme_config=theme_config,
        
    )
    new_etab.save()

    return Response({
        'message': 'Établissement créé avec succès.',
        'id': new_etab.id,
        'nom': new_etab.nom,
        'slug': new_etab.slug
    }, status=status.HTTP_201_CREATED)

#Modifier un établissement
@api_view(['PUT'])
def update_etablissementBySlug(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)

    # Mettre à jour les champs de l'établissement
    etab.nom_etablissement = request.data.get('nom_etablissement', etab.nom_etablissement)
    etab.domaine = request.data.get('domaine', etab.domaine)
    etab.description = request.data.get('description', etab.description)
    etab.adresse = request.data.get('adresse', etab.adresse)
    etab.tel_etablissement = request.data.get('tel_etablissement', etab.tel_etablissement)
    etab.courriel_contact = request.data.get('courriel_contact', etab.courriel_contact)
    etab.type_etablissement = request.data.get('type_etablissement', etab.type_etablissement)
    etab.site_web = request.data.get('site_web', etab.site_web)
    etab.statut = request.data.get('statut', etab.statut)

    # Enregistrer les modifications
    etab.save()

    return Response({'message': 'Établissement mis à jour avec succès'}, status=status.HTTP_200_OK)


# Supprimmer un etablissement
@api_view(['DELETE'])
def delete_etablissementBySlug(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
        etab.delete()
        return Response({'message': 'Établissement supprimé avec succès'}, status=status.HTTP_204_NO_CONTENT)
    except Etablissement.DoesNotExist:
        return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)


##################################################
#creer les vues pour Etudiant


#creer une vue pour lister les étudiants d'un établissement
@api_view(['GET'])
#@permission_classes([EstPersonnelEtablissement])
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
#@permission_classes([EstPersonnelEtablissement])
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
