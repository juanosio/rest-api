//==========================
//    AUTENTICAR TOKEN
//==========================

const jwt = require('jsonwebtoken');

const tokenVerify = (req, res, next) => {

	//Obtener valor de los Headers
	let token = req.get('token');

	jwt.verify(token, process.env.SEED_TOKEN, (error, decoded) => {

		if(error) {
			return res.status(401).json({
				ok: false,
				error
			})
		}

		req.user = decoded.user;
	
		next();
	})

}

//==========================
//   VERIFICA ADMIN ROL
//==========================
const adminRolVerify = (req,res, next) => {
	let {role} = req.user

	if(role != "ADMIN_ROLE"){
		return res.status(403).json({
			ok: false,
			error: "Este usuario no tiene los permisos necesarios"
		})
	}

	next();
}


//=========================================
//   VERIFICA EL TOKEN DE UNA IMAGEN
//=========================================
const tokenImgVerify = (req,res, next) => {

	let token = req.query.token;

	jwt.verify(token, process.env.SEED_TOKEN, (error, decoded) => {

		if(error) {
			return res.status(401).json({
				ok: false,
				error
			})
		}

		req.user = decoded.user;
	
		next();
	})

}
module.exports = {
	tokenVerify,
	adminRolVerify,
	tokenImgVerify
}