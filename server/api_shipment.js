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
const Shipment = require('./models/shipment_schema');
const VerifyToken = require('./auth/VerifyToken');

// Add shipment
router.post(`/shipment`, function (req, res) {
    console.log("Add Shipment V1");
    Shipment.create(req.body, (err, result) => {
        if (err) throw err;

        res.json(req.body);
    });
});

// Show all shipments
router.get(`/shipment`, function (req, res) {

    // console.log("Show Shipment V1 ");
    Shipment.find((err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    }).sort({shipmentStatus: -1, shipmentId : 'desc'});
});

// Show Shipment by id
// router.get(`/shipment/id/:id`, function (req, res) {
router.get(`/shipment/:id`, function (req, res) {

    // console.log("get for Show Shipment with id V1 -- view new --");
    Shipment.findOne({shipmentId: req.params.id}, (err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    });
});


// Get Shipment by keyword
router.get(`/shipment/name/:keyword`, function (req, res) {
    console.log("get shipments by keyword");
    // console.log(req.params.keyword);

    const query = {shipmentName: new RegExp("^.*" + req.params.keyword + ".*$", "i")};
    Shipment.find(query, (err, result) => {
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


// Update Shipment
router.put(`/shipment`, function (req, res) {
    console.log("Update Shipment V1 ");

    Shipment.findOneAndUpdate({shipmentId: req.body.shipmentId}, req.body, (err, result) => {
        // console.log('result : ' + result.shipmentImage);
        if ((result.shipmentImage === '') || (result.shipmentImage === null)) {
            // console.log('image is Null && ""');
        } else if (result.shipmentImage === req.body.shipmentImage) {
            // console.log('Same image');
        } else if ((result.shipmentImage === '') &&  (req.body.shipmentImage.length > 0)) {
            // console.log('Not same image');
        } else if ((result.shipmentImage === null) &&  (req.body.shipmentImage.length > 0)) {
            // console.log('file image cannot deleted but update new picture successfully');
            // console.log('<><> >> ' + req.body.shipmentImage + " <++> " + result.shipmentImage);
            // ถ้ามีไฟล์รูปภาพใหม่มาแทนที่ ให้ไฟล์ภาพเก่าทิ้งก่อน
            fs.unlink(`server/uploaded/images/shipment/` + result.shipmentImage, function(err){
                if(err) return console.log(err);
                console.log('1-- file deleted successfully => ' + result.shipmentImage);
            });
        } else if ((result.shipmentImage.length > 0) &&  (req.body.shipmentImage.length > 0)) {
            // console.log('file image cannot deleted but update new picture successfully');
            // console.log('<><> >> ' + req.body.shipmentImage + " <++> " + result.shipmentImage);
            // ถ้ามีไฟล์รูปภาพใหม่มาแทนที่ ให้ไฟล์ภาพเก่าทิ้งก่อน
            fs.unlink(`server/uploaded/images/shipment/` + result.shipmentImage, function(err){
                if(err) return console.log(err);
                console.log('2--file deleted successfully => ' + result.shipmentImage);
            });
        }

        if (err) throw err;

        const response = {result: "ok", message: "Updated"};
        console.log("Update Shipment V1: " + req.body._id + ", " + JSON.stringify(result));
        res.json(response);
    });
});

// Delete Shipment by id
router.delete(`/shipment/:id`, function (req, res) {
    console.log("Delete Shipment V1");

    Shipment.findOneAndRemove({shipmentId: req.params.id}, (err, result) => {
        // console.log(result.shipmentImage);
        // ถ้ามีไฟล์รูปภาพ  ให้ไฟล์ภาพเก่าทิ้งก่อน แล้วลบข้อมูลในดาต้าเบส
        // if ((result.shipmentImage !== '') || (result.shipmentImage !== null)) {
        if ((result.shipmentImage == '') || (result.shipmentImage == null)) {
            // console.log(result.shipmentImage);
        } else {
            fs.unlink(`server/uploaded/images/shipment/` + result.shipmentImage, function(err){
                if(err) return console.log(err);
                console.log('file deleted successfully => ' + result.shipmentImage);
            });
        }

        if (err) throw err;

        const response = {result: "ok", message: "Removed"};
        res.json(response);
    });
});

// Upload file
router.post(`/fileUploadShipment`, function (req, res) {

    console.log("Upload File Shipment");

    try {
        const form = new formidable.IncomingForm();
        const newname = uniqid.time() + uniqid();
        form.parse(req, function (err, fields, files) {

            const oldpath = files['file'].path;
            const fileExtention = files['file'].name.split(".")[1];
            const newpath = path.resolve(`server/uploaded/images/shipment`) + '/' + newname + "." + fileExtention;
            // console.log(newpath);
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
