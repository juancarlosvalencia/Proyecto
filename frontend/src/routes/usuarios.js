import { VStack, Text, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { get_users } from "../api/endpoints";
import { useAuth } from "../context/useAuth";
import $ from 'jquery';
import parse from 'html-react-parser';


const Usuarios = () => {
    const [id, setId] = useState('')
    const [username, setUserName] = useState('')
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [telefono, setTelefono] = useState('')
    const [genero, setGenero] = useState('')
    const [activo, setActivo] = useState('')
    const [administrador, setAdministrador] = useState('')

    const [usuarios, setUsers] = useState([]);
    const { user, logoutUser } = useAuth();
    const { registerUsers } = useAuth();

    const botones = (
        '<a className="edit mx-1" title="Editar" data-toggle="tooltip" ><i className="fa fa-pencil"></i></a>'
    );

    const handleSave = async () => {
        await registerUsers(id, username, first_name, last_name, telefono, genero, activo, administrador)
    }

    useEffect(() => {
        const fetchUsers = async () => {
            const notes = await get_users();
            setUsers(notes)
        }
        fetchUsers();

        $("#buscar").on("keyup", function() {
            var value = $(this).val().toLowerCase();
            $(".table tbody tr").filter(function() {
              $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
          });

          $(document).on("click", ".edit", function () {
            if($(this).css('display') != 'none'){
                $(this).parents('tr').find("td:not(:last-child)").each(function (i) {
                    var idinput = "";

                    if (i == '0') {
                        $('input[name = id]').val($(this).text());
                        setId($(this).text())
                    } else if (i == '1') {
                        $('input[name = username]').val($(this).text());
                        setUserName($(this).text())
                    } else if (i == '2') {
                        $('input[name = first_name]').val($(this).text());
                        setFirstName($(this).text())
                    } else if (i == '3') {
                        $('input[name = last_name]').val($(this).text());
                        setLastName($(this).text())
                    } else if (i == '4') {
                        $('input[name = telefono]').val($(this).text());
                        setTelefono($(this).text())
                    } else if (i == '5') {
                        $('input[name = genero]').val($(this).attr('data-idgenero')).change();
                        setGenero($(this).attr('data-idgenero'))
                    } else if (i == '6') {
                        var txt = $(this).text();
                        var res = false;
                        if (txt == "Si") {
                            res = true;
                        }
            
                        $('input[name = activo]').prop('checked', res);
                        setActivo(res)
                    } else if (i == '7') {
                        var txt = $(this).text();
                        var res = false;
                        if (txt == "Si") {
                            res = true;
                        }
            
                        $('input[name = administrador]').prop('checked', res);
                        setAdministrador(res)
                    }
                });
                $(this).parents("tr").find(".edit").toggle();
                $('.update').toggle();
            }
        });

    }, []) 

    return (
        <div>
            <div className="table-wrapper mt-5">
                <div className="table-title mb-3">
                    <div className="row">
                        <div className="d-flex justifi-content-left w-auto me-auto"><h4>Lista de usuarios</h4></div>
                        <input type="search" className="form-control rounded" placeholder="Buscar" aria-label="Buscar" aria-describedby="search-addon" name="buscar" key="buscar" style={{maxWidth:"250px"}}/>
                    </div>
                </div>
                <div className="table-responsive text-nowrap">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th className="fw-bold" scope="col">Id</th>
                                <th className="fw-bold" scope="col">Nombre de usuario</th>
                                <th className="fw-bold" scope="col">Nombres</th>
                                <th className="fw-bold" scope="col">Apellidos</th>
                                <th className="fw-bold" scope="col">Telefono</th>
                                <th className="fw-bold" scope="col">Genero</th>
                                <th className="fw-bold" scope="col">Activo</th>
                                <th className="fw-bold" scope="col">Administrador</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-center">
                                <td scope="row" className="fw-bold"><input onChange={(e) => setId(e.target.value)} type="hidden" name="id" class="form-control" /></td>
                                <td><input onChange={(e) => setUserName(e.target.value)} type="email" name="username" class="form-control" /></td>
                                <td><input onChange={(e) => setFirstName(e.target.value)} type="text" name="first_name" class="form-control" /></td>
                                <td><input onChange={(e) => setLastName(e.target.value)} type="text" name="last_name" class="form-control" /></td>
                                <td><input onChange={(e) => setTelefono(e.target.value)} type="text" name="telefono" class="form-control" /></td>
                                <td>
                                    <select onChange={(e) => setGenero(e.target.value)} class="form-select" placeholder="Seleccione un genero" >
                                        <option value="1">Masculino</option>' +
                                        <option value="2">Femenino</option>' +
                                        <option value="3">Otro</option>' +
                                    </select>
                                </td>
                                <td><input onChange={(e) => setActivo(e.target.checked)} type="checkbox" name="activo" class="form-check-input" /></td>
                                <td><input onChange={(e) => setAdministrador(e.target.checked)} type="checkbox" name="administrador" class="form-check-input" /></td>
                                <td>
                                    <button onClick={handleSave} className="update mx-1" title="Guardar" data-toggle="tooltip" style={{display: 'none'}}><i className="fa fa-user-plus"></i></button>
                                </td>
                            </tr>

                            {usuarios.map((usuario) => {
                                if(usuario.usuario && usuario.id){
                                    return (
                                        <tr className="text-center" key={usuario.id}>
                                            <td scope="row" className="fw-bold">{usuario.id}</td>
                                            <td>{usuario.usuario.username}</td>
                                            <td>{usuario.usuario.first_name}</td>
                                            <td>{usuario.usuario.last_name}</td>
                                            <td>{usuario.telefono}</td>
                                            <td data-idgenero={usuario.genero} >{usuario.genero === 1 ? 'Masculino' : usuario.genero === 2 ? 'Femenino' : 'Otro'}</td>
                                            <td>{usuario.activo === true ? 'Si' : 'No'}</td>
                                            <td>{usuario.administrador === true ? 'Si' : 'No'}</td>
                                            <td>
                                                {usuario.usuario.username != user.username ? parse(botones) : '' }
                                            </td>
                                        </tr>
                                    )
                                }
                            })}
                            
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Usuarios;