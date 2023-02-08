const UserModel = require('./User_Model');

//follow and unfollow the user
const followUser = async (req, res) => {
    try{

        const loggedInUser = await UserModel.findById(req.user._id).select('+password') //following
        const userToFollow = await UserModel.findById(req.params.user_id).select('+password') //followers
       
        if(!userToFollow){
            return res.status(404).json({
                message:"user does not exist"
            })
        };


        if(loggedInUser.following.includes(userToFollow._id)){
            //unfollow
           const followingIndex = loggedInUser.following.indexOf(userToFollow._id);
           loggedInUser.following.splice(followingIndex, 1);
           await loggedInUser.save();

           const followerIndex = userToFollow.followers.indexOf(loggedInUser._id)
           userToFollow.followers.splice(followerIndex, 1)
           await userToFollow.save();

           res.status(200).json({
                message:"user unfollowed"
            })

        }else{
             //I follow the users
            loggedInUser.following.push(userToFollow._id)
            await loggedInUser.save();
            //I am followed by the users
            userToFollow.followers.push(loggedInUser._id)
            await userToFollow.save();

            res.status(200).json({
                message:"user followed"
            })
        }

    }catch(err){
        res.status(501).json({
            message:err.message,
            status:"something wrong"
        })
    }
};

//get the data of follower
const getPostOfFollowing = async (req, res) => {
    try{

    }catch(err){
        res.status(501).json({
            message:err.message,
            status:"something wrong"
        })
    }
}

module.exports = {
    followUser, 
    getPostOfFollowing
}