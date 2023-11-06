import express from "express";
import {usuarios,registrar,autenticar,confirmar,olivdePassword,comprobarToken,nuevoPassword,perfil } from '../controllers/usuarioController.js'
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router()

// Autenticación, Registro y confirmación de usuarios 


router.get('/', usuarios)


router.post('/',registrar)
router.post('/login',autenticar)
router.get('/confirmar/:token',confirmar)
router.post('/olvide-password',olivdePassword)

router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword)

router.get('/perfil',checkAuth, perfil)

router.put('/',(req,res) => {
    res.send('Desde PUT API/Usuarios')
})

router.delete('/',(req,res) => {
    res.send('Desde DELETE API/Usuarios')
})


export default router;
