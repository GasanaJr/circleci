const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Import Routes
 const authRoute = require('./routes/auth');
 const checkRoute = require('./routes/checkjwt');

// DB Connection
 mongoose.connect(process.env.DB_CONNECTION).then(()=> {
     console.log('Connected to DB');
    }).catch((err)=> {
        console.log(err);
    }); 

// MiddleWare
 app.use(express.json());
// Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/check', checkRoute);

app.get('/', (req,res) => {
    res.send('We are on home');
})


app.listen(3000, () => console.log("Server started"));
