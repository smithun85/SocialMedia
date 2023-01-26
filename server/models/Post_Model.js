//Using common JS module
const mongoose = require('mongoose');

const postSchma = new mongoose.Schema({
    caption: {
        type: String,
        require: true
    },

    image: {
        public_id: String,
        url: String
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    }],

    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User
        },
        comment: {
            type: String,
            require: true
        }
    }]
}, { timestamps: true});

//create model for schema
const postModel = mongoose.model("Post",postSchma)

//export the model
module.exports = postModel