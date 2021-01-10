const { Router } = require("express");
const fileUpload = require('express-fileupload');
const User = require("../models/User");
const Product = require("../models/Product");
const router = Router();
let { tokenImgVerify } = require("../middlewares/autentication")

const fs = require("fs")
const path = require("path")

router.use(fileUpload());

function isPathValid(path) {
    let validPaths = ["usuario", "producto"]

    return validPaths.indexOf(path) < 0 ? false : true

}

function isFormatValid(formatFile) {
    let validFormat = ["jpeg", "jpg", "png"]

    return validFormat.indexOf(formatFile) < 0 ? false : true

}

function deletePreviusFile(fileName, pathFolder) {
    let pathImg = path.resolve(__dirname, `../../uploads/${pathFolder}/${fileName}`)

    if(fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg)
    }
}

function changeUserImg(userID, pathImg, res){

    User.findById(userID, (error, userDB) => {
        
        //Si hay un error
        if(error) {
            deletePreviusFile(pathImg, "usuario")
            return res.status(400).json({ ok: false, error });
        }

        //Si no encuentra al usuario
        if(!userDB) {
            deletePreviusFile(pathImg, "usuario")
            return res.status(400).json({ok: false, error: "El usuario no se ha encontrado"});
        }

        deletePreviusFile(userDB.img, "usuario")

        userDB.img = pathImg;
        userDB.save((error, userSaved) => {
            //Si hay un error
            if(error) {
                return res.status(400).json({ ok: false, error });
            }

            return res.status(200).json({
                ok: true, 
                user: userSaved
            });
        })

    });
    


}

function changeProductImg(productID, pathImg, res){

    Product.findById(productID, (error, productDB) => {
        
        //Si hay un error
        if(error) {
            deletePreviusFile(pathImg, "producto")
            return res.status(400).json({ ok: false, error });
        }

        //Si no encuentra al producto
        if(!productDB) {
            deletePreviusFile(pathImg, "producto")
            return res.status(400).json({ok: false, error: "El producto no se ha encontrado"});
        }

        deletePreviusFile(productDB.img, "producto")

        productDB.img = pathImg;
        productDB.save((error, productSaved) => {
            //Si hay un error
            if(error) {
                return res.status(400).json({ ok: false, error });
            }

            return res.status(200).json({
                ok: true, 
                product: productSaved
            });
        })
    });

}


router.put("/subir/:path/:id", (req, res) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let id = req.params.id
    let pathDirection = req.params.path
    let fileImg = req.files.fileImg;
    let [_, formatFile] = fileImg.mimetype.split("/")
    
    //Validaciones
    if(!isPathValid(pathDirection)) {
        return res.status(400).json({ok: false, error: "El path que envías no es válido"});
    }

    if(!isFormatValid(formatFile)) {
        return res.status(400).json({ok: false, error: "Este tipo de archivo no esta permitido"});
    }

    //Renombrando y dando el path al archivo
    let newFileName = `${id}-${new Date().getMilliseconds()}.${formatFile}`
  
    //Mover el archivo
    fileImg.mv(path.resolve(__dirname, `../../uploads/${pathDirection}/${newFileName}`), (error) => {
        
        if (error)
            return res.status(500).json({
                ok: false, error
        });

        if(pathDirection === "usuario") {
            changeUserImg(id, newFileName, res)
        } else {
            changeProductImg(id, newFileName, res)
        }

    });
})

router.get("/view/:path/:img", tokenImgVerify, (req, res) => {

    let pathDirection = req.params.path
    let fileName = req.params.img

    //Validaciones
    if(!isPathValid(pathDirection)) {
        return res.status(400).json({ok: false, error: "El path que envías no es válido"});
    }

    let pathImg = path.resolve(__dirname, `../../uploads/${pathDirection}/${fileName}`)

    if( fs.existsSync(pathImg) ) {
        res.sendFile(pathImg)
    } else {
        res.sendFile(path.resolve(__dirname, "../assets/no-image.jpg"))
    }

})



module.exports = router