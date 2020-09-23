const mongoose = require("mongoose")

let Schema = mongoose.Schema;

let userSchema = new Schema({
	name: {
		type: String,
		required: [true, "El nombre del usuario es obligatorio"]
	},
	email: {
		type: String,
		required: [true, "El correo es obligatorio"]
	},
	password: {
		type: String,
		required: [true, "La contraseña es obligatoria"]
	},
	img: {
		type: String
	},
	role: {
		type: String,
		default: "USER_ROL"
	}, 
	state: {
		type: Boolean,
		default: true
	},
	google: {
		type: Boolean,
		default: false
	}
})

module.exports = mongoose.model( "Usuario", userSchema)