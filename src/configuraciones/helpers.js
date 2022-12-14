const helpers = {};
const bcryptjs = require('bcryptjs');

helpers.encriptarContraseña = async (contrasena) => {
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(contrasena, salt);
};

helpers.compararContraseña = async (contrasena, contrasenaGuardada) => {
    return await bcryptjs.compare(contrasena, contrasenaGuardada);
};

module.exports = helpers
