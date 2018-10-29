const express = require('express');
var validator = require('validator');
var bodyParser = require('body-parser');

const { Client } = require('pg')
const app = express();

// Preparando tipo de entorno
process.env.NODE_ENV = 'development';

// config variables
const config = require('./config/config.js');

// Creando conexion
const connectionData = global.gConfig.database;

// Se usa bodyParser
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

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
          client.end()
          res.json(response.rows);
      })
      .catch(err => {
          client.end()
      })
 });

// Funcion post que registrara a un empleado en la BD
app.post('/PostEmpleado', function (req, res) {
    var numEmpl = req.body.numeroempleado;
    var nom = req.body.nombre;
    var rol = req.body.rol;
    var tipo = req.body.tipo

    var resp = {
        status: 0,
        message: ""
    };

    // validando los campos que trae la peticion
    if(!validator.isInt(numEmpl)){
        resp.status = -1;
        resp.message = "El numero de empleado no es valido";
        res.json(resp);
    }
    else if(!validator.isAlpha(nom, ['es-ES'])){
        resp.status = -1;
        resp.message = "El nombre del empleado no es valido";
        res.json(resp);
    }
    else if(!validator.isInt(rol)){
        resp.status = -1;
        resp.message = "El rol no es valido";
        res.json(resp);
    }
    else if(!validator.isInt(tipo)){
        resp.status = -1;
        resp.message = "El tipo no es valido";
        res.json(resp);
    }
    else{
        // si todo es correcto se conectara a la bd y se ejecutara la funcion
        const client = new Client(connectionData)        
        client.connect();
        client.query("SELECT fnregistrarempleado FROM fnRegistrarEmpleado(" + numEmpl + ",'" + nom + "'," + rol + "," + tipo +")")
            .then(response => {
                if(response.rows[0].fnregistrarempleado === 2){
                    resp.status = -1;
                    resp.message = "El numero de empleado: " + numEmpl + " Ya se encuentra registrado";
                }
                else if(response.rows[0].fnregistrarempleado === 1){
                    resp.status = 1;
                    resp.message = "El empleado: " + nom + " Se registro correctamente";
                }
                else{                    
                    resp.status = -1;
                    resp.message = "Ocurrio un error al Registrar al Empleado";                    
                }
                client.end()
                res.json(resp);
            })
            .catch(err => {                
                resp.status = -2;
                resp.message = "Ocurrio un error al Registrar al empleado";                
                client.end()
                res.json(resp);
            });    
    }   
});

// Funcion post que modificara a un empleado en la BD
app.put('/PutEmpleado', function (req, res) {
    var numEmpl = req.body.numeroempleado;
    var nom = req.body.nombre;
    var rol = req.body.rol;
    var tipo = req.body.tipo

    var resp = {
        status: 0,
        message: ""
    };
    
    // validando los campos que trae la peticion
    if(!validator.isInt(numEmpl)){
        resp.status = -1;
        resp.message = "El numero de empleado no es valido";
        res.json(resp);
    }
    else if(!validator.isAlpha(nom, ['es-ES'])){
        resp.status = -1;
        resp.message = "El nombre del empleado no es valido";
        res.json(resp);
    }
    else if(!validator.isInt(rol)){
        resp.status = -1;
        resp.message = "El rol no es valido";
        res.json(resp);
    }
    else if(!validator.isInt(tipo)){
        resp.status = -1;
        resp.message = "El tipo no es valido";
        res.json(resp);
    }
    else{
        // si todo es correcto se conectara a la bd y se ejecutara la funcion
        const client = new Client(connectionData)        
        client.connect();        
        client.query("SELECT fnmodificarempleado FROM fnModificarEmpleado(" + numEmpl + ",'" + nom + "'," + rol + "," + tipo +")")
            .then(response => {
                if(response.rows[0].fnmodificarempleado === 1){
                    resp.status = 1;
                    resp.message = "El empleado: " + nom + " Se modifico correctamente";
                }
                else{                    
                    resp.status = -1;
                    resp.message = "Ocurrio un error al Modificar al Empleado";                    
                }
                client.end()
                res.json(resp);
            })
            .catch(err => {                
                resp.status = -2;
                resp.message = "Ocurrio un error al Modificar el empleado";                
                client.end()
                res.json(resp);
            });    
    }
});

// Funcion post que eliminara/activara a un empleado en la BD
app.delete('/DeleteEmpleado', function (req, res) {
    var numEmpl = req.body.numeroempleado;
    var activo = req.body.activo;
    var resp = {
        status: 0,
        message: ""
    };

    // validando los campos que trae la peticion
    if(!validator.isInt(numEmpl)){
        resp.status = -1;
        resp.message = "El numero de empleado no es valido";
        res.json(resp);
    }
    else if(!validator.isBoolean(activo)){
        resp.status = -1;
        resp.message = "El campo activo no es un boleano";
        res.json(resp);
    }
    else{
        // si todo es correcto se conectara a la bd y se ejecutara la funcion
        const client = new Client(connectionData)        
        client.connect();        
        client.query("SELECT fneliminar_activarempleado FROM fnEliminar_ActivarEmpleado(" + numEmpl + ","+  activo +")")
            .then(response => {                
                if(response.rows[0].fneliminar_activarempleado === 1){
                    resp.status = 1;
                    if(activo === 'true')                                   
                        resp.message = "El numero de empleado: " + numEmpl + " Se Activo correctamente";
                    else
                        resp.message = "El numero de empleado: " + numEmpl + " Se Elimino correctamente";
                }
                else{                    
                    resp.status = -1;
                    if(activo === true)
                        resp.message = "Ocurrio un error al Activar al Empleado";
                    else
                        resp.message = "Ocurrio un error al Eliminar al Empleado";
                }
                client.end()
                res.json(resp);
            })
            .catch(err => {
                resp.status = -2;
                resp.message = "Ocurrio un error al Modificar el empleado";                
                client.end()
                res.json(resp);
            });    
    }
});

