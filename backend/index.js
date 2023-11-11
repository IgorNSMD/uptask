import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import conectarDB from './config/db.js'
import usuarioRoutes from './routes/usuarioRoutes.js'
import proyectoRoutes from './routes/proyectoRoutes.js'
import tareaRoutes from './routes/tareaRoutes.js'

const app = express()
app.use(express.json())

dotenv.config()

conectarDB()

//Configurar CORS
const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin,callback){
        console.log(origin)
        if(whitelist.includes(origin)){
            //Consultar la API
            callback(null,true)
        } else {
            //No esta permitido
            callback(new Error('Error de cors...'))
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
}

app.use(cors(corsOptions))

//Routing
app.use("/api/usuarios",usuarioRoutes)
app.use("/api/proyectos",proyectoRoutes)
app.use("/api/tareas",tareaRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {

    console.log(`Servidor corriendo en el puerto:  ${ PORT } `)
})