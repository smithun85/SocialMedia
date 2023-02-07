const PostModel = require("../models/Post_Model");
const UserModel = require("../models/User_Model");

const createPost = async (req, res) => {
  try {
    const newPostData = {
      caption: req.body.caption,
      image: {
        public_id: "req.body.public_id",
        url: "req.body.url",
      },
      owner: UserModel._id,
    };
    const newPost = await PostModel.create(newPostData);
    res.status(201).json({
      success: true,
      post: newPost,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      status: "Post document is not created...",
    });
  }
};

const getAllPost = async(req, res) => {
    try{

    }catch (err){
        res.status(401).json({
            status:"Not find all Records",
            Error:err.message,
        })
    }
}

module.exports = { createPost , getAllPost};
