from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from etablissement.models import Etablissement,Utilisateur
# deuxiem forme 
import pyotp
from django.utils import timezone
from django.core.exceptions import ValidationError


class Session2FA(models.Model):
    utilisateur = models.OneToOneField(
        Utilisateur, 
        on_delete=models.CASCADE, 
        related_name='session_2fa'
    )
    cle_totp = models.CharField(
        max_length=64,
        editable=False,
        blank=True,
        null=True
    )
    date_derniere_validation = models.DateTimeField(blank=True, null=True)
    appareil_confirme = models.CharField(max_length=200, blank=True, null=True)

    def generer_cle(self):
        if not self.cle_totp:
            self.cle_totp = pyotp.random_base32()
            self.save()

    def get_totp(self):
        if self.cle_totp:
            return pyotp.TOTP(self.cle_totp)
        return None

    def get_qr_uri(self):
        """URI à injecter dans un QR code pour app Authenticator"""
        totp = self.get_totp()
        if totp:
            return totp.provisioning_uri(
                name=self.utilisateur.email,
                issuer_name="EduPlatform"
            )
        return None

    def est_code_valide(self, code: str) -> bool:
        """Vérifie le code TOTP avec une marge de tolérance"""
        totp = self.get_totp()
        if not totp or not code:
            return False
        try:
            return totp.verify(code, valid_window=2)
        except Exception:
            return False

    def a_deja_valide(self, fingerprint: str) -> bool:
        """Vérifie si l'appareil est encore reconnu (moins de 30j)"""
        if not fingerprint:
            return False
        return (
            self.appareil_confirme == fingerprint
            and self.date_derniere_validation
            and (timezone.now() - self.date_derniere_validation).days <= 30
        )

    def enregistrer_validation(self, fingerprint: str):
        self.appareil_confirme = fingerprint
        self.date_derniere_validation = timezone.now()
        self.save()

    def __str__(self):
        return f"Session2FA: {self.utilisateur.email}"
