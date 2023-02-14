const express = require("express");

const router = express.Router();

const isAuthenticated = require("../middlewares/Auth");
const {
  createPost,
  likeAndUnlikePost,
  deletePost,
  updatePost,
  addCommentOnPost,
  updateCommentOnPost,
  deleteCommentOnPost,
} = require("../controllers/Post_Controller");

const { getPostOfFollowing } = require("../controllers/Follows");

router.route("/upload").post(isAuthenticated, createPost);

// router.route('/:post_id').delete(isAuthenticated, deletePost);
//or b/c same url

router
  .route("/:post_id")
  .get(isAuthenticated, likeAndUnlikePost)
  .patch(isAuthenticated, updatePost)
  .delete(isAuthenticated, deletePost);

router.route("/").get(isAuthenticated, getPostOfFollowing);

router.route("/comment/:post_id").post(isAuthenticated, addCommentOnPost);

router.route("/:post_id/commentupdate/:comment_id").patch(isAuthenticated, updateCommentOnPost)
  
router.route("/:post_id/commentdelete/:comment_id").patch(isAuthenticated, deleteCommentOnPost);

module.exports = router;
