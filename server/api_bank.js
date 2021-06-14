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
const Bank = require('./models/bank_schema');
const VerifyToken = require('./auth/VerifyToken');

// Add bank
router.post(`/bank`, function (req, res) {
    console.log("Add Bank V1");
    Bank.create(req.body, (err, result) => {
        if (err) throw err;

        res.json(req.body);
    });
});

// Show all banks
router.get(`/bank`, function (req, res) {

    // console.log("Show Bank V1 ");
    Bank.find((err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    }).sort({bankStatus : -1, bankId : 'desc'});
});

// Show Bank by id
// router.get(`/bank/id/:id`, function (req, res) {
router.get(`/bank/:id`, function (req, res) {

    // console.log("get for Show Bank with id V1 -- view new --");
    Bank.findOne({bankId: req.params.id}, (err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    });
});


// Get Bank by keyword
router.get(`/bank/name/:keyword`, function (req, res) {
    console.log("get banks by keyword");
    // console.log(req.params.keyword);

    const query = {bankName: new RegExp("^.*" + req.params.keyword + ".*$", "i")};
    Bank.find(query, (err, result) => {
        if (err) throw err;

        if (result) {
            // console.log(err + " true =" + result + query)
            res.json(result);
        } else {
            // console.log(err + "else =" + result + query)
            res.json([]);
        }
    });
});


// Update Bank
router.put(`/bank`, function (req, res) {
    console.log("Update Bank V1 ");

    Bank.findOneAndUpdate({bankId: req.body.bankId}, req.body, (err, result) => {
        // console.log('result : ' + result.bankImage);
        if ((result.bankImage === '') || (result.bankImage === null)) {
            // console.log('image is Null && ""');
        } else if (result.bankImage === req.body.bankImage) {
            // console.log('Same image');
        } else if ((result.bankImage === '') &&  (req.body.bankImage.length > 0)) {
            // console.log('Not same image');
        } else if ((result.bankImage === null) &&  (req.body.bankImage.length > 0)) {
            // console.log('file image cannot deleted but update new picture successfully');
            // console.log('<><> >> ' + req.body.bankImage + " <++> " + result.bankImage);
            // ถ้ามีไฟล์รูปภาพใหม่มาแทนที่ ให้ไฟล์ภาพเก่าทิ้งก่อน
            fs.unlink(`server/uploaded/images/bank/` + result.bankImage, function(err){
                if(err) return console.log(err);
                console.log('1-- file deleted successfully => ' + result.bankImage);
            });
        } else if ((result.bankImage.length > 0) &&  (req.body.bankImage.length > 0)) {
            // console.log('file image cannot deleted but update new picture successfully');
            // console.log('<><> >> ' + req.body.bankImage + " <++> " + result.bankImage);
            // ถ้ามีไฟล์รูปภาพใหม่มาแทนที่ ให้ไฟล์ภาพเก่าทิ้งก่อน
            fs.unlink(`server/uploaded/images/bank/` + result.bankImage, function(err){
                if(err) return console.log(err);
                console.log('2--file deleted successfully => ' + result.bankImage);
            });
        }
        
        if (err) throw err;

        const response = {result: "ok", message: "Updated"};
        console.log("Update Bank V1: " + req.body._id + ", " + JSON.stringify(result));
        res.json(response);
    });
});

// Delete Bank by id
router.delete(`/bank/:id`, function (req, res) {
    console.log("Delete Bank V1");

    Bank.findOneAndRemove({bankId: req.params.id}, (err, result) => {
        // ถ้ามีไฟล์รูปภาพ  ให้ไฟล์ภาพเก่าทิ้งก่อน แล้วลบข้อมูลในดาต้าเบส
        // if ((result.bankImage !== '') || (result.bankImage !== null)) {
        if ((result.bankImage == '') || (result.bankImage == null)) {
            // console.log(result.bankImage);
        } else {
            fs.unlink(`server/uploaded/images/bank/` + result.bankImage, function(err){
                if(err) return console.log(err);
                console.log('file deleted successfully => ' + result.bankImage);
            });
        }
        
        if (err) throw err;

        const response = {result: "ok", message: "Removed"};
        res.json(response);
    });
});

// Upload file
router.post(`/fileUploadBank`, function (req, res) {

    console.log("Upload File Bank");

    try {
        const form = new formidable.IncomingForm();
        const newname = uniqid.time() + uniqid();
        form.parse(req, function (err, fields, files) {

            const oldpath = files['file'].path;
            const fileExtention = files['file'].name.split(".")[1];
            const newpath = path.resolve(`server/uploaded/images/bank`) + '/' + newname + "." + fileExtention;
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
