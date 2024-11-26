from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

from .models import UsuariosComplementario, Genero, ListaDeseo

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password']

    def create(self, validated_data):
        user = User(
            username=validated_data['email'],
            email=validated_data['email'],
            first_name=validated_data['first_name'], 
            last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    
class ListaDeseoRegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = ListaDeseo
        fields = ['titulo', 'imagen', 'url', 'precio', 'usuario']

    def create(self, validated_data):
        deseo = ListaDeseo (
            titulo=validated_data['titulo'],
            imagen=validated_data['imagen'],
            url=validated_data['url'], 
            precio=validated_data['precio'],
            usuario=validated_data['usuario']
        )

        deseo.save()
        return deseo
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name']


class UsuariosComplementarioRegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsuariosComplementario
        fields = ['telefono', 'genero', 'usuario']

    def create(self, validated_data):
        user = UsuariosComplementario(
            telefono=validated_data['telefono'],
            genero=validated_data['genero'],
            administrador=False, 
            activo=True,
            usuario=validated_data['usuario']
        )
        
        user.save()
        return user

class UsuariosComplementarioSerializer(serializers.ModelSerializer):
    usuario = UserSerializer()
    class Meta:
        model = UsuariosComplementario
        fields = ['id', 'telefono', 'administrador', 'activo', 'genero', 'usuario']

class GeneroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genero
        fields = ['nombre']

class ListaDeseoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListaDeseo
        fields = ['id', 'titulo', 'imagen', 'url', 'precio', 'usuario']