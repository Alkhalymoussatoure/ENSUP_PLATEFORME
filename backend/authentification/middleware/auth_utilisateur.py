from etablissement.models import Utilisateur
from django.utils.deprecation import MiddlewareMixin
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

class InjecterUtilisateurMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request.utilisateur = None
        auth_header = request.headers.get('Authorization', '')

        # Accepter les deux formats de jeton : "Token ..." ou "Bearer ..."
        prefixes = ['Token ', 'Bearer ']
        for prefix in prefixes:
            if auth_header.startswith(prefix):
                valeur = auth_header[len(prefix):].strip()
                try:
                    utilisateur = Utilisateur.objects.get(token=valeur)
                    if utilisateur.token_expires_at and utilisateur.token_expires_at > timezone.now():
                        request.utilisateur = utilisateur
                        logger.info(f" Utilisateur injecté : {utilisateur.email}")
                    else:
                        logger.info(f" Token expiré pour l'utilisateur {utilisateur.email}")
                except Utilisateur.DoesNotExist:
                    logger.warning(f" Aucun utilisateur avec le token fourni ({valeur})")
                break  #  On arrête dès qu'un préfixe valide est traité
