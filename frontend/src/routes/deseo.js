import { VStack, Text, Button } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { lista_deseo } from "../api/endpoints";
import { useAuth } from "../context/useAuth";
import { NumericFormat } from 'react-number-format';

const Deseo = () => {
    const [datosProducto, setDatos] = useState([]);
    const { deleteListaDeseo } = useAuth();

    const handleSave = async (titulo) => {
        const fetchDatos = async () => {
            const notes = await deleteListaDeseo(titulo)
            setDatos(notes);
        }
        fetchDatos();
    }

    useEffect(() => {
        const fetchDatos = async () => {
            const notes = await lista_deseo();
            setDatos(notes);
        }
        fetchDatos();
    }, [])

    return (
        <div>
            <div class="row mt-5 pt-4">
                <div class="d-flex justifi-content-left w-auto me-auto">
                    <h4>Lista de deseos</h4>
                </div>
            </div>
            <div className="row mt-4">            
                <div className="col-12">
                    <div className="d-flex flex-wrap">
                        {
                            datosProducto.map((producto) => {
                                if(producto && producto.titulo){
                                    return (
                                        <div className="card mb-3 me-3" style={{maxWidth:"400px"}}>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-4">
                                                        <img src={producto.imagen} className="img-fluid img-thumbnail" />
                                                        <Button onClick={() => handleSave(producto.id)} className="bg-white p-0"><i className='fa fa-trash icono-eliminar'></i></Button>
                                                    </div>
                                                    <div className="col-8">

                                                        <a href={producto.url} target="_blank" className="h6" style={{fontSize: '1.2rem'}}>{producto.titulo}</a>
                                                        <p className="text-sm fw-bold" style={{fontSize: 'smaller'}}>Precio <NumericFormat value={producto.precio.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} /></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>  
                </div>  
            </div>  
        </div>
    )
}

export default Deseo;