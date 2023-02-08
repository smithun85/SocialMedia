const express = require("express");

const router = express.Router();

const isAuthenticated = require("../middlewares/Auth");
const {
  createPost,
  getAllPost,
  likeAndUnlikePost,
  deletePost,
} = require("../controllers/Post_Controller");

const { getPostOfFollowing } = require("../controllers/Follows");


router.route("/upload").post(isAuthenticated, createPost);

// router.route('/:post_id').delete(isAuthenticated, deletePost);
//or b/c same url

router
  .route("/:post_id")
  .get(isAuthenticated, likeAndUnlikePost)
  .delete(isAuthenticated, deletePost);

router.route("/").get(isAuthenticated, getPostOfFollowing);

module.exports = router;
