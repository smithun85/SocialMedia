const bcrypt = require("bcrypt");
const PostModel = require("../models/Post_Model");
const UserModel = require("../models/User_Model");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "user already exist",
      });
    }

    user = await UserModel.create({
      name,
      email,
      password,
      avatar: {
        public_id: "sample id",
        url: "smple Url",
      },
    });

    //Token generate: using custom method as generateToken()=>define in userSchema
    const token = await user.generateToken();
    const options = {
      expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.status(200).cookie("token", token, options).json({
      message: "Register successfully",
      user,
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      status: "User document is not created",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let existUser = await UserModel.findOne({ email }).select("+password");

    //user validation
    if (!existUser) {
      return res.status(401).json({
        message: "User does not exist",
      });
    }

    //password validation
    // const isPasswordCorrect = await bcrypt.compare(password, existUser.password);
    //or using custom method as matchPassword()=>define in userSchema
    const isPasswordCorrect = await existUser.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Wrong password",
      });
    }

    //Token generate: using custom method as generateToken()=>define in userSchema
    const token = await existUser.generateToken();
    const options = {
      expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.status(200).cookie("token", token, options).json({
      message: "login successfully",
      existUser,
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      status: "Something wrong",
    });
  }
};

const logout = async (req, res) => {
  try {
    res
      .status(201)
      .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
      .json({
        message: "Successfully logged out",
      });
  } catch (err) {
    res.status(501).json({
      message: err.message,
      status: "Something wrong",
    });
  }
};

//Change Password
const updatePassword = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select("+password");
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(401).json({
        message: "please enter old and new password",
      });
    }

    const isPasswordCorrect = await user.matchPassword(oldPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Old Password is not correct",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(201).json({
      message: "Password Changed",
    });
  } catch (err) {
    res.status(501).json({
      message: err.message,
      status: "Something is wrong",
    });
  }
};


//update Profile
const updateProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select("+password");
    const { name, email } = req.body;

    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    // avatar:
    await user.save();

    //or using direct method and send in response
    // const update = await UserModel.findByIdAndUpdate(req.user._id,{
    //     name,
    //     email
    // })

    res.status(200).json({
      message: "profile updated",
    });
  } catch (err) {
    res.status(501).json({
      message: err.message,
      status: "Something is wrong",
    });
  }
};


//view Profile:
const myProfile = async (req, res) => {
  try{
    const user = await UserModel.findById(req.user._id).populate("posts");
    res.status(201).json({
      user
    })
  }catch(err){
    res.status(501).json({
      message: err.message,
      status: "Something is wrong",
    });
  }
};


//view user's Profile
const getUserProfile = async (req, res) => {
  try{
    const user = await UserModel.findById(req.params.userId).populate("posts");

    if(!user){
      res.status(404).json({
        message:"User does not exist"
      })
    }

    res.status(201).json({
      user
    })

  }catch(err){
    res.status(501).json({
      message: err.message,
      status: "Something is wrong",
    });
  }
};


//view all users profile
const getAllUsersProfile = async (req, res) => {
  try{
    const users = await UserModel.find({});

    res.status(200).json({
      users
    })

  }catch(err){
    res.status(501).json({
      message: err.message,
      status: "Something is wrong",
    });
  }
}

//Delete Profile and own posts:(very complex & conceptual)
const deleteProfile = async (req, res) => {
    try{

        const user = await UserModel.findById(req.user._id)
        const posts_id = user.posts  //we store the user's post before deleted it
        const followers = user.followers;
        const following = user.following
        const user_id = user._id

        

        for(let i= 0; i < posts_id.length; i++){
          const userPosts = await PostModel.findById(posts_id[i])
          await userPosts.remove();
        }
        
        //Removing deleted_user_id from UserModel who is following that user
        for(let i = 0; i < followers.length; i++){
          const userFollowing = await UserModel.findById(followers[i]).select("+password")  //find user who is following that user         
         
          const followingIndex = userFollowing.following.indexOf(user_id);
          
          userFollowing.following.splice(followingIndex, 1)
          await userFollowing.save();
        }

        //Removing user_id from following's follower(Deleted_user is followed )
        for(let i=0; i < following.length; i++){
          const userFollows = await UserModel.findById(following[i]).select("+password")  //find user who is followed by that user
          const followerIndex = userFollows.followers.indexOf(user_id)
          userFollows.followers.splice(followerIndex, 1)
          await userFollows.save();
        }

        //delete the profile and logout user after deleting profile
        await user.remove();
        res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })

        res.status(201).json({
            message:"User Profile deleted with all post and data"
        })

    }catch(err){
        res.status(501).json({
            message:err.message,
            status:"Something wrong"
        })
    }
}

module.exports = { 
    register, 
    login, 
    logout, 
    updatePassword, 
    updateProfile ,
    myProfile,
    getUserProfile,
    getAllUsersProfile,
    deleteProfile
};
