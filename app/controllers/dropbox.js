var Dropbox = require('dropbox');
var multer = require('multer');
var CTS = require('../utils/constants');
var util = require('../utils/util');
var config = require('../../config/main').get(process.env.NODE_ENV);


exports.upload = function(req, res) {


	var upload = multer().single('file');
	upload(req, res, function(err) {
		var rut = req.body.rut;
		var name = req.body.name;
		var file = req.file;
		if (!rut || !name || !file || !rut.length || !name.length) {
			return util.errorResponse(res, 'MISSING_REQUIRED_FIELDS');
		}

		var image = file.buffer;

		var ext = (req.file.originalname.split(".")[req.file.originalname.split(".").length - 1]).toUpperCase();
		if (CTS.ACCEPTED_EXTENSIONS.indexOf(ext) == -1) return util.errorResponse(res, 'UNSUPPORTED_EXTENSIONS');
		if (image.length > CTS.MAX_FILE_SIZE) return util.errorResponse(res, 'FILE_TOO_LARGE');

		var filename = name.toUpperCase() + '.' + ext;

		if (err) {
			res.json(err);
		}

		var dbx = new Dropbox({
			accessToken: config.dropboxKey
		});
		dbx.filesUpload({
				path: CTS.DROPBOX_FOLDER_PATH + "/RUT_" + rut.toUpperCase() + "/" + filename,
				contents: image
			})
			.then(function(response) {
				return util.okResponse(res, 201, {
					file_url: CTS.DROPBOX_FOLDER_PATH + "/RUT_" + rut.toUpperCase() + "/" + filename,
					name: name,
					message: 'Upload file successfully.'

				});
			})
			.catch(function(error) {
				return util.errorResponse(res, 'INTERNAL_ERROR', error);
			});
	});
}


exports.download = function(req, res) {

	var rut = req.params.rut;
	var name = req.params.name;
	if (!rut || !name) {
		return util.errorResponse(res, 'MISSING_REQUIRED_FIELDS');
	}
	var dbx = new Dropbox({
		accessToken: config.dropboxKey
	});
	dbx.filesDownload({
			path: CTS.DROPBOX_FOLDER_PATH + "/" + rut.toUpperCase() + "/" + name,
		})
		.then(function(response) {
			res.end(response.fileBinary, 'binary');
		})
		.catch(function(error) {
			res.status(404).end('File not found');
		});

}