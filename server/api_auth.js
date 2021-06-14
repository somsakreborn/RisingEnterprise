const express = require('express');
const path = require('path');
const router = express.Router();
const formidable = require('formidable');

var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('./config');
const VerifyToken = require('./auth/VerifyToken');

const db = require('./db');

const User = require('./models/user_schema');
const mongoose = require('mongoose');

router.post('/login', (req, res)=>{

    User.findOne({userName:req.body.userName}, (err, user)=>{

        if (err) return res.json({ auth: false, token: "", msg: "Error on the server." });
        if (!user) return res.json({ auth: false, token: "", msg: "Invalid username" });

        const isValidPassword = bcrypt.compareSync(req.body.userPassword, user.userPassword)
        if (!isValidPassword) return res.json({ auth: false, token: "", msg: "Invalid password" });

         // In case valid
        var token = jwt.sign({ id: user._id }, config.secret, {
            // expiresIn: 86400 // expires in 24 hours
            expiresIn: 36000 // expires in 1 hours
        });

        return res.json({
            auth: true, token: token, msg: "Passed",
            userId: user.userId, userName: user.userName, userImage: user.userImage,
            userLevel: user.userLevel
        });

    })

})

// Logout
router.get('/logout', function (req, res) {
    return res.json({ auth: false, token: "", msg: "Passed" });
});

// Register User for database && console.log (Server)
router.post('/register', (req, res)=>{

    var hashedPassword = bcrypt.hashSync(req.body.userPassword, 8);
    req.body.userPassword = hashedPassword;

    User.create(req.body, (error, result)=>{

        if(error)
        {
            return res.json({result: "failed", error: JSON.stringify(error)})
        }

        req.body.result = "Register Success"
        res.json(req.body)
    })
    console.log("Add User to database");
    console.log(req.body);
});

module.exports = router;
