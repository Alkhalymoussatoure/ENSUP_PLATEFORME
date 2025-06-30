from django.urls import path
from .views import (
    get_etablissementBySlug,
    get_all_etablissements,
    create_etablissement,
    update_etablissementBySlug,
    delete_etablissementBySlug,

    get_All_etudiantsByEtablissementSlug,
    get_etudiant_by_matricule,
    update_etudiantByMatricule,
    delete_etudiantByMatricule,
    add_etudiant_to_etablissement,
)

urlpatterns = [
    # Établissements
    path('etablissements/all/', get_all_etablissements, name='liste-etablissements'),
    path('etablissements/create/', create_etablissement, name='create-etablissement'),
    path('etablissements/<slug:slug>/', get_etablissementBySlug, name='get-etablissement'),
    path('etablissements/<slug:slug>/update/', update_etablissementBySlug, name='update-etablissement'),
    path('etablissements/<slug:slug>/delete/', delete_etablissementBySlug, name='delete-etablissement'),

    # Étudiants
    path('etablissements/<slug:slug>/etudiants/', get_All_etudiantsByEtablissementSlug, name='liste-etudiants'),
    path('etablissements/<slug:slug>/etudiants/<str:matricule>/', get_etudiant_by_matricule, name='get-etudiant'),
    path('etablissements/<slug:slug>/etudiants/<str:matricule>/update/', update_etudiantByMatricule, name='update-etudiant'),
    path('etablissements/<slug:slug>/etudiants/<str:matricule>/delete/', delete_etudiantByMatricule, name='delete-etudiant'),
    path('etablissements/<slug:slug>/etudiants/add/', add_etudiant_to_etablissement, name='add-etudiant'),]
