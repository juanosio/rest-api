require("./config/config.js");
const express = require("express");
const mongoose = require('mongoose');

const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Rutas de usuarios
app.use(require("./routes/userRoutes.js"));

//DB conection
mongoose.connect("mongodb+srv://juanCoffeRestApi:26715734@cluster0.ln04s.mongodb.net/coffe-rest-api?retryWrites=true&w=majority", {
	useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}, (error, res) => {

	if(error) throw new Error("Ocurrio un problema")

	console.log("Conexión establecida")
});

app.listen(process.env.PORT, () =>
	console.log(`Proyecto inicializado en el puerto ${process.env.PORT}`)
);
