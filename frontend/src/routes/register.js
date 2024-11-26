import {
    FormControl,
    FormLabel,
    Button,
    VStack,
    Input,
    Text,
    Select,
  } from '@chakra-ui/react'

import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

const Register = () => {

    const [email, setEmail] = useState('')
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [telefono, setTelefono] = useState('')
    const [genero, setGenero] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    const { registerUser } = useAuth();
    const nav = useNavigate();

    const handleLogin = async () => {
        await registerUser(email, password, passwordConfirm, first_name, last_name, telefono, genero)
    }

    const handleNavigate = () => {
        nav('/login')
    }

    return (
        <VStack minH='500px' w='70%' maxW='450px' justifyContent='start' alignItems='start'>
            <Text className='mb-3' color='gray.700' fontSize='44px' fontWeight='bold'>Registro</Text>
            <FormControl className='mb-3'>
                <FormLabel>Correo</FormLabel>
                <Input bg='white' onChange={(e) => setEmail(e.target.value)} value={email} type='email' placeholder='email@email.com' />
            </FormControl>
            <div className='row mb-3'>
                <div className='col-6 pe-0'>
                    <FormLabel>Nombres</FormLabel>
                    <Input  bg='white' onChange={(e) => setFirstName(e.target.value)} value={first_name} type='text' placeholder='Juan Carlos' />
                </div>
                <div className='col-6 pe-0'>
                    <FormLabel>Apellidos</FormLabel>
                    <Input  bg='white' onChange={(e) => setLastName(e.target.value)} value={last_name} type='text' placeholder='Valencia' />
                </div>
            </div>

            <div className='row mb-3'>
                <div className='col-6 pe-0'>
                    <FormLabel>Telefono</FormLabel>
                    <Input  bg='white' onChange={(e) => setTelefono(e.target.value)} value={telefono} type='text' placeholder='3209571694' />
                </div>
                <div className='col-6 pe-0'>
                    <FormLabel>Genero</FormLabel>
                    <Select className='pe-5' bg='white' onChange={(e) => setGenero(e.target.value)} value={genero} placeholder='Seleccione un genero'>
                        <option value="1">Masculino</option>
                        <option value="2">Femenino</option>
                        <option value="3">Otro</option>
                    </Select>
                </div>
            </div>

            <div className='row mb-3'>
                <div className='col-6 pe-0'>
                    <FormLabel>Password</FormLabel>
                    <Input  bg='white' onChange={(e) => setPassword(e.target.value)} value={password} type='password' placeholder='Ingrese un password' />
                </div>
                <div className='col-6 pe-0'>
                    <FormLabel>Confirmar Password</FormLabel>
                    <Input bg='white' onChange={(e) => setPasswordConfirm(e.target.value)} value={passwordConfirm} type='password' placeholder='Confirmar password' />
                </div>
            </div>

            <button type='button' className='btn btn-lg btn-success w-100 mt-4' onClick={handleLogin}>Registrarse</button>
            <Text onClick={handleNavigate} cursor='pointer' color='gray.600' fontSize='14px' className='btn-link text-decoration-none'>Tiene una cuenta? Inicie sesión</Text>
        </VStack>
    )
}

export default Register;