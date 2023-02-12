const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    Image: {
        type: String
    },
    user: {
        type: ObjectId,
        ref: 'users'
    },
    likes: [{
      user: {
        type: String,
        ref: 'users'
      }  
    }],
    comments: [{
        user: {
          type: String,
          ref: 'users'
        },
        text: {
            type: String,
            required: true
        },
        name: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        } 
      }],
      name: {
        type: String
      }
});

module.exports = mongoose.model('Posts', PostSchema);