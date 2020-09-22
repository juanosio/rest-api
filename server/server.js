require("./config/config.js");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/usuarios", function (req, res) {
	res.json({
		nombre: "Juan",
		edad: 22,
	});
});

app.post("/usuarios", function (req, res) {
	const data = req.body;

	console.log(data);
	if (data.nombre === undefined) {
		res.status(400).json({
			ok: false,
			mensaje: "El parametro nombre es obligatorio",
		});
	} else {
		res.json({ persona: data });
	}
});

app.put("/usuarios/:id", function (req, res) {
	const id = req.params.id;
	res.json("El usuario " + id + " a sido actualizado");
});

app.delete("/usuarios/:id", function (req, res) {
	const id = req.params.id;
	res.json("El usuario " + id + " a sido eliminado");
});

app.listen(process.env.PORT, () =>
	console.log(`Proyecto inicializado en el puerto ${process.env.PORT}`)
);
