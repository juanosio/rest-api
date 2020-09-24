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
	urlDB = 'mongodb+srv://juanCoffeRestApi:coffe@cluster0.ln04s.mongodb.net/coffe-rest-api?retryWrites=true&w=majority'
}

process.env.URLDB = urlDB