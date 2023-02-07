const express = require("express");

const router = express.Router()

const { createPost, getAllPost } = require("../controllers/Post_Controller");



router.route('/upload').post(createPost);
router.route('/get').get(getAllPost)

module.exports = router

