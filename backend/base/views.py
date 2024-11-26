from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

from .scraping import scraping
from .models import UsuariosComplementario, Genero, ListaDeseo
from .serializers import ListaDeseoSerializer, UsuariosComplementarioSerializer, UserRegisterSerializer, UserSerializer, ListaDeseoRegisterSerializer, UsuariosComplementarioRegistroSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        usuario = serializer.save()
        request.data.update({'usuario': usuario.id})
        serializerAux = UsuariosComplementarioRegistroSerializer(data=request.data)
        if serializerAux.is_valid():
            serializerAux.save()
            return Response(serializer.data)
        else:
            usuario.delete()
        
    return Response(serializer.error)

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)

            user = request.data['username']
            if user:
                usr = User.objects.get(username=user)
                validacion = UsuariosComplementario.objects.get(usuario=usr)
                if validacion and validacion.activo == False:
                    return Response({'textResponse':'Usario inactivo, comuniquese con un administrador'})
                
            tokens = response.data

            access_token = tokens['access']
            refresh_token = tokens['refresh']

            seriliazer = UserSerializer(request.user, many=False)

            res = Response()

            res.data = {'success':True}

            res.set_cookie(
                key='access_token',
                value=str(access_token),
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )

            res.set_cookie(
                key='refresh_token',
                value=str(refresh_token),
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )
            res.data.update(tokens)
            return res
        
        except Exception as e:
            user = request.data['username']
            if user:
                try:
                    usr = User.objects.get(username=user)
                except Exception as e:
                    return Response({'textResponse':'Usuario no registrado, registrese para iniciar sesión'})
                
                if usr.first_name:
                    return Response({'textResponse':'Password incorrecto'})
                
            print(e)
            return Response({'textResponse':'Usuario no registrado, registrese para iniciar sesión'})
        
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')

            request.data['refresh'] = refresh_token

            response = super().post(request, *args, **kwargs)
            
            tokens = response.data
            access_token = tokens['access']

            res = Response()

            res.data = {'refreshed': True}

            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=False,
                samesite='None',
                path='/'
            )
            return res

        except Exception as e:
            print(e)
            return Response({'refreshed': False})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):

    try:

        res = Response()
        res.data = {'success':True}
        res.delete_cookie('access_token', path='/', samesite='None')
        res.delete_cookie('response_token', path='/', samesite='None')

        return res

    except Exception as e:
        print(e)
        return Response({'success':False})
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_users(request):

    try:
        if request.data['username'] != '' and request.data['first_name'] != '' and request.data['last_name'] != '' :
            usr = User.objects.get(username=request.data['username'])

            usr.username = request.data['username']
            usr.email = request.data['username']
            usr.last_name = request.data['last_name']
            usr.first_name = request.data['first_name']

            res = usr.save()

            usr2 = UsuariosComplementario.objects.get(id=request.data['id'])
            usr2.telefono = request.data['telefono']
            usr2.activo = request.data['activo']
            usr2.administrador = request.data['administrador']
            usr2.genero = Genero.objects.get(id = int(request.data['genero']))
            res2 = usr2.save()
            return Response(res2)
            
        return Response(request.error)

    except Exception as e:
        return Response(request.error)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_todos(request):
    user = request.user
    usuarioComplementario = UsuariosComplementario.objects.filter(usuario=user)
    serializer = UsuariosComplementarioSerializer(usuarioComplementario, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
    usuarioComplementario = UsuariosComplementario.objects.all()
    serializer = UsuariosComplementarioSerializer(usuarioComplementario, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def is_logged_in(request):
    serializer = UserSerializer(request.user, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search(query):
    params = query.query_params.get('query')
    if(params):
        datos = scraping.FiltroArticulo(params)
        return Response(datos)
    else:
        return Response(query.error)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def registerListaDeseo(request):
    usr = User.objects.get(username=request.user)
    request.data.update({'usuario': usr.id})
    serializer = ListaDeseoRegisterSerializer(data=request.data)

    if serializer.is_valid():
        if not request.data["listaDeseo"]:
            serializer.save()
        else:
            ListaDeseo.objects.get(titulo = request.data["titulo"]).delete()

        datos = scraping.FiltroArticulo(request.data["query"])
        return Response(datos)
        
    return Response(serializer.error)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listaDeseo(request):
    usr = User.objects.get(username=request.user)
    datos = ListaDeseo.objects.filter(usuario = usr.id)
    serializer = ListaDeseoSerializer(datos, many=True)
    return Response(serializer.data)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deleteListaDeseo(request):
    params = request.data['titulo']
    usr = User.objects.get(username=request.user)
    datos = ListaDeseo.objects.get(id = params)

    if datos:
        datos.delete()

    datos = ListaDeseo.objects.filter(usuario = usr.id)
    serializer = ListaDeseoSerializer(datos, many=True)
    return Response(serializer.data)