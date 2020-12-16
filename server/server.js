require("./config/config.js");
const express = require("express");
const mongoose = require('mongoose');
const path = require("path")

const app = express();
const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

//Rutas de usuarios
app.use(require("./routes/index.js"));

app.use(express.static(path.join(__dirname, "../public")))

//DB conection
mongoose.connect(process.env.URLDB, {
	useCreateIndex: true,
  	useNewUrlParser: true,
  	useUnifiedTopology: true,
  	useFindAndModify: false
}, (error, res) => {

	if(error) throw new Error("Ocurrio un problema")

	console.log("Conexión establecida: " + process.env.URLDB)
});

app.listen(process.env.PORT, () =>
	console.log(`Proyecto inicializado en el puerto ${process.env.PORT}`)
);
