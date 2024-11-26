import {
    FormControl,
    FormLabel,
    Button,
    VStack,
    Input,
    Text,
  } from '@chakra-ui/react'

import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const { loginUser } = useAuth();
    const nav = useNavigate();

    const handleLogin = async () => {
        await loginUser(username, password)
    }

    const handleNavigate = () => {
        nav('/register')
    }

    return (
        <VStack minH='500px' w='70%' maxW='400px' justifyContent='start' alignItems='start'>
            <Text mb='20px' color='gray.700' fontSize='44px' fontWeight='bold'>Login</Text>
            <FormControl className='mb-3'>
                <FormLabel>Correo</FormLabel>
                <Input bg='white' onChange={(e) => setUsername(e.target.value)} value={username} type='email' placeholder='correo@correo.com' />
            </FormControl>
            <FormControl className='mb-3'>
                <FormLabel>Password</FormLabel>
                <Input  bg='white' onChange={(e) => setPassword(e.target.value)} value={password} type='password' placeholder='Ingrese su contraseña' />
            </FormControl>
            <button className='btn btn-lg btn-success w-100 mt-4' onClick={handleLogin}>Iniciar Sesión</button>
            <Text onClick={handleNavigate} cursor='pointer' color='gray.600' fontSize='14px' className='btn-link text-decoration-none'>No tiene una cuenta? Crear cuenta</Text>
        </VStack>
    )
}

export default Login;