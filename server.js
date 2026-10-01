require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err))

// Rutas API
app.use('/api', require('./routes/authRoutes'));
app.use('/api', require('./routes/productRoutes'));
app.use('/api', require('./routes/orderRoutes'));

// Servir archivos estáticos desde la carpeta public/
app.use(express.static('public'));

// Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;