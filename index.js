const express = require('express');
const app = express();
const port = 3000;
const Mesa = require("./Mesa");
const Usuario = require("./Usuario");

let mesas = [];
let usuarios = [];

const horario = [];
for (let hora = 8; hora <= 18; hora++) {
  const horaFormateada = `${hora.toString().padStart(2, '0')}:00`;
  horario.push({ hora: horaFormateada, usuario: null });
}

mesa1 = new Mesa(0, "Mesa 1", "Ping-Pong", "2 Paletas, 1 Pelota", horario);
mesa2 = new Mesa(1, "Mesa 2", "Taka-Taka", "1 Pelota", horario);
mesa3 = new Mesa(2, "Mesa 3", "Ping-Pong", "2 Paletas, 1 Pelota", horario);
mesa4 = new Mesa(3, "Mesa 4", "Taka-Taka", "1 Pelota", horario);
mesas.push(mesa1);
mesas.push(mesa2);
mesas.push(mesa3);
mesas.push(mesa4);

app.use(express.json());

app.listen(port, () => {
  console.log(`Server on port ${port}`);
});

// Endpoint para listar mesas
app.get("/mesas", (req, res) => {
  res.json(mesas);
});

// Endpoint para obtener la información de una mesa según su id
app.get("/mesa/:id", (req, res) => {
  let id = req.params.id;
  let mesa = mesas.find(mesa => mesa.id == id);
  if (!mesa) {
    res.status(404).json("Mesa no encontrada");
  } else {
    res.status(200).json(mesa);
  }
});

// Endpoint para crear usuario
app.post('/crearusuario', (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  if (usuarios.find(usuario => usuario.correo.toLowerCase() == correo.toLowerCase())) {
    return res.status(400).json({ error: 'Correo ya registrado' });
  }

  const nuevoUsuario = new Usuario(
    usuarios.length | 0,
    nombre,
    correo,
    contrasena,
    'usuario' // Rol por defecto
  );

  usuarios.push(nuevoUsuario);
  res.status(201).json({ mensaje: 'Usuario creado exitosamente', usuario: nuevoUsuario });
});

// Endpoint para obtener la información de un usuario según su id
app.get('/usuario/:id', (req, res) => {
  let id = req.params.id;
  const usuario = usuarios.find(u => u.id == parseInt(id));

  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  res.json(usuario);
});

// Endpoint para crear mesas
app.post('/crearmesa', (req, res) => {
  const { nombre, tipo, accesorios } = req.body;

  if (!nombre || !tipo || !accesorios) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  const nuevaMesa = new Mesa(
    mesas.length | 0,
    nombre,
    tipo,
    accesorios,
    horario // Rol por defecto
  );

  mesas.push(nuevaMesa);
  res.status(201).json({ mensaje: 'Mesa creada exitosamente', mesa: nuevaMesa });
});



//******************segunda entrega*********************** */

// Endpoint para modificar la información de una mesa según su id (PUT)
app.put('/mesa/:id', (req, res) => {
  const id = req.params.id;
  const { nombre, tipo, accesorios } = req.body;

  let mesa = mesas.find(mesa => mesa.id == id);
  if (!mesa) {
    return res.status(404).json({ error: 'Mesa no encontrada' });
  }

  if (nombre) mesa.nombre = nombre;
  if (tipo) mesa.tipo = tipo;
  if (accesorios) mesa.accesorios = accesorios;

  res.json({ mensaje: 'Mesa modificada exitosamente', mesa });
});

// Endpoint para eliminar una mesa (DELETE)
app.delete('/eliminarmesa/:id', (req, res) => {
  const id = req.params.id;
  const index = mesas.findIndex(mesa => mesa.id == id);

  if (index === 0) {
    return res.status(404).json({ error: 'Mesa no encontrada' });
  }

  mesas.splice(index, 1);
  res.json({ mensaje: 'Mesa eliminada exitosamente' });
});

// Endpoint para reservar una mesa en un horario específico (POST)
app.post('/mesa/:id/reserva/:horario', (req, res) => {
  const { id, horario } = req.params;
  const { usuarioId } = req.body;

  const mesa = mesas.find(mesa => mesa.id == id);
  if (!mesa) {
    return res.status(404).json({ error: 'Mesa no encontrada' });
  }

  const horaReservada = mesa.horario.find(h => h.hora === horario);
  if (!horaReservada) {
    return res.status(404).json({ error: 'Horario no disponible' });
  }
  if (horaReservada.usuario) {
    return res.status(400).json({ error: 'Horario ya reservado' });
  }

  const usuario = usuarios.find(u => u.id == usuarioId);
  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  horaReservada.usuario = usuario;
  res.json({ mensaje: 'Mesa reservada exitosamente', mesa });
});

// Endpoint para modificar la información de un usuario según su id (PUT)
app.put('/usuario/:id', (req, res) => {
  const id = req.params.id;
  const { nombre, correo, contrasena } = req.body;

  let usuario = usuarios.find(u => u.id == id);
  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  // Actualizar solo los campos enviados
  if (nombre) usuario.nombre = nombre;
  if (correo) {
    // Verificar que el correo no esté ya registrado por otro usuario
    if (usuarios.find(u => u.correo.toLowerCase() == correo.toLowerCase() && u.id != id)) {
      return res.status(400).json({ error: 'Correo ya registrado por otro usuario' });
    }
    usuario.correo = correo;
  }
  if (contrasena) usuario.contrasena = contrasena;

  res.json({ mensaje: 'Usuario modificado exitosamente', usuario });
});


// Endpoint para eliminar una reserva en específico, con id de mesa
app.delete('/reserva/:id', (req, res) => {
  const id = req.params.id;
  const reserva = req.body.reserva;
  const mesa = mesas.find(mesa => mesa.id == id);

  console.log(reserva);

  if (!mesa) {
    return res.status(404).json({ error: 'Mesa no encontrada' });
  }

  const reservaEncontrada = mesa.horario.find(horario => horario.hora == reserva.hora && horario.usuario?.id == reserva.usuario?.id);

  if (!reservaEncontrada) {
    return res.status(404).json({ error: 'Reserva no encontrada' });
  }

  reservaEncontrada.usuario = null;

  res.json({ mensaje: 'Reserva eliminada exitosamente', mesa });
});