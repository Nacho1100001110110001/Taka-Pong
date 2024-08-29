class Usuario{
    constructor(id, nombre, correo, contraseña, rol){
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.contraseña = contraseña;
        this.rol = rol;
    }
}

module.exports = Usuario;