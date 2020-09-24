const express = require("express");

const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express()

const User = require("../models/User.js");

app.get("/usuarios", function (req, res) {

	let from = Number(req.query.desde) || 0;
	let limit = Number(req.query.limite) || 5;


	User.find({ state: false }, "name email state google role img")
	.limit(limit)
	.skip(from)
		.exec((error, users) => {
			if(error){
				return res.status(400).json({
					ok: false,
					error
				})
			}

			User.countDocuments({ state: false }, (err, conteo) => {
				res.json({
				ok: true,
				length: conteo,
				usuarios: users
			});
			})

			

		})

	
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
		password: bcrypt.hashSync(password, 10),
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
});

app.put("/usuarios/:id", function (req, res) {
	const id = req.params.id;

	const data = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);

	//Para validar que el usuario no pueda alterar la contraseña o altere si su cuente fue hecha con google podriamos hacer algo tipo:
	// delete data.google
	// delete data.password
	//O podemos usar underscore

	const updateOptions = {
		new: true,
	  	runValidators: true,
	  	context: 'query'
	};

	User.findByIdAndUpdate(id, data, updateOptions, (error, userDB) => {

		if(error){
			return res.status(400).json({
				ok: false,
				error
			})
		}

		res.json({
			ok: true,
			usuario: userDB
		})

	})

});

app.delete("/usuarios/:id", function (req, res) {
	const id = req.params.id;
	
	const updateOptions = {
		new: true,
	  	context: 'query'
	};

	const state = { state: true }
	
	// Esto elimina un usuario de la base de datos
	// User.findByIdAndRemove(id, (error, userDeleted) => {
	User.findByIdAndUpdate(id, state, updateOptions, (error, userDeleted) => {
		if(error){
			return res.status(400).json({
				ok: false,
				error
			})
		}

		if(!userDeleted) {
			return res.status(400).json({
				ok: false,
				error: {
					message: "Usuario no encontrado"
				}
			})
		}

		res.json({
			ok: true,
			usuario: userDeleted
		})


	})

	

});

module.exports = app