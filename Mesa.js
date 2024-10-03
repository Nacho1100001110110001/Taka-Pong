class Mesa {
    constructor(id, nombre, tipo, accesorios, horario) {
        this.id = id;
        this.nombre = nombre;
        this.tipo = tipo;
        this.accesorios = accesorios;
        this.horario = JSON.parse(JSON.stringify(horario));
    }
}

module.exports = Mesa;