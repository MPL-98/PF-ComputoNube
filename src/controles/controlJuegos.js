
const juegoCtrl = {};
const pool = require('../database');
const fs = require("fs");
const path = require('path');
const { type } = require('os');

juegoCtrl.renderAgregarJuego = (req, res) => {
    res.render('juegos/agregar');
};

juegoCtrl.agregarJuego = async (req,res) => {
    const { nombre, descripcion, instrucciones, nivel, vocabulario } = req.body;
    const { filename } = req.file;
    const nuevoJuego = {
        nombre,
        descripcion,
        instrucciones,
        ruta_imagen: 'img/subidas/' + filename, 
        nivel,
        vocabulario
    };

    await pool.query('INSERT INTO juegos set ?', [nuevoJuego]); 
    req.flash('mensajeExito', 'Ha añadido la vacante correctamente')
    res.redirect('/juegos');
};

juegoCtrl.renderTodosJuegos = async (req, res) => {
    const juegos = await pool.query('SELECT * FROM juegos');
    res.render('juegos/todosJuegos', {juegos});
};

juegoCtrl.eliminarJuego = async (req,res) => {
    const {id} = req.params;
    const juego = await pool.query('SELECT * FROM juegos WHERE juegos_id = ?', [id]);
    fs.unlinkSync(path.join(__dirname, "../public/"+juego[0].ruta_imagen));
    await pool.query('DELETE FROM juegos WHERE juegos_id = ?', [id]);
    req.flash('mensajeError', 'Ha eliminado la vacante correctamente')
    res.redirect('/juegos')
}

juegoCtrl.renderEditarJuego = async (req,res) => {
    const {id} = req.params;
    const juego = await pool.query('SELECT * FROM juegos WHERE juegos_id = ?', [id]);
    res.render('juegos/editar', {juego : juego[0]});
}

juegoCtrl.editarJuego = async (req,res) => {
    const {id} = req.params;
    const { nombre, descripcion, instrucciones, nivel, vocabulario } = req.body;
    if (req.file){
        const juego = await pool.query('SELECT * FROM juegos WHERE juegos_id = ?', [id]);
        fs.unlinkSync(path.join(__dirname, "../public/"+juego[0].ruta_imagen));
        const { filename } = req.file;
        const nuevoJuego = {
            nombre,
            descripcion,
            instrucciones,
            ruta_imagen: 'img/subidas/' + filename, 
            nivel,
            vocabulario
        };

        await pool.query('UPDATE juegos set ? WHERE juegos_id= ?', [nuevoJuego, id]);
    } else {
        const nuevoJuego = {
            nombre,
            descripcion,
            instrucciones,
            nivel,
            vocabulario
        };

        await pool.query('UPDATE juegos set ? WHERE juegos_id= ?', [nuevoJuego, id]);
    }
    req.flash('mensajeExito', 'Ha editado la vacante correctamente')
    res.redirect('/juegos');

};
juegoCtrl.renderVistaJuego = async (req, res) => {
    const {id} = req.params;
    const juego = await pool.query('SELECT * FROM juegos WHERE juegos_id = ?', [id]);
    const queryString = 'SELECT * FROM juegos WHERE (descripcion LIKE ? OR vocabulario LIKE ? OR nivel LIKE ? OR descripcion LIKE ? OR vocabulario LIKE ?) AND NOT juegos_id = ? ';
    const filtros = ['%' + juego[0].descripcion + '%', '%' + juego[0].vocabulario + '%', '%' + juego[0].nivel + '%', '%' + juego[0].vocabulario + '%', '%' + juego[0].descripcion + '%', ''+juego[0].juegos_id];
    const juegosEncontrados = await pool.query(queryString, filtros);
    res.render('juegos/vista', {juego : juego[0], juegos : juegosEncontrados});
};

juegoCtrl.renderAgregarUso = async (req, res) => {
    const {id} = req.params;
    const juego = await pool.query('SELECT * FROM juegos WHERE juegos_id = ?', [id]);
    res.render('juegos/agregarUsoJuegos', {juego : juego[0]});

};
juegoCtrl.agregarUso = async (req, res) => {
    const {id} = req.params;
    const { calificacion, comentarios } = req.body;
    const { usuario_id } = req.user;

    const usoJuego = {
        usuario_id,
        juegos_id: id,
        calificacion,
        comentarios
    };
    await pool.query('INSERT INTO uso_juegos SET ?', [usoJuego]);
    req.flash('mensajeExito', 'Gracias por su colaboración')
    res.redirect('/juegos');
};

juegoCtrl.buscarJuegos = async (req, res) => {
    const {palabra_clave} = req.body;
    const palabra = '%' + palabra_clave + '%';
    const queryString = 'SELECT * FROM juegos WHERE descripcion LIKE ? OR vocabulario LIKE ? OR nivel LIKE ?';
    const filtros = [palabra, palabra, palabra];
    const juegosEncontrados = await pool.query(queryString, filtros);
    res.render('juegos/busqueda', {juegos : juegosEncontrados});
};

juegoCtrl.renderEstadisticas = async (req, res) => {
    const registros = await pool.query('SELECT * FROM uso_juegos');
    var repetidos = {}
    registros.forEach(function(elemento) {
        repetidos[elemento.juegos_id] = (repetidos[elemento.juegos_id] || 0) + 1;
    });
    let ordenado = Object.keys(repetidos).sort(function(a,b){return repetidos[b]-repetidos[a]});

    var juegosOrdenados = [];
    for (let i=0; i<=ordenado.length -1; ++i){
        let juego = await pool.query('SELECT * FROM juegos WHERE juegos_id = ?', ordenado[i])
        juegosOrdenados.push({juego: juego[0], repeticiones: repetidos[ordenado[i]]})
    }
    console.log(juegosOrdenados);
    res.render('juegos/estadisticas', {juegos : juegosOrdenados});

}



module.exports = juegoCtrl;
