exports.mostrarTrabajos = async (req, res, next) => {
    res.render('home', {
        nombrePagina : 'Trabajos Para Desarrolladores',
        tagline: 'Encuentra y Pública Trabajos para Desarrolladores Web',
        barra: true,
        boton: true,
    })
}