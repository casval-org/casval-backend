const APIError = require("../utils/errors");
const multer = require('multer')

const upload = multer({ 
	storage: multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, './public/uploads/avatars/')
		},
		filename: function (req, file, cb) {
			cb(null, req.userId + Math.floor(Math.random() * 101) + '.' + file.mimetype.split("/")[1])
		}
	}),
	fileFilter: (req, file, cb) => {
    const allowed = ["image/jpg", "image/gif", "image/jpeg", "image/png"]

    if (! allowed.includes(file.mimetype)) {
			cb(new Error("Unsupported mime type!"), false)
    }

    cb(null, true)
	}
})

const uploadAvatar = (req, res, next) => {

  upload.single('avatar')(req, res, function (err) {
    
    if (err) {
      req.uploadError = err ? true : false;
      req.uploadErrorMessage = err ? err.message : '';
    }

    next();
  });  
}

module.exports = {
  uploadAvatar
}