from .models import Etablissement
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from etablissement.models import Etablissement
from authentification.models import Utilisateur
from permissions.permissions import EstPersonnelEtablissement
from rest_framework.views import APIView

# test  api moin importante 
@api_view(['GET'])
def etablissement_test(request, slug):
    try:
        etab = Etablissement.objects.get(slug=slug)
        return Response({
            'nom_etablissement': etab.nom_etablissement,
            'domaine': etab.domaine,
            'slug': etab.slug,
            'logo':etab.logo,
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

class ListeEtudiantsView(APIView):
    permission_classes = [EstPersonnelEtablissement]

    def get(self, request, slug):
        try:
            etab = Etablissement.objects.get(slug=slug)
        except Etablissement.DoesNotExist:
            return Response({'error': 'Établissement introuvable'}, status=status.HTTP_404_NOT_FOUND)

        etudiants = Utilisateur.objects.filter(etablissement=etab, role='etudiant')
        data = [
            {
                'nom': u.nom_complet,
                'matricule': u.matricule,
                'email': u.email,
            } for u in etudiants
        ]
        return Response(data, status=status.HTTP_200_OK)
    
# fin test 

#  api de creation de vu 

@api_view(['POST'])
def Create_Etablissement(request):
    # Récupérer toutes les données nécessaires avec des valeurs par défaut si possible
    nom_etablissement = request.data.get('nom')
    slug = request.data.get('slug')
    domaine = request.data.get('domaine', '')
    logo = request.data.get('logo', '')
    description = request.data.get('description', '')
    adresse = request.data.get('adresse', '')
    tel_etablissement = request.data.get('tel_etablissement', '')
    courriel_contact = request.data.get('courriel_contact', '')
    type_etablissement = request.data.get('type_etablissement', 'universite')  # ou autre défaut
    statut = request.data.get('statut', 'actif')  # ou autre défaut
   
    
    # Vérification des champs obligatoires
    if not all([nom_etablissement, slug, description, adresse, tel_etablissement, courriel_contact]):
        return Response({'error': 'Les champs nom, slug, description, adresse, téléphone et courriel_contact sont requis.'},
                        status=status.HTTP_400_BAD_REQUEST)

    # Vérifier si le slug est déjà utilisé
    if Etablissement.objects.filter(slug=slug).exists():
        return Response({'error': 'Un établissement avec ce slug existe déjà.'},
                        status=status.HTTP_400_BAD_REQUEST)

    # Créer et sauvegarder le nouvel établissement
    new_etab = Etablissement(
        nom_etablissement=nom_etablissement,
        slug=slug,
        domaine=domaine,
        logo=logo,
        description=description,
        adresse=adresse,
        tel_etablissement=tel_etablissement,
        courriel_contact=courriel_contact,
        type_etablissement=type_etablissement,
        statut=statut,
       
    )
    new_etab.save()

    return Response({
        'message': 'Établissement créé avec succès.',
        'id': new_etab.id,
        'nom': new_etab.nom_etablissement,
        'slug': new_etab.slug,
        'domaine': new_etab.domaine,
        'logo': new_etab.logo,
        'description': new_etab.description,
        'adresse': new_etab.adresse,
        'telephone': new_etab.tel_etablissement,
        'courriel_contact': new_etab.courriel_contact,
        'type_etablissement': new_etab.type_etablissement,
        'statut': new_etab.statut,
        
    }, status=status.HTTP_201_CREATED)
 
@api_view(['POST'])
def Create_Utilisateur(request, slug):
    pass

@api_view(['POST'])
def Create_Enseignant(request, slug):
    pass

@api_view(['POST'])
def Create_Departement(request, slug):
    pass

@api_view(['POST'])
def Create_Porgramme(request, slug):
    pass

@api_view(['POST'])
def Create_Cours(request, slug):
    pass

@api_view(['POST'])
def Create_Session(request, slug):
    pass

@api_view(['POST'])
def Create_Section(request, slug):
    pass

@api_view(['POST'])
def Create_Horaire(request, slug):
    pass

@api_view(['POST'])
def Create_Inscripion(request, slug):
    pass

@api_view(['POST'])
def Create_Facture(request, slug):
    pass

@api_view(['POST'])
def Create_Travail(request, slug):
    pass

@api_view(['POST'])
def Create_Remise(request, slug):
    pass

@api_view(['POST'])
def Create_Note(request, slug):
    pass

@api_view(['POST'])
def Create_Presence(request, slug):
    pass

@api_view(['POST'])
def Create_Message(request, slug):
    pass

@api_view(['POST'])
def Create_Annonce(request, slug):
    pass

@api_view(['POST'])
def Create_Forum(request, slug):
    pass

@api_view(['POST'])
def Create_MessageForum(request, slug):
    pass

@api_view(['POST'])
def Create_Local(request, slug):
    pass

@api_view(['POST'])
def Create_Document(request, slug):
    pass

@api_view(['POST'])
def Create_EvenementCalendrier(request, slug):
    pass

@api_view(['POST'])
def Create_FraisScolarite(request, slug):
    pass

@api_view(['POST'])
def Create_Paiement(request, slug):
    pass
# Fin api creation 


# Début api modification

@api_view(['POST'])
def Update_Etablissement(request, id):
    pass

@api_view(['POST'])
def Update_Utilisateur(request, slug, id):
    pass

@api_view(['POST'])
def Update_Enseignant(request, slug, id):
    pass

@api_view(['POST'])
def Update_Departement(request, slug, id):
    pass

@api_view(['POST'])
def Update_Porgramme(request, slug, id):
    pass

@api_view(['POST'])
def Update_Cours(request, slug, id):
    pass

@api_view(['POST'])
def Update_Session(request, slug, id):
    pass

@api_view(['POST'])
def Update_Section(request, slug, id):
    pass

@api_view(['POST'])
def Update_Horaire(request, slug, id):
    pass

@api_view(['POST'])
def Update_Inscripion(request, slug, id):
    pass

@api_view(['POST'])
def Update_Facture(request, slug, id):
    pass

@api_view(['POST'])
def Update_Travail(request, slug, id):
    pass

@api_view(['POST'])
def Update_Remise(request, slug, id):
    pass

@api_view(['POST'])
def Update_Note(request, slug, id):
    pass

@api_view(['POST'])
def Update_Presence(request, slug, id):
    pass

@api_view(['POST'])
def Update_Message(request, slug, id):
    pass

@api_view(['POST'])
def Update_Annonce(request, slug, id):
    pass

@api_view(['POST'])
def Update_Forum(request, slug, id):
    pass

@api_view(['POST'])
def Update_MessageForum(request, slug, id):
    pass

@api_view(['POST'])
def Update_Local(request, slug, id):
    pass

@api_view(['POST'])
def Update_Document(request, slug, id):
    pass

@api_view(['POST'])
def Update_EvenementCalendrier(request, slug, id):
    pass

@api_view(['POST'])
def Update_FraisScolarite(request, slug, id):
    pass

@api_view(['POST'])
def Update_Paiement(request, slug, id):
    pass
# Fin api Modification 

# Debut api Suppression -----------------------------------------------

@api_view(['POST'])
def Delete_Etablissement(request, id):
   pass
 
@api_view(['POST'])
def Delete_Utilisateur(request, slug, id):
    pass

@api_view(['POST'])
def Delete_Enseignant(request, slug, id):
    pass

@api_view(['POST'])
def Delete_Departement(request, slug, id):
    pass

@api_view(['POST'])
def Delete_Porgramme(request, slug, id):
    pass

@api_view(['POST'])
def Delete_Cours(request, slug, id):
    pass

@api_view(['POST'])
def Delete_Session(request, slug, id):
    pass

@api_view(['POST'])
def Delete_Section(request, slug, id):
    pass

@api_view(['POST'])
def Delete_Horaire(request, slug, id):
    pass

@api_view(['POST'])
def Delete_Inscripion(request, slug, id):
    pass

@api_view(['POST'])
def Delete_Facture(request, slug, id):
    pass

@api_view(['POST'])
def Delete_Travail(request, slug, id):
    pass

@api_view(['POST'])
def Delete_Remise(request, slug, id):
    pass

@api_view(['POST'])
def Delete_Note(request, slug, id):
    pass

@api_view(['POST'])
def Delete_Presence(request, slug, id):
    pass

@api_view(['POST'])
def Delete_Message(request, slug, id):
    pass

@api_view(['POST'])
def Delete_Annonce(request, slug, id):
    pass

@api_view(['POST'])
def Delete_Forum(request, slug, id):
    pass

@api_view(['POST'])
def Delete_MessageForum(request, slug, id):
    pass

@api_view(['POST'])
def Delete_Local(request, slug, id):
    pass

@api_view(['POST'])
def Delete_Document(request, slug, id):
    pass

@api_view(['POST'])
def Delete_EvenementCalendrier(request, slug, id):
    pass

@api_view(['POST'])
def Delete_FraisScolarite(request, slug, id):
    pass

@api_view(['POST'])
def Delete_Paiement(request, slug, id):
    pass
# Fin api supression