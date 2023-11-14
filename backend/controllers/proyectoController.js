import Proyecto from "../models/Proyecto.js"
import Usuario from "../models/Usuario.js";

const obtenerProyectos = async(req,res) => {
    const proyectos = await Proyecto.find().where('creador').equals(req.usuario).select("-tareas")

    res.json(proyectos)

}

const nuevoProyecto = async(req,res) => {
    //console.log(req.body)
    //console.log(req.usuario)
    const proyecto = new Proyecto(req.body)
    proyecto.creador = req.usuario._id

    try {
        const proyectoAlmacenado = await proyecto.save()
        res.json(proyectoAlmacenado)

    } catch (error) {
        console.log(error)
    }

}

const obtenerProyecto = async(req,res) => {

    const { id } = req.params;

    try {
        const proyecto = await Proyecto.findById(id).populate('tareas')        
        if(!proyecto){
            const error = new Error('Proyecto no encontrado...')
            return res.status(404).json({ msg: error.message})
        }

        if(proyecto.creador.toString() !== req.usuario._id.toString()){
            const error = new Error('No tienes los permisos...')
            return res.status(401).json({ msg: error.message})
        }

        //console.log(proyecto.creador)
        //console.log(req.usuario._id)

        // Obtener las tareas del proyecto
        // const tareas = await Tarea.find().where('proyecto').equals(proyecto._id)
        // res.json(tareas)        


        res.json(proyecto);

    } catch (error) {
        //console.log(error.message)
        return res.status(404).json({ msg: error.message });
    }
}

const editarProyecto = async(req,res) => {
    const { id } = req.params;

    try {
        const proyecto = await Proyecto.findById(id)        
        if(!proyecto){
            const error = new Error('Proyecto no encontrado...')
            return res.status(404).json({ msg: error.message})
        }

        if(proyecto.creador.toString() !== req.usuario._id.toString()){
            const error = new Error('No tienes los permisos...')
            return res.status(401).json({ msg: error.message})
        }

        //console.log(proyecto.creador)
        //console.log(req.usuario._id)

        proyecto.nombre = req.body.nombre || proyecto.nombre
        proyecto.descripcion = req.body.descripcion || proyecto.descripcion
        proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega
        proyecto.cliente = req.body.cliente || proyecto.cliente

        const proyectoAlmacenado = await proyecto.save()

        res.json(proyectoAlmacenado);

    } catch (error) {
        //console.log(error.message)
        return res.status(404).json({ msg: error.message });
    }
}

const eliminarProyecto = async(req,res) => {
    const { id } = req.params;

    try {
        const proyecto = await Proyecto.findById(id)        
        if(!proyecto){
            const error = new Error('Proyecto no encontrado...')
            return res.status(404).json({ msg: error.message})
        }

        if(proyecto.creador.toString() !== req.usuario._id.toString()){
            const error = new Error('No tienes los permisos...')
            return res.status(401).json({ msg: error.message})
        }

        await proyecto.deleteOne()

        return res.json({ msg: "Proyecto eliminado..."})

    } catch (error) {
        console.log(error.message)
        return res.status(404).json({ msg: error.message });
    }
}

const buscarColaborador = async (req, res) => {

    //console.log(req.body)

    const { email } = req.body;
    const usuario = await Usuario.findOne({ email }).select(
       "-confirmado -createdAt -password -token -updatedAt -__v "
    );
  
    if (!usuario) {
      const error = new Error("Usuario no encontrado");
      return res.status(404).json({ msg: error.message });
    }
  
    res.json(usuario);

  };

const agregarColaborador = async(req,res) => {

}

const eliminarColaborador = async(req,res) => {

}

// const obtenerTareas = async(req,res) => {
//     const { id } = req.params

//     try {
//         const existeProyecto = await Proyecto.findById(id)                
//         if(!existeProyecto){
//             const error = new Error('Proyecto no encontrado...')
//             return res.status(404).json({ msg: error.message})
//         }        

//         // creador o colaborador del proyecto

//         const tareas = await Tarea.find().where('proyecto').equals(id)
//         res.json(tareas)

//     } catch (error) {
        
//     }

// }

export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador,
    //obtenerTareas
}