const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const verify = require('./verifyRoute');

 //Storage for images

// var storage = multer.diskStorage({
//      destination: function(req,file,cb) {
//          cb(null, 'Images/');
//      },
//      filename: function(req,file,cb) {
//          let ext = path.extname(file.originalname);
//          cb(null, Date.now() + ext);
//      }
//  });



// Images

//  var image = multer({
//      storage:storage
//  });

/** 
* @swagger
* /posts:
*  get:
*    summary: Getting all posts
*    tags: [Posts]
*    description: Returns all posts
*    responses:
*     200:
*       description: These are all Posts available on the blog
*       content:
*         application/json:
*           schema:
*             type: array
*     400:
*       description: Bad Request
*       content:
*         application/json:
*           schema:
*             type: array
*     500:
*       description: Internal Server Error
*       content:
*         application/json:
*           schema:
*             type: array
*     401:
*       description: Unauthorized
*       content:
*         application/json:
*           schema:
*             type: array
*     404:
*       description: Not Found
*       content:
*         application/json:
*           schema:
*             type: array
*/

// ALL POSTS
router.get('/', async(req,res) => {
   // res.json("We are on posts");
   try {
    const posts = await Post.find();
    res.json(posts);
   } catch (err) {
    res.json({message: err});
   }
});

// CREATE A POST


/** 
* @swagger
* /posts:
*  post:
*    summary: Creating a new post
*    tags: [Posts]
*    description: Creates a post
*    parameters:
*      - name: auth-token
*        description: Your auth-token
*        in: header
*        type: string
*        required: true 
*    requestBody:
*      description: Provide Blog details
*      content:
*          application/json:
*            schema:
*              type: object
*              properties: 
*                title:
*                  type: string
*                description:
*                  type: string
*                imageUrl:
*                  type: string
*    responses:
*     200:
*       description: Post Created Successfully
*       content:
*         application/json:
*           schema:
*             type: array
*     400:
*       description: Bad Request
*       content:
*         application/json:
*           schema:
*             type: array
*     500:
*       description: Internal Server Error
*       content:
*         application/json:
*           schema:
*             type: array
*     404:
*       description: Not Found
*       content:
*         application/json:
*           schema:
*             type: array
*     401:
*       description: Unauthorized
*       content:
*         application/json:
*           schema:
*             type: array
*/


router.post('/',verify, async (req,res) => {
    
        const user = await User.findById(req.user.user.id).select('-password');
        const post = new Post({
          title: req.body.title,
          description: req.body.description,
          user: user.id,
          name: user.name
      });
    //   if(req.file) {
    //      post.Image = req.file.path;
    //   }
      try {
     const savedPost = await post.save();
      res.status(201).json(savedPost);
      }catch(err) {
         res.json({Message: err});
      }


});

/** 
* @swagger
* /posts/{postId}:
*  get:
*    security:
*      - bearerAuth: []
*    summary: Getting specific posts
*    tags: [Posts]
*    description: Returns a specific posts
*    parameters:
*      - name: postId
*        description: Id of the post needed
*        in: path
*        required: true
*      - name: auth-token
*        description: Your auth-token
*        in: header
*        type: string
*        required: true   
*    responses:
*     200:
*       description: This is the post you requested
*       content:
*         application/json:
*           schema:
*             type: array
*     400:
*       description: Bad Request
*       content:
*         application/json:
*           schema:
*             type: array
*     500:
*       description: Internal Server Error
*       content:
*         application/json:
*           schema:
*             type: array
*     404:
*       description: Not Found
*       content:
*         application/json:
*           schema:
*             type: array
*     401:
*       description: Unauthorized
*       content:
*         application/json:
*           schema:
*             type: array
*/



//SPECIFIC POST
router.get('/:postId',verify, async(req,res) => {
    try{
    const post = await Post.findById(req.params.postId);
    res.status(200).json(post);
    }catch(err) {
        res.json({Message: err});
    }
});

// DELETE POST
/** 
* @swagger
* /posts/{postId}:
*  delete:
*    summary: Deleting a specific post
*    tags: [Posts]
*    description: Deletes a specific posts
*    parameters:
*      - name: postId
*        description: Id of the post needed
*        in: path
*        required: true
*      - name: auth-token
*        description: Your auth-token
*        in: header
*        type: string
*        required: true    
*    responses:
*     200:
*       description: Post deleted
*       content:
*         application/json:
*           schema:
*             type: array
*     400:
*       description: Bad Request
*       content:
*         application/json:
*           schema:
*             type: array
*     500:
*       description: Internal Server Error
*       content:
*         application/json:
*           schema:
*             type: array
*     401:
*       description: Unauthorized
*       content:
*         application/json:
*           schema:
*             type: array
*     404:
*       description: Not Found
*       content:
*         application/json:
*           schema:
*             type: array
*/

router.delete('/:postId',verify, async(req,res) => {
    try{
    const deletedPost = await Post.remove({ _id: req.params.postId });
    res.status(200).json({Message: "Post deleted Successfully"});
    }catch(err) {
        res.json({Message: err});
    }
});


// UPDATE POST


/** 
* @swagger
* /posts:
*  patch:
*    summary: Updating a post
*    tags: [Posts]
*    description: Updates a post
*    parameters:
*      - name: postId
*        description: Id of the post needed
*        in: path
*        required: true
*      - name: auth-token
*        description: Your auth-token
*        in: header
*        type: string
*        required: true 
*    requestBody:
*      description: Provide new post details
*      content:
*          application/json:
*            schema:
*              type: object
*              properties: 
*                title:
*                  type: string
*                description:
*                  type: string
*                imageUrl:
*                  type: string
*    responses:
*     200:
*       description: Post Updated Successfully
*       content:
*         application/json:
*           schema:
*             type: array
*     400:
*       description: Bad Request
*       content:
*         application/json:
*           schema:
*             type: array
*     500:
*       description: Internal Server Error
*       content:
*         application/json:
*           schema:
*             type: array
*     401:
*       description: Unauthorized
*       content:
*         application/json:
*           schema:
*             type: array
*     404:
*       description: Not Found
*       content:
*         application/json:
*           schema:
*             type: array
*/

// router.patch('/:postId', async(req,res) => {
router.patch('/:postId',verify, async(req,res) => {

    try{
    const updatedPost = await Post.updateOne(
        { _id: req.params.postId },
        {$set: {title:req.body.title}}
        );
    res.status(200).json({Message: "Post Updated Successfully"});
    }catch(err) {
        res.json({Message: err});
    }
});

// LIKING A POST
/** 
* @swagger
* /posts/like/{postId}:
*  put:
*    summary: Liking a specific post
*    tags: [Posts]
*    description: Likes a specific post
*    parameters:
*      - name: postId
*        description: Id of the post needed
*        in: path
*        required: true
*      - name: auth-token
*        description: Your auth-token
*        in: header
*        type: string
*        required: true  
*    responses:
*     200:
*       description: Post Liked
*       content:
*         application/json:
*           schema:
*             type: array
*     400:
*       description: Bad Request
*       content:
*         application/json:
*           schema:
*             type: array
*     500:
*       description: Internal Server Error
*       content:
*         application/json:
*           schema:
*             type: array
*     401:
*       description: Unauthorized
*       content:
*         application/json:
*           schema:
*             type: array
*     404:
*       description: Not Found
*       content:
*         application/json:
*           schema:
*             type: array
*/
router.put('/like/:postId',verify, async(req,res) => {
    try {
        const post = await Post.findById(req.params.postId);

        // check if post has been liked before

          if(post.likes.find((like) => like.user == req.user.user.id)){
              return res.status(400).json({Message: "Post already Liked"});

          }
          post.likes.unshift({user: req.user.user.id});
          await post.save();
          res.status(200).json({Message: "Post Liked"});
          console.log(post);
        
     } catch (err) {
         console.error(err.message);
         res.status(500).json({Message: "Server Error"});
     }
});

// UNLIKING A POST
/** 
* @swagger
* /posts/unlike/{postId}:
*  put:
*    summary: Unliking a specific post
*    tags: [Posts]
*    description: Unlikes a specific post
*    parameters:
*      - name: postId
*        description: Id of the post needed
*        in: path
*        required: true
*      - name: auth-token
*        description: Your auth-token
*        in: header
*        type: string
*        required: true   
*    responses:
*     200:
*       description: Post unliked
*       content:
*         application/json:
*           schema:
*             type: array
*     400:
*       description: Bad Request
*       content:
*         application/json:
*           schema:
*             type: array
*     500:
*       description: Internal Server Error
*       content:
*         application/json:
*           schema:
*             type: array
*     401:
*       description: Unauthorized
*       content:
*         application/json:
*           schema:
*             type: array
*     404:
*       description: Not Found
*       content:
*         application/json:
*           schema:
*             type: array
*/

router.put('/unlike/:postId',verify, async(req,res) => {
    try {
        const post = await Post.findById(req.params.postId);

        // check if post has been liked before
        //  if(post.likes.filter(like => like.users.toString() === req.user.id).length > 0){
        //      return res.json(400).json({msg: "Post already Liked"});
        //  }
         if (
             post.likes.filter(like => like.user === req.user.user.id).length === 0
         ) {
             return res.status(400).json({ Message: "Post has not been Liked yet"});
         }
        
        // Get remove index
        const removeIndex = post.likes.map(like => like.user).indexOf(req.body._id);
        post.likes.splice(removeIndex, 1);
        await post.save();
        res.status(200).json({Message: "Post Unliked"});

        
     } catch (err) {
         console.error(err.message);
         res.status(500).json({Message: "Server Error"});
     }
});

// COMMENTS

/** 
* @swagger
* /posts/comment/{id}:
*  post:
*    summary: Commenting on a post
*    tags: [Posts]
*    description: comments on a post
*    parameters:
*      - name: id
*        description: Id of the post needed
*        in: path
*        required: true
*      - name: auth-token
*        description: Your auth-token
*        in: header
*        type: string
*        required: true 
*    requestBody:
*      description: Provide your comment here
*      content:
*          application/json:
*            schema:
*              type: object
*              properties: 
*                text:
*                  type: string
*    responses:
*     200:
*       description: Comment added Successfully
*       content:
*         application/json:
*           schema:
*             type: array
*     400:
*       description: Bad Request
*       content:
*         application/json:
*           schema:
*             type: array
*     500:
*       description: Internal Server Error
*       content:
*         application/json:
*           schema:
*             type: array
*     401:
*       description: Unauthorized
*       content:
*         application/json:
*           schema:
*             type: array
*     404:
*       description: Not Found
*       content:
*         application/json:
*           schema:
*             type: array
*/

router.post('/comment/:id',verify, async(req,res) => {
    try {
        const user = await User.findById(req.user.user.id);
        const post = await Post.findById(req.params.id);
        const newComment = {
            text: req.body.text,
            name: user.name,
            user: user.id
        };
        post.comments.unshift(newComment);
        await post.save();
        res.status(200).json({Message: 'Comment Added'})
        
        
    } catch (err) {
        console.error(err.message);
        res.status(500).json({Message: 'Server Error'});
    }
});

// Removing a comment
/** 
* @swagger
* /posts/comment/{id}/{comment_id}:
*  post:
*    summary: Removing a Comment from a post
*    tags: [Posts]
*    description: comments on a post
*    parameters:
*      - name: postId
*        description: Id of the post needed
*        in: path
*        required: true 
*      - name: CommentId
*        description: Id of the comment needed
*        in: path
*        required: true 
*      - name: auth-token
*        description: Your auth-token
*        in: header
*        type: string
*        required: true 
*    responses:
*     200:
*       description: Comment removed Successfully
*       content:
*         application/json:
*           schema:
*             type: array
*     400:
*       description: Bad Request
*       content:
*         application/json:
*           schema:
*             type: array
*     500:
*       description: Internal Server Error
*       content:
*         application/json:
*           schema:
*             type: array
*     401:
*       description: Unauthorized
*       content:
*         application/json:
*           schema:
*             type: array
*     404:
*       description: Not Found
*       content:
*         application/json:
*           schema:
*             type: array
*/

// router.post('/comment/:id/:comment_id', verify, async(req,res) => {
//     try {
//         const post = await Post.findById(req.params.id);

//         // GET COMMENT TO BE REMOVED
//         const comment = post.comments.find(comment => comment.id === req.params.comment_id);
//         if(!comment) {
//             return res.status(404).json({message: "Comment does not exist"});
//         }

//         // Check user
//         // if(comment.user !== req.user.user.id) {
//         //     return res.status(401).json({message: "Unauthorized"}); 
//         // }

//         // delete
//         const removeIndex = post.comments.map(comment => comment.user).indexOf(req.user.user.id);
//         post.comments.splice(removeIndex, 1);
//         await post.save();
//         res.json(post.comments);

        
    // } catch (err) {
    //     console.error(err.message);
    //     res.status(500).json({Message: 'Server Error'}); 
    // }
//});







module.exports = router;