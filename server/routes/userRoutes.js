const express = require("express");

const app = express()

const User = require("../models/User.js");

app.get("/usuarios", function (req, res) {
	res.json({
		nombre: "Juan",
		edad: 22,
	});
});

app.post("/usuarios", function (req, res) {
	const {
		name, 
		email, 
		password, 
		role } = req.body;

	let user = new User({
		name, 
		email,
		password,
		role
	})

	user.save((error, userDB) => {
		if(error){
			return res.status(400).json({
				ok: false,
				error
			})
		}

		return res.json({
			ok: true,
			usuario: userDB
		})
	})

	// console.log(data);
	// if (data.nombre === undefined) {
	// 	res.status(400).json({
	// 		ok: false,
	// 		mensaje: "El parametro nombre es obligatorio",
	// 	});
	// } else {
	// 	res.json({ persona: data });
	// }
});

app.put("/usuarios/:id", function (req, res) {
	const id = req.params.id;
	res.json("El usuario " + id + " a sido actualizado");
});

app.delete("/usuarios/:id", function (req, res) {
	const id = req.params.id;
	res.json("El usuario " + id + " a sido eliminado");
});

module.exports = app