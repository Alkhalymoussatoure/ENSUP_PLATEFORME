from django.urls import path

from .views.views_etablissement import (
    # Établissement
    get_etablissementBySlug, get_all_etablissements, 
    create_etablissement, update_etablissementBySlug, delete_etablissementBySlug
)

from .views.views_etudiant import (
    # Étudiant
    get_All_etudiantsByEtablissementSlug, get_etudiant_by_matricule, add_etudiant_to_etablissement,
    update_etudiantByMatricule, delete_etudiantByMatricule
)

from .views.views_enseignant import (
   # Enseignant
    get_all_enseignants_by_etablissement, get_enseignant_by_matricule, add_enseignant_to_etablissement,
    update_enseignant_by_matricule, delete_enseignant_by_matricule,

)

from .views.views_departement import (
    # Département
    get_all_departements_by_etablissement, get_departement_by_code, create_departement,
    update_departement_by_code, delete_departement_by_code
)

from .views.views_programme import (
    # Programme
    get_all_programmes_by_etablissement, get_programme_by_code, create_programme,
    update_programme_by_code, delete_programme_by_code
)

from .views.views_cours import (
    # Cours
    get_all_cours_by_etablissement, get_cours_by_code, create_cours,
    update_cours_by_code, delete_cours_by_code
)

from .views.views_session import (
    # Session
    get_all_sessions_by_etablissement, get_session_by_id, create_session,
    update_session_by_id, delete_session_by_id
)

from .views.views_section import (
    # Section
    get_all_sections_by_etablissement, get_section_by_id, create_section,
    update_section_by_id, delete_section_by_id
)

from .views.views_horaire import (
    # Horaire
    get_all_horaires_by_etablissement, get_horaire_by_id, create_horaire,
    update_horaire_by_id, delete_horaire_by_id
)

from .views.views_inscription import (
    # Inscription
    get_all_inscriptions_by_etablissement, get_inscription_by_id, create_inscription,
    update_inscription_by_id, delete_inscription_by_id
)

from .views.views_facture import (
    # Facture
    get_all_factures_by_etablissement, get_facture_by_id, create_facture,
    update_facture_by_id, delete_facture_by_id
)

from .views.views_travail import (
    # Travail
    get_all_travaux_by_etablissement, create_travail, get_travail_by_id,
    update_travail_by_id, delete_travail_by_id
)

from .views.views_remise import (
    # Remise
    get_all_remises_by_etablissement, get_remise_by_id, create_remise,
    update_remise_by_id, delete_remise_by_id
)

from .views.views_note import (
    # Note
    get_all_notes_by_etablissement, get_note_by_id, create_note,
    update_note_by_id, delete_note_by_id
)

from .views.views_presence import (
    # Présence
    get_all_presences_by_etablissement, get_presence_by_id, create_presence,
    update_presence_by_id, delete_presence_by_id
)

from .views.views_message import (
    # Message
    get_all_messages_by_etablissement, get_message_by_id, create_message,
    update_message_by_id, delete_message_by_id
)

from .views.views_annonce import (
    # Annonce
    get_all_annonces_by_etablissement, get_annonce_by_id, create_annonce,
    update_annonce_by_id, delete_annonce_by_id
)

from .views.views_forum import (
    # Forum
    get_all_forums_by_etablissement, get_forum_by_id, create_forum,
    update_forum_by_id, delete_forum_by_id
)

from .views.views_messageForum import (
    # Message Forum
    get_all_messages_forum_by_etablissement, get_message_forum_by_id, create_message_forum,
    update_message_forum_by_id, delete_message_forum_by_id
)

from .views.views_local import (
    # Local
    get_all_locaux_by_etablissement, get_local_by_id, create_local,
    update_local_by_id, delete_local_by_id
)

from .views.views_document import (
    # Document
    get_all_documents_by_etablissement, get_document_by_id, create_document,
    update_document_by_id, delete_document_by_id
)

from .views.views_evenementCalendrier import (
    # EvenementCalendrier
    get_all_evenements_by_etablissement, create_evenement, get_evenement_by_id,
    update_evenement_by_id, delete_evenement_by_id,
)

from .views.views_fraisScolarite import (
    # Frais Scolarité
    get_all_frais_scolarite_by_etablissement, get_frais_scolarite_by_id, create_frais_scolarite,
    update_frais_scolarite_by_id, delete_frais_scolarite_by_id
)

from .views.views_paiement import (
    # Paiement
    get_all_paiements_by_etablissement, get_paiement_by_id, create_paiement,
    update_paiement_by_id, delete_paiement_by_id
)




urlpatterns = [
    # Établissements
    path('etablissements/all/', get_all_etablissements, name='liste-etablissements'),
    path('etablissements/create/', create_etablissement, name='create-etablissement'),
    path('etablissements/<slug:slug>/', get_etablissementBySlug, name='get-etablissement'),
    path('etablissements/<slug:slug>/update/', update_etablissementBySlug, name='update-etablissement'),
    path('etablissements/<slug:slug>/delete/', delete_etablissementBySlug, name='delete-etablissement'),

    # Étudiants
    path('<slug:slug>/etudiants/', get_All_etudiantsByEtablissementSlug, name='liste-etudiants'),
    path('<slug:slug>/etudiants/<str:matricule>/', get_etudiant_by_matricule, name='get-etudiant'),
    path('<slug:slug>/etudiants/<str:matricule>/update/', update_etudiantByMatricule, name='update-etudiant'),
    path('<slug:slug>/etudiants/<str:matricule>/delete/', delete_etudiantByMatricule, name='delete-etudiant'),
    path('<slug:slug>/etudiants/add/', add_etudiant_to_etablissement, name='add-etudiant'),

    # Enseignants
    path('<slug:slug>/enseignants/', get_all_enseignants_by_etablissement, name='liste-enseignants'),
    path('<slug:slug>/enseignants/add/', add_enseignant_to_etablissement, name='add-enseignant'),
    path('<slug:slug>/enseignants/<str:matricule>/', get_enseignant_by_matricule, name='get-enseignant'),
    path('<slug:slug>/enseignants/<str:matricule>/update/', update_enseignant_by_matricule, name='update-enseignant'),
    path('<slug:slug>/enseignants/<str:matricule>/delete/', delete_enseignant_by_matricule, name='delete-enseignant'),

    # Départements
    path('<slug:slug>/departements/', get_all_departements_by_etablissement, name='liste-departements'),
    path('<slug:slug>/departements/add/', create_departement, name='add-departement'),
    path('<slug:slug>/departements/<str:code>/', get_departement_by_code, name='get-departement'),
    path('<slug:slug>/departements/<str:code>/update/', update_departement_by_code, name='update-departement'),
    path('<slug:slug>/departements/<str:code>/delete/', delete_departement_by_code, name='delete-departement'),

    # Programmes
    path('<slug:slug>/programmes/', get_all_programmes_by_etablissement, name='liste-programmes'),
    path('<slug:slug>/programmes/add/', create_programme, name='add-programme'),
    path('<slug:slug>/programmes/<str:code>/', get_programme_by_code, name='get-programme'),
    path('<slug:slug>/programmes/<str:code>/update/', update_programme_by_code, name='update-programme'),
    path('<slug:slug>/programmes/<str:code>/delete/', delete_programme_by_code, name='delete-programme'),

    # Cours
    path('<slug:slug>/cours/', get_all_cours_by_etablissement, name='liste-cours'),
    path('<slug:slug>/cours/add/', create_cours, name='add-cours'),
    path('<slug:slug>/cours/<str:code>/', get_cours_by_code, name='get-cours'),
    path('<slug:slug>/cours/<str:code>/update/', update_cours_by_code, name='update-cours'),
    path('<slug:slug>/cours/<str:code>/delete/', delete_cours_by_code, name='delete-cours'),

    # Sessions
    path('<slug:slug>/sessions/', get_all_sessions_by_etablissement, name='liste-sessions'),
    path('<slug:slug>/sessions/add/', create_session, name='add-session'),
    path('<slug:slug>/sessions/<int:session_id>/', get_session_by_id, name='get-session'),
    path('<slug:slug>/sessions/<int:session_id>/update/', update_session_by_id, name='update-session'),
    path('<slug:slug>/sessions/<int:session_id>/delete/', delete_session_by_id, name='delete-session'),

    # Sections
    path('<slug:slug>/sections/', get_all_sections_by_etablissement, name='liste-sections'),
    path('<slug:slug>/sections/add/', create_section, name='add-section'),
    path('<slug:slug>/sections/<int:section_id>/', get_section_by_id, name='get-section'),
    path('<slug:slug>/sections/<int:section_id>/update/', update_section_by_id, name='update-section'),
    path('<slug:slug>/sections/<int:section_id>/delete/', delete_section_by_id, name='delete-section'),

    # Horaires
    path('<slug:slug>/horaires/', get_all_horaires_by_etablissement, name='liste-horaires'),
    path('<slug:slug>/horaires/add/', create_horaire, name='add-horaire'),
    path('<slug:slug>/horaires/<int:horaire_id>/', get_horaire_by_id, name='get-horaire'),
    path('<slug:slug>/horaires/<int:horaire_id>/update/', update_horaire_by_id, name='update-horaire'),
    path('<slug:slug>/horaires/<int:horaire_id>/delete/', delete_horaire_by_id, name='delete-horaire'),

    # Inscriptions
    path('<slug:slug>/inscriptions/', get_all_inscriptions_by_etablissement, name='liste-inscriptions'),
    path('<slug:slug>/inscriptions/add/', create_inscription, name='add-inscription'),
    path('<slug:slug>/inscriptions/<int:inscription_id>/', get_inscription_by_id, name='get-inscription'),
    path('<slug:slug>/inscriptions/<int:inscription_id>/update/', update_inscription_by_id, name='update-inscription'),
    path('<slug:slug>/inscriptions/<int:inscription_id>/delete/', delete_inscription_by_id, name='delete-inscription'),

    # Factures
    path('<slug:slug>/factures/', get_all_factures_by_etablissement, name='liste-factures'),
    path('<slug:slug>/factures/add/', create_facture, name='add-facture'),
    path('<slug:slug>/factures/<int:facture_id>/', get_facture_by_id, name='get-facture'),
    path('<slug:slug>/factures/<int:facture_id>/update/', update_facture_by_id, name='update-facture'),
    path('<slug:slug>/factures/<int:facture_id>/delete/', delete_facture_by_id, name='delete-facture'),

    # Travaux
    path('<slug:slug>/travaux/', get_all_travaux_by_etablissement, name='liste-travaux'),
    path('<slug:slug>/travaux/add/', create_travail, name='add-travail'),
    path('<slug:slug>/travaux/<int:travail_id>/', get_travail_by_id, name='get-travail'),
    path('<slug:slug>/travaux/<int:travail_id>/update/', update_travail_by_id, name='update-travail'),
    path('<slug:slug>/travaux/<int:travail_id>/delete/', delete_travail_by_id, name='delete-travail'),

    # Remises
    path('<slug:slug>/remises/', get_all_remises_by_etablissement, name='liste-remises'),
    path('<slug:slug>/remises/add/', create_remise, name='add-remise'),
    path('<slug:slug>/remises/<int:remise_id>/', get_remise_by_id, name='get-remise'),
    path('<slug:slug>/remises/<int:remise_id>/update/', update_remise_by_id, name='update-remise'),
    path('<slug:slug>/remises/<int:remise_id>/delete/', delete_remise_by_id, name='delete-remise'),

    # Notes
    path('<slug:slug>/notes/', get_all_notes_by_etablissement, name='liste-notes'),
    path('<slug:slug>/notes/add/', create_note, name='add-note'),
    path('<slug:slug>/notes/<int:note_id>/', get_note_by_id, name='get-note'),
    path('<slug:slug>/notes/<int:note_id>/update/', update_note_by_id, name='update-note'),
    path('<slug:slug>/notes/<int:note_id>/delete/', delete_note_by_id, name='delete-note'),

    # Présences
    path('<slug:slug>/presences/', get_all_presences_by_etablissement, name='liste-presences'),
    path('<slug:slug>/presences/add/', create_presence, name='add-presence'),
    path('<slug:slug>/presences/<int:presence_id>/', get_presence_by_id, name='get-presence'),
    path('<slug:slug>/presences/<int:presence_id>/update/', update_presence_by_id, name='update-presence'),
    path('<slug:slug>/presences/<int:presence_id>/delete/', delete_presence_by_id, name='delete-presence'),

    # Messages
    path('<slug:slug>/messages/', get_all_messages_by_etablissement, name='liste-messages'),
    path('<slug:slug>/messages/add/', create_message, name='add-message'),
    path('<slug:slug>/messages/<int:message_id>/', get_message_by_id, name='get-message'),
    path('<slug:slug>/messages/<int:message_id>/update/', update_message_by_id, name='update-message'),
    path('<slug:slug>/messages/<int:message_id>/delete/', delete_message_by_id, name='delete-message'),

    # Annonces
    path('<slug:slug>/annonces/', get_all_annonces_by_etablissement, name='liste-annonces'),
    path('<slug:slug>/annonces/add/', create_annonce, name='add-annonce'),
    path('<slug:slug>/annonces/<int:annonce_id>/', get_annonce_by_id, name='get-annonce'),
    path('<slug:slug>/annonces/<int:annonce_id>/update/', update_annonce_by_id, name='update-annonce'),
    path('<slug:slug>/annonces/<int:annonce_id>/delete/', delete_annonce_by_id, name='delete-annonce'),

    # Forums
    path('<slug:slug>/forums/', get_all_forums_by_etablissement, name='liste-forums'),
    path('<slug:slug>/forums/add/', create_forum, name='add-forum'),
    path('<slug:slug>/forums/<int:forum_id>/', get_forum_by_id, name='get-forum'),
    path('<slug:slug>/forums/<int:forum_id>/update/', update_forum_by_id, name='update-forum'),
    path('<slug:slug>/forums/<int:forum_id>/delete/', delete_forum_by_id, name='delete-forum'),

    # Messages de forum
    path('<slug:slug>/messages-forum/', get_all_messages_forum_by_etablissement, name='liste-messages-forum'),
    path('<slug:slug>/messages-forum/add/', create_message_forum, name='add-message-forum'),
    path('<slug:slug>/messages-forum/<int:message_id>/', get_message_forum_by_id, name='get-message-forum'),
    path('<slug:slug>/messages-forum/<int:message_id>/update/', update_message_forum_by_id, name='update-message-forum'),
    path('<slug:slug>/messages-forum/<int:message_id>/delete/', delete_message_forum_by_id, name='delete-message-forum'),

    # Locaux
    path('<slug:slug>/locaux/', get_all_locaux_by_etablissement, name='liste-locaux'),
    path('<slug:slug>/locaux/add/', create_local, name='add-local'),
    path('<slug:slug>/locaux/<int:local_id>/', get_local_by_id, name='get-local'),
    path('<slug:slug>/locaux/<int:local_id>/update/', update_local_by_id, name='update-local'),
    path('<slug:slug>/locaux/<int:local_id>/delete/', delete_local_by_id, name='delete-local'),

    # Documents
    path('<slug:slug>/documents/', get_all_documents_by_etablissement, name='liste-documents'),
    path('<slug:slug>/documents/add/', create_document, name='add-document'),
    path('<slug:slug>/documents/<int:document_id>/', get_document_by_id, name='get-document'),
    path('<slug:slug>/documents/<int:document_id>/update/', update_document_by_id, name='update-document'),
    path('<slug:slug>/documents/<int:document_id>/delete/', delete_document_by_id, name='delete-document'),

    # Événements calendrier
    path('<slug:slug>/evenements/', get_all_evenements_by_etablissement, name='liste-evenements'),
    path('<slug:slug>/evenements/add/', create_evenement, name='add-evenement'),
    path('<slug:slug>/evenements/<int:evenement_id>/', get_evenement_by_id, name='get-evenement'),
    path('<slug:slug>/evenements/<int:evenement_id>/update/', update_evenement_by_id, name='update-evenement'),
    path('<slug:slug>/evenements/<int:evenement_id>/delete/', delete_evenement_by_id, name='delete-evenement'),

    # Frais de scolarité
    path('<slug:slug>/frais-scolarite/', get_all_frais_scolarite_by_etablissement, name='liste-frais-scolarite'),
    path('<slug:slug>/frais-scolarite/add/', create_frais_scolarite, name='add-frais-scolarite'),
    path('<slug:slug>/frais-scolarite/<int:frais_id>/', get_frais_scolarite_by_id, name='get-frais-scolarite'),
    path('<slug:slug>/frais-scolarite/<int:frais_id>/update/', update_frais_scolarite_by_id, name='update-frais-scolarite'),
    path('<slug:slug>/frais-scolarite/<int:frais_id>/delete/', delete_frais_scolarite_by_id, name='delete-frais-scolarite'),

    # Paiements
    path('<slug:slug>/paiements/', get_all_paiements_by_etablissement, name='liste-paiements'),
    path('<slug:slug>/paiements/add/', create_paiement, name='add-paiement'),
    path('<slug:slug>/paiements/<int:paiement_id>/', get_paiement_by_id, name='get-paiement'),
    path('<slug:slug>/paiements/<int:paiement_id>/update/', update_paiement_by_id, name='update-paiement'),
    path('<slug:slug>/paiements/<int:paiement_id>/delete/', delete_paiement_by_id, name='delete-paiement'),
]
