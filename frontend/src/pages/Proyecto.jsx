import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import useProyectos from '../hooks/useProyectos';
import useAdmin from '../hooks/useAdmin';
import ModalFormularioTarea from '../components/ModalFormularioTarea'
import ModalEliminarTarea from '../components/ModalEliminarTarea'
import ModalEliminarColaborador from '../components/ModalEliminarColaborador'
import Tarea from '../components/Tarea';
import Alerta from '../components/Alerta';
import Colaborador from '../components/Colaborador';

const Proyecto = () => {

    const params = useParams();
    const { obtenerProyecto, proyecto, cargando, handleModalTarea, alerta } = useProyectos()

    const admin = useAdmin()
    console.log(admin)


    useEffect( () => {
        obtenerProyecto(params.id)
      }, [])    

    const { nombre } = proyecto
    if(cargando) return 'Cargando..'
    const { msg } = alerta

    console.log(proyecto)
  return (
    <>
    <div className='flex justify-between'>
        <h1 className='font-black text-4xl'>{nombre}</h1>

        {admin && (
          <div className='flex items-center gap-2 text-gray-400 hover:text-black'>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>

            <Link 
                to={`/proyectos/editar/${params.id}`}
                className='uppercase font-bold'
            >Editar</Link>                    

          </div>
        )}


    </div>     
      {admin && ( 

        <button
          onClick={ handleModalTarea }
          type='button'
          className='text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5 flex gap-2 items-center justify-center'
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          Nueva Tarea
      </button>       

      )}
 

      <p className='font-bold text-xl mt-10'>Tareas del Proyecto</p>

      <div className='flex justify-center'>
          <div className='md:1/3 lg:w-1/4'>
              {msg && <Alerta alerta={alerta} /> }
          </div>
      </div>

      <div className='bg-white shadow mt-10 rounded-lg'>
          {proyecto.tareas?.length ? 
            proyecto.tareas?.map( tarea => (
              <Tarea 
                key={tarea._id}
                tarea={tarea}
              />
            )) : 
          <p className='text-center my-5 p-10'>No hay tareas en este proyecto</p>}
      </div>

      {admin && ( 
        <>
          <div className='flex items-center justify-between mt-10'>
              <p className='font-bold text-xl'>Colaboradores</p>
              <Link
                to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
                className='text-gray-400 hover:text-black uppercase font-bold'
              >Añadir</Link>
          </div>        
          <div className='bg-white shadow mt-10 rounded-lg'>
              {proyecto.colaboradores?.length ? 
                proyecto.colaboradores?.map( colaborador => (
                    <Colaborador 
                        key={colaborador._id}
                        colaborador={colaborador}
                    />
                )) : 
              <p className='text-center my-5 p-10'>No hay Colaboradores en este proyecto</p>}
          </div>      
        </>
      )}

      <ModalFormularioTarea />
      <ModalEliminarTarea />
      <ModalEliminarColaborador />
    </>
 
  )
}

export default Proyecto
