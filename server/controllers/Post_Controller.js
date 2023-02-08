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
    
    user.posts.push(posts._id)
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

//delete the post:
const deletePost = async (req, res) => {

  try{
    const post = await PostModel.findById(_id) 
    const user = await UserModel.findById(req.user._id)
    if(post.owner.toString() !== req.user._id.toString()){
      await PostModel.findByIdAndDelete()
    }
  }catch(err){
    res.status(500).json({
      message:err.message,
      status: "something is wrong"
    })
  }
}

//Like and dislike the post
const likeAndUnlikePost = async (req, res) => {
  try{
    const post = await PostModel.findById(req.params.post_id) 

    if(!post){
      return json.status(401).json({
        message:"Post not found"
      })
    }
    
    //unlike the post
    if(post.likes.includes(req.user._id)){  //includes(_id); =>means id already exists, that means user already like in same post
      const index = post.likes.indexOf(req.user._id)  //find out the index of user in post.likes model
      
      post.likes.splice(index,1) 
      await post.save()                    //remove 1 element from position of index value

      return res.status(200).json({
        message:"post unliked"
      })

    } else{
      //like the post
      post.likes.push(req.user._id)
      await post.save()
      res.status(201).json({
        message: "post liked"
      })
    } 

    

  }catch (err){
    res.status(501).json({
      message:err.message,
      status: "something wrong..."
    })
  }
}

const getAllPost = async(req, res) => {
    try{

    }catch (err){
        res.status(401).json({
            status:"Not find all Records",
            Error:err.message,
        })
    }
}

module.exports = { createPost ,deletePost, getAllPost, likeAndUnlikePost};
