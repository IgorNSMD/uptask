import { useState, useEffect, createContext } from 'react'
import clienteAxios from '../config/clienteAxios'
import { useNavigate } from 'react-router-dom'


const ProyectosContext = createContext();

const ProyectosProvider = ({children}) => {
    const [proyectos, setProyectos] = useState([]);
    const [alerta, setAlerta] = useState({});
    const [proyecto, setProyecto] = useState({});
    const [cargando, setCargando] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const obtenerProyectos = async () => {
            try {
                const token = localStorage.getItem('token')
                if(!token) return
                
    
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                const { data } = await clienteAxios('/proyectos', config)
                //console.log(data)

                setProyectos(data)

            } catch (error) {
                console.log(error)
            }
        }
        obtenerProyectos()
    }, [])

    const mostrarAlerta = alerta => {
        setAlerta(alerta)

        setTimeout(() => {
            setAlerta({})
        }, 5000);
    }

    const submitProyecto = async proyecto => {
        if(proyecto.id) {
            await editarProyecto(proyecto)
        } else {
            await nuevoProyecto(proyecto)
        }
    }

    const editarProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)

            // Sincronizar el state
            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
            setProyectos(proyectosActualizados)

            setAlerta({
                msg: 'Proyecto Actualizado Correctamente',
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000);
        } catch (error) {
            console.log(error)
        }
    }

    const nuevoProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post('/proyectos', proyecto, config)

            setProyectos([...proyectos, data])

            setAlerta({
                msg: 'Proyecto Creado Correctamente',
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000);
        } catch (error) {
            console.log(error)
        }
    }

    const obtenerProyecto = async id => {
        console.log(id)
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios(`/proyectos/${id}`, config )
            //console.log(data)

             setProyecto(data)
            // setAlerta({})
        } catch (error) {
            // navigate('/proyectos')
            // setAlerta({
            //     msg: error.response.data.msg,
            //     error: true
            // })
            // setTimeout(() => {
            //     setAlerta({})
            // }, 3000);
        } finally {
            setCargando(false)
        }
    }    

    const eliminarProyecto = async id => {
        console.log('eliminando...', id)

        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-type":"application/json",
                    "Authorization":`Bearer ${token}`
                } 
            }

            // console.log('token -> ', token)
            const { data } = await clienteAxios.delete(`/proyectos/${id}`, config)

            // await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/proyectos/${id}`, config ).then(response => {
            //     // Handle the response here.
            //     console.log('DELETE3 request successful', response.data);
            //   }).catch(error => {
            //     // Handle errors here.
            //     console.error('DELETE23 request failed', error);
            //   });

            // Sincronizar el state
            const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id )
            setProyectos(proyectosActualizados)

            setAlerta({
                msg: data.msg,
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000);

        } catch (error) {
            console.log(error)
        }
    }    


    return (

        <ProyectosContext.Provider
            value={{
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto
            }} 
        >
            {children}
        </ProyectosContext.Provider>

    )

}

export { 
    ProyectosProvider
}

export default ProyectosContext