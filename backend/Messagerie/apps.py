from django.apps import AppConfig


class MessagerieConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Messagerie'

    def ready(self):
        import Messagerie.signals  
        
# la méthode ready() à l’intérieur de EtablissementConfig sert justement à charger des modules 
# comme les signaux au démarrage de l’app. Ton ligne :