const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const multer = require('multer');
const { v4:uuidv4 } = require('uuid')
const flash = require('connect-flash');
const session = require('express-session');
const mysqlStore = require('express-mysql-session');
const {database} = require('./keys'); 
const passport = require('passport')

// Incializaciones
const app = express();
require('./configuraciones/passport');

//Ajustes
app.set('puerto', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'), 
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./auxiliares/handlebars'),
}));
app.set('view engine', '.hbs');

//Middlewars
app.use(session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: false,
    store: new mysqlStore(database) 
}))
app.use(morgan('dev'));
app.use(flash());
app.use(express.urlencoded({ extended: false }));
const almacenamiento = multer.diskStorage({
    destination: path.join(__dirname, 'public/img/subidas'),
    filename: (req, file, cb, filename) => {
        cb(null, uuidv4() + path.extname(file.originalname))
    }
});
app.use(multer({ storage: almacenamiento }).single('imagen'));
app.use(passport.initialize());
app.use(passport.session());

//Variables Globales
app.use((req, res, next) => {
    res.locals.mensajeExito = req.flash('mensajeExito');
    res.locals.mensajeError = req.flash('mensajeError');
    res.locals.error = req.flash('error');
    res.locals.usuario = req.user || null;
    next();
});
//Rutas
app.use(require('./rutas/index.ruta'));
app.use(require('./rutas/juegos.ruta'));
app.use(require('./rutas/usuarios.ruta'));

//Archivos publicos
app.use(express.static(path.join(__dirname, "public")));


module.exports = app;
