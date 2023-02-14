const { default: mongoose } = require("mongoose");
const PostModel = require("../models/Post_Model");
const UserModel = require("../models/User_Model");

//create(POST) the post
const createPost = async (req, res) => {
  try {
    const newPostData = {
      caption: req.body.caption,
      image: {
        public_id: "req.body.public_id",
        url: "req.body.url",
      },
      owner: req.user._id,
    };

    const posts = await PostModel.create(newPostData);

    const user = await UserModel.findById(req.user._id).select("+password");

    user.posts.push(posts._id);
    await user.save();

    res.status(201).json({
      success: true,
      posts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      status: "Post document is not created...",
    });
  }
};

//view all posts
const getAllPost = async (req, res) => {
  try {
  } catch (err) {
    res.status(401).json({
      status: "Not find all Records",
      Error: err.message,
    });
  }
};

//update the post
const updatePost = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id); //.select("+password")
    const post = await PostModel.findById(req.params.post_id);

    if (!post) {
      return res.status(401).json({
        message: "post not found",
      });
    }

    if (req.user._id.toString() !== post.owner.toString()) {
      res.status(401).json({
        message: "Unauthorized user",
      });
    }

    const update = await PostModel.findByIdAndUpdate(
      req.params.post_id,
      {
        caption: req.body.caption,
      },
      { new: true } //{new:true} gives the current updated value
    );
    res.status(201).json({
      message: "post updated",
    });
  } catch (err) {
    res.status(501).json({
      message: err.message,
      status: "something is wrong",
    });
  }
};

//delete the post:
const deletePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.post_id);

    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "user not authorized...",
      });
    }

    // await PostModel.findByIdAndDelete(req.params.post_id)
    await post.remove();

    const user = await UserModel.findById(req.user._id).select("+password");
    const index = user.posts.indexOf(post._id);
    user.posts.splice(index, 1);
    await user.save();

    res.status(201).json({
      message: "post deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      status: "something is wrong",
    });
  }
};

//Like and dislike the post
const likeAndUnlikePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.post_id);

    if (!post) {
      return json.status(401).json({
        message: "Post not found",
      });
    }

    //unlike the post
    if (post.likes.includes(req.user._id)) {
      //includes(_id); =>means id already exists, that means user already like in same post
      const index = post.likes.indexOf(req.user._id); //find out the index of user in post.likes model
      post.likes.splice(index, 1);
      await post.save(); //remove 1 element from position of index value

      return res.status(200).json({
        message: "post unliked",
      });
    } else {
      //like the post
      post.likes.push(req.user._id);
      await post.save();
      res.status(201).json({
        message: "post liked",
      });
    }
  } catch (err) {
    res.status(501).json({
      message: err.message,
      status: "something wrong...",
    });
  }
};

//Add comment
const addCommentOnPost = async (reqs, res) => {
  try {
    const post = await PostModel.findById(reqs.params.post_id);

    if (!post) {
      res.status(401).json({
        message: "post not found",
      });
    }

    post.comments.push({
      user: reqs.user._id,
      comment: reqs.body.comment,
    });

    await post.save();

    res.status(201).json({
      message: "Comment added",
    });
  } catch (err) {
    res.status(501).json({
      message: err.message,
      status: "something is wrong",
    });
  }
};


//update comment in aparticular post
const updateCommentOnPost = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);

   const post = await  PostModel.findOne({ _id: req.params.post_id })
      if (!post)
        return res.status(401).json({
          status: "post not found",
        });

      const commentIndex = post.comments.findIndex(
        (comment) => comment._id.toString() === req.params.comment_id.toString()
      );

      if (commentIndex === -1) {
        return res.status(401).json({
          message: "comment not found",
        });
      }

      if (user._id.toString() === post.comments[commentIndex].user.toString()) {
        // post.comments[commentIndex].comment = req.body.comment;

        post.save();
        res.status(201).json({
          message: "Comment updated successfully",
        });
      } else {
        res.status(401).json({
          message: "user not authorized",
        });
      }
  
  } catch (err) {
    res.status(501).json({
      message: err.message,
      status: "something is wrong",
    });
  }
};

//Delete the comment from a particular post
const deleteCommentOnPost = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);

    PostModel.findOne({ _id: req.params.post_id }, function (err, post) {
      if (!post)
        return res.status(401).json({
          status: "post not found",
        });

      const commentIndex = post.comments.findIndex(
        (comment) => comment._id.toString() === req.params.comment_id.toString()
      );
      
      if (commentIndex === -1)
        return res.status(401).json({
          message: "comment not found",
        });

        if ((user._id.toString() === post.comments[commentIndex].user.toString()) || (user._id.toString() === post.owner.toString())) {

          post.comments.splice(commentIndex, 1);

          post.save();
    
          res.status(201).json({
            message: "Comment deleted successfully",
          });
        } else {
          res.status(401).json({
            message: "user not authorized",
          });
        }
    });
  } catch (error) {
    res.status(501).json({
      message: error.message,
      status: "something is wrong",
    });
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  likeAndUnlikePost,
  addCommentOnPost,
  updateCommentOnPost,
  deleteCommentOnPost,
};
