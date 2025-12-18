const generateToken = require("../middleware/generateToken");
const { errorResponse, successResponse } = require("../utils/responseHandeler");
const User = require("./user.model");

// user registration
const userRegistration = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.status(200).send({ message: "Registration Successfull" });
  } catch (error) {
    console.error("Error while registering a user", error);
    res.status(500).send({ message: "Registration Failed" });
  }
};

// user login
const userLoggedIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
     return errorResponse(res, 404, "User not found");
    }

    const isMatch = await user.comparePassword(password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid password" });
    }
    const token = await generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // REQUIRED on Vercel
      sameSite: "none", // REQUIRED for cross-domain
    });
    res.status(200).send({
      message: "Login successfull",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        profession: user.profession,
      },
    });
  } catch (error) {
    console.error("Error while login user", error);
    res.status(500).send({ message: "Login failed!" });
  }
};

// logout function
const userLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).send({ message: "Successfully logged out" });
  } catch (error) {
    console.error("Error while logging out a user", error);
    return res.status(500).json({ message: "Logout failed" });
  }
};

// get all users function (token varify and admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "email role username").sort({
      createdAt: -1,
    });
    successResponse(res, 200, "All users fetched successfully", (data = users));
  } catch (error) {
    errorResponse(res, 500, "Field to fetch all users", error);
  }
};

// delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return errorResponse(res, 404, "User Not Found");
    }
    return successResponse(res, 200, "User deleted successfully");
  } catch (error) {
    errorResponse(res, 500, "Field to delete the users", error);
  }
};

// update user role by admin
const updateUserRole = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  console.log(req.body);
  const { role } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );
    if (!updatedUser) {
      return errorResponse(res, 404, "User not found", error);
    }
    return successResponse(
      res,
      200,
      "User role updated successfully",
      (data = updatedUser)
    );
  } catch (error) {
    errorResponse(res, 500, "Field to update the user's role", error);
  }
};

// edit user profile
const editUserProfile = async (req, res) => {
  const { id } = req.params;
  const { username, profileImage, bio, profession } = req.body;
  try {
    const updateFields = {
      username,
      profileImage,
      bio,
      profession,
    };
    const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
      new: true,
    });
    if (!updatedUser) {
      return errorResponse(res, 404, "user mot found", error);
    }

    return successResponse(
      res,
      200,
      "User profile updated  successfully",
      updatedUser
    );
  } catch (error) {
    errorResponse(res, 500, "Field to update the user profile", error);
  }
};

module.exports = {
  userRegistration,
  userLoggedIn,
  userLogout,
  getAllUsers,
  deleteUser,
  updateUserRole,
  editUserProfile,
};
