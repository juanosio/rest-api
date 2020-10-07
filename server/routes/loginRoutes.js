const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require("../models/User.js");

const app = express()

app.post("/login", function (req, res) {

	const { email, password } = req.body;

	User.findOne({email}, (error, userDB) => {

		if(error){
			return res.status(500).json({
				ok: false,
				error
			})
		}

		if(!userDB){
			return res.status(404).json({
				ok: false,
				error: {
					message: "Usuario o contraseña incorrectos"
				}
			})
		}

		if(!bcrypt.compareSync(password, userDB.password) ){
			return res.status(400).json({
				ok: false,
				error: {
					message: "Usuario o contraseña incorrectos"
				}
			})
		}

		let token = jwt.sign({
			user: userDB
		}, process.env.SEED_TOKEN, { expiresIn: process.env.EXPIRE_TOKEN } )


		res.status(200).json({
			ok: true,
			token,
			usuario: userDB, 
		})

	})



	res.status(500).json

})


module.exports = app