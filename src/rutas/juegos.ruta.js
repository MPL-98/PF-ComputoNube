const {Router} = require('express');
const router = Router();
const { renderAgregarJuego, 
        agregarJuego, 
        renderTodosJuegos, 
        eliminarJuego, 
        renderEditarJuego, 
        editarJuego, 
        renderVistaJuego,
        renderAgregarUso,
        agregarUso,
        buscarJuegos,
        renderEstadisticas} = require('../controles/controlJuegos');

const {estaAutenticado, esAdmin} = require('../auxiliares/validacionSesion')

router.get('/juegos/agregar', estaAutenticado, esAdmin, renderAgregarJuego);
router.post('/juegos/agregar', estaAutenticado, esAdmin, agregarJuego);

router.get('/juegos', estaAutenticado, renderTodosJuegos);
router.get('/juegos/:id', estaAutenticado, renderVistaJuego);

router.get('/juegos/eliminar/:id', estaAutenticado, esAdmin, eliminarJuego);

router.get('/juegos/editar/:id', estaAutenticado, esAdmin, renderEditarJuego);
router.post('/juegos/editar/:id', estaAutenticado, esAdmin, editarJuego);

router.get('/juegos/agregar_uso/:id', estaAutenticado, renderAgregarUso);
router.post('/juegos/agregar_uso/:id', estaAutenticado, agregarUso);
router.post('/juegos/buscar', estaAutenticado, buscarJuegos );
router.get('/estadisticas', estaAutenticado, esAdmin, renderEstadisticas);

module.exports = router;
