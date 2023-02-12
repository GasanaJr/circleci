const router = require('express').Router();
//const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('./verifyRoute');
const {registerValidation, loginValidation} = require('./validation');

// Getting All users
/** 
* @swagger
* /api/user:
*  get:
*    summary: Getting all Users
*    tags: [Users]
*    description: Returns all Users
*    responses:
*     200:
*       description: These are all the users available in the database
*       content:
*         application/json:
*           schema:
*             type: array
*/


router.get('/', async (req,res) => {
        try {
          const allUsers = await User.find();
          if (!allUsers) {
            res.status(500).json({ message: "Server Error - Try again later." });
          } else {
            res.status(200).json(allUsers);
          }
        } catch (error) {
          console.log("Error fetching all users:", error.message);
        }
      
});

// Registration of Users
/** 
* @swagger
* /api/user/register:
*  post:
*    summary: Registering a new user
*    tags: [Users]
*    description: Creates a new user
*    requestBody:
*      description: Provide User details
*      content:
*          application/json:
*            schema:
*              type: object
*              properties: 
*                name:
*                  type: string
*                email:
*                  type: string
*                password:
*                  type: string
*    responses:
*     201:
*       description: User Created Successfully
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

router.post('/register',async (req,res) => {

   //  Data Validation
    const {error} = registerValidation(req.body);
     if(error) return res.status(400).json(error.details[0].message);

     // Checking if a user exists
     const emailExist = await User.findOne({email: req.body.email});
     if(emailExist) return res.status(400).json({Message: 'Email already exists'});

     //Hashing the passwords
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user

      const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword
      });
      try {
          const savedUser = await user.save();
          res.status(201).json({Message: "User Created Successfully"});
      } catch(err) {
          res.status(400).json(err);
      }
});

// ----------------------------Login---------------------
/** 
* @swagger
* /api/user/login:
*  post:
*    summary: Log in of Users
*    tags: [Users]
*    description: Logs a new user
*    requestBody:
*      description: Provide Login details
*      content:
*          application/json:
*            schema:
*              type: object
*              properties: 
*                email:
*                  type: string
*                password:
*                  type: string
*    responses:
*     200:
*       description: User Login Successful
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
router.post('/login', async(req,res) => {
    // Validating the user
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).json({Message: error.details[0].message});
    // checking if user exists
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).json({Message: 'Email does not exist'});
    // Check password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).json({Message: 'Password is incorrect'});
    //Create and assign a token
    const payload = {
        user: {
            id: user.id
        }
      }
     jwt.sign(payload, process.env.TOKEN_SECRET, (err,token) => {
        if(err) throw err;
        res.json({token});
     });
    // res.header('auth-token',token).json(token);


});

module.exports = router;