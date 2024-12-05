const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const APIError = require("../utils/errors");
const Response = require("../utils/response");
const crypto = require("crypto");
const {
  createToken,
  createTemporaryToken,
  decodedTemporaryToken,
} = require("../middlewares/auth");
const moment = require("moment");
const sendEmail = require("../utils/sendMail");

const login = async (req, res) => {

  const user = await UserModel.findOne({ email: req.body.email });

  if (! user) {
    throw new APIError("Email or password is incorrect!", 200);
  }

  if (! await bcrypt.compare(req.body.password, user.password)) {
    throw new APIError("Email or password is incorrect!", 200);
  }

  let token = await createToken(user);

  return new Response({ token, user: userResponse(user) }, "").success(res);
};

const register = async (req, res) => {

  let user = await UserModel.findOne({ email: req.body.email });

  if (user) {
    throw new APIError("Email already exist, please enter a different email!", 422);
  }
  let username = await UserModel.findOne({ username: req.body.username });

  if (username) {
    throw new APIError("Username already exist, please enter a different username!", 422);
  }

  user = await UserModel.create({
    name: req.body.name,
    surname: req.body.surname,
    username: req.body.username,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, 10),
    role: 'user'
  })
  
  let token = await createToken(user);

  return new Response({ token, user: userResponse(user) }, "").success(res);
};

const forgetPassword = async (req, res) => {

  const user = await UserModel.findOne({ email: req.body.email });

  if (! user) {
    return new APIError("Invalid email", 422);
  }

  const code = crypto.randomBytes(3).toString("hex");

  // @todo: Check Email
  // await sendEmail({
  //   from: process.env.EMAIL_USERNAME,
  //   to: user.email,
  //   subject: "Password Reset",
  //   text: `Your password reset code: ${code}`,
  // });
  console.log(`Your password reset code: ${code}`);

  await UserModel.findOneAndUpdate({email: req.body.email}, 
    {
      $set: {
        reset: {
          code: code,
          time: moment(new Date()).add(15, "minute").format("YYYY-MM-DD HH:mm:ss"),
        }
      }
    }
  );

  return new Response(true, "Please check your email box.").success(res);
};

const resetCodeCheck = async (req, res) => {

  const user = await UserModel.findOne({ email: req.body.email });

  if (! user) {
    throw new APIError("Invalid Code!", 422);
  }

  const dbTime = moment(user.reset.time);
  const nowTime = moment(new Date());
  const timeDiff = dbTime.diff(nowTime, "minutes");

  if (timeDiff <= 0 || user.reset.code !== req.body.code) {
    throw new APIError("Invalid Code", 422);
  }

  const token = await createTemporaryToken(
    user._id,
    user.email
  );

  return new Response({ token }, "You can reset your password now.").success(res);
};

const resetPassword = async (req, res) => {
  const user = await decodedTemporaryToken(req.body.temporaryToken);

  if(! user) {
    throw new APIError("Invalid Token", 422);
  }

  const hashPassword = await bcrypt.hash(req.body.password, 10);

  await UserModel.findByIdAndUpdate(user._id,
    {
      reset: {
        code: null,
        time: null,
      },
      password: hashPassword,
    }
  );

  return new Response(userResponse(user), "Password reset is completed succesfully").success(res);
};

const userResponse = (user) => {
  return {
    id: user._id,
    name: user.name,
    surname: user.surname,
    username: user.username,
    email: user.email,
    role: user.role,
    reset: {
      code: user.reset.code,
      time: user.reset.time,
    },
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

module.exports = {
  login,
  register,  
  forgetPassword,
  resetCodeCheck,
  resetPassword
};