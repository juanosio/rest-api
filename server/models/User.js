const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let allowedRoles = {
	values: ["ADMIN_ROLE", "USER_ROLE"],
	message: "{VALUE} no es un rol válido"
}

let userSchema = new Schema({
	name: {
		type: String,
		required: [true, "El nombre del usuario es obligatorio"]
	},
	email: {
		type: String,
		unique: true,
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
		enum: allowedRoles,
		default: "USER_ROLE"
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

userSchema.plugin(uniqueValidator, { message: '{PATH} ya está siendo utilizado'});


module.exports = mongoose.model( "Usuario", userSchema)