import { VStack, Text, Button } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { mercado_libre } from "../api/endpoints";
import { useAuth } from "../context/useAuth";
import { NumericFormat } from 'react-number-format';

const Mercado = () => {
    const [query, setQuery] = useState('')

    const [datos, setDatos] = useState([]);
    const [boton, setBoton] = useState(false);
    const [spinner, setSpinner] = useState(<i className="fas fa-search me-2"></i>);
    const [datosProducto, setDatosProducto] = useState([]);
    const { registerListaDeseo } = useAuth();

    const handleSave = async (titulo, imagen, url, precio, listaDeseo) => {
        const fetchDatos = async () => {
            setBoton(true);
            setSpinner(<div className="spinner-border text-light spinner-border-sm me-2" role="status"></div>);
            const notes = await registerListaDeseo(titulo, imagen, url, precio, listaDeseo, query)
            setDatos([notes]);
            setDatosProducto(notes.datos);
            setBoton(false);
            setSpinner(<i className="fas fa-search me-2"></i>);
        }
        fetchDatos();
    }

    const useEffect = async () => {
        const fetchDatos = async () => {
            setBoton(true);
            setSpinner(<div className="spinner-border text-light spinner-border-sm me-2" role="status"></div>);
            const notes = await mercado_libre(query);
            setDatos([notes]);
            setDatosProducto(notes.datos);
            setBoton(false);
            setSpinner(<i className="fas fa-search me-2"></i>);
        }
        fetchDatos();
    }

    return (
        <div>
            <div className="row mt-5 pt-4 mb-5">
                <div className="col-8 mx-auto">
                    <div className="search-bar">
                        <div className="input-group">
                            <input onChange={(e) => setQuery(e.target.value)} value={query} type="text" className="form-control" placeholder="Buscar..." aria-label="Search" aria-describedby="search-addon" />
                            <button onClick={useEffect} className="btn btn-primary" type="button" id="search-addon" disabled={boton}>
                                {spinner} BUSCAR
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row pt-5 mt-5">
                {datos.map((dato) => {
                    if(dato){
                        return (
                            <div className="col-4">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="fw-bold mb-4">Recomendaciones</h5>
                                        <div className="row mb-5">
                                            <div className="col-6 fw-bold">
                                                Precio promedio:
                                            </div>
                                            <div className="col-6 fw-bold text-end">
                                                <NumericFormat value={dato.promedio.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                                            </div>
                                        </div>
                                        <h6 className="text-end fw-bold mb-3">Precio más bajo</h6>
                                        <div className="row mb-4">
                                            <div className="col-4">
                                                <img src={dato.precioMin[5]} className="img-fluid img-thumbnail" />
                                                <Button onClick={() => handleSave(dato.precioMin[0], dato.precioMin[5], dato.precioMin[1], dato.precioMin[2], dato.precioMin[6])} className="bg-white p-0"><i className={dato.precioMin[6] == true ? 'fa-solid fa-star text-warning' : 'fa-regular fa-star text-warning'}></i></Button>
                                            </div>
                                            <div className="col-8">
                                                <h6 style={{fontSize: '1.2rem'}}>{dato.precioMin[0]}</h6>
                                                <p className="text-sm fw-bold" style={{fontSize: 'smaller'}}>Precio <NumericFormat value={dato.precioMin[2].toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} /> </p>
                                                <p className="text-sm mb-1" style={{fontSize: '12px'}}>Descuento <NumericFormat value={dato.precioMin[3].toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} /></p>
                                                <p className="text-sm mb-0" style={{fontSize: '12px'}}>Puntaje {dato.precioMin[4]}</p>
                                            </div>
                                        </div>
                                        <h6 className="text-end fw-bold mb-3">Precio más alto</h6>
                                        <div className="row mb-4">
                                            <div className="col-4">
                                                <img src={dato.precioMax[5]} className="img-fluid img-thumbnail" />
                                                <Button onClick={() => handleSave(dato.precioMax[0], dato.precioMax[5], dato.precioMax[1], dato.precioMax[2], dato.precioMax[6])} className="bg-white p-0"><i className={dato.precioMax[6] == true ? 'fa-solid fa-star text-warning icono-guardar' : 'fa-regular fa-star text-warning icono-guardar'}></i></Button>
                                            </div>
                                            <div className="col-8">
                                                <h6 style={{fontSize: '1.2rem'}}>{dato.precioMax[0]}</h6>
                                                <p className="text-sm fw-bold" style={{fontSize: 'smaller'}}>Precio <NumericFormat value={dato.precioMax[2].toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} /></p>
                                                <p className="text-sm mb-1" style={{fontSize: '12px'}}>Descuento <NumericFormat value={dato.precioMax[3].toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} /></p>
                                                <p className="text-sm mb-0" style={{fontSize: '12px'}}>Puntaje {dato.precioMax[4]}</p>
                                            </div>
                                        </div>
                                        <h6 className="text-end fw-bold mb-3">Mejor descuento</h6>
                                        <div className="row mb-4">
                                            <div className="col-4">
                                                <img src={dato.descuentoMax[5]} className="img-fluid img-thumbnail" />
                                                <Button onClick={() => handleSave(dato.descuentoMax[0], dato.descuentoMax[5], dato.descuentoMax[1], dato.descuentoMax[2], dato.descuentoMax[6])} className="bg-white p-0"><i className={dato.descuentoMax[6] == true ? 'fa-solid fa-star text-warning icono-guardar' : 'fa-regular fa-star text-warning icono-guardar'}></i></Button>
                                            </div>
                                            <div className="col-8">
                                                <h6 style={{fontSize: '1.2rem'}}>{dato.descuentoMax[0]}</h6>
                                                <p className="text-sm fw-bold" style={{fontSize: 'smaller'}}>Precio <NumericFormat value={dato.descuentoMax[2].toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} /></p>
                                                <p className="text-sm mb-1" style={{fontSize: '12px'}}>Descuento <NumericFormat value={dato.descuentoMax[3].toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} /></p>
                                                <p className="text-sm mb-0" style={{fontSize: '12px'}}>Puntaje {dato.descuentoMax[4]}</p>
                                            </div>
                                        </div>
                                        <h6 className="text-end fw-bold mb-3">Mejor calificado</h6>
                                        <div className="row mb-4">
                                            <div className="col-4">
                                                <img src={dato.calificacionMax[5]} className="img-fluid img-thumbnail" />
                                                <Button onClick={() => handleSave(dato.calificacionMax[0], dato.calificacionMax[5], dato.calificacionMax[1], dato.calificacionMax[2], dato.calificacionMax[6])} className="bg-white p-0"><i className={dato.calificacionMax[6] == true ? 'fa-solid fa-star text-warning icono-guardar' : 'fa-regular fa-star text-warning icono-guardar'}></i></Button>
                                            </div>
                                            <div className="col-8">
                                                <h6 style={{fontSize: '1.2rem'}}>{dato.calificacionMax[0]}</h6>
                                                <p className="text-sm fw-bold" style={{fontSize: 'smaller'}}>Precio <NumericFormat value={dato.calificacionMax[2].toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} /></p>
                                                <p className="text-sm mb-1" style={{fontSize: '12px'}}>Descuento <NumericFormat value={dato.calificacionMax[3].toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} /></p>
                                                <p className="text-sm mb-0" style={{fontSize: '12px'}}>Puntaje {dato.calificacionMax[4]}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                })
                }
            
                <div className="col-8">
                    <div className="d-flex flex-wrap">
                        {
                            datosProducto.map((producto) => {
                                if(producto){
                                    return (
                                        <div className="card mb-3 me-3" key={producto.id} style={{maxWidth:"400px"}}>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-4">
                                                        <img src={producto['link-imagen']} className="img-fluid img-thumbnail" />
                                                        <Button onClick={() => handleSave(producto.titulo, producto['link-imagen'], producto['link-producto'], producto.precio, producto.deseo)} className="bg-white p-0"><i className={producto.deseo == true ? 'fa-solid fa-star text-warning icono-guardar' : 'fa-regular fa-star text-warning icono-guardar'}></i></Button>
                                                    </div>
                                                    <div className="col-8">
                                                        <h6 style={{fontSize: '1.2rem'}}>{producto.titulo}</h6>
                                                        <p className="text-sm fw-bold" style={{fontSize: 'smaller'}}>Precio <NumericFormat value={producto.precio.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} /></p>
                                                        <p className="text-sm mb-1" style={{fontSize: '12px'}}>Descuento <NumericFormat value={producto.descuento.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} /></p>
                                                        <p className="text-sm mb-0" style={{fontSize: '12px'}}>Puntaje {producto.calificacion}</p>
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

export default Mercado;