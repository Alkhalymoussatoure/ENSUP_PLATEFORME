# middleware/auth_utilisateur.py

from etablissement.models import Utilisateur
from django.utils.deprecation import MiddlewareMixin

from django.utils import timezone


class InjecterUtilisateurMiddleware(MiddlewareMixin):
    def process_request(self, request):
        token = request.headers.get('Authorization')

        if token and token.startswith('Token '):
            valeur = token.split(' ')[1]
            try:
                utilisateur = Utilisateur.objects.get(token=valeur)
                if utilisateur.token_expires_at and utilisateur.token_expires_at > timezone.now():
                    request.utilisateur = utilisateur
                else:
                    request.utilisateur = None  # token expiré
            except Utilisateur.DoesNotExist:
                request.utilisateur = None
