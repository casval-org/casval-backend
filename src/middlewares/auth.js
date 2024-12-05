const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const APIError = require("../utils/errors");

const createToken = async (user) => {
  const payload = {
    sub: user._id,
    name: user.name,
  };

  const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    algorithm: "HS512",
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;  
};

const adminTokenCheck = async (req, res, next) => {
  
  const user = await tokenVerify(req.headers);

  if (user.role !== "admin") {
    throw new APIError("Invalid Token", 401);
  }

  req.user = user;
  req.userId = user._id.toString();
  
  next();
};

const userTokenCheck = async (req, res, next) => {

  const user = await tokenVerify(req.headers);

  if (user.role !== "user") {
    throw new APIError("Invalid Token", 401);
  }

  req.user = user;
  req.userId = user._id.toString();

  next();
};

const tokenVerify = async (headers) => {
  
  let token = null;
  if(headers?.authorization?.startsWith("Bearer ")) {
    token = headers.authorization.split(" ")[1];
  }
    
  if (token === null) {
    throw new APIError("Invalid session, please try again", 401);
  }

  return await jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (err) {
      throw new APIError("Invalid Token", 401);
    }

    const user = await UserModel.findById(decoded.sub);

    if (! user) {
      throw new APIError("Invalid Token", 401);
    }

    return user;
  });
};

const createTemporaryToken = async (userId, email) => {
  const payload = {
    sub: userId,
    email,
  };

  const token = await jwt.sign(payload, process.env.JWT_TEMPORARY_KEY, {
    algorithm: "HS512",
    expiresIn: process.env.JWT_TEMPORARY_EXPIRES_IN,
  });

  return token;
};

const decodedTemporaryToken = async (temporaryToken) => {
  
  let user = null;
  let rsp = await jwt.verify(
    temporaryToken,
    process.env.JWT_TEMPORARY_KEY,
    async (err, decoded) => {

      if (err) {
        throw new APIError("Invalid Token", 401);
      }

      user = await UserModel.findById(decoded.sub);

      if (! user) {
        throw new APIError("Invalid Token", 401);
      }
    }
  );

  console.log(rsp, user);

  return user;
};

module.exports = {
  createToken,
  createTemporaryToken,
  decodedTemporaryToken,
  adminTokenCheck,
  userTokenCheck
};