from etablissement.models import Utilisateur
from django.utils.deprecation import MiddlewareMixin
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

class InjecterUtilisateurMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request.utilisateur = None
        token = request.headers.get('Authorization', '')

        if token.startswith('Token '):
            try:
                valeur = token.split(' ')[1]
                utilisateur = Utilisateur.objects.get(token=valeur)

                if utilisateur.token_expires_at and utilisateur.token_expires_at > timezone.now():
                    request.utilisateur = utilisateur
                else:
                    logger.info(f"🔒 Token expiré pour l'utilisateur {utilisateur.email}")
            except (IndexError, Utilisateur.DoesNotExist):
                logger.warning("⚠️ Token invalide ou utilisateur inexistant")
