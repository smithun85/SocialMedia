const express = require("express");

const router = express.Router()

const isAuthenticated = require("../middlewares/Auth");
const { createPost, getAllPost, likeAndUnlikePost, deletePost } = require("../controllers/Post_Controller")

router.route('/upload').post(isAuthenticated, createPost);

router.route('/delete/:post_id').delete(isAuthenticated, deletePost);

router.route('/likeAndUnlike/:post_id').get(isAuthenticated, likeAndUnlikePost);

router.route('/get').get(getAllPost)

module.exports = router

