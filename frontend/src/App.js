import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'

import { AuthProvider } from './context/useAuth';

import Login from './routes/login';
import Mercado from './routes/mercado';
import Usuarios from './routes/usuarios';
import Deseo from './routes/deseo';
import Register from './routes/register';

import Layout from './components/layout';
import LayoutMenu from './components/layoutmenu';
import PrivateRoute from './components/private_route';

function App() {
  return (
    <ChakraProvider>
        <Router>
          <AuthProvider>
              <Routes>
                <Route element={<PrivateRoute><LayoutMenu><Mercado /></LayoutMenu></PrivateRoute>} path='/' />
                <Route element={<PrivateRoute><LayoutMenu><Usuarios /></LayoutMenu></PrivateRoute>} path='/usuarios' />
                <Route element={<PrivateRoute><LayoutMenu><Deseo /></LayoutMenu></PrivateRoute>} path='/deseo' />
                <Route element={<Layout><Login /></Layout>} path='/login' /> 
                <Route element={<Layout><Register /></Layout>} path='/register' /> 
              </Routes>
          </AuthProvider>
        </Router>
    </ChakraProvider>
  );
}

export default App;
