import pyotp, qrcode, io, re, jwt
import base64, random, secrets
from passlib.hash import pbkdf2_sha256

from django.db.models import Q
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.conf import settings

from django.utils import timezone
from django.contrib.auth import get_user_model
from authentification.models import Session2FA

from etablissement.models import Etablissement
from authentification.constants import ROLES_AVEC_2FA
from django.core.validators import validate_email

from django.core.exceptions import ValidationError
from .models import Utilisateur,Session2FA
from Messagerie.permissions import EstConnecteEtDansEtablissement, EstLegitimePourConnexion
from django.http import JsonResponse
from datetime import timedelta
from django.core.mail import send_mail


@api_view(['POST'])
def register_utilisateur(request, slug):
    data = request.data

    matricule = data.get('matricule')
    nom_complet = data.get('nom_complet')
    email = data.get('email')
    mot_de_passe = data.get('mot_de_passe')
    mot_de_passe_confirm = data.get('mot_de_passe_confirm')
    role = data.get('role')
    #  Vérifie que tous les champs sont présents
    if not all([matricule, nom_complet, email, mot_de_passe, mot_de_passe_confirm, role]):
        return Response({'error': "Tous les champs sont requis."}, status=400)

    #  Validation des mots de passe
    if mot_de_passe != mot_de_passe_confirm:
        return Response({'error': "Les mots de passe ne sont pas identiques."}, status=400)

    if (
        len(mot_de_passe) < 8 or
        not re.search(r'[A-Za-z]', mot_de_passe) or
        not re.search(r'\d', mot_de_passe) or
        not re.search(r'[!@#$%^&*()_+{}\[\]:;"\'<>.,?\\|/-]', mot_de_passe)
    ):
        return Response({'error': "Mot de passe trop faible."}, status=400)

    #  Validation email
    try:
        validate_email(email)
    except ValidationError:
        return Response({'error': "Adresse e-mail invalide."}, status=400)

    #  Vérification unicité
    if Utilisateur.objects.filter(matricule=matricule).exists():
        return Response({'error': "Ce matricule est déjà utilisé."}, status=400)
    if Utilisateur.objects.filter(email=email).exists():
        return Response({'error': "Cet e-mail est déjà utilisé."}, status=400)

    #  Vérifie établissement
    try:
        etab = Etablissement.objects.get(slug=slug)
    except Etablissement.DoesNotExist:
        return Response({'error': "Établissement inconnu."}, status=404)

    #  Création utilisateur : on passe le mot de passe en clair
    utilisateur = Utilisateur(
        matricule=matricule,
        email=email,
        mot_de_passe=mot_de_passe,  # sera haché automatiquement via save()
        nom_complet=nom_complet,
        role=role,
        etablissement=etab,
        
    )
    utilisateur.set_mot_de_passe(mot_de_passe)  #  Hachage explicite
    utilisateur._mot_de_passe_deja_hache = True #si l'utilisateur ets deja hascher dis-lui de ne pas re-hasher
    utilisateur.save()

    return Response({'message': 'Utilisateur créé avec succès'}, status=201)


@api_view(['GET'])
def verifier_token(request, slug):
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    print(" [verify-token] Token reçu:", token)
    print(" [verify-token] Slug reçu:", slug)

    utilisateur = Utilisateur.objects.filter(token=token).first()

    if not utilisateur:
        return Response({'valid': False, 'reason': 'user_not_found'}, status=401)
    elif not utilisateur.est_token_valide():
        return Response({'valid': False, 'reason': 'token_expired'}, status=401)
    elif utilisateur.etablissement.slug != slug:
        return Response({'valid': False, 'reason': 'wrong_establishment'}, status=401)
    return Response({
        'valid': True,
        'reason': None,  # ← Très important pour éviter le fallback “Accès non autorisé.”
        'matricule': utilisateur.matricule,
    })


@api_view(['GET'])
def verifier_slug(request, slug):
    try:
        Etablissement.objects.get(slug=slug)
        return JsonResponse({'valid': True})
    except Etablissement.DoesNotExist:
        return JsonResponse({'valid': False}, status=404)


@api_view(['POST'])
@permission_classes([EstLegitimePourConnexion])
def connexion_utilisateur(request, slug):
    identifiant = request.data.get('identifiant')
    mot_de_passe = request.data.get('mot_de_passe')
    fingerprint = request.data.get('fingerprint')  #  identifiant unique de l'appareil

    if not identifiant or not mot_de_passe:
        return Response({'error': 'Identifiant et mot de passe obligatoires.'}, status=400)

    utilisateur = Utilisateur.objects.filter(
        Q(email=identifiant) | Q(matricule=identifiant)
    ).first()

    if not utilisateur:
        return Response({'error': "Identifiants invalides"}, status=401)

    if utilisateur.etablissement.slug != slug:
        return Response({'error': "Tu ne peux pas te connecter ici. Établissement incorrect."}, status=403)

    if not utilisateur.verifier_mot_de_passe(mot_de_passe):
        return Response({'error': "Mot de passe invalide"}, status=401)

    if not utilisateur.est_actif:
        return Response({'error': "Compte désactivé"}, status=403)

    #  Logique 2FA intégrée
    session = getattr(utilisateur, 'session_2fa', None)

    if not session:
        session = Session2FA.objects.create(utilisateur=utilisateur)

    if session.doit_declencher_2fa(fingerprint):
        #  Cas 1 : première fois (pas de clé)
        if not session.cle_totp:
            return Response({
                'require_2fa_setup': True,
                'redirect_url': f"/{slug}/2fa/init?identifiant={identifiant}"
            }, status=202)

        #  Cas 2 : clé active mais nouvel appareil
        session.generer_cle()  # (tu peux limiter par fréquence)
        return Response({
            'require_2fa': True,
            'message': "Code de vérification requis",
            'identifiant': identifiant,
            'slug': slug,
            'fingerprint': fingerprint
        }, status=202)

    #  Cas 3 : appareil reconnu + 2FA déjà validé  accès direct
    utilisateur.generer_token()
    return Response({
        'message': 'Connexion réussie',
        'matricule': utilisateur.matricule,
        'token': utilisateur.token,
        'email': utilisateur.email,
        'role': utilisateur.role,
        'nom': utilisateur.nom_complet,
        'slug_etablissement': utilisateur.etablissement.slug
    })
    

@api_view(['GET'])
@permission_classes([EstLegitimePourConnexion])
def generer_2fa(request, slug):
    utilisateur = getattr(request, 'utilisateur', None)

    if not utilisateur:
        identifiant = request.query_params.get('identifiant')  #  ou dans les headers ou body si tu préfères
        utilisateur = Utilisateur.objects.filter(
            Q(email=identifiant) | Q(matricule=identifiant),
            etablissement__slug=slug
        ).first()

    if not utilisateur:
        return Response({'error': 'Utilisateur non identifié'}, status=401)

    if utilisateur.etablissement.slug != slug:
        return Response({'error': "Tu n'appartiens pas à cet établissement."}, status=403)

    if not hasattr(utilisateur, 'session_2fa'):
        session = Session2FA.objects.create(utilisateur=utilisateur)
    else:
        session = utilisateur.session_2fa

    session.generer_cle()

    otp_url = pyotp.totp.TOTP(session.cle_totp).provisioning_uri(
        name=utilisateur.email,
        issuer_name="Portail Établissement"
    )

    qr = qrcode.make(otp_url)
    buffer = io.BytesIO()
    qr.save(buffer, format="PNG")
    qr_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

    return Response({
        'qr_code': f"data:image/png;base64,{qr_base64}",
        'message': "Scanne le QR Code avec Google Authenticator pour activer le 2FA"
    })

 
@api_view(['POST'])
@permission_classes([EstLegitimePourConnexion])
def verifier_2fa(request, slug):
    utilisateur = getattr(request, 'utilisateur', None)

    if not utilisateur:
        identifiant = request.data.get('identifiant')
        utilisateur = Utilisateur.objects.filter(
            Q(email=identifiant) | Q(matricule=identifiant),
            etablissement__slug=slug
        ).first()

    if not utilisateur:
        return Response({'error': 'Utilisateur non identifié'}, status=401)

    if utilisateur.etablissement.slug != slug:
        return Response({'error': "Tu n'appartiens pas à cet établissement."}, status=403)

    code = request.data.get('code')
    fingerprint = request.data.get('fingerprint')

    if not code:
        return Response({'error': 'Code requis'}, status=400)

    session = getattr(utilisateur, 'session_2fa', None)

    if not session or not session.cle_totp:
        return Response({'error': '2FA non activé'}, status=400)

    if session.est_code_valide(code):
        session.enregistrer_validation(fingerprint)
        utilisateur.generer_token()

        return Response({
            'message': 'Authentification 2FA validée',
            'token': utilisateur.token,
            'matricule': utilisateur.matricule,
            'email': utilisateur.email,
            'role': utilisateur.role,
            'nom': utilisateur.nom_complet,
            'slug_etablissement': utilisateur.etablissement.slug
        })
    else:
        return Response({'error': 'Code 2FA incorrect'}, status=404)



@api_view(['POST'])
@permission_classes([EstConnecteEtDansEtablissement])  # gère déjà la sécurité
def deconnexion_utilisateur(request, slug):
    utilisateur = getattr(request, 'utilisateur', None)

    if utilisateur and utilisateur.etablissement.slug == slug:
        utilisateur.token = None
        utilisateur.token_expires_at = None
        utilisateur.save()
        return Response({'message': "Déconnexion réussie"}, status=200)
    
    return Response({'error': "Accès refusé"}, status=403)


@api_view(['GET'])
@permission_classes([EstLegitimePourConnexion])
def qui_suis_je(request, slug):
    utilisateur = getattr(request, 'utilisateur', None)
    if not utilisateur:
        return Response({'error': 'Token invalide ou expiré'}, status=401)

    if utilisateur.etablissement.slug != slug:
        return Response({'error': "Tu n'appartiens pas à cet établissement."}, status=403)

    return Response({
        'matricule': utilisateur.matricule,
        'email': utilisateur.email,
        'role': utilisateur.role,
        'nom': utilisateur.nom_complet,
        'slug_etablissement': utilisateur.etablissement.slug
        
    })

def generer_code_temporaire():
    return random.randint(100000, 999999)

def generer_token_temporaire():
    return secrets.token_urlsafe(48)

def envoyer_code(email, code):
    sujet = "🔐 Code de récupération"
    message = f"""Bonjour,

Voici votre code temporaire : {code}
Ce code est valide pendant 10 minutes.

Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.

— Équipe Support
"""
    expediteur = "noreply@kharangni)fée.com"
    send_mail(sujet, message, expediteur, [email])

def envoyer_email_reinitialisation(email, lien):
    sujet = "🔒 Réinitialisation de votre mot de passe"
    message = f"""Bonjour 👋,

Vous avez demandé à réinitialiser votre mot de passe. 
Cliquez sur le lien ci-dessous pour le faire :

{lien}

⚠️ Ce lien est valide pendant 1 heure. Ne le partagez avec personne.

Si vous n'avez pas initié cette demande, ignorez ce message.

— Équipe Support
"""
    expediteur = "noreply@kharangni-fée.com"
    send_mail(sujet, message, expediteur, [email])

@api_view(['POST'])
def demande_reinitialisation_email(request, slug):
    email = request.data.get('email', '').strip()

    if not email:
        return Response({'error': "L'adresse email est requise."}, status=400)

    utilisateur = Utilisateur.objects.filter(
        email=email,
        etablissement__slug=slug
    ).first()

    if not utilisateur:
        return Response({'error': "Adresse introuvable."}, status=404)

    token = generer_token_temporaire()
    utilisateur.token_reset_password = token
    utilisateur.token_reset_expire = timezone.now() + timedelta(hours=1)
    utilisateur.save()

    lien = f"https://ton-frontend.com/{slug}/reset-password/{token}"

    envoyer_email_reinitialisation(email, lien)

    return Response({'message': "Un email de réinitialisation a été envoyé."}, status=200)

@api_view(['POST'])
def valider_reinitialisation(request, slug, token):
    nouveau = request.data.get('mot_de_passe')
    confirmation = request.data.get('mot_de_passe_confirm')

    if not nouveau or not confirmation:
        return Response({'error': "Tous les champs sont requis."}, status=400)
    if nouveau != confirmation:
        return Response({'error': "Les mots de passe ne correspondent pas."}, status=400)
    if len(nouveau) < 8 or not any(c.isdigit() for c in nouveau) or not any(c.isalpha() for c in nouveau):
        return Response({'error': "Mot de passe trop faible."}, status=400)

    utilisateur = Utilisateur.objects.filter(
        token_reset_password=token,
        token_reset_expire__gte=timezone.now(),
        etablissement__slug=slug
    ).first()

    if not utilisateur:
        return Response({'error': "Lien invalide ou expiré."}, status=403)

    utilisateur.set_mot_de_passe(nouveau)
    utilisateur.token_reset_password = None
    utilisateur.token_reset_expire = None
    utilisateur.save()

    # Optionnel : envoi de confirmation
    send_mail(
        "✅ Mot de passe réinitialisé",
        "Votre mot de passe a été modifié avec succès.",
        "noreply@kharangni_fée.com",
        [utilisateur.email]
    )

    return Response({'message': "Mot de passe mis à jour avec succès."}, status=200)


