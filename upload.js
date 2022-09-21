const path = require('path')
const multer = require('multer')

var storage = multer.diskStorage({
    distination: function(req,file,cb){
        cb(null, 'uploads/')
    },
    filename: function(req,file,cb){
        let ext = path.extreme(file.originalname)
        cb(null,Date.now() +ext)
    }
})

var upload = multer ({
    storage : storage,
    fileFilter: function(req,file,callback){
        if(
            file.mimetype == "image/png" || file.mimetype == "image/jpeg"
        ){
            callback(null,true)
        }else{
            console.log("Only JPG or PNG")
            callback(null, false)
        }
    },
    limits:{
        fileSize: 1024 *1024 * 2
    }
})

module.exports = upload