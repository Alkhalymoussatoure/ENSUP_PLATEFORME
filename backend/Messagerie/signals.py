from django.db.models.signals import post_save
from django.dispatch import receiver
from etablissement.models import Annonce, Message # import de la classe Annonce et message
from django.core.mail import send_mail
from etablissement.models import Notification



@receiver(post_save, sender=Annonce)
def notifier_annonce_urgente(sender, instance, created, **kwargs):
    if created and instance.est_urgent:
        destinataires = []

        if instance.est_generale:
            from authentification.models import Utilisateur
            destinataires = Utilisateur.objects.filter(etablissement=instance.etablissement, est_actif=True)
        elif instance.section:
            from etablissement.models import Inscription
            inscriptions = Inscription.objects.filter(section=instance.section)
            destinataires = [ins.etudiant.utilisateur for ins in inscriptions]

        for utilisateur in destinataires:
            Notification.objects.create(
                utilisateur=utilisateur,
                titre=f"🔔 Urgence : {instance.titre}",
                texte=instance.contenu,
                lien_associe=f"/{instance.etablissement.slug}/annonces/{instance.id}/"
            )


@receiver(post_save, sender=Message)
def notifier_message(sender, instance, created, **kwargs):
    if created:
        for utilisateur in instance.destinataires.all():
            Notification.objects.create(
                utilisateur=utilisateur,
                titre=f"Nouveau message de {instance.expediteur.nom_complet}",
                texte=f"Consulte ta messagerie pour lire : « {instance.sujet} »",
                lien_associe=f"/{instance.etablissement.slug}/messages/{instance.id}/"
            )



