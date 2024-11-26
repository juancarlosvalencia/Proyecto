from django.urls import path
from .views import get_todos, search, get_users, register_users, registerListaDeseo, listaDeseo, deleteListaDeseo, CustomTokenObtainPairView, CustomTokenRefreshView, logout, register, is_logged_in

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout/', logout),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('todos/', get_todos),
    path('users/', get_users),
    path('registerusers/', register_users),
    path('register/', register),
    path('registerlistadeseo/', registerListaDeseo),
    path('listadeseo/', listaDeseo),
    path('deletelistadeseo/',deleteListaDeseo),
    path('authenticated/', is_logged_in),
    path('search/', search),
]