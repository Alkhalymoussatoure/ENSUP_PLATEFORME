from rest_framework.permissions import BasePermission
from etablissement.models import Etablissement
from django.db.models import Q

class EstLegitimePourConnexion(BasePermission):
    """
    Autorise l'accès à la vue de connexion uniquement si le slug d'établissement est valide.
    """
    def has_permission(self, request, view):
        slug = view.kwargs.get('slug')
        if not slug:
            return False

        return Etablissement.objects.filter(slug=slug).exists()

class EstConnecteEtDansEtablissement(BasePermission):
    """
    Vérifie que l'utilisateur est bien connecté ET appartient à l'établissement désigné par le slug
    """
    def has_permission(self, request, view):
        slug = view.kwargs.get('slug')
        utilisateur = getattr(request, 'utilisateur', None)

        return (
            utilisateur is not None and
            utilisateur.est_actif and
            hasattr(utilisateur, 'etablissement') and
            utilisateur.etablissement is not None and
            utilisateur.etablissement.slug == slug
        )

class EstEtudiantDansEtablissement(EstConnecteEtDansEtablissement):
    def has_permission(self, request, view):
        utilisateur = getattr(request, 'utilisateur', None)
        return super().has_permission(request, view) and utilisateur.role == 'etudiant'


class EstEnseignantDansEtablissement(EstConnecteEtDansEtablissement):
    def has_permission(self, request, view):
        utilisateur = getattr(request, 'utilisateur', None)
        return super().has_permission(request, view) and utilisateur.role == 'enseignant'


class EstAdministrateurDansEtablissement(EstConnecteEtDansEtablissement):
    def has_permission(self, request, view):
        utilisateur = getattr(request, 'utilisateur', None)
        return super().has_permission(request, view) and utilisateur.role == 'administrateur'


class EstDirecteurDansEtablissement(EstConnecteEtDansEtablissement):
    def has_permission(self, request, view):
        utilisateur = getattr(request, 'utilisateur', None)
        return super().has_permission(request, view) and utilisateur.role == 'directeur'


class EstPersonnelEtablissement(EstConnecteEtDansEtablissement):
    def has_permission(self, request, view):
        utilisateur = getattr(request, 'utilisateur', None)
        return (
            super().has_permission(request, view)
            and utilisateur.role in ['enseignant', 'administrateur', 'directeur']
        )
