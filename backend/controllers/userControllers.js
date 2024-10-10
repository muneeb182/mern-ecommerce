import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import generateToken from "../utilis/createToken.js";


// Creating a Users
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email && !password) {
    throw new Error("Please all the inputs.");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).send("User All ready exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ username, email, password: hashPassword });
  try {
    await newUser.save();
    generateToken(res, newUser._id);
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Invalid User data");
  }
});
// Login the users
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isValidPassword) {
      generateToken(res, existingUser._id);

      res.status(201).json({
        _id: existingUser._id,
        username:existingUser.username,
        email: existingUser.email,
        password: existingUser.password,
        isAdmin: existingUser.isAdmin,
      });
      return;
    }
  }
});
// Logout users
const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logout Successfully" });
});
//Get all the users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Read the current Users
const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("User not Found");
  }
});

// update the user
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashPassword || user.password;
    }

    const updateUser = await user.save();

    res.json({
      _id: updateUser._id,
      username: updateUser.username,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("User not found");
  }
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id); // Fix the req.param to req.params
  
  if (user) {
    if (user.isAdmin) {
      res.status(400).json({ message: 'Admin cannot be deleted' }); // Send a response and return early
      return; // Ensure no further execution after sending a response
    }

    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User deleted successfully!' });
  } else {
    res.status(404).json({ message: 'User not found' }); // Send a 404 response if the user is not found
    return; // Ensure no further execution
  }
});

const getUserById = asyncHandler(async(req ,res) => {
  const user = await User.findById(req.params.id).select("-password");

  if(user){
    res.json(user);
  }
  else{
    res.status(404);
    throw new Error('User not Found');
  }
});

const updateUserById= asyncHandler(async(req ,res) =>{
  const user = await User.findById(req.params.id);

  if(user){
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updateUser = await user.save();

    res.json({
      _id: updateUser._id,
      username: updateUser.username,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin
    })
  }
  else{
    res.status(401);
    throw new Error('User Not Found')
  }

})


export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateUser,
  deleteUserById,
  getUserById,
  updateUserById
};
