
from django.urls import path
from .views import verifier_token,verifier_slug, generer_2fa, verifier_2fa, register_utilisateur, connexion_utilisateur,deconnexion_utilisateur,demande_reinitialisation_email,valider_reinitialisation

urlpatterns = [
    path('<slug:slug>/register/', register_utilisateur),
    path('<slug:slug>/verify/', verifier_slug),
    path('<slug:slug>/verify-token/', verifier_token),
    path('<slug:slug>/login/', connexion_utilisateur),
    path('<slug:slug>/2fa/generer/', generer_2fa),
    path('<slug:slug>/2fa/verify/', verifier_2fa),
    path('<slug:slug>/logout/',deconnexion_utilisateur),
    path('<slug:slug>/reset-password/request/', demande_reinitialisation_email),
    path('<slug:slug>/reset-password/<str:token>/', valider_reinitialisation),
]