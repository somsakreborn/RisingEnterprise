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
const Category = require('./models/category_schema');
const VerifyToken = require('./auth/VerifyToken');

// search Id Counter by categoryId Seq

// Add category
router.post(`/category`, function (req, res) {
    console.log("Add Category V1");
    Category.create(req.body, (err, result) => {
        if (err) throw err;

        res.json(req.body);
    });
});

// Show all categorys
router.get(`/category`, function (req, res) {

    console.log("Show Category V1 ");
    Category.find((err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    }).sort({categoryStatus : -1, categorySeq : 'asc'});
});

// Show Category by id
// router.get(`/category/id/:id`, function (req, res) {
router.get(`/category/:id`, function (req, res) {

    // console.log("get for Show Category with id V1 -- view new --");
    Category.findOne({categoryId: req.params.id}, (err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    });
});


// Update Category
router.put(`/category`, function (req, res) {
    console.log("Update Category V1 ");

    Category.findOneAndUpdate({categoryId: req.body.categoryId}, req.body, (err, result) => {
        // console.log('result : ' + result.categoryImage);
        if ((result.categoryImage === '') || (result.categoryImage === null)) {
            // console.log('image is Null && ""');
        } else if (result.categoryImage === req.body.categoryImage) {
            // console.log('Same image');
        } else if ((result.categoryImage === '') &&  (req.body.categoryImage.length > 0)) {
            // console.log('Not same image');
        } else if ((result.categoryImage === null) &&  (req.body.categoryImage.length > 0)) {
            // console.log('file image cannot deleted but update new picture successfully');
            // console.log('<><> >> ' + req.body.categoryImage + " <++> " + result.categoryImage);
            // ถ้ามีไฟล์รูปภาพใหม่มาแทนที่ ให้ไฟล์ภาพเก่าทิ้งก่อน
            fs.unlink(`server/uploaded/images/category/` + result.categoryImage, function(err){
                if(err) return console.log(err);
                console.log('1-- file deleted successfully => ' + result.categoryImage);
            });
        } else if ((result.categoryImage.length > 0) &&  (req.body.categoryImage.length > 0)) {
            // console.log('file image cannot deleted but update new picture successfully');
            // console.log('<><> >> ' + req.body.categoryImage + " <++> " + result.categoryImage);
            // ถ้ามีไฟล์รูปภาพใหม่มาแทนที่ ให้ไฟล์ภาพเก่าทิ้งก่อน
            fs.unlink(`server/uploaded/images/category/` + result.categoryImage, function(err){
                if(err) return console.log(err);
                console.log('2--file deleted successfully => ' + result.categoryImage);
            });
        }

        if (err) throw err;

        const response = {result: "ok", message: "Updated"};
        console.log("Update Category V1: " + req.body._id + ", " + JSON.stringify(result));
        res.json(response);
    });
});

// Delete Category by id
router.delete(`/category/:id`, function (req, res) {
    console.log("Delete Category V1");

    Category.findOneAndRemove({categoryId: req.params.id}, (err, result) => {
        // ถ้ามีไฟล์รูปภาพ  ให้ไฟล์ภาพเก่าทิ้งก่อน แล้วลบข้อมูลในดาต้าเบส
        // if ((result.categoryImage !== '') || (result.categoryImage !== null)) {
        if ((result.categoryImage == '') || (result.categoryImage == null)) {
            // console.log(result.categoryImage);
        } else {
            fs.unlink(`server/uploaded/images/category/` + result.categoryImage, function(err){
                if(err) return console.log(err);
                console.log('file deleted successfully => ' + result.categoryImage);
            });
        }

        if (err) throw err;

        const response = {result: "ok", message: "Removed"};
        res.json(response);
    });
});

// Upload file
router.post(`/fileUploadCategory`, function (req, res) {

    console.log("Upload File Category");

    try {
        const form = new formidable.IncomingForm();
        const newname = uniqid.time() + uniqid();
        form.parse(req, function (err, fields, files) {

            const oldpath = files['file'].path;
            const fileExtention = files['file'].name.split(".")[1];
            const newpath = path.resolve(`server/uploaded/images/category`) + '/' + newname + "." + fileExtention;
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
