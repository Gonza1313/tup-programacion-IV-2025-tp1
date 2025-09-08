import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

// Arreglo interno para guardar las tareas
let tareas = [];

// Funcion para verificar si ya existe una tarea con ese nombre
const existeTarea = (nombre) => {
  return tareas.some(t => t.nombre.toLowerCase() === nombre.toLowerCase());
};


// Crear tarea
app.post("/tareas", (req, res) => {
  const { nombre, completada } = req.body;

  if (!nombre || typeof completada !== "boolean") {
    return res.status(400).json({ error: "Debes enviar nombre y estado (true/false)." });
  }
  if (existeTarea(nombre)) {
    return res.status(400).json({ error: "Ya existe una tarea con ese nombre." });
  }

  tareas.push({ nombre, completada });
  res.status(201).json({ mensaje: "Tarea creada correctamente." });
});

// Listar todas las tareas (con un filtro)
app.get("/tareas", (req, res) => {
  const { estado } = req.query;

  let resultado = tareas;

  if (estado !== undefined) {
    if (estado === "true") {
      resultado = tareas.filter(t => t.completada === true);
    } else if (estado === "false") {
      resultado = tareas.filter(t => t.completada === false);
    } else {
      return res.status(400).json({ error: "El filtro 'estado' debe ser true o false." });
    }
  }

  res.json(resultado);
});

// Consultar tarea por nombre
app.get("/tareas/:nombre", (req, res) => {
  const { nombre } = req.params;
  const tarea = tareas.find(t => t.nombre.toLowerCase() === nombre.toLowerCase());
  if (!tarea) {
    return res.status(404).json({ error: "Tarea no encontrada." });
  }
  res.json(tarea);
});

// Modificar tarea 
app.put("/tareas/:nombre", (req, res) => {
  const { nombre } = req.params;
  const { nuevoNombre, completada } = req.body;

  const tarea = tareas.find(t => t.nombre.toLowerCase() === nombre.toLowerCase());
  if (!tarea) {
    return res.status(404).json({ error: "Tarea no encontrada." });
  }

  // verificar duplicado si se cambia el nombre
  if (nuevoNombre && nuevoNombre.toLowerCase() !== nombre.toLowerCase() && existeTarea(nuevoNombre)) {
    return res.status(400).json({ error: "Ya existe otra tarea con ese nombre." });
  }

  if (nuevoNombre) tarea.nombre = nuevoNombre;
  if (typeof completada === "boolean") tarea.completada = completada;

  res.json({ mensaje: "Tarea modificada correctamente." });
});

// Eliminar tarea
app.delete("/tareas/:nombre", (req, res) => {
  const { nombre } = req.params;
  const indice = tareas.findIndex(t => t.nombre.toLowerCase() === nombre.toLowerCase());
  if (indice === -1) {
    return res.status(404).json({ error: "Tarea no encontrada." });
  }
  tareas.splice(indice, 1);
  res.json({ mensaje: "Tarea eliminada correctamente." });
});


app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
