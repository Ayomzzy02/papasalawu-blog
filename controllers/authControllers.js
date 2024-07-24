const AppError = require("../utils/appError");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const { getSignedToken } = require("../utils/jwt");

const authenticateResponse = async function (
  user,
  statusCode,
  res,
  req,
) {
  const token = getSignedToken(user._id);
  user.password = undefined; // so the password won't be part of the output

  res.cookie('token', token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day expiration
    httpOnly: true,
    path: '/' // Specify the path where the cookie is available
  });

  return res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};


exports.signInUser = catchAsync(async (req, res, next) => {
  const { password } = req.body;
  // Finds user and compare password
  const user = req.user;
 if (!(await user.correctPassword(password, user.password))) {
    return res.status(401).json({
      status: "failed",
      message: `Password not correct!`,
    });
  }

    authenticateResponse(user, 200, res, req);
});


exports.signUpUser = catchAsync(async (req, res, next) => { 
  try{
    const { name, email, password } = req.body;

  const checkUser = await User.findOne({ email });
  if (checkUser) {
    return res.status(400).json({
      status: "failed",
      message: `User with email already exists.`,
    });
  }

  const user = await User.create({
    name: name,
    email: email,
    password: password,
    role: "Author"
  });

  return res.status(201).json({
    status: "success",
    //data: user,
    message: `${name} Hurray You've Successfully Registered`,
    data: {
      user
    }
  });
  } catch(error) {
    return next(new AppError("Something went terribly wrong, Pls Try Again later", 400));
  }
});