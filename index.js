const express = require("express");
const mysql = require("mysql2");
const app = express();


const pool = mysql.createPool({
  host: "gym-admin-db.mysql.database.azure.com",
  user: "gym_admin1",
  password: "Administrador_1",
  database: "gym_admin_db",
  port: 3306,
  connectionLimit: 10,
});


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", function(req,res){
    res.render("layout");
});

app.get("/principal", function(req,res){
  const sql= "SELECT membresia.id_membresia, clientes.primer_nombre, clientes.primer_apellido, DATE_FORMAT(asistencia.fecha_registro, '%Y-%m-%d') as fecha_registro FROM membresia JOIN clientes ON membresia.id_cliente = clientes.id_cliente JOIN asistencia ON clientes.id_cliente = asistencia.id_cliente";
  pool.query(sql, (error, results) => {
    if(error) {
      console.error(error);
      throw error;
    }
    console.log(results);
    res.render("principal", { Asistencias: results });
  });
})

app.post("/vali", function (req, res) {
  const datos = req.body;
  const usuario = datos.usuario;
  const contrasena = datos.contrasena;

  const sql = 'CALL ValidarUsuario(?, ?)';

  pool.query(sql, [usuario, contrasena], function (error, results) {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al validar usuario.' });
    } else {
      if (results[0].length > 0) {
        res.render("principal"); //, { Asistencias: results }
      } else {
        res.render("mensajeError", { mensaje: 'Usuario y/o contraseña incorrectos' });
      }
    }
  });
});




app.post("/asistencia", function(req,res){
  const datos3 = req.body;
  const cliente =datos3.id_cliente;
  const sql= 'CALL registrar_asistencia(?)';

  pool.query(sql, [cliente], function (error,results){
    if(error){
      console.error(error);
      return res.status(500).json({ error: 'Error al insertar en la base de datos.' });
    }
    console.log("Datos insertados correctamente.")
    res.redirect('principal');
  })
})


app.get("/agregarCl", function(req, res) {
  const sql = "SELECT id_cliente, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, DATE_FORMAT(fecha_nacimiento, '%Y-%m-%d') as fecha_nacimiento, cedula, telefono, sexo FROM clientes WHERE estado = TRUE";
  pool.query(sql, (error, results) => {
    if (error) throw error;
    console.log(results);
    res.render("agregarCl", { Clientes: results });
  });
});


app.post("/agregarC", function (req, res) {
  const dato2 = req.body;
  const { primerNombre, segundoNombre, primerApellido, segundoApellido, fechaNacimiento, cedula, telefono, sexo} = dato2;

  const sql= 'CALL insertar_cliente(?,?,?,?,?,?,?,?)';

  pool.query(sql, [primerNombre, segundoNombre, primerApellido, segundoApellido, fechaNacimiento, cedula, telefono, sexo], function (error, results) {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al insertar en la base de datos.' });
    }

    console.log("Datos insertados correctamente.");
    
   
    res.redirect('/agregarCl');
  });
});




app.get("/tipoMembresia", function(req,res){
  res.render("tipoMembresia");
});

app.get("/agreMenbresia", function(req,res){
  res.render("agreMenbresia");
});
app.get("/staff", function(req,res){
  res.render("staff");
});
app.get("/proveedor", function(req,res){
  res.render("proveedor");
});
app.get("/usuario", function(req,res){
  res.render("usuario");
});
app.get("/cargos", function(req,res){
  res.render("cargos");
});
app.get("/productos", function(req,res){
  res.render("productos");
});
app.get("/layout", function(req,res){
  res.render("layout");
});
app.get("/venta", function(req,res){
  res.render("venta");
});
app.get("/compra", function(req,res){
  res.render("compra");
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`La aplicación está escuchando en el puerto ${PORT}`);
});










