const passport = require('passport');
const helpers = require('../configuraciones/helpers');
const pool = require('../database');

usuarioCtrl = {}

usuarioCtrl.renderRegistro = (req,res) => {
    res.render('usuarios/registro');
};

usuarioCtrl.registro = async (req,res) => {
    const errores = [];
    const { usuario_id, nombre, apellidos, contrasena, confirmarContrasena } = req.body;
    if (contrasena != confirmarContrasena) {
        errores.push({ text: 'Las contraseñas no coinciden' });
    };
    if (contrasena.length < 4) {
        errores.push({ text: 'La contraseña debe tener al menos 4 caracteres' });
    };
    if (errores.length > 0) {
        res.render('usuarios/registro', {
            errores,
            nombre,
            usuario_id,
            apellidos
        });
    } else {
        const usuarioID = await pool.query('SELECT * FROM usuarios WHERE usuario_id = ?', [usuario_id]);
        if (usuarioID.length > 0) {
            req.flash('mensajeError', "El usuario ya está en uso");
            res.redirect('/usuarios/registro')
        } else {
            const nuevoUsuario = {
                usuario_id,
                nombre,
                apellidos,
                contrasena,
                es_admin: false,
                es_profesor: false
            };
            nuevoUsuario.contrasena = await helpers.encriptarContraseña(contrasena);
            await pool.query('INSERT INTO usuarios set ?', [nuevoUsuario]);
            req.flash('mensajeExito', 'Se ha registrado correctamente');
            res.redirect('/usuarios/iniciar')
        }
    }
}

usuarioCtrl.renderFormInicio = (req, res) => {
    res.render('usuarios/iniciar');
}

usuarioCtrl.iniciaSesion = passport.authenticate('local', {
    failureRedirect: '/usuarios/registro',
    successRedirect: '/juegos',
    failureFlash: true
});

usuarioCtrl.cerrarSesion = (req,res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/usuarios/iniciar');
    });
};

module.exports = usuarioCtrl;
