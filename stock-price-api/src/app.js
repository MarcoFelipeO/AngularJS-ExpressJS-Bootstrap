const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Importar cors

const app = express();
const port = process.env.PORT || 9090;

// Middleware para permitir CORS
app.use(cors()); // Utilizar cors

// Middleware para analizar el cuerpo de la solicitud como JSON
app.use(express.json());

// Cargar datos de los archivos JSON
const symbolsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'symbols.json'), 'utf8'));
const historicalData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'historical.json'), 'utf8'));

// Rutas para obtener información de símbolos
app.get('/api/symbols/', (req, res) => { // ACCIONES TRAE TODAS GET http://localhost:9090/api/symbols/
  res.json(symbolsData.symbolsList);
});

app.get('/api/symbols/:symbol', (req, res) => { // http://localhost:9090/api/symbols/CMCSA TRAER SOLO UN SIMBOLO
  const symbol = req.params.symbol.toUpperCase();
  const symbolData = symbolsData.symbolsList.find(s => s.symbol === symbol);
  if (symbolData) {
    res.json(symbolData);
  } else {
    res.status(404).json({ message: 'Simbolo no encontrado, vuelva a intentar' });
  }
});

// Rutas para obtener información histórica
app.get('/api/historical', (req, res) => { //TRAEMOS INFORMACION HISTORICA DE TODOS LOS SIMBOLOS http://localhost:9090/api/historical 
  res.json(historicalData.historicalStockList);
});

app.get('/api/historical/:symbol', (req, res) => { // http://localhost:9090/api/historical/CMCSA UN SYMBOLO HISTORICO EN ESPECIFICO
  const symbol = req.params.symbol.toUpperCase();
  const historical = historicalData.historicalStockList.find(h => h.symbol === symbol);
  if (historical) {
    res.json(historical);
  } else {
    res.status(404).json({ message: 'Simbolo no encontrado en el historico, vuelva a intentar' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
