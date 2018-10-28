const express = require('express');
const { Client } = require('pg')
const app = express();

// Preparando tipo de entorno
process.env.NODE_ENV = 'development';

// config variables
const config = require('./config/config.js');

// Creando conexion
const connectionData = global.gConfig.database;

//ruta get
app.get('/', (req, res) => {
    res.json(global.gConfig);
});

//Mostrando en consola por que puerto esta escuchando
app.listen(global.gConfig.node_port, () => {
    console.log(`${global.gConfig.app_name} escuchando por el puerto ${global.gConfig.node_port}`);
});

//Prueba rapida para el funcionamiento de la modulo PG
app.get('/GetEmpleados', function(req, res) {
  const client = new Client(connectionData)
  client.connect();  
  client.query('SELECT * FROM empleados')
      .then(response => {
          console.log(response.rows)          
          this.client.end()
          res.json(response.rows);
      })
      .catch(err => {
          client.end()
      })
 });
