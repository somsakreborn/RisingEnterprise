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
const Pixel = require('./models/pixel_schema');
const VerifyToken = require('./auth/VerifyToken');

// Add channel
router.post(`/pixel`, function (req, res) {
    console.log("Add Pixel V1");
    Pixel.create(req.body, (err, result) => {
        if (err) throw err;

        res.json(req.body);
    });
});


// Show all pixels
router.get(`/pixel`, function (req, res) {

    console.log("Show Pixel V1 ");
    Pixel.find((err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    }).sort({pixelStatus : 'desc', pixelId : 'desc'});
});

// Show Pixel by id
// router.get(`/pixel/id/:id`, function (req, res) {
router.get(`/pixel/:id`, function (req, res) {

    // console.log("get for Show Pixel with id V1 -- view new --");
    Pixel.findOne({pixelId: req.params.id}, (err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    });
});


// Update Pixel
router.put(`/pixel`, function (req, res) {
    console.log("Update Pixel V1 " + req.body.pixelId);

    Pixel.findOneAndUpdate({pixelId: req.body.pixelId}, req.body, (err, result) => {
        // console.log('result : ' + result.pixelImage);
        // if ((result.pixelImage === '') || (result.pixelImage === null)) {
        //     // console.log('image is Null && ""');
        // } else if (result.pixelImage === req.body.pixelImage) {
        //     // console.log('Same image');
        // } else if ((result.pixelImage === '') &&  (req.body.pixelImage.length > 0)) {
        //     // console.log('Not same image');
        // } else if ((result.pixelImage === null) &&  (req.body.pixelImage.length > 0)) {
        //     // console.log('file image cannot deleted but update new picture successfully');
        //     // console.log('<><> >> ' + req.body.pixelImage + " <++> " + result.pixelImage);
        //     // ถ้ามีไฟล์รูปภาพใหม่มาแทนที่ ให้ไฟล์ภาพเก่าทิ้งก่อน
        //     fs.unlink(`server/uploaded/images/pixel/` + result.pixelImage, function(err){
        //         if(err) return console.log(err);
        //         console.log('1-- file deleted successfully => ' + result.pixelImage);
        //     });
        // } else if ((result.pixelImage.length > 0) &&  (req.body.pixelImage.length > 0)) {
        //     // console.log('file image cannot deleted but update new picture successfully');
        //     // console.log('<><> >> ' + req.body.pixelImage + " <++> " + result.pixelImage);
        //     // ถ้ามีไฟล์รูปภาพใหม่มาแทนที่ ให้ไฟล์ภาพเก่าทิ้งก่อน
        //     fs.unlink(`server/uploaded/images/pixel/` + result.pixelImage, function(err){
        //         if(err) return console.log(err);
        //         console.log('2--file deleted successfully => ' + result.pixelImage);
        //     });
        // }

        if (err) throw err;

        const response = {result: "ok", message: "Updated"};
        // console.log("Update Pixel V1: " + req.body._id + ", " + JSON.stringify(result));
        res.json(response);
    });
});

// Delete Pixel by id
router.delete(`/pixel/:id`, function (req, res) {
    console.log("Delete Pixel V1" + req.params.id);

    Pixel.findOneAndRemove({pixelId: req.params.id}, (err, result) => {
        // ถ้ามีไฟล์รูปภาพ  ให้ไฟล์ภาพเก่าทิ้งก่อน แล้วลบข้อมูลในดาต้าเบส
        // if ((result.pixelImage !== '') || (result.pixelImage !== null)) {
        // if ((result.pixelImage == '') || (result.pixelImage == null)) {
        //     // console.log(result.pixelImage);
        // } else {
        //     fs.unlink(`server/uploaded/images/pixel/` + result.pixelImage, function(err){
        //         if(err) return console.log(err);
        //         console.log('file deleted successfully => ' + result.pixelImage);
        //     });
        // }

        if (err) throw err;

        const response = {result: "ok", message: "Removed"};
        res.json(response);
    });
});

// Upload file
router.post(`/fileUploadPixel`, function (req, res) {

    console.log("Upload File Pixel");

    try {
        const form = new formidable.IncomingForm();
        const newname = uniqid.time() + uniqid();
        form.parse(req, function (err, fields, files) {

            const oldpath = files['file'].path;
            const fileExtention = files['file'].name.split(".")[1];
            const newpath = path.resolve(`server/uploaded/images/pixel`) + '/' + newname + "." + fileExtention;
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
