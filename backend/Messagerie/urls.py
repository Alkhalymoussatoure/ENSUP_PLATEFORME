from django.urls import path
from .views import (
    envoyer_message_unifie,message_boite_reception,rechercher_utilisateur, 
    publier_message_forum,message_boite_envoi,liste_notifications,
    marquer_notification_lue, supprimer_notification,get_messages_in_trash, 
    delete_message_for_user,delete_message_forum_by_id, message_marquer_lu, move_message_to_trash,restore_message_from_trash
)

urlpatterns = [
    
    path('<slug:slug>/messages/send/', envoyer_message_unifie), # envoi de message
    path('<slug:slug>/messages/inbox/', message_boite_reception),# est reçu
    path('<slug:slug>/messages/marquer_lu/', message_marquer_lu),# est marquer comme lu
    
    path('<slug:slug>/messages/<int:message_id>/trash/', move_message_to_trash), #corbeil
    path('<slug:slug>/messages/prendre-tous-corbeille/', get_messages_in_trash), #corbeil
    path('<slug:slug>/messages/<int:message_id>/restore/', restore_message_from_trash), # restaurer
    path('<slug:slug>/messages/inbox/<int:message_id>/delete-user/', delete_message_for_user),# sup message utilisateur 
    path('<slug:slug>/users/search/', rechercher_utilisateur), # rechercher destinataire(nom_complet ou matricule)
    path('<slug:slug>/messages/envoyer/', message_boite_envoi), # messages envoyés
    path('<slug:slug>/forums/<slug:forum_slug>/post/', publier_message_forum),
    path('<slug:slug>/forums/<slug:forum_slug>/delete/', delete_message_forum_by_id),
    path('<slug:slug>/notifications/', liste_notifications),
    path('<slug:slug>/notifications/<int:notification_id>/read/', marquer_notification_lue),
    path('<slug:slug>/notifications/<int:notification_id>/delete/', supprimer_notification),
] 
