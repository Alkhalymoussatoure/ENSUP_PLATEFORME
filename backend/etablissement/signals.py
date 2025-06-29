from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Annonce, Message # import de la classe Annonce et message
from django.core.mail import send_mail

@receiver(post_save, sender=Annonce)
def notifier_annonce_urgente(sender, instance, created, **kwargs):
    if created and instance.est_urgent:
        destinataires = []

        if instance.est_generale:
            # Notifier tout le monde (exemple simplifié)
            from .models import Utilisateur
            destinataires = Utilisateur.objects.filter(etablissement=instance.etablissement, role='etudiant')
        elif instance.section:
            # Notifier uniquement les étudiants de la section
            from .models import Inscription
            inscriptions = Inscription.objects.filter(section=instance.section)
            destinataires = [ins.etudiant.utilisateur for ins in inscriptions]

        # Envoyer les courriels (ou une autre méthode de notification)
        for utilisateur in destinataires:
            send_mail(
                subject=f"🔔 Nouvelle annonce urgente : {instance.titre}",
                message=instance.contenu,
                from_email='noreply@tonetab.org',
                recipient_list=[utilisateur.courriel],
                fail_silently=True,
            )



@receiver(post_save, sender=Message)
def notifier_message(sender, instance, created, **kwargs):
    if created:
        destinataires = instance.destinataires.all()
        for utilisateur in destinataires:
            if utilisateur.courriel:
                send_mail(
                    subject=f"📬 Nouveau message : {instance.sujet}",
                    message=f"Tu as reçu un message de {instance.expediteur.nom_utilisateur}.",
                    from_email='noreply@tonetab.org',
                    recipient_list=[utilisateur.courriel],
                    fail_silently=True,
                )
