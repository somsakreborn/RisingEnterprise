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
const Channel = require('./models/channel_schema');
const VerifyToken = require('./auth/VerifyToken');

// Add channel
router.post(`/channel`, function (req, res) {
    console.log("Add Channel V1");
    Channel.create(req.body, (err, result) => {
        if (err) throw err;

        res.json(req.body);
    });
});


// Show all channels
router.get(`/channel`, function (req, res) {

    console.log("Show Channel V1 ");
    Channel.find((err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    }).sort({channelStatus : 'desc', channelId : 'desc'});
});

// Show Channel by id
// router.get(`/channel/id/:id`, function (req, res) {
router.get(`/channel/:id`, function (req, res) {

    // console.log("get for Show Channel with id V1 -- view new --");
    Channel.findOne({channelId: req.params.id}, (err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    });
});


// Update Channel
router.put(`/channel`, function (req, res) {
    console.log("Update Channel V1 ");

    Channel.findOneAndUpdate({channelId: req.body.channelId}, req.body, (err, result) => {
        // console.log('result : ' + result.channelImage);
        if ((result.channelImage === '') || (result.channelImage === null)) {
            // console.log('image is Null && ""');
        } else if (result.channelImage === req.body.channelImage) {
            // console.log('Same image');
        } else if ((result.channelImage === '') &&  (req.body.channelImage.length > 0)) {
            // console.log('Not same image');
        } else if ((result.channelImage === null) &&  (req.body.channelImage.length > 0)) {
            // console.log('file image cannot deleted but update new picture successfully');
            // console.log('<><> >> ' + req.body.channelImage + " <++> " + result.channelImage);
            // ถ้ามีไฟล์รูปภาพใหม่มาแทนที่ ให้ไฟล์ภาพเก่าทิ้งก่อน
            fs.unlink(`server/uploaded/images/channel/` + result.channelImage, function(err){
                if(err) return console.log(err);
                console.log('1-- file deleted successfully => ' + result.channelImage);
            });
        } else if ((result.channelImage.length > 0) &&  (req.body.channelImage.length > 0)) {
            // console.log('file image cannot deleted but update new picture successfully');
            // console.log('<><> >> ' + req.body.channelImage + " <++> " + result.channelImage);
            // ถ้ามีไฟล์รูปภาพใหม่มาแทนที่ ให้ไฟล์ภาพเก่าทิ้งก่อน
            fs.unlink(`server/uploaded/images/channel/` + result.channelImage, function(err){
                if(err) return console.log(err);
                console.log('2--file deleted successfully => ' + result.channelImage);
            });
        }

        if (err) throw err;

        const response = {result: "ok", message: "Updated"};
        console.log("Update Channel V1: " + req.body._id + ", " + JSON.stringify(result));
        res.json(response);
    });
});

// Delete Channel by id
router.delete(`/channel/:id`, function (req, res) {
    console.log("Delete Channel V1");

    Channel.findOneAndRemove({channelId: req.params.id}, (err, result) => {
        // ถ้ามีไฟล์รูปภาพ  ให้ไฟล์ภาพเก่าทิ้งก่อน แล้วลบข้อมูลในดาต้าเบส
        // if ((result.channelImage !== '') || (result.channelImage !== null)) {
        if ((result.channelImage == '') || (result.channelImage == null)) {
            // console.log(result.channelImage);
        } else {
            fs.unlink(`server/uploaded/images/channel/` + result.channelImage, function(err){
                if(err) return console.log(err);
                console.log('file deleted successfully => ' + result.channelImage);
            });
        }

        if (err) throw err;

        const response = {result: "ok", message: "Removed"};
        res.json(response);
    });
});

// Upload file
router.post(`/fileUploadChannel`, function (req, res) {

    console.log("Upload File Channel");

    try {
        const form = new formidable.IncomingForm();
        const newname = uniqid.time() + uniqid();
        form.parse(req, function (err, fields, files) {

            const oldpath = files['file'].path;
            const fileExtention = files['file'].name.split(".")[1];
            const newpath = path.resolve(`server/uploaded/images/channel`) + '/' + newname + "." + fileExtention;
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
