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

app.listen(port, ()=>{
    console.log(`Server on port ${port}`);
});

// Endpoint para listar mesas
app.get("/mesas", (req, res)=>{
    res.json(mesas);
});

// Endpoint para obtener la información de una mesa según su id
app.get("/mesa/:id", (req, res)=>{
    let id = req.params.id;
    let mesa = mesas.find(mesa => mesa.id == id);
    if(!mesa){
        res.status(404).json("Mesa no encontrada");
    }else{
        res.status(200).json(mesa);
    }
});

// Endpoint para crear usuario
app.post('/crearusuario', (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  if(usuarios.find(usuario => usuario.correo.toLowerCase() == correo.toLowerCase())){
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
  res.status(201).json({ mensaje: 'Usuario creado exitosamente', usuario: nuevoUsuario });
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
    res.status(201).json({ mensaje: 'Mesa creada exitosamente', mesa: nuevaMesa});
  });