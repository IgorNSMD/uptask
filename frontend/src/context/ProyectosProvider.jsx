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

        try {
            const token = localStorage.getItem('token')
            if(!token) return 

            const config = {
                headers: {
                    "Context-type":"application/json",
                    Authorization:`Bearer ${ token }`
                } 
            }

            const { data } = await clienteAxios.post(`/proyectos`, proyecto, config)
            //console.log(data)
            setProyectos([...proyectos, data])

            setAlerta({
                msg:'Proyecto creado correctamente',
                error:false
            })

            setTimeout(() =>{
                setAlerta({})
                navigate('/proyectos')
            }, 3000)


        } catch (error) {
            console.log(error)
        }
        
        // if(proyecto.id) {
        //     await editarProyecto(proyecto)
        // } else {
        //     await nuevoProyecto(proyecto)
        // }
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

    return (

        <ProyectosContext.Provider
            value={{
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando
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