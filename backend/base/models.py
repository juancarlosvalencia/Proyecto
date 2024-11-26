from django.db import models
from django.contrib.auth.models import User

class Genero(models.Model):
    nombre = models.CharField(max_length=10)

class UsuariosComplementario(models.Model):
    telefono = models.CharField(max_length=13)
    administrador = models.BooleanField(default=False)
    activo = models.BooleanField(default=False)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='usuarioscomplementarios')
    genero = models.ForeignKey(Genero, on_delete=models.CASCADE, related_name='generos')
    
class ListaDeseo(models.Model):
    titulo = models.CharField(max_length=300)
    imagen = models.CharField(max_length=1200)
    url = models.CharField(max_length=1200)
    precio = models.IntegerField(default=0)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listadeseo')