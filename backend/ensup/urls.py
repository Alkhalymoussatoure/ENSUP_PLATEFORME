
from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('kharangnifee.gn/', include('authentification.urls')),
    path('kharangnifee.gn/', include('etablissement.urls')),
    

]
