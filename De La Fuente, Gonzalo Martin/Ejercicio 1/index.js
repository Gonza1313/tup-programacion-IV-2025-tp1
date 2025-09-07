import express from "express";

const app = express();
app.use(express.json());

// arreglo en memoria para guardar cálculos
let calculos = [];

/**
 * Crea un calculo de rectangulo/cuadrado
 */
app.post("/rectangulos", (req, res) => {
  const { base, altura } = req.body;

  // validaciones
  if (!base || !altura || base <= 0 || altura <= 0) {
    return res.status(400).json({ error: "Base y altura deben ser mayores que 0" });
  }

  const perimetro = 2 * (base + altura);
  const superficie = base * altura;

  // guardamos en el arreglo SIN el tipo
  calculos.push({ base, altura, perimetro, superficie });

  res.status(201).json({ mensaje: "Cálculo guardado con éxito" });
});

/**
 * Devuelve todos los calculos agregando el tipo (rectangulo o cuadrado)
 */
app.get("/rectangulos", (req, res) => {
  const resultados = calculos.map(c => ({
    ...c,
    tipo: c.base === c.altura ? "cuadrado" : "rectángulo"
  }));

  res.json(resultados);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
