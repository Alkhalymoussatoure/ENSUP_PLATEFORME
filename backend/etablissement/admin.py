
from django.contrib import admin
from .models import (
    Etablissement, Etudiant, Enseignant,Utilisateur,
    Departement, Programme, Cours, Session, Section, Horaire,
    Inscription, Travail, Remise, Note, Presence, Message,
    Annonce, Forum, MessageForum, Local, Document, EvenementCalendrier,
    FraisScolarite, Paiement,MessageUtilisateur ,Notification
)

admin.site.register(Etablissement)
admin.site.register(Utilisateur)
admin.site.register(Etudiant)
admin.site.register(Enseignant)
admin.site.register(Departement)
admin.site.register(Programme)
admin.site.register(Cours)
admin.site.register(Session)
admin.site.register(Section)
admin.site.register(Horaire)
admin.site.register(Inscription)
admin.site.register(Travail)
admin.site.register(Remise)
admin.site.register(Note)
admin.site.register(Presence)
admin.site.register(Message)
admin.site.register(MessageUtilisateur)
admin.site.register(Annonce)
admin.site.register(Notification)
admin.site.register(Forum)
admin.site.register(MessageForum)
admin.site.register(Local)
admin.site.register(Document)
admin.site.register(EvenementCalendrier)
admin.site.register(FraisScolarite)
admin.site.register(Paiement)
