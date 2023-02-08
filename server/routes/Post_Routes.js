const express = require("express");

const router = express.Router()

const isAuthenticated = require("../middlewares/Auth");
const { createPost, getAllPost, likeAndUnlikePost, deletePost } = require("../controllers/Post_Controller");
const { getPostOfFollowing } = require("../models/FollowUser");

router.route('/upload').post(isAuthenticated, createPost);

// router.route('/:post_id').delete(isAuthenticated, deletePost);
//or b/c same url

router.route('/:post_id')
.get(isAuthenticated, likeAndUnlikePost)
.delete(isAuthenticated, deletePost)
.get(isAuthenticated, getPostOfFollowing);

router.route('/get').get(getAllPost);



module.exports = router

