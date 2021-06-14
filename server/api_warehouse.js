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
const Warehouse = require('./models/warehouse_schema');
const VerifyToken = require('./auth/VerifyToken');

// Add product
router.post(`/warehouse`, function (req, res) {
    console.log("Add Warehouse V1");
    Warehouse.create(req.body, (err, result) => {
        if (err) throw err;

        res.json(req.body);
    });
});


// Show all warehouses
router.get(`/warehouse`, function (req, res) {

    console.log("Show Warehouse V1 ");
    Warehouse.find((err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    }).sort({warehouseDefualt : 'desc', warehouseStatus: 'desc', warehouseId: 'desc'});
});

// Show Warehouse by id
router.get(`/warehouse/:id`, function (req, res) {

    // console.log("get for Show Warehouse with id V1 -- view new --");
    Warehouse.findOne({warehouseId: req.params.id}, (err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    });
});

// get warehouseDefualt set option //
router.get(`/warehouse/warehouseDefualt/Status`, function (req, res) {

    console.log("Show Number WarehouseDefualt for CTId ");
    // find({warehouseDefualt: 'true'})
    Warehouse.findOne({warehouseDefualt: true}, (err, result) => {
        if (err) throw err;

        if (result) {
            res.json(result);
        } else {
            res.json([]);
        }
    }).limit(1);
});


// Update Warehouse
router.put(`/warehouse`, function (req, res) {
    console.log("Update Warehouse V1 ");

    Warehouse.findOneAndUpdate({warehouseId: req.body.warehouseId}, req.body, (err, result) => {
        // console.log('result : ' + result.warehouseImage);
        if ((result.warehouseImage === '') || (result.warehouseImage === null)) {
            // console.log('image is Null && ""');
        } else if (result.warehouseImage === req.body.warehouseImage) {
            // console.log('Same image');
        } else if ((result.warehouseImage === '') &&  (req.body.warehouseImage.length > 0)) {
            // console.log('Not same image');
        } else if ((result.warehouseImage === null) &&  (req.body.warehouseImage.length > 0)) {
            // console.log('file image cannot deleted but update new picture successfully');
            // console.log('<><> >> ' + req.body.warehouseImage + " <++> " + result.warehouseImage);
            // ถ้ามีไฟล์รูปภาพใหม่มาแทนที่ ให้ไฟล์ภาพเก่าทิ้งก่อน
            fs.unlink(`server/uploaded/images/warehouse/` + result.warehouseImage, function(err){
                if(err) return console.log(err);
                console.log('1-- file deleted successfully => ' + result.warehouseImage);
            });
        } else if ((result.warehouseImage.length > 0) &&  (req.body.warehouseImage.length > 0)) {
            // console.log('file image cannot deleted but update new picture successfully');
            // console.log('<><> >> ' + req.body.warehouseImage + " <++> " + result.warehouseImage);
            // ถ้ามีไฟล์รูปภาพใหม่มาแทนที่ ให้ไฟล์ภาพเก่าทิ้งก่อน
            fs.unlink(`server/uploaded/images/warehouse/` + result.warehouseImage, function(err){
                if(err) return console.log(err);
                console.log('2--file deleted successfully => ' + result.warehouseImage);
            });
        }

        if (err) throw err;

        const response = {result: "ok", message: "Updated"};
        console.log("Update Warehouse V1: " + req.body._id + ", " + JSON.stringify(result));
        res.json(response);
    });
});

// Delete Warehouse by id
router.delete(`/warehouse/:id`, function (req, res) {
    console.log("Delete Warehouse V1");

    Warehouse.findOneAndRemove({warehouseId: req.params.id}, (err, result) => {
        // ถ้ามีไฟล์รูปภาพ  ให้ไฟล์ภาพเก่าทิ้งก่อน แล้วลบข้อมูลในดาต้าเบส
        // if ((result.warehouseImage !== '') || (result.warehouseImage !== null)) {
        if ((result.warehouseImage == '') || (result.warehouseImage == null)) {
            // console.log(result.warehouseImage);
        } else {
            fs.unlink(`server/uploaded/images/warehouse/` + result.warehouseImage, function(err){
                if(err) return console.log(err);
                console.log('file deleted successfully => ' + result.warehouseImage);
            });
        }

        if (err) throw err;

        const response = {result: "ok", message: "Removed"};
        res.json(response);
    });
});

// Upload file
router.post(`/fileUploadWarehouse`, function (req, res) {

    console.log("Upload File Warehouse");

    try {
        const form = new formidable.IncomingForm();
        const newname = uniqid.time() + uniqid();
        form.parse(req, function (err, fields, files) {

            const oldpath = files['file'].path;
            const fileExtention = files['file'].name.split(".")[1];
            const newpath = path.resolve(`server/uploaded/images/warehouse`) + '/' + newname + "." + fileExtention;
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
