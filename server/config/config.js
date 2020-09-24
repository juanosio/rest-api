//--------------------------------------
//                PUERTO
//--------------------------------------

process.env.PORT = process.env.PORT || 3000;


//--------------------------------------
//              ENTORNO
//--------------------------------------
process.env.NODE_ENV = process.env.NODE_ENV || "dev"

//--------------------------------------
//            BASE DE DATOS
//--------------------------------------
let urlDB;

if(process.env.NODE_ENV === "dev") {
	urlDB = 'mongodb://localhost:27017/coffe'
} else {
	urlDB = 'mongodb+srv://juanosio:coffee-rest@coffee-rest.s2mld.mongodb.net/coffee-rest?retryWrites=true&w=majority'
}

process.env.URLDB = urlDB