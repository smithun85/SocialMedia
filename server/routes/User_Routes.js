const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  updatePassword,
  updateProfile,
  myProfile,
  getUserProfile,
  getAllUsersProfile,
  deleteProfile,
} = require("../controllers/User_Controller");

const isAuthenticated = require("../middlewares/Auth");
const { followUser } = require("../controllers/Follows");

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/logout").get(logout);

router.route("/update/password").patch(isAuthenticated, updatePassword)
  
router.route("/update/profile").patch(isAuthenticated, updateProfile);

router.route("/follows/:user_id").get(isAuthenticated, followUser);

router.route("/profile").get(isAuthenticated, myProfile)

router.route("/profile/:userId").get(isAuthenticated, getUserProfile);

router.route("/profiles").get(isAuthenticated, getAllUsersProfile)

router.route("/delete").delete(isAuthenticated, deleteProfile)

module.exports = router;
