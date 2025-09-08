import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

// Arreglo interno para guardar alumnos
let alumnos = [];

// Función para validar alumnos
const existeAlumno = (nombre) => {
  return alumnos.some(a => a.nombre.toLowerCase() === nombre.toLowerCase());
};

// Función para calcular promedio y condicion
const calcularDatos = (notas) => {
  const promedio = notas.reduce((acc, n) => acc + n, 0) / notas.length;
  let condicion = "";
  if (promedio < 6) condicion = "reprobado";
  else if (promedio < 8) condicion = "aprobado"; // 6 o 7
  else condicion = "promocionado"; // 8 o más
  return { promedio, condicion };
};


// Crear alumno
app.post("/alumnos", (req, res) => {
  const { nombre, notas } = req.body;

  // Validaciones
  if (!nombre || !Array.isArray(notas) || notas.length !== 3) {
    return res.status(400).json({ error: "Debes enviar nombre y un array con 3 notas." });
  }
  if (existeAlumno(nombre)) {
    return res.status(400).json({ error: "Ya existe un alumno con ese nombre." });
  }

  alumnos.push({ nombre, notas });
  res.status(201).json({ mensaje: "Alumno agregado correctamente." });
});

// Listar los alumnos
app.get("/alumnos", (req, res) => {
  const resultado = alumnos.map(a => {
    const { promedio, condicion } = calcularDatos(a.notas);
    return { ...a, promedio, condicion };
  });
  res.json(resultado);
});

// Consultar un alumno por el nombre
app.get("/alumnos/:nombre", (req, res) => {
  const { nombre } = req.params;
  const alumno = alumnos.find(a => a.nombre.toLowerCase() === nombre.toLowerCase());
  if (!alumno) {
    return res.status(404).json({ error: "Alumno no encontrado." });
  }
  const { promedio, condicion } = calcularDatos(alumno.notas);
  res.json({ ...alumno, promedio, condicion });
});

// Modificar alumno
app.put("/alumnos/:nombre", (req, res) => {
  const { nombre } = req.params;
  const { nuevoNombre, notas } = req.body;

  const alumno = alumnos.find(a => a.nombre.toLowerCase() === nombre.toLowerCase());
  if (!alumno) {
    return res.status(404).json({ error: "Alumno no encontrado." });
  }

  // verificar que no exista duplicado al cambiar el nombre
  if (nuevoNombre && nuevoNombre.toLowerCase() !== nombre.toLowerCase() && existeAlumno(nuevoNombre)) {
    return res.status(400).json({ error: "Ya existe otro alumno con ese nombre." });
  }

  if (nuevoNombre) alumno.nombre = nuevoNombre;
  if (Array.isArray(notas) && notas.length === 3) alumno.notas = notas;

  res.json({ mensaje: "Alumno modificado correctamente." });
});

// Eliminar alumno
app.delete("/alumnos/:nombre", (req, res) => {
  const { nombre } = req.params;
  const indice = alumnos.findIndex(a => a.nombre.toLowerCase() === nombre.toLowerCase());
  if (indice === -1) {
    return res.status(404).json({ error: "Alumno no encontrado." });
  }
  alumnos.splice(indice, 1);
  res.json({ mensaje: "Alumno eliminado correctamente." });
});

// -------------------------------------------------

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
