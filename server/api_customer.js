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
const Customer = require('./models/customer_schema');
const VerifyToken = require('./auth/VerifyToken');

// Add customer cannot gen-password
// router.post(`/customer`, function (req, res) {
//     console.log("Add Customer V1");
//     Customer.create(req.body, (err, result) => {
//         if (err) throw err;
//
//         res.json(req.body);
//     });
// });

// Add customer and generate-token-password
router.post('/customer', (req, res)=>{

    // var hashedPassword = bcrypt.hashSync(req.body.customerPassword, 8);
    // req.body.customerPassword = hashedPassword;

    Customer.create(req.body, (error, result)=>{

        if(error)
        {
            return res.json({result: "failed", error: JSON.stringify(error)})
        }

        req.body.result = "Register Success"
        res.json(req.body)
    })
    console.log("Add Customer to database and GenToken-Password");
    console.log(req.body);
});

// Show all customers
router.get(`/customer`, function (req, res) {

    console.log("Show Customer V1 ");
    Customer.find((err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    // }).sort({ customerId : 'desc'});
    }).sort({ customerId : 'desc'});
});

// Show Customer by id
// router.get(`/customer/id/:id`, function (req, res) {
router.get(`/customer/:id`, function (req, res) {

    // console.log("get for Show Customer with id V1 -- view new --");
    Customer.findOne({customerId: req.params.id}, (err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    });
});


// Get Customer by keyword
// router.get(`/customer/name/:keyword`, function (req, res) {
//     console.log("get customers by keyword");
//     // console.log(req.params.keyword);
//
//     const query = {customerName: new RegExp("^.*" + req.params.keyword + ".*$", "i")};
//     Customer.find(query, (err, result) => {
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


// Update Customer
router.put(`/customer`, function (req, res) {
    console.log("Update Customer V1 ");

    Customer.findOneAndUpdate({customerId: req.body.customerId}, req.body, (err, result) => {
        // console.log('result : ' + result.customerImage);
        // if ((result.customerImage === '') || (result.customerImage === null)) {
        //     // console.log('image is Null && ""');
        // } else if (result.customerImage === req.body.customerImage) {
        //     // console.log('Same image');
        // } else if ((result.customerImage === '') &&  (req.body.customerImage.length > 0)) {
        //     // console.log('Not same image');
        // } else if ((result.customerImage === null) &&  (req.body.customerImage.length > 0)) {
        //     // console.log('file image cannot deleted but update new picture successfully');
        //     // console.log('<><> >> ' + req.body.customerImage + " <++> " + result.customerImage);
        //     // ถ้ามีไฟล์รูปภาพใหม่มาแทนที่ ให้ไฟล์ภาพเก่าทิ้งก่อน
        //     fs.unlink(`server/uploaded/images/customer/` + result.customerImage, function(err){
        //         if(err) return console.log(err);
        //         console.log('1-- file deleted successfully => ' + result.customerImage);
        //     });
        // } else if ((result.customerImage.length > 0) &&  (req.body.customerImage.length > 0)) {
        //     // console.log('file image cannot deleted but update new picture successfully');
        //     // console.log('<><> >> ' + req.body.customerImage + " <++> " + result.customerImage);
        //     // ถ้ามีไฟล์รูปภาพใหม่มาแทนที่ ให้ไฟล์ภาพเก่าทิ้งก่อน
        //     fs.unlink(`server/uploaded/images/customer/` + result.customerImage, function(err){
        //         if(err) return console.log(err);
        //         console.log('2--file deleted successfully => ' + result.customerImage);
        //     });
        // }

        if (err) throw err;

        const response = {result: "ok", message: "Updated"};
        console.log("Update Customer V1: " + req.body._id + ", " + JSON.stringify(result));
        res.json(response);
    });
});

// Delete Customer by id
router.delete(`/customer/:id`, function (req, res) {
    console.log("Delete Customer V1");

    Customer.findOneAndRemove({customerId: req.params.id}, (err, result) => {
        // ถ้ามีไฟล์รูปภาพ  ให้ไฟล์ภาพเก่าทิ้งก่อน แล้วลบข้อมูลในดาต้าเบส
        // if ((result.customerImage !== '') || (result.customerImage !== null)) {
        if ((result.customerImage == '') || (result.customerImage == null)) {
            // console.log(result.customerImage);
        } else {
            fs.unlink(`server/uploaded/images/customer/` + result.customerImage, function(err){
                if(err) return console.log(err);
                console.log('file deleted successfully => ' + result.customerImage);
            });
        }

        if (err) throw err;

        const response = {result: "ok", message: "Removed"};
        res.json(response);
    });
});

// Upload file
router.post(`/fileUploadCustomer`, function (req, res) {

    console.log("Upload File Customer");

    try {
        const form = new formidable.IncomingForm();
        const newname = uniqid.time() + uniqid();
        form.parse(req, function (err, fields, files) {

            const oldpath = files['file'].path;
            const fileExtention = files['file'].name.split(".")[1];
            const newpath = path.resolve(`server/uploaded/images/customer`) + '/' + newname + "." + fileExtention;
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
