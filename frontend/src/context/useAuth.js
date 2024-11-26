import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';

import { authenticated_user, login, logout, register, register_users, guardar_lista_deseo, eliminar_lista_deseo } from '../api/endpoints';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const nav = useNavigate();
    
    const get_authenticated_user = async () => {
        try {
          const user = await authenticated_user();
          setUser(user);
        } catch (error) {
          setUser(null); // If the request fails, set the user to null
        } finally {
          setLoading(false); // Set loading to false after request completes
        }
    };

    const loginUser = async (username, password) => {
        const user = await login(username, password)
        if(user.textResponse){
          alerta(user.textResponse, false);
          return
        }

        if (user && user.success) {
          setUser(user)
          nav('/')
        } else {
          alerta('Error al iniciar sesión', false);
        }
    }

    const logoutUser = async () => {
      await logout();
      nav('/login')
    }

    const registerUser = async (email, password, passwordConfirm, first_name, last_name, telefono, genero) => {
      try {
        if (password === passwordConfirm) {
          await register(email, password, first_name, last_name, telefono, genero)
          alerta('Usuario registrado correctamente');
          nav('/login')
        }else{
          alerta('Password y repetir password son diferentes, intentelo nuevamente', false);
        }
      } catch {
        alerta('Error al registrar el usuario', false);
      }
    }

    const registerUsers = async (id, username, first_name, last_name, telefono, genero, activo, administrador) => {
      try {
          await register_users(id, username, first_name, last_name, telefono, genero, activo, administrador)
          alerta('Usuario modificado exitosamente');
      } catch {
        alerta('Error al guardar el usuario', false);
      }

      window.location.reload();
    }

    const registerListaDeseo = async (titulo, imagen, url, precio, listaDeseo, query) => {
      try {
          return await guardar_lista_deseo(titulo, imagen, url, precio, listaDeseo, query)
      } catch {
        alerta('Error al guardar', false);
      }
    }

    const deleteListaDeseo = async (titulo) => {
      try {
          return await eliminar_lista_deseo(titulo);
      } catch {
        alerta('Error al guardar', false);
      }
    }

    useEffect(() => {
        get_authenticated_user();
    }, [window.location.pathname])

    function alerta(texto, exito = true){
      if(exito){
        $('#alertaExito .texto').html(texto);
        $('#alertaExito').fadeTo(5000, 500).slideUp(500, function(){
          $('#alertaExito').slideUp(500);
        })
      }else {
        $('#alertaError .texto').html(texto);
        $('#alertaError').fadeTo(5000, 500).slideDown(500, function(){
          $('#alertaError').slideDown(500);
        })
      }
    }

    $('#alertaExito').hide();
    $('#alertaError').hide();

    return (
        <AuthContext.Provider value={{ user, loading, deleteListaDeseo, loginUser, logoutUser, registerUser, registerUsers, registerListaDeseo }}>
          {children}
        </AuthContext.Provider>
      );
}

export const useAuth = () => useContext(AuthContext);