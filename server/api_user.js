const express = require('express');
const path = require('path');
const formidable = require('formidable');
const router = express.Router();
const fs = require('fs');
let uniqid = require('uniqid');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('./config');
const db = require('./db');

const mongoose = require('mongoose');
const User = require('./models/user_schema');
const VerifyToken = require('./auth/VerifyToken');

// Add user cannot gen-password
// router.post(`/user`, function (req, res) {
//     console.log("Add User V1");
//     User.create(req.body, (err, result) => {
//         if (err) throw err;
//
//         res.json(req.body);
//     });
// });

// Add user and generate-token-password
router.post('/user', (req, res)=>{

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
    console.log("Add User to database and GenToken-Password");
    console.log(req.body);
});

// Show all users
router.get(`/user`, function (req, res) {

    console.log("Show User V1 ");
    User.find((err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    }).sort({ userId : 'desc'});
});

// Show User by id
// router.get(`/user/id/:id`, function (req, res) {
router.get(`/user/:id`, function (req, res) {

    // console.log("get for Show User with id V1 -- view new --");
    User.findOne({userId: req.params.id}, (err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    });
});


// Get User by keyword
// router.get(`/user/name/:keyword`, function (req, res) {
//     console.log("get users by keyword");
//     // console.log(req.params.keyword);
//
//     const query = {userName: new RegExp("^.*" + req.params.keyword + ".*$", "i")};
//     User.find(query, (err, result) => {
//         if (err) throw err;
//
//         if (result) {
//             // console.log(err + " true =" + result + query)
//             res.json(result);
//         } else {
//             // console.log(err + "else =" + result + query)
//             res.json([]);
//         }
//     });
// });


// Update User
router.put(`/user`, function (req, res) {
    console.log("Update User V1 ");

    User.findOneAndUpdate({userId: req.body.userId}, req.body, (err, result) => {
        // console.log('result : ' + result.userImage);
        if ((result.userImage === '') || (result.userImage === null)) {
            // console.log('image is Null && ""');
        } else if (result.userImage === req.body.userImage) {
            // console.log('Same image');
        } else if ((result.userImage === '') &&  (req.body.userImage.length > 0)) {
            // console.log('Not same image');
        } else if ((result.userImage === null) &&  (req.body.userImage.length > 0)) {
            // console.log('file image cannot deleted but update new picture successfully');
            // console.log('<><> >> ' + req.body.userImage + " <++> " + result.userImage);
            // ถ้ามีไฟล์รูปภาพใหม่มาแทนที่ ให้ไฟล์ภาพเก่าทิ้งก่อน
            fs.unlink(`server/uploaded/images/user/` + result.userImage, function(err){
                if(err) return console.log(err);
                console.log('1-- file deleted successfully => ' + result.userImage);
            });
        } else if ((result.userImage.length > 0) &&  (req.body.userImage.length > 0)) {
            // console.log('file image cannot deleted but update new picture successfully');
            // console.log('<><> >> ' + req.body.userImage + " <++> " + result.userImage);
            // ถ้ามีไฟล์รูปภาพใหม่มาแทนที่ ให้ไฟล์ภาพเก่าทิ้งก่อน
            fs.unlink(`server/uploaded/images/user/` + result.userImage, function(err){
                if(err) return console.log(err);
                console.log('2--file deleted successfully => ' + result.userImage);
            });
        }

        if (err) throw err;

        const response = {result: "ok", message: "Updated"};
        console.log("Update User V1: " + req.body._id + ", " + JSON.stringify(result));
        res.json(response);
    });
});

// Delete User by id
router.delete(`/user/:id`, function (req, res) {
    console.log("Delete User V1");

    User.findOneAndRemove({userId: req.params.id}, (err, result) => {
        // ถ้ามีไฟล์รูปภาพ  ให้ไฟล์ภาพเก่าทิ้งก่อน แล้วลบข้อมูลในดาต้าเบส
        // if ((result.userImage !== '') || (result.userImage !== null)) {
        if ((result.userImage == '') || (result.userImage == null)) {
            // console.log(result.userImage);
        } else {
            fs.unlink(`server/uploaded/images/user/` + result.userImage, function(err){
                if(err) return console.log(err);
                console.log('file deleted successfully => ' + result.userImage);
            });
        }

        if (err) throw err;

        const response = {result: "ok", message: "Removed"};
        res.json(response);
    });
});

// Upload file
router.post(`/fileUploadUser`, function (req, res) {

    console.log("Upload File User");

    try {
        const form = new formidable.IncomingForm();
        const newname = uniqid.time() + uniqid();
        form.parse(req, function (err, fields, files) {

            const oldpath = files['file'].path;
            const fileExtention = files['file'].name.split(".")[1];
            const newpath = path.resolve(`server/uploaded/images/user`) + '/' + newname + "." + fileExtention;
            console.log(newpath);
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                res.end('[{"success":1,"messege":"File uploaded and moved!","name":"' + newname + "." + fileExtention + '"}]');
            });
        });
    } catch (err) {
        console.log("err : " + err);
    }
});

module.exports = router;
