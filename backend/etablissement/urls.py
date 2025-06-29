from django.urls import path
from .views import etablissement_test
from .views import ListeEtudiantsView


urlpatterns=[
    path('<slug:slug>/',etablissement_test, name='etablissement-test'),
    path('<slug:slug>/etudiants/', ListeEtudiantsView.as_view(), name='liste-etudiants'),
]