from django.apps import AppConfig


class EtablissementConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'etablissement'

    def ready(self):
        import etablissement.signals  
        
# la méthode ready() à l’intérieur de EtablissementConfig sert justement à charger des modules 
# comme les signaux au démarrage de l’app. Ton ligne :