import { Button, Flex } from "@chakra-ui/react"
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react"
import { get_notes } from "../api/endpoints"
import { useAuth } from "../context/useAuth";

const LayoutMenu = ({children}) => {
    const [notes, setNotes] = useState([]);
    const { user, logoutUser } = useAuth();
    const nav = useNavigate();

    useEffect(() => {
        const fetchNotes = async () => {
            const notes = await get_notes();
            setNotes(notes)
        }
        fetchNotes();
    }, [])

    const handleLogout = async () => {
        await logoutUser()
    };

    const handleNavigateUsers = () => {
        nav('/usuarios')
    }

    const handleNavigate = () => {
        nav('/')
    }

    const handleNavigateDeseos = () => {
        nav('/deseo')
    }

    const menu = (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid container-lg">
                <a className="navbar-brand me-lg-4" href="#">
                    <img src="../logo192.png"
                         alt="Logo"
                         loading="lazy" style={{height: "25px"}} />
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <i className="navbar-toggler-icon"></i>
                </button>
                <div className="collapse navbar-collapse" key="navbarTogglerDemo02">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                        {notes.map((note) => {
                            if(note.administrador){
                                return (<li className="nav-item" key="usuarios">
                                            <button className="nav-link" onClick={handleNavigateUsers} >Usuarios</button>
                                        </li>)
                            }else{
                                return '';
                            }
                        })}
                        

                        <li className="nav-item">
                            <button className="nav-link" onClick={handleNavigate} >Mercado Libre</button>
                        </li>

                        <li className="nav-item">
                            <button className="nav-link" onClick={handleNavigateDeseos} >Lista de deseos</button>
                        </li>

                    </ul>
                    <span className="me-4">Bienvenido {user ? user.first_name + ' ' + user.last_name : ''}</span>
                    <button className="btn btn-danger" onClick={handleLogout} data-mdb-ripple-color="dark">
                        Cerrar Sesi&#243;n
                    </button>
                </div>
            </div>
        </nav>
    )

    return (
        <div className="h-100 w-100">
            <div id="alertaError" className="alert alert-danger alert-dismissible fade show" role="alert">
              <span className="texto"></span>
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>

            <div id="alertaExito" className="alert alert-success alert-dismissible fade show" role="alert">
              <span className="texto"></span>
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            
            {menu}
            <div className="container body-content mt-4 contenido">
                {children}
                <hr className="hr hr-blurry mt-5" />
                <footer>
                    <p className="mb-0 pb-2">&copy; 2024 - Realizado por Juan Carlos Valencia </p>
                </footer>
            </div>
        </div>
    )
}

export default LayoutMenu;