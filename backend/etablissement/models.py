from django.db import models
from django.core.validators import RegexValidator    # pour le tel
from django.utils import timezone          # pour les dépots de fichiers (en retard)
from django.utils.timezone import now
from django.core.exceptions import ValidationError
from django.utils.text import slugify      # slug remplace le id pour une belle lisibilité des liens (urls)
from passlib.hash import pbkdf2_sha256
import os , secrets                       # utils pour deviner le type du fichier 
from django.utils import timezone
from datetime import timedelta # pour les token expiration

# related_name='nom_relier' nom personnalisé que Django utilisera pour accéder
# à l’objet parent depuis l’objet lié.dasn foreignkey
    
class Etablissement(models.Model):
    STATUT_CHOICES = [
        ('actif', 'Actif'),
        ('inactif', 'Inactif'),
        ('en_maintenance', 'En maintenance'),
    ]
    
    TYPE_CHOICES = [ 
        ('universite', 'Université'),
        ('professionnel', 'Professionnel'),
        ('lycee', 'Lycée'),
        ('college', 'collège'), 
    ]

    nom_etablissement = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(unique=True)
    domaine = models.CharField(max_length=255, blank=True)
    logo = models.ImageField(upload_to='logos/', blank=True, default='logos/default.png')
    description = models.TextField()
    adresse = models.CharField(max_length=255)
    tel_etablissement = models.CharField(
        max_length=20,
        validators=[RegexValidator(regex=r'^\+?\d{9,15}$', message="Numéro invalide.")],
    )
    courriel_contact = models.EmailField()
    type_etablissement = models.CharField(max_length=50, choices=TYPE_CHOICES, default='universite')
    site_web = models.URLField(blank=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='actif')
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nom_etablissement
    def save(self, *args, **kwargs): # netoyage du nom de domaine de l'établissement
        if self.domaine:
            self.domaine = self.domaine.lower().strip().replace('www.', '')
        super().save(*args, **kwargs)


class Utilisateur(models.Model):
    ROLE_CHOICES = [
        ('etudiant', 'Étudiant'),
        ('enseignant', 'Enseignant'),
        ('administrateur', 'Administrateur'),
        ('directeur', 'Directeur'),
    ]

    matricule = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    mot_de_passe = models.CharField(max_length=255)
    nom_complet = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    est_actif = models.BooleanField(default=True)
    # IMPORTANT: établissement optionnel pour les superusers
    etablissement = models.ForeignKey(
        Etablissement, 
        on_delete=models.CASCADE, 
        related_name='utilisateurs',
    )
    token = models.CharField(max_length=100, unique=True, blank=True, null=True)
    token_expires_at = models.DateTimeField(blank=True, null=True)
    
    def generer_token(self):
        self.token = secrets.token_hex(32)  # 64 caractères
        self.token_expires_at = timezone.now() + timedelta(days=30) #valid pour 30 jours
        self.save()
        
    def __str__(self):
        return self.nom_complet
    
    def set_mot_de_passe(self, mot_de_passe_clair):
        self.mot_de_passe = pbkdf2_sha256.hash(mot_de_passe_clair)

    def verifier_mot_de_passe(self, mot_de_passe_clair):
        if not self.mot_de_passe:
            return False
        return pbkdf2_sha256.verify(mot_de_passe_clair, self.mot_de_passe)
    
    def __init__(self, *args, **kwargs):
        self._mot_de_passe_deja_hache = False
        super().__init__(*args, **kwargs)
        
    def save(self, *args, **kwargs):
        if self.mot_de_passe and not self._mot_de_passe_deja_hache:
            if not pbkdf2_sha256.identify(self.mot_de_passe):
                self.set_mot_de_passe(self.mot_de_passe)
        super().save(*args, **kwargs)


        
 

        

class Etudiant(models.Model):
    STATUT_CHOICES = [
        ('actif', 'Actif'),
        ('diplome', 'Diplômé'),
        ('abandonne', 'Abandonné'),
        ('suspendu', 'Suspendu'),
    ]

    utilisateur = models.ForeignKey(
        Utilisateur,
        on_delete=models.CASCADE,
        limit_choices_to={'role__in': ['etudiant']}
    )
    etablissement = models.ForeignKey('Etablissement', on_delete=models.CASCADE)
    programme = models.ForeignKey('Programme', on_delete=models.SET_NULL, null=True)
    # numero_etudiant = models.CharField(max_length=50, unique=True)
    date_admission = models.DateField()
    courriel_etudiant = models.EmailField(blank=True, unique=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES)
    etudiant_telephone = models.CharField(
        max_length=20,
        validators=[RegexValidator(regex=r'^\+?\d{9,15}$', message="Numéro invalide.")],
    )
    adresse = models.TextField()
    tuteur_nom = models.CharField(max_length=255)
    tuteur_telephone = models.CharField(
        max_length=20,
        validators=[RegexValidator(regex=r'^\+?\d{9,15}$', message="Numéro invalide.")],
    )
    

  
    def __str__(self):
        return f"Etudiant: {self.utilisateur}"


class Enseignant(models.Model):
    
    utilisateur = models.ForeignKey(
        Utilisateur,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'enseignant'}
    )
    etablissement = models.ForeignKey('Etablissement', on_delete=models.CASCADE)
    courriel_employe = models.EmailField(blank=True, unique=True)
    departement = models.ForeignKey('Departement', on_delete=models.SET_NULL, null=True, related_name='enseignants')
    specialite = models.CharField(max_length=255)
    date_embauche = models.DateField()
    qualifications = models.TextField()
    bureau = models.CharField(max_length=100)

    def __str__(self):
        return self.utilisateur


class Departement(models.Model):
    etablissement = models.ForeignKey('Etablissement', on_delete=models.CASCADE)
    nom = models.CharField(max_length=255)
    code = models.CharField(max_length=20)
    description = models.TextField(blank=True)
    chef_departement = models.ForeignKey(
        'Utilisateur', on_delete=models.SET_NULL, 
        null=True, blank=True,  
        related_name='departement_dirige',
        limit_choices_to={'role__in': ['administrateur','directeur']}
    )
    # related_name='departement_dirige' nom personnalisé que Django utilisera pour accéder à l’objet parent depuis l’objet lié.
    bureau = models.CharField(max_length=100)
    telephone = models.CharField(max_length=20)

    def __str__(self):
        return self.nom


class Programme(models.Model):
    TYPE_CHOICES = [
        ('technique', 'Technique'),
        ('universitaire', 'Universitaire'),
        ('formation_continue', 'Formation Continue'),
    ]
    
    NIVEAU_CHOICES = [
        ('licence', 'Licence'),
        ('master', 'Master'),
        ('doctorat', 'Doctorat'),
    ]
    

    etablissement = models.ForeignKey('Etablissement', on_delete=models.CASCADE)
    departement = models.ForeignKey('Departement', on_delete=models.SET_NULL, null=True)
    code = models.CharField(max_length=20)
    nom = models.CharField(max_length=255)
    niveau = models.CharField(max_length=20, choices=NIVEAU_CHOICES, blank=True)
    description = models.TextField()
    duree_semestres = models.IntegerField()
    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    frais_scolarite = models.DecimalField(max_digits=10, decimal_places=2)
    conditions_admission = models.TextField()
    est_actif = models.BooleanField(default=True)

    def __str__(self):
        return self.nom


class Cours(models.Model):
    etablissement = models.ForeignKey('Etablissement', on_delete=models.CASCADE)
    programme = models.ForeignKey('Programme', on_delete=models.SET_NULL, null=True)
    code = models.CharField(max_length=20)
    nom = models.CharField(max_length=255)
    description = models.TextField()
    credits = models.IntegerField(null=True, blank=True)
    prerequis = models.TextField(blank=True)
    objectifs = models.TextField()
    est_actif = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['code']
        verbose_name = 'Cours'
        verbose_name_plural = 'Cours'

    

    def __str__(self):
        return f"{self.code} - {self.nom}"


class Session(models.Model):
    SAISON_CHOICES = [
        ('automne', 'Automne'),
        ('hiver', 'Hiver'),
        ('ete', 'Été'),
    ]

    etablissement = models.ForeignKey('Etablissement', on_delete=models.CASCADE)
    nom = models.CharField(max_length=100)
    saison = models.CharField(max_length=20, choices=SAISON_CHOICES)
    annee = models.IntegerField()
    date_debut = models.DateField()
    date_fin = models.DateField()
    date_limite_inscription = models.DateField()
    date_limite_abandon = models.DateField()
    est_courante = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.nom} {self.annee}"


class Section(models.Model):
    MODE_CHOICES = [
        ('presentiel', 'Présentiel'),
        ('en_ligne', 'En ligne'),
        ('hybride', 'Hybride'),
    ]

    etablissement = models.ForeignKey('Etablissement', on_delete=models.CASCADE)
    cours = models.ForeignKey('Cours', on_delete=models.CASCADE)
    enseignant = models.ForeignKey('Enseignant', on_delete=models.CASCADE)
    session = models.ForeignKey('Session', on_delete=models.CASCADE)
    numero_section = models.CharField(max_length=50)
    max_etudiants = models.IntegerField()
    nombre_inscrits = models.IntegerField(default=0)
    local = models.CharField(max_length=50)
    mode_livraison = models.CharField(max_length=20, choices=MODE_CHOICES)
    notes_section = models.TextField(blank=True)
    
    class Meta:
        ordering = ['numero_section']
        verbose_name = 'Section'
        verbose_name_plural = 'Sections'
    
    def save(self, *args, **kwargs):
        if self.nombre_inscrits > self.max_etudiants:
            self.nombre_inscrits = self.max_etudiants  # ou lève une exception si tu préfères
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"Section {self.numero_section} - {self.cours.nom} ({self.mode_livraison})"

    
    @property
    def taux_remplissage(self):
        if self.max_etudiants == 0:
            return 0
        return round((self.nombre_inscrits / self.max_etudiants) * 100, 1)
    @property
    def est_complete(self):
        return self.nombre_inscrits >= self.max_etudiants


class Horaire(models.Model):
    JOUR_CHOICES = [
        ('lundi', 'Lundi'),
        ('mardi', 'Mardi'),
        ('mercredi', 'Mercredi'),
        ('jeudi', 'Jeudi'),
        ('vendredi', 'Vendredi'),
        ('samedi', 'Samedi'),
        ('dimanche', 'Dimanche'),
    ]

    TYPE_CHOICES = [
        ('cours', 'Cours'),
        ('laboratoire', 'Laboratoire'),
        ('seminaire', 'Séminaire'),
        ('examen', 'Examen'),
    ]

    etablissement = models.ForeignKey('Etablissement', on_delete=models.CASCADE)
    section = models.ForeignKey('Section', on_delete=models.CASCADE)
    cours = models.ForeignKey('Cours', on_delete=models.CASCADE)
    enseignant = models.ForeignKey('Utilisateur', on_delete=models.SET_NULL, null=True, blank=True, limit_choices_to={'role': 'enseignant'})
    jour_semaine = models.CharField(max_length=20, choices=JOUR_CHOICES)
    heure_debut = models.TimeField()
    heure_fin = models.TimeField()
    local = models.CharField(max_length=50)
    type_horaire = models.CharField(max_length=20, choices=TYPE_CHOICES)
    recurrence_semaines = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.section} - {self.cours.nom} ({self.jour_semaine} {self.heure_debut})"


class Inscription(models.Model):
    STATUT_CHOICES = [
        ('inscrit', 'Inscrit'),
        ('abandonne', 'Abandonné'),
        ('complete', 'Complété'),
        ('echec', 'Échec'),
    ]

    etablissement = models.ForeignKey('Etablissement', on_delete=models.CASCADE)
    etudiant = models.ForeignKey('Etudiant', on_delete=models.CASCADE)
    section = models.ForeignKey('Section', on_delete=models.CASCADE)
    date_inscription = models.DateField()
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES)
    note_finale = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    note_lettre = models.CharField(max_length=5, blank=True)
    frais_section = models.DecimalField(max_digits=8, decimal_places=2)
    frais_payes = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.etudiant} - {self.section}"
    
    def clean(self):
        # Vérification des notes
        if self.statut in ['complete', 'echec'] and self.note_finale is None:
            raise ValidationError("Une note finale doit être fournie pour un statut 'completé' ou 'échec'.")
        if self.note_finale is not None and self.statut not in ['complete', 'echec']:
            raise ValidationError("La note finale ne peut être fournie que pour un cours terminé.")
        
        # Vérification de la capacité de la section
        if self.section.est_complete:
            raise ValidationError("Cette section est déjà complète.")

    def save(self, *args, **kwargs):
        # Vérification de la capacité avant création
        if self.pk is None and self.section.est_complete:
            raise ValidationError("Impossible d'inscrire : cette section est déjà complète.")

        # Attribution automatique de la note lettre
        if self.note_finale is not None:
            if self.note_finale >= 90:
                self.note_lettre = 'A+'
            elif self.note_finale >= 80:
                self.note_lettre = 'A'
            elif self.note_finale >= 70:
                self.note_lettre = 'B'
            elif self.note_finale >= 60:
                self.note_lettre = 'C'
            else:
                self.note_lettre = 'F'

        # Enregistrer
        super().save(*args, **kwargs)

        # Créer une facture automatiquement pour les nouvelles inscriptions
        if not hasattr(self, '_facture_created'):
            self._creer_facture()
            self._facture_created = True

    def _creer_facture(self):
        """Créer une facture pour cette inscription"""
        try:
            # Vérifier si une facture existe déjà
            if not hasattr(self, 'facture'):
                Facture.objects.create(
                    inscription=self,
                    montant=self.frais_section,
                    payee=self.frais_payes
                )
        except Exception as e:
            print(f"Erreur lors de la création de la facture : {e}")


class Facture(models.Model):
    inscription = models.OneToOneField('Inscription', on_delete=models.CASCADE, related_name='facture')
    montant = models.DecimalField(max_digits=8, decimal_places=2)
    date_emission = models.DateTimeField(auto_now_add=True)
    payee = models.BooleanField(default=False)
    
    # Champs optionnels pour les informations de facturation
    numero_facture = models.CharField(max_length=50, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-date_emission']

    def __str__(self):
        return f"Facture #{self.pk} - {self.inscription.etudiant}"
    
    def save(self, *args, **kwargs):
        # Générer automatiquement un numéro de facture si pas fourni
        if not self.numero_facture:
            self.numero_facture = f"FAC-{self.inscription.id}-{self.date_emission.strftime('%Y%m%d') if self.date_emission else ''}"
        super().save(*args, **kwargs)


class Travail(models.Model):
    TYPE_CHOICES = [
        ('devoir', 'Devoir'),
        ('examen', 'Examen'),
        ('projet', 'Projet'),
        ('presentation', 'Présentation'),
        ('laboratoire', 'Laboratoire'),
    ]

    etablissement = models.ForeignKey('Etablissement', on_delete=models.CASCADE)
    section = models.ForeignKey('Section', on_delete=models.CASCADE)
    titre = models.CharField(max_length=255)
    description = models.TextField()
    instructions = models.TextField()
    date_echeance = models.DateField()
    heure_echeance = models.TimeField()
    points_max = models.DecimalField(max_digits=6, decimal_places=2)
    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    est_publie = models.BooleanField(default=False)
    remise_en_ligne = models.BooleanField(default=True)
    fichier_joint = models.FileField(upload_to='travaux/', blank=True, null=True)


    def __str__(self):
        return self.titre
    
    @property
    def est_en_retard(self):
        import datetime
        date_heure_limite = datetime.datetime.combine(self.date_echeance, self.heure_echeance)
        return timezone.now() > timezone.make_aware(date_heure_limite)
        
    class Meta:
        ordering = ['date_echeance', 'heure_echeance']
        verbose_name = 'Travail'
        verbose_name_plural = 'Travaux'


class Remise(models.Model):
    etablissement = models.ForeignKey('Etablissement', on_delete=models.CASCADE)
    travail = models.ForeignKey('Travail', on_delete=models.CASCADE)
    etudiant = models.ForeignKey('Etudiant', on_delete=models.CASCADE)
    contenu = models.FileField(upload_to="remise/", blank=True)
    date_remise = models.DateTimeField()
    note = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    commentaires_enseignant = models.TextField(blank=True)
    commentaires_etudiant = models.TextField(blank=True)
    est_en_retard = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.etudiant} - {self.travail}"


class Note(models.Model):
    etablissement = models.ForeignKey('Etablissement', on_delete=models.CASCADE)
    inscription = models.ForeignKey('Inscription', on_delete=models.CASCADE)
    travail = models.ForeignKey('Travail', on_delete=models.CASCADE)
    points_obtenus = models.DecimalField(max_digits=6, decimal_places=2)
    points_possibles = models.DecimalField(max_digits=6, decimal_places=2)
    coefficient = models.DecimalField(max_digits=4, decimal_places=2, default=1.00)
    date_notation = models.DateField()
    commentaires = models.TextField(blank=True)
    est_finale = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.inscription} - {self.travail}"
    @property      #pour retourner le resulta de calcul comme un champ 
    def note_ponderee(self):
        if self.points_possibles == 0:
            return 0
        return (self.points_obtenus / self.points_possibles) * self.coefficient


class Presence(models.Model):
    STATUT_CHOICES = [
        ('present', 'Présent'),
        ('absent', 'Absent'),
        ('retard', 'Retard'),
        ('excuse', 'Excusé'),
    ]

    etablissement = models.ForeignKey('Etablissement', on_delete=models.CASCADE)
    inscription = models.ForeignKey('Inscription', on_delete=models.CASCADE)
    date_cours = models.DateField()
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES)
    notes = models.TextField(blank=True)
    heure_arrivee = models.TimeField(null=True, blank=True)
    heure_depart = models.TimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.inscription} - {self.date_cours}"


class Message(models.Model):
    TYPE_CHOICES = [
        ('prive', 'Privé'),
        ('groupe', 'Groupe'),
        ('annonce', 'Annonce'),
    ]

    etablissement = models.ForeignKey('Etablissement', on_delete=models.CASCADE)
    expediteur = models.ForeignKey('Utilisateur', on_delete=models.CASCADE, related_name='messages_envoyes')
    destinataires = models.ManyToManyField('Utilisateur', related_name='messages_recus')
    # groupe = models.ForeignKey('Groupe', on_delete=models.CASCADE, null=True, blank=True)
    sujet = models.CharField(max_length=255, blank=False)
    contenu = models.TextField(blank=True)
    fichier_joint = models.FileField(upload_to='messages/', blank=True)  # Corrigé le chemin
    date_envoi = models.DateTimeField(auto_now_add=True)
    est_lu = models.BooleanField(default=False)
    date_lecture = models.DateTimeField(null=True, blank=True)
    message_parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    type_message = models.CharField(max_length=20, choices=TYPE_CHOICES)

    def __str__(self):
        return self.sujet

    def clean(self):
        
        # Note : La validation des destinataires doit être faite après la sauvegarde
        # car c'est une relation ManyToMany

        if self.date_lecture and not self.est_lu:
            raise ValidationError("Impossible de définir une date de lecture pour un message non lu.")

    def save(self, *args, **kwargs):
        # Gérer la date de lecture
        if self.est_lu and not self.date_lecture:
            self.date_lecture = now()
        
        super().save(*args, **kwargs)
        
        # Validation des destinataires après sauvegarde (pour les relations ManyToMany)
        if self.type_message in ['prive', 'annonce'] and self.destinataires.count() == 0:
            # Vous pouvez soit lever une exception, soit logger un avertissement
            pass  # ou print(f"Attention: Le message {self.sujet} n'a pas de destinataires")

    class Meta:
        ordering = ['-date_envoi']
        verbose_name = 'Message'
        verbose_name_plural = 'Messages'


class Annonce(models.Model):
    etablissement = models.ForeignKey('Etablissement', on_delete=models.CASCADE)
    auteur = models.ForeignKey('Utilisateur', on_delete=models.CASCADE)
    section = models.ForeignKey('Section', on_delete=models.SET_NULL, null=True, blank=True)
    titre = models.CharField(max_length=255)
    contenu = models.TextField()
    date_publication = models.DateTimeField(auto_now_add=True)
    date_expiration = models.DateField(null=True, blank=True)
    est_urgent = models.BooleanField(default=False)
    est_generale = models.BooleanField(default=False)
    destinataires = models.CharField(max_length=40, blank=True)
   
    def __str__(self):
        return f"[{self.date_publication.strftime('%Y-%m-%d')}] {self.titre}   {self.auteur.nom_complet}"

    @property
    def est_expiree(self):
        return self.date_expiration and self.date_expiration < timezone.now().date()
    #signale automatique declancher 


class Forum(models.Model):
    TYPE_CHOICES = [
        ('cours', 'Cours'),
        ('general', 'Général'),
        ('aide', 'Aide'),
        ('annonces', 'Annonces'),
    ]

    etablissement = models.ForeignKey('Etablissement', on_delete=models.CASCADE)
    section = models.ForeignKey('Section', on_delete=models.SET_NULL, null=True, blank=True)
    titre = models.CharField(max_length=255)
    description = models.TextField()
    date_creation = models.DateTimeField(auto_now_add=True)
    est_actif = models.BooleanField(default=True)
    est_prive = models.BooleanField(default=False)
    type_forum = models.CharField(max_length=30, choices=TYPE_CHOICES)
    slug = models.SlugField(unique=True, blank=True)


    def __str__(self):
        return self.titre

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.type_forum}-{self.titre}")
        super().save(*args, **kwargs)


class MessageForum(models.Model):
    forum = models.ForeignKey('Forum', on_delete=models.CASCADE)
    etablissement = models.ForeignKey('Etablissement', on_delete=models.CASCADE)
    auteur = models.ForeignKey('Utilisateur', on_delete=models.CASCADE)
    titre = models.CharField(max_length=255)
    contenu = models.TextField()
    date_publication = models.DateTimeField(auto_now_add=True)
    message_parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    est_epingle = models.BooleanField(default=False)
    nombre_vues = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.titre

    @property
    def est_lie_a_une_section(self):
        # Vérifiez si le champ 'section' existe, sinon remplacez par la logique appropriée
        return hasattr(self, 'section') and self.section is not None

    class Meta:
        # Corrigé : utilise 'date_publication' au lieu de 'date_creation'
        ordering = ['-date_publication']
        verbose_name = 'Message de Forum'
        verbose_name_plural = 'Messages de Forum'

      
class Local(models.Model):
    
    TYPE_CHOICES = [
        ('classe', 'Classe'),
        ('laboratoire', 'Laboratoire'),
        ('amphitheatre', 'Amphithéâtre'),
        ('bureau', 'Bureau'),
    ]

    etablissement = models.ForeignKey('Etablissement', on_delete=models.CASCADE)
    numero_local = models.CharField(max_length=50)
    batiment = models.CharField(max_length=100)
    capacite = models.PositiveIntegerField()
    equipement = models.TextField(blank=True)
    responsables = models.ManyToManyField('Utilisateur', related_name='locaux_responsables', blank=True)
    est_disponible = models.BooleanField(default=True)
    type_local = models.CharField(max_length=30, choices=TYPE_CHOICES)
    
    

    def __str__(self):
        return f"{self.numero_local} ({self.batiment})"
    @property
    def est_laboratoire(self):
        return self.type_local == 'laboratoire'
    
    @property
    def noms_responsables(self):
        return ", ".join(resp.nom_complet for resp in self.responsables.all())


    
    class Meta:
        ordering = ['batiment', 'numero_local']
        verbose_name = 'Local'
        verbose_name_plural = 'Locaux'


class Document(models.Model):
    etablissement = models.ForeignKey('Etablissement', on_delete=models.CASCADE)
    section = models.ForeignKey('Section', on_delete=models.SET_NULL, null=True, blank=True)
    telecharge_par = models.ForeignKey('Utilisateur', on_delete=models.SET_NULL, null=True)
    titre = models.CharField(max_length=255)
    fichier = models.FileField(upload_to='documents/',null=True)
    tags = models.CharField(max_length=100, blank=True, help_text="Mots-clés séparés par des virgules")
    type_fichier = models.CharField(max_length=50)
    date_telechargement = models.DateTimeField(auto_now_add=True)
    est_public = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    

    def __str__(self):
        return self.titre

    def save(self, *args, **kwargs):
        if self.fichier and self.etablissement:
            self.fichier.name = f"{self.etablissement.nom}_{self.fichier.name}"

            if not self.type_fichier:
                extension = os.path.splitext(self.fichier.name)[1].lower()
                self.type_fichier = extension.strip('.')

        super().save(*args, **kwargs)


class EvenementCalendrier(models.Model):
    TYPE_CHOICES = [
        ('cours', 'Cours'),
        ('examen', 'Examen'),
        ('reunion', 'Réunion'),
        ('conference', 'Conférence'),
        ('vacances', 'Vacances'),
    ]

    etablissement = models.ForeignKey('Etablissement', on_delete=models.CASCADE)
    titre = models.CharField(max_length=255)
    description = models.TextField()
    heure_debut = models.DateTimeField()
    heure_fin = models.DateTimeField()
    type_evenement = models.CharField(max_length=30, choices=TYPE_CHOICES)
    est_public = models.BooleanField(default=True)
    cree_par = models.ForeignKey('Utilisateur', on_delete=models.SET_NULL, null=True)
    lieu = models.CharField(max_length=255)
    participants = models.ManyToManyField('Utilisateur', related_name='evenements_participes', blank=True)

    
    def clean(self):
        if self.heure_fin <= self.heure_debut:
            raise ValidationError("L'heure de fin doit être postérieure à l'heure de début.")
    @property
    def est_en_cours(self):
        now = timezone.now()
        return self.heure_debut <= now <= self.heure_fin

    def __str__(self):
        return self.titre
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    
    class Meta:
        ordering = ['heure_debut']
        verbose_name = 'Événement'
        verbose_name_plural = 'Événements'

    
class FraisScolarite(models.Model):
    STATUT_CHOICES = [
        ('non_paye', 'Non payé'),
        ('partiel', 'Partiellement payé'),
        ('complet', 'Payé complètement'),
        ('en_retard', 'En retard'),
    ]

    etablissement = models.ForeignKey('Etablissement', on_delete=models.CASCADE)
    etudiant = models.ForeignKey('Etudiant', on_delete=models.CASCADE)
    session = models.ForeignKey('Session', on_delete=models.CASCADE)
    montant_total = models.DecimalField(max_digits=10, decimal_places=2)
    montant_paye = models.DecimalField(max_digits=10, decimal_places=2)
    date_echeance = models.DateField()
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.etudiant} - {self.session}"
    
    @property
    def statut_auto(self):
        if self.montant_paye >= self.montant_total:
            return 'complet'
        elif self.montant_paye > 0:
            return 'partiel'
        elif self.date_echeance < timezone.now().date():
            return 'en_retard'
        else:
            return 'non_paye'
        
    @property     #solde restant (à payer)
    def solde(self):
        return self.montant_total - self.montant_paye
    
    def save(self, *args, **kwargs): # protection pour montant à  payer face au total
        if self.montant_paye > self.montant_total:
            raise ValidationError("Le montant payé ne peut pas excéder le total.")
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-date_echeance']
        verbose_name = "Frais de scolarité"
        verbose_name_plural = "Frais de scolarité"


class Paiement(models.Model):
    etablissement = models.ForeignKey('Etablissement', on_delete=models.CASCADE)
    frais = models.ForeignKey('FraisScolarite', on_delete=models.CASCADE)
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    date_paiement = models.DateField()
    methode_paiement = models.CharField(max_length=50)
    numero_transaction = models.CharField(max_length=100)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Paiement de {self.montant} ({self.date_paiement})"
    
    def clean(self):
        if self.montant > (self.frais.montant_total - self.frais.montant_paye):
            raise ValidationError("Le montant dépasse le solde restant à payer.")
        
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.frais.montant_paye += self.montant
        self.frais.save()


