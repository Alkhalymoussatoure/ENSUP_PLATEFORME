from .models import Message, Notification
from django.db.models.signals import post_save

@receiver(post_save, sender=Message)
def notifier_message(sender, instance, created, **kwargs):
    if created:
        for utilisateur in instance.destinataires.all():
            Notification.objects.create(
                utilisateur=utilisateur,
                message=instance,
                titre=f"Nouveau message de {instance.expediteur.nom_utilisateur}",
                texte=f"Consulte ton espace messagerie pour voir le message : « {instance.sujet} »"
            )
