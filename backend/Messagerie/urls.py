from django.urls import path
from .views import (
    envoyer_message,boite_reception,rechercher_utilisateur, 
    publier_message_forum,envoyer_message_groupe,liste_notifications,
    marquer_notification_lue, supprimer_notification
)

urlpatterns = [
    path('<slug:slug>/messages/send/', envoyer_message),
    path('<slug:slug>/messages/inbox/', boite_reception),
    path('<slug:slug>/users/search/', rechercher_utilisateur),
    path('<slug:slug>/messages/group/send/', envoyer_message_groupe),
    path('<slug:slug>/forums/<slug:forum_slug>/post/', publier_message_forum),
    path('<slug:slug>/notifications/', liste_notifications),
    path('<slug:slug>/notifications/<int:notification_id>/read/', marquer_notification_lue),
    path('<slug:slug>/notifications/<int:notification_id>/delete/', supprimer_notification),
]
