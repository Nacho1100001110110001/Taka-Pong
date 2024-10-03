class Usuario {
    constructor(id, nombre, correo, contrasena, rol) {
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.contrasena = contrasena;
        this.rol = rol;
    }
}

module.exports = Usuario;