import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/'

const LOGIN_URL = `${BASE_URL}login/`
const REGISTER_URL = `${BASE_URL}register/`
const REGISTER_USERS = `${BASE_URL}registerusers/`
const LOGOUT_URL = `${BASE_URL}logout/`
const NOTES_URL = `${BASE_URL}todos/`
const USERS_URL = `${BASE_URL}users/`
const AUTHENTICATED_URL = `${BASE_URL}authenticated/`
const MERCADOLIBRE_URL = `${BASE_URL}search/`
const LISTADESEOREGISTRO_URL = `${BASE_URL}registerlistadeseo/`
const LISTADESEOELIMINAR_URL = `${BASE_URL}deletelistadeseo/`
const LISTADESEO_URL = `${BASE_URL}listadeseo/`

axios.defaults.withCredentials = true; 

export const login = async (username, password) => {
    try {
        const response = await axios.post(
            LOGIN_URL, 
            { username, password },  // Object shorthand for cleaner syntax
            { withCredentials: true }  // Ensures cookies are included
        );
        
        // Check if the response contains a success attribute (depends on backend response structure)
        return response.data
    } catch (error) {
        console.log("Error al iniciar sesión: ", error);
        return false;  // Return false or handle the error as needed
    }
};

export const get_notes = async () => {
    const response = await axios.get(NOTES_URL, { withCredentials: true });
    return response.data;
};

export const get_users = async () => {
    const response = await axios.get(USERS_URL, { withCredentials: true });
    return response.data;
};

export const register_users = async (id, username, first_name, last_name, telefono, genero, activo, administrador) => {
    const response = await axios.post(REGISTER_USERS, {id, username, first_name, last_name, telefono, genero, activo, administrador}, { withCredentials: true });
    return response.data;
};

export const logout = async () => {
    const response = await axios.post(LOGOUT_URL, { withCredentials: true });
    return response.data;
};

export const register = async (email, password, first_name, last_name, telefono, genero) => {
    const response = await axios.post(REGISTER_URL, {email, password, first_name, last_name, telefono, genero}, { withCredentials: true });
    return response.data;
};

export const authenticated_user = async () => {
    const response = await axios.get(AUTHENTICATED_URL, { withCredentials: true });
    return response.data
}

export const mercado_libre = async (query) => {
    if(query){
        const response = await axios.get(MERCADOLIBRE_URL + "?query=" + query, { withCredentials: true });
        return response.data;
    }
    
    return null;
}

export const eliminar_lista_deseo = async (titulo) => {
    const response = await axios.post(LISTADESEOELIMINAR_URL, {titulo}, { withCredentials: true });
    return response.data;
};

export const lista_deseo = async () => {
    const response = await axios.get(LISTADESEO_URL, { withCredentials: true });
    return response.data;
}

export const guardar_lista_deseo = async (titulo, imagen, url, precio, listaDeseo, query) => {
    const response = await axios.post(LISTADESEOREGISTRO_URL, {titulo, imagen, url, precio, listaDeseo, query}, { withCredentials: true });
    return response.data;
};