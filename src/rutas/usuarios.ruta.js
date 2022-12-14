const { Router } = require('express');
const router = Router();
const { renderRegistro, registro, renderFormInicio, iniciaSesion, cerrarSesion } = require('../controles/controlUsuarios');
const { estaAutenticado, noEstaAutenticado } = require('../auxiliares/validacionSesion')


router.get('/usuarios/registro', noEstaAutenticado, renderRegistro);
router.post('/usuarios/registro', noEstaAutenticado, registro);
router.get('/usuarios/iniciar', noEstaAutenticado, renderFormInicio);
router.post('/usuarios/iniciar', noEstaAutenticado, iniciaSesion)
router.get('/usuarios/cerrarSesion', estaAutenticado, cerrarSesion)

module.exports = router;
