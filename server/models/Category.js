const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let categorySchema = new Schema({
    description: {
        type: String,
        unique: true, 
        required: [true, "La descripción de la categoría es obligatoria"]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "Usuario"
    }
})

module.exports = mongoose.model( "Categoria", categorySchema)