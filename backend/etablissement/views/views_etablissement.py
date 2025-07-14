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


