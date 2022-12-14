const auxiliar = {};

auxiliar.estaAutenticado = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('mensajeError', 'No has iniciado sesion')
    res.redirect('/usuarios/iniciar')
}
auxiliar.noEstaAutenticado = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    req.flash('mensajeError', 'Ya tienes una sesion iniciada')
    res.redirect('/juegos')
}

auxiliar.esAdmin = (req, res, next) => {
    if (req.user.es_admin) {
        return next();
    }
    req.flash('mensajeError', 'No esta autorizado')
    res.redirect('/juegos')
}



module.exports = auxiliar;
