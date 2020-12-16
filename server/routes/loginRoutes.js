const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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


async function verifyGoogleToken(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIEND_ID,  
  });

  const payload = ticket.getPayload();

  return {
	  name: payload.name,
	  email: payload.email,
	  img: payload.picture,
	  google: true
  }

}



app.post("/google", async (req, res) => {

	const token = req.body.idToken

	const googleUser = await verifyGoogleToken(token)

	User.findOne( {email: googleUser.email}, (error, usuarioDB) => {
		if(error){
			return res.status(500).json({
				ok: false,
				error
			})
		}

		if( usuarioDB ) {
			
			if( usuarioDB.google === false ) {
				return res.status(400).json({
					ok: false,
					error: "Este correo no se puede autenticar con la cuenta de google, por que ya ha sido registrado"
				})
			} else {

				let token = jwt.sign({
					user: usuarioDB
				}, process.env.SEED_TOKEN, { expiresIn: process.env.EXPIRE_TOKEN } )
		
				return res.json({
					ok: true,
					usuario: usuarioDB,
					token
				})
			}
		}

		//Si el usuario no existe en nuestra base de datos
		let newUser = new User({
			name: googleUser.name,
			email: googleUser.email,
			img: googleUser.img,
			password: ":)",
			google: true
		})

		newUser.save((error, usuarioDB) => {
			if(error){
				return res.status(500).json({
					ok: false,
					error
				})
			}

			let token = jwt.sign({
				user: usuarioDB
			}, process.env.SEED_TOKEN, { expiresIn: process.env.EXPIRE_TOKEN } )
	
			return res.json({
				ok: true,
				usuario: usuarioDB,
				token
			})

		})
	})
})


module.exports = app