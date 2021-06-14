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
const Order = require('./models/order_schema');
const Counter = require('./models/counter_schema');
const VerifyToken = require('./auth/VerifyToken');

// add function genOrderODId //
const moment = require('moment');
function genCode(orderId) {
    // const day = moment().format('YYYYMMDD');
    var std ='OD';
    // const lastNum = !!orderId ? +order.code.slice(-8) : 0;
    // const lastNum = !!orderId ? +orderId.slice(-8) : 0;
    var lastNum = orderId;
    var num = ('00000000' + (lastNum + 1)).slice(-8);
    return std + num;
}
function checkYearMonth(year, month) {
    if( month > 12 ) {
        // const newMonth = (month - 12);
        var numMonth = ('0' + (month - 12)).slice(-2);
        var newYear = (year + 1);
        return newYear +'-'+numMonth;
    }else{
        var numMonth = ('0' + month).slice(-2);
        var newYear = year;
        return newYear +'-'+numMonth;
    }
}
function daysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}
function monthsInMonth(year, month) {
    return new Date(year, month).getMonth();
}
function yearsInMonth(year, month) {
    return new Date(year, month).getFullYear();
}
function checkDays(day) {
    if( day.length !== 2) {
        var day = ('0' + day).slice(-2);
        return day;
    }else{
        return day;
    }
}
// add function genOrderODId //

//  new api Report Order && Products //

//// Get API report Users Amount ////
router.get(`/report/users/:rangeUserAmount`, function (req, res) {

    console.log("Show ReportUserAmount V1 ByRangDate = " + req.params.rangeUserAmount);
    // console.log("User ByRangDate Length = " + req.params.rangeUserAmount.length);
    // const dd = req.params.RangDate;
    const ddDate = req.params.rangeUserAmount.split(' - ');
    // console.log("rangeProductAmount " + req.params.rangeProductAmount);
    // console.log("rangeProductAmount-Start = " + ddDate[0]);
    // console.log("rangeProductAmount-End = " + ddDate[1]);
    const dateRangeStart = ddDate[0]+'T00:00:00.000Z';
    const dateRangeEnd = ddDate[1]+'T24:00:00.000Z';

    //// New Get API report Products Amount ////
    var dateObj = new Date();
    var dateNow = (dateObj.getDate());
    const startDate = checkYearMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1))+'-01'+'T00:00:00.000Z';
    const endDate = checkYearMonth(dateObj.getFullYear(), (dateObj.getMonth() + 2))+'-'+checkDays(dateNow)+'T24:00:00.000Z';
    const maxEndDate = checkYearMonth(dateObj.getFullYear(), (dateObj.getMonth() + 2))+'-'+daysInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1))+'T00:00:00.000Z';
    // console.log('startDate = '+ startDate);
    // console.log('endDate = '+ endDate);
    // console.log('maxEndDate = ' + maxEndDate);
    // console.log('MaxDate = '+ daysInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1)));
    // console.log('MaxMonth = '+ monthsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1)));
    // console.log('MaxYear = '+ yearsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1)));
    var year = yearsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1));
    var month = ('0' + monthsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1))).slice(-2);
    var maxdate = ('0' + daysInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1))).slice(-2);

    // console.log('year-month-day = ' + year +'-' +month +'-'+ maxdate);
    // console.log('maxday = ' + maxdate);

    if (req.params.rangeUserAmount.length !== 23) {
        // if == filter by All orders //
        Order.aggregate(
            [
                {
                    $lookup : {
                        from : 'users',
                        localField : 'orderSellerId',
                        foreignField : 'userId',
                        as : 'fromUsers'
                    }
                },
                {
                    $replaceRoot : {
                        newRoot : {
                            $mergeObjects : [
                                {
                                    $arrayElemAt : [
                                        '$fromUsers',
                                        0
                                    ]
                                },
                                '$$ROOT'
                            ]
                        }
                    }
                },
                {
                    $project : {
                        'fromUsers' : 0
                    }
                },
                {
                    $unwind : '$orderODId'
                },
                {
                    $group : {
                        _id : {
                            userId : '$orderSellerId',
                            userName : '$userName',
                            userLevel : '$userLevel'
                        },
                        usersSumCount : {
                            $sum : 1
                        },
                        usersTotal : {
                            $sum : '$orderTotal'
                        },
                        usersDiscount : {
                            $sum : '$orderDiscount'
                        },
                        usersDelivery : {
                            $sum : '$delivery.price'
                        }
                    }
                },
                {
                    $sort : {
                        usersSumCount : -1,
                        usersTotal : -1
                    }
                }
            ], (err, result) => {
                if (err) throw err;
                // console.log('resultReportProductsAmountLength = ' + result.length);
                if (result) {
                    res.json(result);
                } else {
                    res.json([]);
                }
            }
        );

    } else {
        // else == filter by rangeDate //
        Order.aggregate(
            [
                {
                    $lookup : {
                        from : 'users',
                        localField : 'orderSellerId',
                        foreignField : 'userId',
                        as : 'fromUsers'
                    }
                },
                {
                    $replaceRoot : {
                        newRoot : {
                            $mergeObjects : [
                                {
                                    $arrayElemAt : [
                                        '$fromUsers',
                                        0
                                    ]
                                },
                                '$$ROOT'
                            ]
                        }
                    }
                },
                {
                    $project : {
                        'fromUsers' : 0
                    }
                },
                {
                    $match : {
                        $and : [
                            {
                                orderCreated : {
                                    // $gte : new Date(startDate)
                                    $gte : new Date(dateRangeStart)  // ok
                                }
                            },
                            {
                                orderCreated : {
                                    // $lte : new Date(endDate)
                                    $lte : new Date(dateRangeEnd) // ok
                                }
                            }
                        ]
                    }
                },
                {
                    $unwind : '$orderODId'
                },
                {
                    $group : {
                        _id : {
                            userId : '$orderSellerId',
                            userName : '$userName',
                            userLevel : '$userLevel'
                        },
                        usersSumCount : {
                            $sum : 1
                        },
                        usersTotal : {
                            $sum : '$orderTotal'
                        },
                        usersDiscount : {
                            $sum : '$orderDiscount'
                        },
                        usersDelivery : {
                            $sum : '$delivery.price'
                        }
                    }
                },
                {
                    $sort : {
                        usersSumCount : -1,
                        usersTotal : -1
                    }
                }
            ], (err, result) => {
                if (err) throw err;
                // console.log('resultReportProductsAmountLength = ' + result.length);
                if (result) {
                    res.json(result);
                } else {
                    res.json([]);
                }
            }
        );
    }
    //// End Get API report Users Amount ////
});
//// End Get API report Users Amount ////

//// Get API report Channels Amount ////
router.get(`/report/channels/:rangeChannelAmount`, function (req, res) {

    console.log("Show ReportChannelAmount V1 ByRangDate = " + req.params.rangeChannelAmount);
    // const dd = req.params.RangDate;
    const ddDate = req.params.rangeChannelAmount.split(' - ');
    // console.log("rangeProductAmount " + req.params.rangeProductAmount);
    // console.log("rangeProductAmount-Start = " + ddDate[0]);
    // console.log("rangeProductAmount-End = " + ddDate[1]);
    const dateRangeStart = ddDate[0]+'T00:00:00.000Z';
    const dateRangeEnd = ddDate[1]+'T24:00:00.000Z';

    //// New Get API report Products Amount ////
    var dateObj = new Date();
    var dateNow = (dateObj.getDate());
    const startDate = checkYearMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1))+'-01'+'T00:00:00.000Z';
    const endDate = checkYearMonth(dateObj.getFullYear(), (dateObj.getMonth() + 2))+'-'+checkDays(dateNow)+'T24:00:00.000Z';
    const maxEndDate = checkYearMonth(dateObj.getFullYear(), (dateObj.getMonth() + 2))+'-'+daysInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1))+'T00:00:00.000Z';
    // console.log('startDate = '+ startDate);
    // console.log('endDate = '+ endDate);
    // console.log('maxEndDate = ' + maxEndDate);
    // console.log('MaxDate = '+ daysInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1)));
    // console.log('MaxMonth = '+ monthsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1)));
    // console.log('MaxYear = '+ yearsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1)));
    var year = yearsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1));
    var month = ('0' + monthsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1))).slice(-2);
    var maxdate = ('0' + daysInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1))).slice(-2);

    // console.log('year-month-day = ' + year +'-' +month +'-'+ maxdate);
    // console.log('maxday = ' + maxdate);

    if (req.params.rangeChannelAmount.length !== 23) {
        // if == filter by All orders //
        Order.aggregate(
            [
                {
                    $lookup : {
                        from : 'channels',
                        localField : 'orderChannelId',
                        foreignField : 'channelId',
                        as : 'fromChannels'
                    }
                },
                {
                    $replaceRoot : {
                        newRoot : {
                            $mergeObjects : [
                                {
                                    $arrayElemAt : [
                                        '$fromChannels',
                                        0
                                    ]
                                },
                                '$$ROOT'
                            ]
                        }
                    }
                },
                {
                    $project : {
                        'fromChannels' : 0
                    }
                },
                {
                    $unwind : '$orderODId'
                },
                {
                    $group : {
                        _id : {
                            channelId : '$orderChannelId',
                            channelName : '$channelName'
                        },
                        channelsSumCount : {
                            $sum : 1
                        },
                        channelsTotal : {
                            $sum : '$orderTotal'
                        },
                        channelsDiscount : {
                            $sum : '$orderDiscount'
                        },
                        channelsDelivery : {
                            $sum : '$delivery.price'
                        }
                    }
                },
                {
                    $sort : {
                        channelsSumCount : -1,
                        channelsTotal : -1
                    }
                }
            ], (err, result) => {
                if (err) throw err;
                // console.log('resultReportProductsAmountLength = ' + result.length);
                if (result) {
                    res.json(result);
                } else {
                    res.json([]);
                }
            }
        );

    } else {
        // else == filter by rangeDate //
        Order.aggregate(
            [
                {
                    $lookup : {
                        from : 'channels',
                        localField : 'orderChannelId',
                        foreignField : 'channelId',
                        as : 'fromChannels'
                    }
                },
                {
                    $replaceRoot : {
                        newRoot : {
                            $mergeObjects : [
                                {
                                    $arrayElemAt : [
                                        '$fromChannels',
                                        0
                                    ]
                                },
                                '$$ROOT'
                            ]
                        }
                    }
                },
                {
                    $project : {
                        'fromChannels' : 0
                    }
                },
                {
                    $match : {
                        $and : [
                            {
                                orderCreated : {
                                    // $gte : new Date(startDate)
                                    $gte : new Date(dateRangeStart)  // ok
                                }
                            },
                            {
                                orderCreated : {
                                    // $lte : new Date(endDate)
                                    $lte : new Date(dateRangeEnd) // ok
                                }
                            }
                        ]
                    }
                },
                {
                    $unwind : '$orderODId'
                },
                {
                    $group : {
                        _id : {
                            channelId : '$orderChannelId',
                            channelName : '$channelName'
                        },
                        channelsSumCount : {
                            $sum : 1
                        },
                        channelsTotal : {
                            $sum : '$orderTotal'
                        },
                        channelsDiscount : {
                            $sum : '$orderDiscount'
                        },
                        channelsDelivery : {
                            $sum : '$delivery.price'
                        }
                    }
                },
                {
                    $sort : {
                        channelsSumCount : -1,
                        channelsTotal : -1
                    }
                }
            ], (err, result) => {
                if (err) throw err;
                // console.log('resultReportProductsAmountLength = ' + result.length);
                if (result) {
                    res.json(result);
                } else {
                    res.json([]);
                }
            }
        );
    }
    //// New Get API report Channels Amount ////
});
//// New Get API report Channels Amount ////

//  new api Report Order && Products //
//// Get API report Products Amount ////
router.get(`/report/products/:rangeProductAmount`, function (req, res) {

    console.log("Show ReportProductsAmount V1 ByRangDate = " + req.params.rangeProductAmount);
    // const dd = req.params.RangDate;
    const ddDate = req.params.rangeProductAmount.split(' - ');
    // console.log("rangeProductAmount " + req.params.rangeProductAmount);
    // console.log("rangeProductAmount-Start = " + ddDate[0]);
    // console.log("rangeProductAmount-End = " + ddDate[1]);
    const dateRangeStart = ddDate[0]+'T00:00:00.000Z';
    const dateRangeEnd = ddDate[1]+'T24:00:00.000Z';

    //// New Get API report Products Amount ////
    var dateObj = new Date();
    var dateNow = (dateObj.getDate());
    const startDate = checkYearMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1))+'-01'+'T00:00:00.000Z';
    const endDate = checkYearMonth(dateObj.getFullYear(), (dateObj.getMonth() + 2))+'-'+checkDays(dateNow)+'T24:00:00.000Z';
    const maxEndDate = checkYearMonth(dateObj.getFullYear(), (dateObj.getMonth() + 2))+'-'+daysInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1))+'T00:00:00.000Z';
    // console.log('startDate = '+ startDate);
    // console.log('endDate = '+ endDate);
    // console.log('maxEndDate = ' + maxEndDate);
    // console.log('MaxDate = '+ daysInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1)));
    // console.log('MaxMonth = '+ monthsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1)));
    // console.log('MaxYear = '+ yearsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1)));
    var year = yearsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1));
    var month = ('0' + monthsInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1))).slice(-2);
    var maxdate = ('0' + daysInMonth(dateObj.getFullYear(), (dateObj.getMonth() + 1))).slice(-2);

    // console.log('year-month-day = ' + year +'-' +month +'-'+ maxdate);
    // console.log('maxday = ' + maxdate);

    if (req.params.rangeProductAmount.length !== 23) {
        // if == filter by All orders //
        Order.aggregate(
            [
                {
                    $lookup : {
                        from : 'products',
                        localField : 'products.id',
                        foreignField : 'productId',
                        as : 'fromProducts'
                    }
                },
                {
                    $replaceRoot : {
                        newRoot : {
                            $mergeObjects : [
                                {
                                    $arrayElemAt : [
                                        '$fromProducts', 0
                                    ]
                                },
                                '$$ROOT'
                            ]
                        }
                    }
                },
                {
                    $project : {
                        'fromProducts' : 0
                    }
                },
                // {
                //     $match : {
                //         $and : [
                //             {
                //                 orderCreated : {
                //                     // $gte : ISODate("2019-03-26T00:00:00.000+0700")
                //                     // $gte : ISODate("2019-03-26T00:00:00.000+0700")
                //                     $gte : new Date(startDate)
                //                 }
                //             },
                //             {
                //                 orderCreated : {
                //                     // $lte : ISODate("2019-03-26T24:00:00.000+0700")
                //                     // $lte : ISODate("2019-03-26T24:00:00.000+0700")
                //                     $lte : new Date(endDate)
                //                 }
                //             }
                //         ]
                //     }
                // },
                { $unwind: '$products' },
                {
                    $group : {
                        _id : {
                            idO : '$products.id',
                            codeO : '$products.code',
                        },
                        productsAmount : {
                            $sum : '$products.amount'
                        },
                        productsSumCount : {
                            $sum : 1
                        },
                        productsTotal : {
                            $sum : '$orderTotal'
                        },
                        productsDiscount : {
                            $sum : '$orderDiscount'
                        },
                        productsDelivery : {
                            $sum : '$delivery.price'
                        }
                    }
                },
                {
                    $sort : {
                        productsTotal : -1,
                        productsAmount : -1,
                        productsSumCount : -1
                    }
                }
            ], (err, result) => {
                if (err) throw err;
                // console.log('resultReportProductsAmountLength = ' + result.length);
                if (result) {
                    res.json(result);
                } else {
                    res.json([]);
                }
            }
        );

    } else {
        // else == filter by rangeDate //
        Order.aggregate(
            [
                {
                    $lookup : {
                        from : 'products',
                        localField : 'products.id',
                        foreignField : 'productId',
                        as : 'fromProducts'
                    }
                },
                {
                    $replaceRoot : {
                        newRoot : {
                            $mergeObjects : [
                                {
                                    $arrayElemAt : [
                                        '$fromProducts', 0
                                    ]
                                },
                                '$$ROOT'
                            ]
                        }
                    }
                },
                {
                    $project : {
                        'fromProducts' : 0
                    }
                },
                {
                    $match : {
                        $and : [
                            {
                                orderCreated : {
                                    // $gte : new Date(startDate)
                                    $gte : new Date(dateRangeStart)  // ok
                                }
                            },
                            {
                                orderCreated : {
                                    // $lte : new Date(endDate)
                                    $lte : new Date(dateRangeEnd) // ok
                                }
                            }
                        ]
                    }
                },
                { $unwind: '$products' },
                {
                    $group : {
                        _id : {
                            idO : '$products.id',
                            codeO : '$products.code',
                        },
                        productsAmount : {
                            $sum : '$products.amount'
                        },
                        productsSumCount : {
                            $sum : 1
                        },
                        productsTotal : {
                            $sum : '$orderTotal'
                        },
                        productsDiscount : {
                            $sum : '$orderDiscount'
                        },
                        productsDelivery : {
                            $sum : '$delivery.price'
                        },
                    }
                },
                {
                    $sort : {
                        productsAmount : -1,
                        productsSumCount : -1,
                        productsTotal : -1
                    }
                }
            ], (err, result) => {
                if (err) throw err;
                // console.log('resultReportProductsAmountLength = ' + result.length);
                if (result) {
                    res.json(result);
                } else {
                    res.json([]);
                }
            }
        );
    }
    //// New Get API report Products Amount ////
});
//// Get API dashboard for report chart ////

module.exports = router;
