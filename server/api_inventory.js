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
// const Inventory = require('./models/inventory_schema');
const Inventory = require('./models/inventory_schema');
const VerifyToken = require('./auth/VerifyToken');

// Add product
router.post(`/inventory`, function (req, res) {
    console.log("Add Inventory V1");
    Inventory.create(req.body, (err, result) => {
        if (err) throw err;

        res.json(req.body);
    });
});


// Show all inventorys
router.get(`/inventory`, function (req, res) {

    console.log("Show Inventory V1 ");
    Inventory.find((err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    }).sort({ inventoryId : 'desc'});
});

// Show Inventory by id
// router.get(`/inventory/id/:id`, function (req, res) {
router.get(`/inventory/:id`, function (req, res) {

    // console.log("get for Show Inventory with id V1 -- view new --");
    Inventory.findOne({inventoryId: req.params.id}, (err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    });
});


// Get Inventory by keyword
// router.get(`/inventory/name/:keyword`, function (req, res) {
//     console.log("get inventorys by keyword");
//     // console.log(req.params.keyword);
//
//     const query = {inventoryName: new RegExp("^.*" + req.params.keyword + ".*$", "i")};
//     Inventory.find(query, (err, result) => {
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


// Update Inventory
router.put(`/inventory`, function (req, res) {
    console.log("Update Inventory V1 ");

    Inventory.findOneAndUpdate({inventoryId: req.body.inventoryId}, req.body, (err, result) => {
        // console.log('result : ' + result.inventoryImage);
        if ((result.inventoryImage === '') || (result.inventoryImage === null)) {
            // console.log('image is Null && ""');
        } else if (result.inventoryImage === req.body.inventoryImage) {
            // console.log('Same image');
        } else if ((result.inventoryImage === '') &&  (req.body.inventoryImage.length > 0)) {
            // console.log('Not same image');
        } else if ((result.inventoryImage === null) &&  (req.body.inventoryImage.length > 0)) {
            // console.log('file image cannot deleted but update new picture successfully');
            // console.log('<><> >> ' + req.body.inventoryImage + " <++> " + result.inventoryImage);
            // ถ้ามีไฟล์รูปภาพใหม่มาแทนที่ ให้ไฟล์ภาพเก่าทิ้งก่อน
            fs.unlink(`server/uploaded/images/inventory/` + result.inventoryImage, function(err){
                if(err) return console.log(err);
                console.log('1-- file deleted successfully => ' + result.inventoryImage);
            });
        } else if ((result.inventoryImage.length > 0) &&  (req.body.inventoryImage.length > 0)) {
            // console.log('file image cannot deleted but update new picture successfully');
            // console.log('<><> >> ' + req.body.inventoryImage + " <++> " + result.inventoryImage);
            // ถ้ามีไฟล์รูปภาพใหม่มาแทนที่ ให้ไฟล์ภาพเก่าทิ้งก่อน
            fs.unlink(`server/uploaded/images/inventory/` + result.inventoryImage, function(err){
                if(err) return console.log(err);
                console.log('2--file deleted successfully => ' + result.inventoryImage);
            });
        }

        if (err) throw err;

        const response = {result: "ok", message: "Updated"};
        console.log("Update Inventory V1: " + req.body._id + ", " + JSON.stringify(result));
        res.json(response);
    });
});

// Delete Inventory by id
router.delete(`/inventory/:id`, function (req, res) {
    console.log("Delete Inventory V1");

    Inventory.findOneAndRemove({inventoryId: req.params.id}, (err, result) => {
        // ถ้ามีไฟล์รูปภาพ  ให้ไฟล์ภาพเก่าทิ้งก่อน แล้วลบข้อมูลในดาต้าเบส
        // if ((result.inventoryImage !== '') || (result.inventoryImage !== null)) {
        if ((result.inventoryImage == '') || (result.inventoryImage == null)) {
            // console.log(result.inventoryImage);
        } else {
            fs.unlink(`server/uploaded/images/inventory/` + result.inventoryImage, function(err){
                if(err) return console.log(err);
                console.log('file deleted successfully => ' + result.inventoryImage);
            });
        }

        if (err) throw err;

        const response = {result: "ok", message: "Removed"};
        res.json(response);
    });
});

// Upload file
router.post(`/fileUploadInventory`, function (req, res) {

    console.log("Upload File Inventory");

    try {
        const form = new formidable.IncomingForm();
        const newname = uniqid.time() + uniqid();
        form.parse(req, function (err, fields, files) {

            const oldpath = files['file'].path;
            const fileExtention = files['file'].name.split(".")[1];
            const newpath = path.resolve(`server/uploaded/images/inventory`) + '/' + newname + "." + fileExtention;
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
