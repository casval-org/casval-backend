const UserModel = require("../models/user.model");
const APIError = require("../utils/errors");
const Response = require("../utils/response");

const me = async (req, res) => {
	return new Response(await profileResponse(req.userId), "").success(res);
}

const profile = async (req, res) => {
	return new Response(await profileResponse(req.params.id), "").success(res);
}

const update = async (req, res) => {
	const {name, surname, bio, sex, birthdate} = req.body;

	await UserModel.findByIdAndUpdate(
		req.userId, 
		{ name, surname, bio, sex, birthdate },
		{ returnDocument: 'after'}
	);

	return new Response(await profileResponse(req.userId), "").success(res);
}

const updateProfileImage = async (req, res) => {

	if (req.uploadError) {
		throw new APIError(req.uploadErrorMessage, 422);	
	}

	await UserModel.findByIdAndUpdate(
		req.userId, 
		{ profileImage: req.file.filename },
		{ returnDocument: 'after'}
	);

	return new Response(req.file.filename, "").success(res);
}

const profileResponse = async (id) => {

	let user = await UserModel.findById(id);
	
	if (user === null) {
		throw new APIError("User not found!", 404);
	}	
	return {
		id: id,
		name: user?.name || '',
		surname: user?.surname || '',
		username: user?.username || '',
		email: user?.email || '',
		profileImage: user?.profileImage || '',
		bio: user?.bio || '',
		birthdate: user?.birthdate || '',
		sex: user?.sex || '',
		createdAt: user.createdAt,
	}
}


module.exports = {
	me,
	profile,
	update,
	updateProfileImage    
}