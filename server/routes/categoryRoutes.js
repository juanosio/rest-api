const { Router } = require("express")
const router = Router();
const Category = require("../models/Category");
let { tokenVerify, adminRolVerify } = require("../middlewares/autentication")

//Index
router.get("/categoria", tokenVerify, (req, res) => {
    Category.find()
    .populate("user", "name")
        .then( categories => {
            Category.countDocuments((error, cantidadCategorias) => {
                res.status(200).json({
                    ok: true, 
                    length: cantidadCategorias,
                    categories
                })
            })
        })
        .catch( error => {
            res.status(500).json({
                ok: false,
                error
            })
        })
})

//Show
router.get("/categoria/:id", tokenVerify, (req, res) => {
    
    let id = req.params.id
    
    Category.findById(id, (error, category) => {

        if(error) {
            return res.status(500).json({
                ok: false,
                error
            })
        }

        res.status(200).json({
            ok: true, 
            category
        })

    })
})

//Store
router.post("/categoria", tokenVerify, (req, res) => {
    const { description } = req.body
    //Obtengo datos del usuario desde el tokenVerify
    //Ya que el maneja la "sesion"
    const idUser = req.user._id
    
    const newCategory = new Category({
        description,
        user: idUser
    })

    newCategory.save((error, categoryCreated) => {
        if(error) {
            return res.status(500).json({
                ok: false,
                error
            })
        }

        res.status(200).json({
            ok: true, 
            categoryCreated
        })
    })
})

//Actualizar
router.put("/categoria/:id", tokenVerify, (req, res) => {
    const id = req.params.id 
    const { description } = req.body

    const updateOptions = {
		new: true,
	  	runValidators: true,
	  	context: 'query'
	};
     
    Category.findOneAndUpdate({_id: id}, {description}, updateOptions, (error, categoryUpdated) => {
        if(error) {
            return res.status(500).json({
                ok: false,
                error
            })
        }

        res.status(200).json({
            ok: true, 
            categoryUpdated
        })
    })
})

//Eliminar
router.delete("/categoria/:id", [tokenVerify, adminRolVerify], (req, res) => {
    
    let id = req.params.id
    
    Category.findByIdAndRemove(id, (error, categoryDeleted) => {
        if(error) {
            return res.status(500).json({
                ok: false,
                error
            })
        }

        res.status(200).json({
            ok: true, 
            categoryDeleted
        })
    })
})

module.exports = router;