const user = require("../models/user.model");
const bcrypt = require("bcrypt");
const APIError = require("../utils/errors");
const Response = require("../utils/response");
const {
  createToken,
  createTemporaryToken,
  decodedTemporaryToken,
} = require("../middlewares/auth");
const crypto = require("crypto");
const sendEmail = require("../utils/sendMail");
const moment = require("moment");

const login = async (req, res) => {
  const { email, password } = req.body;

  const userInfo = await user.findOne({ email });

  if (!userInfo) throw new APIError("Email or password is incorrect!", 401);

  const comparePassword = await bcrypt.compare(password, userInfo.password);

  if (!comparePassword)
    throw new APIError("Email or password is incorrect!", 401);

  createToken(userInfo, res);
};

const register = async (req, res) => {
  const { email } = req.body;

  const userCheck = await user.findOne({ email });

  if (userCheck) {
    throw new APIError(
      "Email already exist, please enter a different email!",
      401
    );
  }
  req.body.password = await bcrypt.hash(req.body.password, 10);

  const userSave = new user(req.body);
  await userSave
    .save()
    .then((data) => {
      return new Response(data, "User registered succesfully").created(res);
    })
    .catch((err) => {
      throw new APIError("User can not registered, please try again!", 400);
    });
};

const me = async (req, res) => {
  return new Response(req.user).success(res);
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  const userInfo = await user
    .findOne({ email })
    .select("nickname email ");

  if (!userInfo) return new APIError("Invalid email", 400);

  const resetCode = crypto.randomBytes(3).toString("hex");

  console.log(resetCode);

  await sendEmail({
    from: process.env.EMAIL_USERNAME,
    to: userInfo.email,
    subject: "Şifre Sıfırlama Talebi",
    text: `Şifre sıfırlama kodun: ${resetCode}`,
  });

  await user.updateOne(
    { email },
    {
      reset: {
        code: resetCode,
        time: moment(new Date())
          .add(15, "minute")
          .format("YYYY-MM-DD HH:mm:ss"),
      },
    }
  );

  return new Response(true, "Please check your email box.").success(res);
};

const resetCodeCheck = async (req, res) => {
  const { email, code } = req.body;

  const userInfo = await user
    .findOne({ email })
    .select("_id name lastname email reset");

  if (!userInfo) throw new APIError("Invalid Code!", 401);

  const dbTime = moment(userInfo.reset.time);
  const nowTime = moment(new Date());

  const timeDiff = dbTime.diff(nowTime, "minutes");

  if (timeDiff <= 0 || userInfo.reset.code !== code) {
    throw new APIError("Invalid Code", 401);
  }

  const temporaryToken = await createTemporaryToken(
    userInfo._id,
    userInfo.email
  );

  return new Response(
    { temporaryToken },
    "You can reset your password now."
  ).success(res);
};

const resetPassword = async (req, res) => {
  const { password, temporaryToken } = req.body;

  const decodedToken = await decodedTemporaryToken(temporaryToken);
  console.log("decodedToken : ", decodedToken);

  const hashPassword = await bcrypt.hash(password, 10);

  await user.findByIdAndUpdate(
    { _id: decodedToken._id },
    {
      reset: {
        code: null,
        time: null,
      },
      password: hashPassword,
    }
  );

  return new Response(
    decodedToken,
    "Password reset is complated succesfully"
  ).success(res);
};

const getUserbyId = async (req, res) => {
  const { id } = req.params;
  const userReq = req.user;

  if (!userReq) {
    throw new APIError(
      "You are unauthorized to view these content!",
      401
    );
  }
  if (userReq.role != "admin") {
    throw new APIError(
      "You are unauthorized to view these content!",
      401
    );
  }

  const userInfo = await user.findById(id).catch((err) => {
    throw new APIError("Something went wrong! Try Again.", 401);
  });

  if (!userInfo) throw new APIError("User not found! Try Again.", 401);

  const userDetail = {
    id: userInfo._id.toString(),
    nickname: userInfo.nickname,
    email: userInfo.email,
    role: userInfo.role,
    createdAt: userInfo.createdAt,
    updatedAt: userInfo.updatedAt
  }
  return new Response(userDetail).success(res);
};

const getAllUsers = async (req, res) => {
  const userInfo = await user.find().catch((err) => {
    throw new APIError("Something went wrong! Try Again.", 401);
  });

  const userReq = req.user;

  if (!userReq) {
    throw new APIError(
      "You are unauthorized to view these contents!",
      401
    );
  }
  if (userReq.role != "admin") {
    throw new APIError(
      "You are unauthorized to view these contents!",
      401
    );
  }

  if (!userInfo || userInfo.length === 0) throw new APIError("User not found! Try Again.", 401);

  const usersDetails = userInfo.map((user) => {
    return {
      id: user._id.toString(),
      nickname: user.nickname,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  });
  return new Response(usersDetails).success(res);
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const userReq = req.user;

  if (!userReq) {
    throw new APIError(
      "You are unauthorized to delete these content!",
      401
    );
  }

  const currenUserInfo = await user.findById(id).catch((err) => {
    throw new APIError("Something went wrong! Try Again.", 401);
  });
  if (!currenUserInfo) throw new APIError("User not found! Try Again.", 401);

  if (userReq.role != "admin" && currenUserInfo._id.toString() !== userReq._id.toString()) {
    throw new APIError(
      "You are unauthorized to delete these content!",
      401
    );
  }

  const userInfo = await user.findByIdAndDelete(id).catch((err) => {
    throw new APIError("Something went wrong! Try Again.", 401);
  });

  if (!userInfo) throw new APIError("User not found! Try Again.", 401);

  return new Response(userInfo).success(res);
};

const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { nickname, password } = req.body;
  const userReq = req.user;

  if (!userReq) {
    throw new APIError(
      "You are unauthorized to view these contents!",
      401
    );
  }
  const currenUserInfo = await user.findById(userReq._id);
  if (!currenUserInfo) {
    throw new APIError("User not found! Try Again.", 401);
  }

  if (userReq.role != "admin" && currenUserInfo._id.toString() !== userReq._id.toString()) {
    throw new APIError(
      "You are unauthorized to view these contents!",
      401
    );
  }

  const userInfo = await user.findById(id);

  if (!userInfo) throw new APIError("User not found! Try Again.", 401);

  const comparePassword = await bcrypt.compare(password, userInfo.password);

  if (!comparePassword)
    throw new APIError("Email or password is incorrect!", 401);

  const userDetail = {
    nickname
  };


  try {
    const updatedUser = await user.findByIdAndUpdate(id, { nickname }, { new: true });

    const userDetail = {
      id: updatedUser._id.toString(),
      nickname: updatedUser.nickname,
      email: updatedUser.email,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    }
    return new Response(updatedUser, "User updated successfully").success(res);
  } catch (err) {
    throw new APIError("User cannot be updated, please try again!", 400);
  }
};

module.exports = {
  login,
  register,
  me,
  forgetPassword,
  resetCodeCheck,
  resetPassword,
  getAllUsers,
  getUserbyId,
  updateProfile,
  deleteUser,
};