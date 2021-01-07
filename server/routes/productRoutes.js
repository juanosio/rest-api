const { Router } = require("express")
const router = Router()
const Product = require("../models/Product")
const _ = require('underscore');
let { tokenVerify, adminRolVerify } = require("../middlewares/autentication")

//Index
router.get("/productos", tokenVerify, (req, res) => {

    let from = Number(req.query.desde) || 0;

    Product.find({state: true})
        .populate("category", "description")
        .populate("user", "name")
        .limit(5)
        .skip(from)
            .then(products => {

                Product.countDocuments({ state: true }, (err, conteo) => {
                    res.json({
                        ok: true,
                        length: conteo,
                        products
                    });
                })	

            })
            .catch(error => {
                res.status(500).json({
                    ok: false,
                    error
                })
            })
})

//Show
router.get("/productos/:id", tokenVerify, (req, res) => { 

    let id = req.params.id
    
    Product.findById(id)
        .populate("category", "description")
        .populate("user", "name")
            .then(product => {

                    res.json({
                        ok: true,
                        product
                    });     	

            })
            .catch(error => {
                res.status(500).json({
                    ok: false,
                    error
                })
            })
})


//Search
router.get("/productos/buscar/:termino", tokenVerify, (req, res) => { 

    let wordToSearch = req.params.termino;
    
    //Buscar mucho más flexible
    let regex = new RegExp(wordToSearch, "i");

    Product.find({name: regex})
        .populate("category", "description")
        .populate("user", "name")
            .then(product => {

                if(!product) {
                    return res.status(500).json({ok: false, error: "No existen almuerzos con este nombre"})
                }

                res.status(200).json({
                    ok: true,
                    product
                });     	

            })
            .catch(error => {
                res.status(500).json({
                    ok: false,
                    error
                })
            })
})


//Store
router.post("/producto", tokenVerify, (req, res) => {
    const { name, priceUni, description, category } = req.body;
    const idUser = req.user._id

    const product = new Product({
        name,
        priceUni,
        description, 
        category,
        user: idUser
    })

    product.save((error, productCreated) => {

        if(error){
            return res.status(500).json({
                ok: false,
                error
            })
        }

        res.status(200).json({
            ok: true,
            product: productCreated
        })
    })

})

//Update
router.put("/producto/:id", tokenVerify, (req, res) => {

    const id = req.params.id
    const data = _.pick(req.body, ['name', 'priceUni', 'description', 'category']);

    const updateOptions = {
		new: true,
	  	runValidators: true,
	  	context: 'query'
    };
    
    Product.findByIdAndUpdate(id, data, updateOptions, (error, productUpdated) => {
        if(error){
            return res.status(500).json({
                ok: false,
                error
            })
        }

        if(!productUpdated) {
			return res.status(400).json({
				ok: false,
				error: "El producto que desea actualizar no se ha encontrado"
			})
		}

        res.status(200).json({
            ok: true,
            product: productUpdated
        })
    })


})

//Delete
router.delete("/producto/:id", [tokenVerify, adminRolVerify] ,(req, res) => {
    
    const id = req.params.id

    const updateOptions = {
		new: true,
	  	context: 'query'
	};

    Product.findByIdAndUpdate(id, {state: false}, updateOptions, (error, productDeleted) => {
        if(error){
            return res.status(500).json({
                ok: false,
                error
            })
        }

        if(!productDeleted) {
			return res.status(400).json({
				ok: false,
				error: "El producto que desea eliminar no se ha encontrado"
			})
		}

        res.status(200).json({
            ok: true,
            product: productDeleted
        })
    })
})

module.exports = router