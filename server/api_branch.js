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
const Branch = require('./models/branch_schema');
const VerifyToken = require('./auth/VerifyToken');

// Add branch
router.post(`/branch`, function (req, res) {
    console.log("Add Branch V1");
    Branch.create(req.body, (err, result) => {
        if (err) throw err;

        res.json(req.body);
    });
});

// Show all branchs
router.get(`/branch`, function (req, res) {

    console.log("Show Branch V1 ");

    Branch.find((err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    }).sort({ branchId : 'desc'});
});

// Show Branch by id
// router.get(`/branch/id/:id`, function (req, res) {
router.get(`/branch/:id`, function (req, res) {

    console.log("get for Show Branch with id V1 -- view new --");
    Branch.findOne({branchId: req.params.id}, (err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    });
});


// Get Branch by keyword
router.get(`/branch/name/:keyword`, function (req, res) {
    console.log("get branchs by keyword");
    // console.log(req.params.keyword);

    const query = {branchName: new RegExp("^.*" + req.params.keyword + ".*$", "i")};
    Branch.find(query, (err, result) => {
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


// Update Branch
router.put(`/branch`, function (req, res) {
    console.log("Update Branch V1 ");

    Branch.findOneAndUpdate({branchId: req.body.branchId}, req.body, (err, result) => {
        // console.log('result : ' + result.branchImage);
        if ((result.branchImage === '') || (result.branchImage === null)) {
            // console.log('image is Null && ""');
        } else if (result.branchImage === req.body.branchImage) {
            // console.log('Same image');
        } else if ((result.branchImage === '') &&  (req.body.branchImage.length > 0)) {
            // console.log('Not same image');
        } else if ((result.branchImage === null) &&  (req.body.branchImage.length > 0)) {
            // console.log('file image cannot deleted but update new picture successfully');
            // console.log('<><> >> ' + req.body.branchImage + " <++> " + result.branchImage);
            // ถ้ามีไฟล์รูปภาพใหม่มาแทนที่ ให้ไฟล์ภาพเก่าทิ้งก่อน
            fs.unlink(`server/uploaded/images/branch/` + result.branchImage, function(err){
                if(err) return console.log(err);
                console.log('1-- file deleted successfully => ' + result.branchImage);
            });
        } else if ((result.branchImage.length > 0) &&  (req.body.branchImage.length > 0)) {
            // console.log('file image cannot deleted but update new picture successfully');
            // console.log('<><> >> ' + req.body.branchImage + " <++> " + result.branchImage);
            // ถ้ามีไฟล์รูปภาพใหม่มาแทนที่ ให้ไฟล์ภาพเก่าทิ้งก่อน
            fs.unlink(`server/uploaded/images/branch/` + result.branchImage, function(err){
                if(err) return console.log(err);
                console.log('2--file deleted successfully => ' + result.branchImage);
            });
        }
        
        if (err) throw err;

        const response = {result: "ok", message: "Updated"};
        console.log("Update Branch V1: " + req.body._id + ", " + JSON.stringify(result));
        res.json(response);
    });
});

// Delete Branch by id
router.delete(`/branch/:id`, function (req, res) {
    console.log("Delete Branch V1");

    Branch.findOneAndRemove({branchId: req.params.id}, (err, result) => {
        // ถ้ามีไฟล์รูปภาพ  ให้ไฟล์ภาพเก่าทิ้งก่อน แล้วลบข้อมูลในดาต้าเบส
        // if ((result.branchImage !== '') || (result.branchImage !== null)) {
        if ((result.branchImage === '') || (result.branchImage === null)) {
            // console.log(result.branchImage);
        } else {
            fs.unlink(`server/uploaded/images/branch/` + result.branchImage, function(err){
                if(err) return console.log(err);
                console.log('file deleted successfully => ' + result.branchImage);
            });
        }
        
        if (err) throw err;

        const response = {result: "ok", message: "Removed"};
        res.json(response);
    });
});

// bank file
router.post(`/fileUploadBranch`, function (req, res) {
    console.log("Upload File Branch");

    try {
        const form = new formidable.IncomingForm();
        const newname = uniqid.time() + uniqid();
        form.parse(req, function (err, fields, files) {

            const oldpath = files['file'].path;
            const fileExtention = files['file'].name.split(".")[1];
            const newpath = path.resolve(`server/uploaded/images/branch`) + '/' + newname + "." + fileExtention;
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
