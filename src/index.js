const app = require('./server')

require('./database');

// Iniciar Servidor
app.listen(app.get('puerto'), () => {
    console.log("Servidor en el puerto ", app.get('puerto'));
});
