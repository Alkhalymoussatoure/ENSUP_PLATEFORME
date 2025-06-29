
from django.urls import path
from .views import generer_2fa, verifier_2fa, register_utilisateur, connexion_utilisateur

urlpatterns = [
    path('<slug:slug>/register/', register_utilisateur),
    path('<slug:slug>/login/', connexion_utilisateur),
    path('<slug:slug>/2fa/generer/', generer_2fa),
    path('<slug:slug>/2fa/verify/', verifier_2fa),
]