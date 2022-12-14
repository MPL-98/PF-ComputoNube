const passport = require('passport');
const helpers = require('../configuraciones/helpers');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');

passport.use(new LocalStrategy({
    usernameField: 'usuario_id',
    passwordField: 'contrasena',
    passReqToCallback: true
}, async (req, usuario_id, contrasena, terminado) => {
    const user = await pool.query('SELECT * FROM usuarios WHERE usuario_id = ?', [usuario_id]);
    if (user.length <= 0) {
        return terminado(null, false, { message: 'No existe este usuario' });
    } else {
        const comparacion = await helpers.compararContraseña(contrasena, user[0].contrasena);
        if (comparacion) {
            return terminado(null, user[0]);
        } else {
            return terminado(null, false, { message: 'Contraseña incorrecta' })
        }
    }

}));
passport.serializeUser((usuario, terminado) => {
    terminado(null, usuario.usuario_id);
});
passport.deserializeUser( async (usuario_id, terminado) => {
    const rows = await pool.query('SELECT * FROM usuarios WHERE usuario_id = ?', [usuario_id]);
    terminado(null, rows[0])
});

