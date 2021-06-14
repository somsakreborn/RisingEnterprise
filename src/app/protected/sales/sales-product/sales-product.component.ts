import {Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import {NgbDate, NgbCalendar, NgbDateStruct, NgbTabsetConfig} from '@ng-bootstrap/ng-bootstrap';

import {SaleProduct} from '../sales.interface';
import {ReportsService} from '../sales.service';
import {environment as env} from '../../../../environments/environment';
import {Product} from '../../products/products.interface';
import {ProductsService} from '../../products/products.service';
import {Subscription} from 'rxjs/index';

import {BsDatepickerConfig} from 'ngx-bootstrap/datepicker';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {listLocales} from 'ngx-bootstrap/chronos';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {thLocale, enGbLocale} from 'ngx-bootstrap/locale';
defineLocale('th', thLocale);
import * as moment from 'moment';
import * as _ from 'lodash';
import {XlsxService} from '../../../services/xlsx.service';

@Component({
    selector: 'app-sales-product',
    templateUrl: './sales-product.component.html',
    styleUrls: [
        './sales-product.component.scss',
        '../../../../assets/icon/icofont/css/icofont.scss'
    ]
})
export class SalesProductComponent implements OnInit, OnDestroy, AfterViewInit {

    private sub: Subscription = null;
    private dataSub: Subscription = null;
    // datepicker-range //
    locale = 'en';
    locales = listLocales();
    fromDate: NgbDate;
    toDate: NgbDate;
    colorTheme = 'theme-dark-blue';
    bsConfig: Partial<BsDatepickerConfig>;
    bsValue = new Date();
    bsRangeValue: Date[];
    bsRangeValueDayNow: Date[];
    bsRangeValueMonthNow: Date[];
    bsRangeValueYearNow: Date[];
    minDate = new Date();
    maxDate = new Date();
    startDate = new Date();
    endDate = new Date();
    toDay = new Date();
    toYesterday = new Date();
    rangeDate: any;
    // const stdDate = '15/02/2019';
    // const endDate = '26/03/2019';
    // rangDate = `15/02/2019 - 26/03/2019`;
    // datepicker-range //

    // datepickerRange //
    hoveredDate: NgbDate;

    displayMonths = 2;
    navigation = 'select';
    showWeekNumbers = false;
    outsideDays = 'visible';
    // datepickerRange //

    isMeridian = false;
    showSpinners = true;
    myTime: Date = new Date();

    // public model: any;
    // displayMonths = 2;
    // navigation = 'select';
    // showWeekNumbers = false;
    // outsideDays = 'visible';
    //
    // model: NgbDateStruct;
    // startDate: NgbDateStruct;
    // endDate: NgbDateStruct;
    // firstDate: NgbDateStruct;
    // lastDate: NgbDateStruct;
    // today: number = Date.now();
    // modelPopup: NgbDateStruct = {} as NgbDateStruct;
    //
    // testaaa: any = [];
    // SumOrdersTotal: number;
    // SumCount: number;
    // // selected: {startDate: Moment, endDate: Moment};
    // public date: { year: number, month: number, day: number };
    // now = new Date();

    reportData: SaleProduct[] = [] as SaleProduct[];
    reportSumAPTotal: number;
    reportSumODTotal: number;
    reportSumPPATotal: number;
    reportOrderProducts: SaleProduct[] = [] as SaleProduct[];
    saleproducts: SaleProduct[] = [] as SaleProduct[];
    product: Product = {} as Product;
    products: Product[] = [] as Product[];
    rangeDateDefualt: any;
    bsRangeValueDefualtStr: string;
    bsRangeValueDefualt: Date[];

    // dataTable //
    selected = [];
    rowsOnPage = 50;
    filterQuery = '';
    public sortBy = '';
    public sortOrder = 'asc';
    // dataTable //
    ActiveVal: string;
    constructor(
        private calendar: NgbCalendar,
        private reportService: ReportsService,
        private productService: ProductsService,
        private xlsxService: XlsxService,
        private localeService: BsLocaleService
    ) {
        this.ActiveVal = 'Day';
        this.sub = this.productService.fetchProduct()
            .subscribe((r: Product[]) => {
                this.products = r;
            });

        this.localeService.use('th');
        this.bsConfig = Object.assign({},{
            containerClass: this.colorTheme,
            rangeInputFormat: 'YYYY-MM-DD', rangeSeparator: ' - '
        });
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), (now.getDate() - 1));
        const toDay = moment(now).format('YYYY-MM-DD');
        const toMorrow = moment(tomorrow).format('YYYY-MM-DD');
        this.rangeDateDefualt = `${toDay} - ${toDay}`;
        this.bsRangeValueDefualtStr = `${toDay} - ${toDay}`;
        this.bsRangeValueDefualt = [this.startDate, this.startDate];
    }

    ngOnInit() {

        // this.fetchProducts();
        // const rangeProductAmount = '2019-03-01 - 2019-03-30';
        // this.rangeDateDefualt = '2019-03-01 - 2019-03-30';
        // this.fetchReportSalesProductsAmount(rangeProductAmount);
        // this.fetchReportSalesProductsAmount(this.rangeDateDefualt);
        // this.fetchOrderMapProduct(this.rangeDateDefualt);
        // const date = new Date();
        // const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        // const lastDay = new Date(date.getFullYear(), date.getMonth() + 4, 0);
        //
        // this.firstDate = {year: firstDay.getFullYear(), month: firstDay.getMonth() + 1, day: 1} ;
        // this.lastDate = {year: lastDay.getFullYear(), month: lastDay.getMonth() + 4, day: (lastDay.getDate())};
        // console.log('first day = ' + Number(firstDay));
        // console.log('last day = ' + Number(lastDay));
        // console.log('first date = ' + this.firstDate);
        // console.log('last date = ' + this.lastDate);
        // console.log(this.today);
        // const d1 = new Date('2019-08-25');
        // console.log(d1);
        // console.log((d1.getMonth()) + 1);
        // this.echoData();

        // test number formatt dateime //

        // const s = new Date(1504095567183).toLocaleDateString('en-US');
        // console.log(s);
        //
        // const s1 = new Date(Number(firstDay)).toLocaleDateString('en-US');
        // console.log('firstDay = ' + s1);
        //
        // const s2 = new Date(Number(lastDay)).toLocaleDateString('en-US');
        // console.log('lastDay = ' + s2);

        // test number formatt dateime //

        // console.log('Count Product = ' + this.products.length);


        // this.fetchOrderMapProduct('2019-04-03 - 2019-04-03');
        // const date = new Date();
        // const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        // const lastDay = new Date(date.getFullYear(), date.getMonth() + 4, 0);
        //
        // this.firstDate = {year: firstDay.getFullYear(), month: firstDay.getMonth() + 1, day: 1} ;
        // this.lastDate = {year: lastDay.getFullYear(), month: lastDay.getMonth() + 4, day: (lastDay.getDate())};
        // this.selectToday();
        // this.selectDateRange();

        // this.sub = this.reportService.fetchReportSalesProductsAmount(this.rangeDateDefualt)
        //     .map(resp => {
        //         // console.log('resp = ' + JSON.stringify(resp));
        //         this.reportOrderProducts = resp;
        //         this.reportSumAPTotal = 0;
        //         this.reportSumODTotal = 0;
        //         this.reportSumPPATotal = 0;
        //         this.reportOrderProducts.map((o) => {
        //             //     (console.log('oid = ' + o._id.idO));
        //             // this.productService.fetchProduct()
        //             //     .subscribe((rr: Product[]) => {
        //             //         this.products = rr;
        //             //         // console.log(' id ' + o._id.idO);
        //
        //             this.products.filter((rrr: Product, err) => {
        //                 // if (err) {
        //                 //     // alert('err = ' + err);
        //                 //     console.log('err = ' + err);
        //                 // }
        //                 if (rrr.productId === o._id.idO) {
        //                     // console.log('dataNew = ' + o._id.idO + ' && ' + rrr.productCodename + ' && ' + rrr.productName);
        //                     o.productId = rrr.productId;
        //                     o.productName = rrr.productName;
        //                     o.productCodename = rrr.productCodename;
        //                     o.productPiece = rrr.productPiece;
        //                     o.productTotal = rrr.productTotal;
        //                     o.productHold = rrr.productHold;
        //                     o.productRemain = (rrr.productTotal - rrr.productHold);
        //                     o.productsTotalPrice = (rrr.productPiece * o.productsAmount);
        //
        //                     this.reportSumAPTotal += o.productsAmount;
        //                     this.reportSumODTotal += o.productsSumCount;
        //                     this.reportSumPPATotal += o.productsTotalPrice;
        //                 }
        //                 // return o;
        //             });
        //             //     } );
        //             return o;
        //         });
        //         return resp;
        //         // console.log(new Date() + '\n' + 'Resualt = ' + JSON.stringify(this.reportData));
        //     })
        //     .subscribe((resp: SaleProduct[]) => {
        //         this.reportData = resp;
        //         // console.log('Data = ' + JSON.stringify(this.reportData) + resp[0].productName);
        //     });
    }

    // fetchReportSalesProductsAmount(rangeProductAmount) {
    //     // this.reportService.fetchReportSalesProductsAmount(rangeProductAmount)
    //     //     .subscribe(r => {
    //     //     this.reportData = r;
    //     //     // console.log('reportData = ' + JSON.stringify(this.reportData));
    //     // });
    //     this.sub = this.reportService.fetchReportSalesProductsAmount(rangeProductAmount)
    //         .map((r: SaleProduct[]) => {
    //
    //         // .subscribe(r => {
    //             // this.reportData = r;
    //             r.forEach((o: SaleProduct) => {
    //             //     (console.log('oid = ' + o._id.idO));
    //                 this.productService.fetchViewProductId(o._id.idO)
    //                     .map((m: Product) => {
    //                         if (m.productId === o._id.idO) {
    //                             o.productName = m.productName;
    //                             o.productCodename = m.productCodename;
    //                         }
    //                         return m;
    //                     });
    //                 // console.log('O =' + JSON.stringify(o));
    //                 return o;
    //             });
    //             // console.log('R =' + JSON.stringify(r));
    //             return r;
    //         })
    //         .subscribe((resp: SaleProduct[]) => {
    //         // console.log('resp = ' + JSON.stringify(resp));
    //             this.reportData = resp;
    //     });
    // }
    //
    // fetchProducts() {
    //     this.sub = this.productService.fetchProduct()
    //         .map((m: Product[]) => {
    //             let x = 0;
    //             m.map(r => {
    //                 r.index = ++x;
    //                 if (r.productImage) {
    //                     r.productImage = `${env.serverAPI}/images/product/` + r.productImage;
    //                 } else {
    //                     r.productImage = `${env.serverAPI}/images/image-blank.jpg`;
    //                 }
    //                 return r;
    //             });
    //             return m;
    //         })
    //         .subscribe(resp => {
    //             this.products = resp;
    //             // console.log('this.products = ' + JSON.stringify(this.products));
    //         });
    // }

    fetchOrderMapProduct(rangeDate) {
        if (!rangeDate) {
            return;
        }

        this.sub = this.reportService.fetchReportSalesProductsAmount(rangeDate)
            .map((resp: SaleProduct[]) => {
                this.reportOrderProducts = resp;
                this.reportSumAPTotal = 0;
                this.reportSumODTotal = 0;
                this.reportSumPPATotal = 0;
                this.reportOrderProducts.map((o: SaleProduct) => {
                    this.products.filter((rrr: Product) => {
                        if (rrr.productId === o._id.idO) {
                            o.productId = rrr.productId;
                            o.productName = rrr.productName;
                            o.productCodename = rrr.productCodename;
                            o.productPiece = rrr.productPiece;
                            o.productTotal = rrr.productTotal;
                            o.productHold = rrr.productHold;
                            o.productRemain = (rrr.productTotal - rrr.productHold);
                            o.productsTotalPrice = (rrr.productPiece * o.productsAmount);

                            this.reportSumAPTotal += o.productsAmount;
                            this.reportSumODTotal += o.productsSumCount;
                            this.reportSumPPATotal += o.productsTotalPrice;
                        }
                    });
                    //     } );
                    return o;
                });
                return resp;
            })
            .subscribe((r: SaleProduct[]) => {
                this.reportData = r;
            });
    }
    daysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }
    checkMonth(value) {
        if (value < 10) {
            value = '0' + value;
        }
        return value;
    }
    setRangeDateSearch(rangeDate, val) {
        this.ActiveVal = val;
        const today = new Date();
        const dd = today.getDate();
        const mm = today.getMonth() + 1;
        const yyyy = today.getFullYear();
        const ddToday = (yyyy + '-' + this.checkMonth(mm) + '-' + this.checkMonth(dd));
        const ddMonthStart = (yyyy + '-' + this.checkMonth(mm) + '-01');
        const ddMonthEnd = (yyyy + '-' + this.checkMonth(mm) + '-' + this.checkMonth(this.daysInMonth(yyyy, mm)));
        const ddYearStart = (yyyy + '-01-01');
        const ddYearEnd = (yyyy + '-12-31');
        const rangeToday = (yyyy + '-' + this.checkMonth(mm) + '-' + this.checkMonth(dd)) + ' - ' + (yyyy + '-' + this.checkMonth(mm) + '-' + this.checkMonth(dd));
        const rangeMonth = (yyyy + '-' + this.checkMonth(mm) + '-01 - ' + yyyy + '-' + this.checkMonth(mm) + '-' + this.checkMonth(this.daysInMonth(yyyy, mm)));
        const rangeYear = (yyyy + '-01-01 - ' + yyyy + '-12-31');
        const thisYearNow = today.getFullYear();
        const thisYearMonthNow = today.getFullYear() + '-' + this.checkMonth(mm);

        const tomorrow = new Date(today.getFullYear(), today.getMonth(), (today.getDate() - 1));
        const toMorrow = moment(tomorrow).format('YYYY-MM-DD');

        if (val === 'Day') {
            this.bsRangeValueDefualt = [new Date(ddToday), new Date(ddToday)];
            const Str = moment(ddToday).format('YYYY-MM-DD');
            this.bsRangeValueDefualtStr = `${Str} - ${Str}`;
        }
        if (val === 'Tomorrow') {
            this.bsRangeValueDefualt = [new Date(tomorrow), new Date(tomorrow)];
            // const Str = moment(ddToday).format('YYYY-MM-DD');
            this.bsRangeValueDefualtStr = `${toMorrow} - ${toMorrow}`;
        }
        if (val === 'Month') {
            this.bsRangeValueDefualt = [new Date(ddMonthStart), new Date(ddMonthEnd)];
            const StrStart = moment(ddMonthStart).format('YYYY-MM-DD');
            const StrEnd = moment(ddMonthEnd).format('YYYY-MM-DD');
            this.bsRangeValueDefualtStr = `${StrStart} - ${StrEnd}`;
        }
        if (val === 'Year') {
            this.bsRangeValueDefualt = [new Date(ddYearStart), new Date(ddYearEnd)];
            const StrStart = moment(ddYearStart).format('YYYY-MM-DD');
            const StrEnd = moment(ddYearEnd).format('YYYY-MM-DD');
            this.bsRangeValueDefualtStr = `${StrStart} - ${StrEnd}`;
        }
        this.fetchOrderMapProduct(this.bsRangeValueDefualtStr);
    }

    selectToday() {
        const dd = new Date();
        // this.startDate = this.calendar.getToday();
        // this.startDate = this.firstDate;
        // this.startDate = {year: dd.getFullYear(), month: dd.getMonth() + 1, day: (dd.getUTCDate())};
        this.fromDate = this.calendar.getToday();
        this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 10);
    }

    selectDateRange() {
        const dd = new Date();
        // this.startDate = this.calendar.getToday();
        // this.endDate = this.lastDate;
        // this.endDate = {year: dd.getFullYear(), month: dd.getMonth() + 1, day: (dd.getUTCDate() + 7)};
        this.fromDate = this.calendar.getToday();
        this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 10);
    }

    // datepickerRange  //
    onDateSelection(date: NgbDate) {
        if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
        } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
            this.toDate = date;
        } else {
            this.toDate = null;
            this.fromDate = date;
        }
    }

    isHovered(date: NgbDate) {
        return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
    }

    isInside(date: NgbDate) {
        return date.after(this.fromDate) && date.before(this.toDate);
    }

    isRange(date: NgbDate) {
        return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
    }

    onSelect({selected}) {
        this.selected.splice(0, this.selected.length);
        // alert(this.selected.forEach(r => console.log(r + this.selected)));
        // this.selectedOrder = this.selected.push(...selected);
        // this.printOrders = this.selected.push(...selected);
        // console.log(...selected);
        // this.selectedtest = {...selected};
        // console.log(JSON.stringify(this.printOrders));
        // console.log(JSON.stringify(this.selectedtest));
        // console.log(JSON.stringify(this.selectedOrders));
        // alert(selected);
        // console.log(this.selectedOrder);
        // alert(this.selected.push(...selected));

        // if (selected.length > 0) {
        //     if (this.selected) {
        //         for (let i = 0; i < this.selected.length; i++ ) {
        //             alert(JSON.stringify(selected[i].orderId));
        //         }
        //     }
        //     // alert(JSON.stringify(selected));
        // }
    }

    onActivate(event) {
        // alert(event.target.checked);
        // console.log(event.target.checked);
        //   console.log('Activate Event' + event.target.checked);
    }

    // Destroy data unsubscript //
    ngOnDestroy() {
        if (this.dataSub !== null) {
            this.dataSub.unsubscribe();
        }
        if (this.sub !== null) {
            this.sub.unsubscribe();
        }
    }
    ngAfterViewInit(): void {
        if (this.reportData.length > 0) {
            // console.log('Products Length = ' + this.products.length);
            // console.log('reportProduct Length = ' + this.reportData);
        }
        setTimeout(() => {
            this.fetchOrderMapProduct(this.rangeDateDefualt);
            // this.fetchOrderMapProduct(this.bsRangeValueDefualtStr);
        }, 1000);
    }
    // Destroy data unsubscript //

    exportReportSaleProductsAllToExcel(rproducts) {
        // const selectedOrders = this.orders.filter(o => o.selected);
        // console.log('channel = ' + JSON.stringify(this.channels));
        // console.log('shipment = ' + JSON.stringify(this.shipments));
        this.xlsxService.exportExcelReportSaleProductsAll(rproducts);
    }

    // datepickerRange  //

    // test lodash functions data test //
    //
    // echoData() {
    //     const aaa = _.chunk(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], 2);
    //     const bbb = _.take(aaa, 2);
    //     this.testaaa = bbb;
    //     console.log(this.testaaa);
    //
    //     // ####################################### //
    //     const orders = [{
    //         'customer': {
    //             'orderCustomerId': 5,
    //             'orderCustomerChannelId': 8,
    //             'orderCustomerSocial': 'ภิญญดา จรรยาโมทย์',
    //             'orderCustomerTel': '0642728292',
    //             'orderCustomerNameSurname': 'ภิญญดา จรรยาโมทย์',
    //             'orderCustomerIdhome': '177 / 4 หมู่ 9',
    //             'orderCustomerAddress': 'ต.แสนสุข อ.เมืองชลบุรี จ.ชลบุรี',
    //             'orderCustomerZipcode': '20130'
    //         },
    //         'delivery': {'price': 10, 'orderShipmentId': 1},
    //         'payment': {
    //             'orderShipmentId': 1,
    //             'orderBankId': null,
    //             'orderPaymentDate': null,
    //             'orderPaymentTime': null,
    //             'orderPaymentImage': null,
    //             'method': 'cod'
    //         },
    //         'orderStatusCode': 0,
    //         'orderStatusName': 'process',
    //         'orderStatus': false,
    //         'orderCheckedPrint': false,
    //         'orderSelectedPrint': false,
    //         'orderRemark': 'หมายเหตุ ... 12345',
    //         '_id': '5c35d81e01c4230637493e70',
    //         'orderChannelId': 8,
    //         'orderODId': 'OD00000010',
    //         'products': [{
    //             'id': 1,
    //             'code': 'V208-C',
    //             'name': 'เสื้อปักกวาง-เขียว',
    //             'price': 590,
    //             'amount': 1,
    //             'total': 590,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncur6ls5hegk7c9jncur6lt.jpg'
    //         }, {
    //             'id': 2,
    //             'code': 'V208-B',
    //             'name': 'เสื้อปักกวาง-กรม',
    //             'price': 590,
    //             'amount': 1,
    //             'total': 590,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncuuh925hegk7c9jncuuh93.jpg'
    //         }],
    //         'orderSellerId': 2,
    //         'orderSellerName': 'somsak',
    //         'orderDiscount': 20,
    //         'orderTotal': 1170,
    //         'orderLastupdate': '2019-01-09T11:16:46.697Z',
    //         'orderCreated': '2019-01-09T11:16:46.697Z',
    //         'orderId': 10,
    //         '__v': 0
    //     }, {
    //         'customer': {
    //             'orderCustomerId': 1,
    //             'orderCustomerChannelId': 7,
    //             'orderCustomerSocial': 'จรรยา ยาย่า',
    //             'orderCustomerTel': '0810960852',
    //             'orderCustomerNameSurname': 'จรรยา ซุนจ้าย',
    //             'orderCustomerIdhome': '999/9 หมู่ 8 4556 ซอย.สุขใจ',
    //             'orderCustomerAddress': 'ต.เสม็จ อ.สำโรงทาบ จ.สุรินทร์',
    //             'orderCustomerZipcode': '32170'
    //         },
    //         'delivery': {'price': 0, 'orderShipmentId': 1},
    //         'payment': {
    //             'orderShipmentId': 1,
    //             'orderBankId': null,
    //             'orderPaymentDate': null,
    //             'orderPaymentTime': null,
    //             'orderPaymentImage': null,
    //             'method': 'cod'
    //         },
    //         'orderStatusCode': 3,
    //         'orderStatusName': 'pack',
    //         'orderStatus': false,
    //         'orderCheckedPrint': true,
    //         'orderSelectedPrint': false,
    //         'orderRemark': 'หมายเหตุ...',
    //         '_id': '5c2db74bb14bce3fd75961b7',
    //         'orderChannelId': 7,
    //         'orderODId': 'OD00000009',
    //         'products': [{
    //             'id': 1,
    //             'code': 'V208-C',
    //             'name': 'เสื้อปักกวาง-เขียว',
    //             'price': 590,
    //             'amount': 2,
    //             'total': 1180,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncur6ls5hegk7c9jncur6lt.jpg'
    //         }, {
    //             'id': 2,
    //             'code': 'V208-B',
    //             'name': 'เสื้อปักกวาง-กรม',
    //             'price': 590,
    //             'amount': 1,
    //             'total': 590,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncuuh925hegk7c9jncuuh93.jpg'
    //         }],
    //         'orderSellerId': 3,
    //         'orderSellerName': 'test',
    //         'orderDiscount': null,
    //         'orderTotal': 1770,
    //         'orderLastupdate': '2019-01-08T15:14:21.735Z',
    //         'orderCreated': '2019-01-03T07:18:35.624Z',
    //         'orderId': 9,
    //         '__v': 0
    //     }, {
    //         'customer': {
    //             'orderCustomerId': 2,
    //             'orderCustomerChannelId': 7,
    //             'orderCustomerSocial': 'น้ำพริก กะปิ',
    //             'orderCustomerTel': '0890864485',
    //             'orderCustomerNameSurname': 'ปาลตรี สวัสดรปิติ',
    //             'orderCustomerIdhome': '4555454/4488',
    //             'orderCustomerAddress': 'ต.สันมหาพน อ.แม่แตง จ.เชียงใหม่',
    //             'orderCustomerZipcode': '50150'
    //         },
    //         'delivery': {'price': 100, 'orderShipmentId': 1},
    //         'payment': {
    //             'orderShipmentId': 1,
    //             'orderBankId': 2,
    //             'orderPaymentDate': '2018-12-23T17:00:00.000Z',
    //             'orderPaymentTime': '17:00',
    //             'orderPaymentImage': 'jq25jcla5hegkclzjq25jclb.jpg',
    //             'method': 'banktranfer'
    //         },
    //         'orderStatusCode': 5,
    //         'orderStatusName': 'success',
    //         'orderStatus': false,
    //         'orderCheckedPrint': true,
    //         'orderSelectedPrint': false,
    //         'orderRemark': '4556',
    //         '_id': '5c20ae7cb14bce3fd75961b6',
    //         'orderChannelId': 7,
    //         'orderODId': 'OD00000008',
    //         'products': [{
    //             'id': 2,
    //             'code': 'V208-B',
    //             'name': 'เสื้อปักกวาง-กรม',
    //             'price': 590,
    //             'amount': 1,
    //             'total': 590,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncuuh925hegk7c9jncuuh93.jpg'
    //         }, {
    //             'id': 1,
    //             'code': 'V208-C',
    //             'name': 'เสื้อปักกวาง-เขียว',
    //             'price': 590,
    //             'amount': 2,
    //             'total': 1180,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncur6ls5hegk7c9jncur6lt.jpg'
    //         }],
    //         'orderSellerId': 1,
    //         'orderSellerName': 'risingadmin',
    //         'orderDiscount': 200,
    //         'orderTotal': 1670,
    //         'orderLastupdate': '2019-01-03T12:00:59.305Z',
    //         'orderCreated': '2018-12-24T10:01:33.912Z',
    //         'orderId': 8,
    //         '__v': 0
    //     }, {
    //         'customer': {
    //             'orderCustomerId': 1,
    //             'orderCustomerChannelId': 2,
    //             'orderCustomerSocial': 'จรรยา ยาย่า',
    //             'orderCustomerTel': '0810960852',
    //             'orderCustomerNameSurname': 'จรรยา ซุนจ้าย',
    //             'orderCustomerIdhome': '458',
    //             'orderCustomerAddress': 'ต.วัดป่า อ.หล่มสัก จ.เพชรบูรณ์',
    //             'orderCustomerZipcode': '67110'
    //         },
    //         'delivery': {'price': 100, 'orderShipmentId': 1},
    //         'payment': {
    //             'orderShipmentId': 1,
    //             'orderBankId': 1,
    //             'orderPaymentDate': '2018-12-12T17:00:00.000Z',
    //             'orderPaymentTime': '20:51',
    //             'orderPaymentImage': 'jpmnzmq65hegk9btjpmnzmq7.png',
    //             'method': 'banktranfer'
    //         },
    //         'orderStatusCode': 0,
    //         'orderStatusName': 'process',
    //         'orderStatus': false,
    //         'orderCheckedPrint': false,
    //         'orderSelectedPrint': false,
    //         'orderRemark': '',
    //         '_id': '5c12646a9d903e2f3964f00e',
    //         'orderChannelId': 2,
    //         'orderODId': 'OD00000007',
    //         'products': [{
    //             '_id': '5c12646a9d903e2f3964f00f',
    //             'id': 1,
    //             'code': 'V208-C',
    //             'name': 'เสื้อปักกวาง-เขียว',
    //             'price': 590,
    //             'amount': 2,
    //             'total': 1180,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncur6ls5hegk7c9jncur6lt.jpg'
    //         }],
    //         'orderSellerId': 2,
    //         'orderSellerName': 'somsak',
    //         'orderDiscount': 200,
    //         'orderTotal': 1080,
    //         'orderLastupdate': '2018-12-13T13:53:45.599Z',
    //         'orderCreated': '2018-12-13T13:53:45.599Z',
    //         'orderId': 7,
    //         '__v': 0
    //     }, {
    //         'customer': {
    //             'orderCustomerId': 4,
    //             'orderCustomerChannelId': 10,
    //             'orderCustomerSocial': 'นันทนา พิสุทธิ์เกษม',
    //             'orderCustomerTel': '0851225629',
    //             'orderCustomerNameSurname': 'นันทนา พิสุทธิ์เกษม',
    //             'orderCustomerIdhome': '555',
    //             'orderCustomerAddress': 'ต.ห้วยใหญ่ อ.เมืองเพชรบูรณ์ จ.เพชรบูรณ์',
    //             'orderCustomerZipcode': '67000'
    //         },
    //         'delivery': {'price': 345, 'orderShipmentId': 1},
    //         'payment': {
    //             'orderShipmentId': 1,
    //             'orderBankId': 3,
    //             'orderPaymentDate': '2019-01-08T17:00:00.000Z',
    //             'orderPaymentTime': '17:50',
    //             'orderPaymentImage': 'jqp2dnng5hegk187jqp2dnnh.jpg',
    //             'method': 'banktranfer'
    //         },
    //         'orderStatusCode': 1,
    //         'orderStatusName': 'waitpack',
    //         'orderStatus': false,
    //         'orderCheckedPrint': false,
    //         'orderSelectedPrint': false,
    //         'orderRemark': '',
    //         '_id': '5c10c8733f1aab7e2255f4b6',
    //         'orderChannelId': 10,
    //         'orderODId': 'OD00000006',
    //         'products': [{
    //             '_id': '5c10c8733f1aab7e2255f4b7',
    //             'id': 2,
    //             'code': 'V208-B',
    //             'name': 'เสื้อปักกวาง-กรม',
    //             'price': 590,
    //             'amount': 1,
    //             'total': 590,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncuuh925hegk7c9jncuuh93.jpg'
    //         }, {
    //             'id': 1,
    //             'code': 'V208-C',
    //             'name': 'เสื้อปักกวาง-เขียว',
    //             'price': 590,
    //             'amount': 1,
    //             'total': 590,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncur6ls5hegk7c9jncur6lt.jpg'
    //         }],
    //         'orderSellerId': 2,
    //         'orderSellerName': 'somsak',
    //         'orderDiscount': 200,
    //         'orderTotal': 980,
    //         'orderLastupdate': '2019-01-09T10:51:49.040Z',
    //         'orderCreated': '2019-01-09T10:51:49.040Z',
    //         'orderId': 6,
    //         '__v': 0
    //     }, {
    //         'customer': {
    //             'orderCustomerId': 2,
    //             'orderCustomerChannelId': 12,
    //             'orderCustomerSocial': 'น้ำพริก กะปิ',
    //             'orderCustomerTel': '0890864485',
    //             'orderCustomerNameSurname': 'ปาลตรี สวัสดรปิติ',
    //             'orderCustomerIdhome': '10/8 หมู่ 9',
    //             'orderCustomerAddress': 'ต.มุกดาหาร อ.เมืองมุกดาหาร จ.มุกดาหาร',
    //             'orderCustomerZipcode': '49000'
    //         },
    //         'delivery': {'price': 55, 'orderShipmentId': 1},
    //         'payment': {
    //             'orderShipmentId': 1,
    //             'orderBankId': 1,
    //             'orderPaymentDate': '2018-12-11T17:00:00.000Z',
    //             'orderPaymentTime': '15:32',
    //             'orderPaymentImage': 'jpkx52fk5hegkowyjpkx52fl.png',
    //             'method': 'banktranfer'
    //         },
    //         'orderStatusCode': 6,
    //         'orderStatusName': 'fail',
    //         'orderStatus': false,
    //         'orderCheckedPrint': true,
    //         'orderSelectedPrint': false,
    //         'orderRemark': '',
    //         '_id': '5c10c8103f1aab7e2255f4b3',
    //         'orderChannelId': 12,
    //         'orderODId': 'OD00000005',
    //         'products': [{
    //             '_id': '5c10c8103f1aab7e2255f4b5',
    //             'id': 1,
    //             'code': 'V208-C',
    //             'name': 'เสื้อปักกวาง-เขียว',
    //             'price': 590,
    //             'amount': 1,
    //             'total': 590,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncur6ls5hegk7c9jncur6lt.jpg'
    //         }, {
    //             '_id': '5c10c8103f1aab7e2255f4b4',
    //             'id': 2,
    //             'code': 'V208-B',
    //             'name': 'เสื้อปักกวาง-กรม',
    //             'price': 590,
    //             'amount': 1,
    //             'total': 590,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncuuh925hegk7c9jncuuh93.jpg'
    //         }],
    //         'orderSellerId': 2,
    //         'orderSellerName': 'somsak',
    //         'orderDiscount': 234,
    //         'orderTotal': 1001,
    //         'orderLastupdate': '2019-01-03T12:01:25.577Z',
    //         'orderCreated': '2018-12-12T08:34:23.218Z',
    //         'orderId': 5,
    //         '__v': 0
    //     }, {
    //         'customer': {
    //             'orderCustomerId': 5,
    //             'orderCustomerChannelId': 12,
    //             'orderCustomerSocial': 'ภิญญดา จรรยาโมทย์',
    //             'orderCustomerTel': '0642728292',
    //             'orderCustomerNameSurname': 'ภิญญดา จรรยาโมทย์',
    //             'orderCustomerIdhome': '2456/56',
    //             'orderCustomerAddress': 'ต.ห้วยโพธิ์ อ.เมืองกาฬสินธุ์ จ.กาฬสินธุ์',
    //             'orderCustomerZipcode': '46000'
    //         },
    //         'delivery': {'price': 50, 'orderShipmentId': 1},
    //         'payment': {
    //             'orderShipmentId': 1,
    //             'orderBankId': 2,
    //             'orderPaymentDate': '2018-12-12T17:00:00.000Z',
    //             'orderPaymentTime': '08:00',
    //             'orderPaymentImage': 'jpkxpceb5hegkowyjpkxpcec.png',
    //             'method': 'banktranfer'
    //         },
    //         'orderStatusCode': 0,
    //         'orderStatusName': 'process',
    //         'orderStatus': false,
    //         'orderCheckedPrint': false,
    //         'orderSelectedPrint': false,
    //         'orderRemark': '',
    //         '_id': '5c10be0c3f1aab7e2255f4b0',
    //         'orderChannelId': 12,
    //         'orderODId': 'OD00000004',
    //         'products': [{
    //             '_id': '5c10be0c3f1aab7e2255f4b2',
    //             'id': 1,
    //             'code': 'V208-C',
    //             'name': 'เสื้อปักกวาง-เขียว',
    //             'price': 590,
    //             'amount': 2,
    //             'total': 1180,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncur6ls5hegk7c9jncur6lt.jpg'
    //         }, {
    //             '_id': '5c10be0c3f1aab7e2255f4b1',
    //             'id': 2,
    //             'code': 'V208-B',
    //             'name': 'เสื้อปักกวาง-กรม',
    //             'price': 590,
    //             'amount': 1,
    //             'total': 590,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncuuh925hegk7c9jncuuh93.jpg'
    //         }],
    //         'orderSellerId': 2,
    //         'orderSellerName': 'somsak',
    //         'orderDiscount': 100,
    //         'orderTotal': 1720,
    //         'orderLastupdate': '2018-12-13T13:48:42.209Z',
    //         'orderCreated': '2018-12-12T08:50:09.305Z',
    //         'orderId': 4,
    //         '__v': 0
    //     }, {
    //         'customer': {
    //             'orderCustomerId': 2,
    //             'orderCustomerChannelId': 9,
    //             'orderCustomerSocial': 'น้ำพริก กะปิ',
    //             'orderCustomerTel': '0890864485',
    //             'orderCustomerNameSurname': 'ปาลตรี สวัสดรปิติ',
    //             'orderCustomerIdhome': '1234',
    //             'orderCustomerAddress': 'ต.สันติคีรี อ.แม่ลาน้อย จ.แม่ฮ่องสอน',
    //             'orderCustomerZipcode': '58120'
    //         },
    //         'delivery': {'price': 0, 'orderShipmentId': 1},
    //         'payment': {
    //             'orderShipmentId': 1,
    //             'orderBankId': null,
    //             'orderPaymentDate': null,
    //             'orderPaymentTime': null,
    //             'orderPaymentImage': null,
    //             'method': 'cod'
    //         },
    //         'orderStatusCode': 3,
    //         'orderStatusName': 'pack',
    //         'orderStatus': false,
    //         'orderCheckedPrint': true,
    //         'orderSelectedPrint': false,
    //         'orderRemark': '',
    //         '_id': '5c10b6083f1aab7e2255f4a5',
    //         'orderChannelId': 9,
    //         'orderODId': 'OD00000003',
    //         'products': [{
    //             '_id': '5c10b6083f1aab7e2255f4a7',
    //             'id': 2,
    //             'code': 'V208-B',
    //             'name': 'เสื้อปักกวาง-กรม',
    //             'price': 590,
    //             'amount': 1,
    //             'total': 590,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncuuh925hegk7c9jncuuh93.jpg'
    //         }, {
    //             '_id': '5c10b6083f1aab7e2255f4a6',
    //             'id': 4,
    //             'code': 'V208-A',
    //             'name': 'เสื้อปักกวาง-แดง',
    //             'price': 590,
    //             'amount': 1,
    //             'total': 590,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncv02ve5hegk7c9jncv02vf.jpg'
    //         }],
    //         'orderSellerId': 2,
    //         'orderSellerName': 'somsak',
    //         'orderDiscount': 0,
    //         'orderTotal': 1180,
    //         'orderLastupdate': '2018-12-13T13:47:45.219Z',
    //         'orderCreated': '2018-12-12T07:48:33.498Z',
    //         'orderId': 3,
    //         '__v': 0
    //     }, {
    //         'customer': {
    //             'orderCustomerId': 6,
    //             'orderCustomerChannelId': 7,
    //             'orderCustomerSocial': '@Kiikii_Cool@',
    //             'orderCustomerTel': '0817064587',
    //             'orderCustomerNameSurname': 'มณีรัตน์ ศิริจรรยา',
    //             'orderCustomerIdhome': '45',
    //             'orderCustomerAddress': 'ต.โพธิ์ทอง อ.โพนทอง จ.ร้อยเอ็ด',
    //             'orderCustomerZipcode': '45110'
    //         },
    //         'delivery': {'price': 10, 'orderShipmentId': 2},
    //         'payment': {
    //             'orderShipmentId': 2,
    //             'orderBankId': null,
    //             'orderPaymentDate': null,
    //             'orderPaymentTime': null,
    //             'orderPaymentImage': null,
    //             'method': 'cod'
    //         },
    //         'orderStatusCode': 4,
    //         'orderStatusName': 'delivery',
    //         'orderStatus': false,
    //         'orderCheckedPrint': true,
    //         'orderSelectedPrint': false,
    //         'orderRemark': '',
    //         '_id': '5c10b16e1bb0877d120bcddf',
    //         'orderChannelId': 7,
    //         'orderODId': 'OD00000002',
    //         'products': [{
    //             '_id': '5c10b16e1bb0877d120bcde0',
    //             'id': 6,
    //             'code': 'V207-C',
    //             'name': 'เดรสกระดุม-โอรส',
    //             'price': 690,
    //             'amount': 1,
    //             'total': 690,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncv2sob5hegk7c9jncv2soc.jpg'
    //         }],
    //         'orderSellerId': 1,
    //         'orderSellerName': 'risingadmin',
    //         'orderDiscount': 0,
    //         'orderTotal': 700,
    //         'orderLastupdate': '2018-12-13T13:50:22.169Z',
    //         'orderCreated': '2018-12-12T06:57:50.469Z',
    //         'orderId': 2,
    //         '__v': 0
    //     }, {
    //         'customer': {
    //             'orderCustomerId': 2,
    //             'orderCustomerChannelId': 9,
    //             'orderCustomerSocial': 'น้ำพริก กะปิ',
    //             'orderCustomerTel': '0890864485',
    //             'orderCustomerNameSurname': 'ปาลตรี สวัสดรปิติ',
    //             'orderCustomerIdhome': '1223',
    //             'orderCustomerAddress': 'ต.นาดอกคำ อ.นาด้วง จ.เลย',
    //             'orderCustomerZipcode': '42210'
    //         },
    //         'delivery': {'price': 0, 'orderShipmentId': 2},
    //         'payment': {
    //             'orderShipmentId': 2,
    //             'orderBankId': null,
    //             'orderPaymentDate': null,
    //             'orderPaymentTime': null,
    //             'orderPaymentImage': null,
    //             'method': 'cod'
    //         },
    //         'orderStatusCode': 1,
    //         'orderStatusName': 'waitpack',
    //         'orderStatus': false,
    //         'orderCheckedPrint': false,
    //         'orderSelectedPrint': false,
    //         'orderRemark': '',
    //         '_id': '5c10af4f10dd287c536b75c4',
    //         'orderChannelId': 9,
    //         'orderODId': 'OD00000001',
    //         'products': [{
    //             '_id': '5c10af4f10dd287c536b75c6',
    //             'id': 1,
    //             'code': 'V208-C',
    //             'name': 'เสื้อปักกวาง-เขียว',
    //             'price': 590,
    //             'amount': 2,
    //             'total': 1180,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncur6ls5hegk7c9jncur6lt.jpg'
    //         }, {
    //             '_id': '5c10af4f10dd287c536b75c5',
    //             'id': 2,
    //             'code': 'V208-B',
    //             'name': 'เสื้อปักกวาง-กรม',
    //             'price': 590,
    //             'amount': 1,
    //             'total': 590,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncuuh925hegk7c9jncuuh93.jpg'
    //         }],
    //         'orderSellerId': 1,
    //         'orderSellerName': 'risingadmin',
    //         'orderDiscount': 50,
    //         'orderTotal': 1720,
    //         'orderLastupdate': '2018-12-12T06:54:42.542Z',
    //         'orderCreated': '2018-12-12T06:54:42.542Z',
    //         'orderId': 1,
    //         '__v': 0
    //     }];
    //
    //     const orders2 = [{
    //         'customer': {
    //             'orderCustomerId': 5,
    //             'orderCustomerChannelId': 8,
    //             'orderCustomerSocial': 'ภิญญดา จรรยาโมทย์',
    //             'orderCustomerTel': '0642728292',
    //             'orderCustomerNameSurname': 'ภิญญดา จรรยาโมทย์',
    //             'orderCustomerIdhome': '177 / 4 หมู่ 9',
    //             'orderCustomerAddress': 'ต.แสนสุข อ.เมืองชลบุรี จ.ชลบุรี',
    //             'orderCustomerZipcode': '20130'
    //         },
    //         'delivery': {'price': 10, 'orderShipmentId': 1},
    //         'payment': {
    //             'orderShipmentId': 1,
    //             'orderBankId': null,
    //             'orderPaymentDate': null,
    //             'orderPaymentTime': null,
    //             'orderPaymentImage': null,
    //             'method': 'cod'
    //         },
    //         'orderStatusCode': 0,
    //         'orderStatusName': 'process',
    //         'orderStatus': false,
    //         'orderCheckedPrint': false,
    //         'orderSelectedPrint': false,
    //         'orderRemark': 'หมายเหตุ ... 12345',
    //         '_id': '5c35d81e01c4230637493e70',
    //         'orderChannelId': 8,
    //         'orderODId': 'OD00000010',
    //         'products': [{
    //             'id': 1,
    //             'code': 'V208-C',
    //             'name': 'เสื้อปักกวาง-เขียว',
    //             'price': 590,
    //             'amount': 1,
    //             'total': 590,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncur6ls5hegk7c9jncur6lt.jpg'
    //         }, {
    //             'id': 2,
    //             'code': 'V208-B',
    //             'name': 'เสื้อปักกวาง-กรม',
    //             'price': 590,
    //             'amount': 1,
    //             'total': 590,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncuuh925hegk7c9jncuuh93.jpg'
    //         }],
    //         'orderSellerId': 2,
    //         'orderSellerName': 'somsak',
    //         'orderDiscount': 20,
    //         'orderTotal': 1170,
    //         'orderLastupdate': '2019-01-09T11:16:46.697Z',
    //         'orderCreated': '2019-01-09T11:16:46.697Z',
    //         'orderId': 10,
    //         '__v': 0
    //     }, {
    //         'customer': {
    //             'orderCustomerId': 1,
    //             'orderCustomerChannelId': 7,
    //             'orderCustomerSocial': 'จรรยา ยาย่า',
    //             'orderCustomerTel': '0810960852',
    //             'orderCustomerNameSurname': 'จรรยา ซุนจ้าย',
    //             'orderCustomerIdhome': '999/9 หมู่ 8 4556 ซอย.สุขใจ',
    //             'orderCustomerAddress': 'ต.เสม็จ อ.สำโรงทาบ จ.สุรินทร์',
    //             'orderCustomerZipcode': '32170'
    //         },
    //         'delivery': {'price': 0, 'orderShipmentId': 1},
    //         'payment': {
    //             'orderShipmentId': 1,
    //             'orderBankId': null,
    //             'orderPaymentDate': null,
    //             'orderPaymentTime': null,
    //             'orderPaymentImage': null,
    //             'method': 'cod'
    //         },
    //         'orderStatusCode': 3,
    //         'orderStatusName': 'pack',
    //         'orderStatus': false,
    //         'orderCheckedPrint': true,
    //         'orderSelectedPrint': false,
    //         'orderRemark': 'หมายเหตุ...',
    //         '_id': '5c2db74bb14bce3fd75961b7',
    //         'orderChannelId': 7,
    //         'orderODId': 'OD00000009',
    //         'products': [{
    //             'id': 1,
    //             'code': 'V208-C',
    //             'name': 'เสื้อปักกวาง-เขียว',
    //             'price': 590,
    //             'amount': 2,
    //             'total': 1180,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncur6ls5hegk7c9jncur6lt.jpg'
    //         }, {
    //             'id': 2,
    //             'code': 'V208-B',
    //             'name': 'เสื้อปักกวาง-กรม',
    //             'price': 590,
    //             'amount': 1,
    //             'total': 590,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncuuh925hegk7c9jncuuh93.jpg'
    //         }],
    //         'orderSellerId': 3,
    //         'orderSellerName': 'test',
    //         'orderDiscount': null,
    //         'orderTotal': 1770,
    //         'orderLastupdate': '2019-01-08T15:14:21.735Z',
    //         'orderCreated': '2019-01-03T07:18:35.624Z',
    //         'orderId': 9,
    //         '__v': 0
    //     }, {
    //         'customer': {
    //             'orderCustomerId': 2,
    //             'orderCustomerChannelId': 7,
    //             'orderCustomerSocial': 'น้ำพริก กะปิ',
    //             'orderCustomerTel': '0890864485',
    //             'orderCustomerNameSurname': 'ปาลตรี สวัสดรปิติ',
    //             'orderCustomerIdhome': '4555454/4488',
    //             'orderCustomerAddress': 'ต.สันมหาพน อ.แม่แตง จ.เชียงใหม่',
    //             'orderCustomerZipcode': '50150'
    //         },
    //         'delivery': {'price': 100, 'orderShipmentId': 1},
    //         'payment': {
    //             'orderShipmentId': 1,
    //             'orderBankId': 2,
    //             'orderPaymentDate': '2018-12-23T17:00:00.000Z',
    //             'orderPaymentTime': '17:00',
    //             'orderPaymentImage': 'jq25jcla5hegkclzjq25jclb.jpg',
    //             'method': 'banktranfer'
    //         },
    //         'orderStatusCode': 5,
    //         'orderStatusName': 'success',
    //         'orderStatus': false,
    //         'orderCheckedPrint': true,
    //         'orderSelectedPrint': false,
    //         'orderRemark': '4556',
    //         '_id': '5c20ae7cb14bce3fd75961b6',
    //         'orderChannelId': 7,
    //         'orderODId': 'OD00000008',
    //         'products': [{
    //             'id': 2,
    //             'code': 'V208-B',
    //             'name': 'เสื้อปักกวาง-กรม',
    //             'price': 590,
    //             'amount': 1,
    //             'total': 590,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncuuh925hegk7c9jncuuh93.jpg'
    //         }, {
    //             'id': 1,
    //             'code': 'V208-C',
    //             'name': 'เสื้อปักกวาง-เขียว',
    //             'price': 590,
    //             'amount': 2,
    //             'total': 1180,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncur6ls5hegk7c9jncur6lt.jpg'
    //         }],
    //         'orderSellerId': 1,
    //         'orderSellerName': 'risingadmin',
    //         'orderDiscount': 200,
    //         'orderTotal': 1670,
    //         'orderLastupdate': '2019-01-03T12:00:59.305Z',
    //         'orderCreated': '2018-12-24T10:01:33.912Z',
    //         'orderId': 8,
    //         '__v': 0
    //     }, {
    //         'customer': {
    //             'orderCustomerId': 1,
    //             'orderCustomerChannelId': 2,
    //             'orderCustomerSocial': 'จรรยา ยาย่า',
    //             'orderCustomerTel': '0810960852',
    //             'orderCustomerNameSurname': 'จรรยา ซุนจ้าย',
    //             'orderCustomerIdhome': '458',
    //             'orderCustomerAddress': 'ต.วัดป่า อ.หล่มสัก จ.เพชรบูรณ์',
    //             'orderCustomerZipcode': '67110'
    //         },
    //         'delivery': {'price': 100, 'orderShipmentId': 1},
    //         'payment': {
    //             'orderShipmentId': 1,
    //             'orderBankId': 1,
    //             'orderPaymentDate': '2018-12-12T17:00:00.000Z',
    //             'orderPaymentTime': '20:51',
    //             'orderPaymentImage': 'jpmnzmq65hegk9btjpmnzmq7.png',
    //             'method': 'banktranfer'
    //         },
    //         'orderStatusCode': 0,
    //         'orderStatusName': 'process',
    //         'orderStatus': false,
    //         'orderCheckedPrint': false,
    //         'orderSelectedPrint': false,
    //         'orderRemark': '',
    //         '_id': '5c12646a9d903e2f3964f00e',
    //         'orderChannelId': 2,
    //         'orderODId': 'OD00000007',
    //         'products': [{
    //             '_id': '5c12646a9d903e2f3964f00f',
    //             'id': 1,
    //             'code': 'V208-C',
    //             'name': 'เสื้อปักกวาง-เขียว',
    //             'price': 590,
    //             'amount': 2,
    //             'total': 1180,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncur6ls5hegk7c9jncur6lt.jpg'
    //         }],
    //         'orderSellerId': 2,
    //         'orderSellerName': 'somsak',
    //         'orderDiscount': 200,
    //         'orderTotal': 1080,
    //         'orderLastupdate': '2018-12-13T13:53:45.599Z',
    //         'orderCreated': '2018-12-13T13:53:45.599Z',
    //         'orderId': 7,
    //         '__v': 0
    //     }, {
    //         'customer': {
    //             'orderCustomerId': 4,
    //             'orderCustomerChannelId': 10,
    //             'orderCustomerSocial': 'นันทนา พิสุทธิ์เกษม',
    //             'orderCustomerTel': '0851225629',
    //             'orderCustomerNameSurname': 'นันทนา พิสุทธิ์เกษม',
    //             'orderCustomerIdhome': '555',
    //             'orderCustomerAddress': 'ต.ห้วยใหญ่ อ.เมืองเพชรบูรณ์ จ.เพชรบูรณ์',
    //             'orderCustomerZipcode': '67000'
    //         },
    //         'delivery': {'price': 345, 'orderShipmentId': 1},
    //         'payment': {
    //             'orderShipmentId': 1,
    //             'orderBankId': 3,
    //             'orderPaymentDate': '2019-01-08T17:00:00.000Z',
    //             'orderPaymentTime': '17:50',
    //             'orderPaymentImage': 'jqp2dnng5hegk187jqp2dnnh.jpg',
    //             'method': 'banktranfer'
    //         },
    //         'orderStatusCode': 1,
    //         'orderStatusName': 'waitpack',
    //         'orderStatus': false,
    //         'orderCheckedPrint': false,
    //         'orderSelectedPrint': false,
    //         'orderRemark': '',
    //         '_id': '5c10c8733f1aab7e2255f4b6',
    //         'orderChannelId': 10,
    //         'orderODId': 'OD00000006',
    //         'products': [{
    //             '_id': '5c10c8733f1aab7e2255f4b7',
    //             'id': 2,
    //             'code': 'V208-B',
    //             'name': 'เสื้อปักกวาง-กรม',
    //             'price': 590,
    //             'amount': 1,
    //             'total': 590,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncuuh925hegk7c9jncuuh93.jpg'
    //         }, {
    //             'id': 1,
    //             'code': 'V208-C',
    //             'name': 'เสื้อปักกวาง-เขียว',
    //             'price': 590,
    //             'amount': 1,
    //             'total': 590,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncur6ls5hegk7c9jncur6lt.jpg'
    //         }],
    //         'orderSellerId': 2,
    //         'orderSellerName': 'somsak',
    //         'orderDiscount': 200,
    //         'orderTotal': 980,
    //         'orderLastupdate': '2019-01-09T10:51:49.040Z',
    //         'orderCreated': '2019-01-09T10:51:49.040Z',
    //         'orderId': 6,
    //         '__v': 0
    //     }, {
    //         'customer': {
    //             'orderCustomerId': 2,
    //             'orderCustomerChannelId': 12,
    //             'orderCustomerSocial': 'น้ำพริก กะปิ',
    //             'orderCustomerTel': '0890864485',
    //             'orderCustomerNameSurname': 'ปาลตรี สวัสดรปิติ',
    //             'orderCustomerIdhome': '10/8 หมู่ 9',
    //             'orderCustomerAddress': 'ต.มุกดาหาร อ.เมืองมุกดาหาร จ.มุกดาหาร',
    //             'orderCustomerZipcode': '49000'
    //         },
    //         'delivery': {'price': 55, 'orderShipmentId': 1},
    //         'payment': {
    //             'orderShipmentId': 1,
    //             'orderBankId': 1,
    //             'orderPaymentDate': '2018-12-11T17:00:00.000Z',
    //             'orderPaymentTime': '15:32',
    //             'orderPaymentImage': 'jpkx52fk5hegkowyjpkx52fl.png',
    //             'method': 'banktranfer'
    //         },
    //         'orderStatusCode': 6,
    //         'orderStatusName': 'fail',
    //         'orderStatus': false,
    //         'orderCheckedPrint': true,
    //         'orderSelectedPrint': false,
    //         'orderRemark': '',
    //         '_id': '5c10c8103f1aab7e2255f4b3',
    //         'orderChannelId': 12,
    //         'orderODId': 'OD00000005',
    //         'products': [{
    //             '_id': '5c10c8103f1aab7e2255f4b5',
    //             'id': 1,
    //             'code': 'V208-C',
    //             'name': 'เสื้อปักกวาง-เขียว',
    //             'price': 590,
    //             'amount': 1,
    //             'total': 590,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncur6ls5hegk7c9jncur6lt.jpg'
    //         }, {
    //             '_id': '5c10c8103f1aab7e2255f4b4',
    //             'id': 2,
    //             'code': 'V208-B',
    //             'name': 'เสื้อปักกวาง-กรม',
    //             'price': 590,
    //             'amount': 1,
    //             'total': 590,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncuuh925hegk7c9jncuuh93.jpg'
    //         }],
    //         'orderSellerId': 2,
    //         'orderSellerName': 'somsak',
    //         'orderDiscount': 234,
    //         'orderTotal': 1001,
    //         'orderLastupdate': '2019-01-03T12:01:25.577Z',
    //         'orderCreated': '2018-12-12T08:34:23.218Z',
    //         'orderId': 5,
    //         '__v': 0
    //     }, {
    //         'customer': {
    //             'orderCustomerId': 5,
    //             'orderCustomerChannelId': 12,
    //             'orderCustomerSocial': 'ภิญญดา จรรยาโมทย์',
    //             'orderCustomerTel': '0642728292',
    //             'orderCustomerNameSurname': 'ภิญญดา จรรยาโมทย์',
    //             'orderCustomerIdhome': '2456/56',
    //             'orderCustomerAddress': 'ต.ห้วยโพธิ์ อ.เมืองกาฬสินธุ์ จ.กาฬสินธุ์',
    //             'orderCustomerZipcode': '46000'
    //         },
    //         'delivery': {'price': 50, 'orderShipmentId': 1},
    //         'payment': {
    //             'orderShipmentId': 1,
    //             'orderBankId': 2,
    //             'orderPaymentDate': '2018-12-12T17:00:00.000Z',
    //             'orderPaymentTime': '08:00',
    //             'orderPaymentImage': 'jpkxpceb5hegkowyjpkxpcec.png',
    //             'method': 'banktranfer'
    //         },
    //         'orderStatusCode': 0,
    //         'orderStatusName': 'process',
    //         'orderStatus': false,
    //         'orderCheckedPrint': false,
    //         'orderSelectedPrint': false,
    //         'orderRemark': '',
    //         '_id': '5c10be0c3f1aab7e2255f4b0',
    //         'orderChannelId': 12,
    //         'orderODId': 'OD00000004',
    //         'products': [{
    //             '_id': '5c10be0c3f1aab7e2255f4b2',
    //             'id': 1,
    //             'code': 'V208-C',
    //             'name': 'เสื้อปักกวาง-เขียว',
    //             'price': 590,
    //             'amount': 2,
    //             'total': 1180,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncur6ls5hegk7c9jncur6lt.jpg'
    //         }, {
    //             '_id': '5c10be0c3f1aab7e2255f4b1',
    //             'id': 2,
    //             'code': 'V208-B',
    //             'name': 'เสื้อปักกวาง-กรม',
    //             'price': 590,
    //             'amount': 1,
    //             'total': 590,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncuuh925hegk7c9jncuuh93.jpg'
    //         }],
    //         'orderSellerId': 2,
    //         'orderSellerName': 'somsak',
    //         'orderDiscount': 100,
    //         'orderTotal': 1720,
    //         'orderLastupdate': '2018-12-13T13:48:42.209Z',
    //         'orderCreated': '2018-12-12T08:50:09.305Z',
    //         'orderId': 4,
    //         '__v': 0
    //     }, {
    //         'customer': {
    //             'orderCustomerId': 2,
    //             'orderCustomerChannelId': 9,
    //             'orderCustomerSocial': 'น้ำพริก กะปิ',
    //             'orderCustomerTel': '0890864485',
    //             'orderCustomerNameSurname': 'ปาลตรี สวัสดรปิติ',
    //             'orderCustomerIdhome': '1234',
    //             'orderCustomerAddress': 'ต.สันติคีรี อ.แม่ลาน้อย จ.แม่ฮ่องสอน',
    //             'orderCustomerZipcode': '58120'
    //         },
    //         'delivery': {'price': 0, 'orderShipmentId': 1},
    //         'payment': {
    //             'orderShipmentId': 1,
    //             'orderBankId': null,
    //             'orderPaymentDate': null,
    //             'orderPaymentTime': null,
    //             'orderPaymentImage': null,
    //             'method': 'cod'
    //         },
    //         'orderStatusCode': 3,
    //         'orderStatusName': 'pack',
    //         'orderStatus': false,
    //         'orderCheckedPrint': true,
    //         'orderSelectedPrint': false,
    //         'orderRemark': '',
    //         '_id': '5c10b6083f1aab7e2255f4a5',
    //         'orderChannelId': 9,
    //         'orderODId': 'OD00000003',
    //         'products': [{
    //             '_id': '5c10b6083f1aab7e2255f4a7',
    //             'id': 2,
    //             'code': 'V208-B',
    //             'name': 'เสื้อปักกวาง-กรม',
    //             'price': 590,
    //             'amount': 1,
    //             'total': 590,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncuuh925hegk7c9jncuuh93.jpg'
    //         }, {
    //             '_id': '5c10b6083f1aab7e2255f4a6',
    //             'id': 4,
    //             'code': 'V208-A',
    //             'name': 'เสื้อปักกวาง-แดง',
    //             'price': 590,
    //             'amount': 1,
    //             'total': 590,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncv02ve5hegk7c9jncv02vf.jpg'
    //         }],
    //         'orderSellerId': 2,
    //         'orderSellerName': 'somsak',
    //         'orderDiscount': 0,
    //         'orderTotal': 1180,
    //         'orderLastupdate': '2018-12-13T13:47:45.219Z',
    //         'orderCreated': '2018-12-12T07:48:33.498Z',
    //         'orderId': 3,
    //         '__v': 0
    //     }, {
    //         'customer': {
    //             'orderCustomerId': 6,
    //             'orderCustomerChannelId': 7,
    //             'orderCustomerSocial': '@Kiikii_Cool@',
    //             'orderCustomerTel': '0817064587',
    //             'orderCustomerNameSurname': 'มณีรัตน์ ศิริจรรยา',
    //             'orderCustomerIdhome': '45',
    //             'orderCustomerAddress': 'ต.โพธิ์ทอง อ.โพนทอง จ.ร้อยเอ็ด',
    //             'orderCustomerZipcode': '45110'
    //         },
    //         'delivery': {'price': 10, 'orderShipmentId': 2},
    //         'payment': {
    //             'orderShipmentId': 2,
    //             'orderBankId': null,
    //             'orderPaymentDate': null,
    //             'orderPaymentTime': null,
    //             'orderPaymentImage': null,
    //             'method': 'cod'
    //         },
    //         'orderStatusCode': 4,
    //         'orderStatusName': 'delivery',
    //         'orderStatus': false,
    //         'orderCheckedPrint': true,
    //         'orderSelectedPrint': false,
    //         'orderRemark': '',
    //         '_id': '5c10b16e1bb0877d120bcddf',
    //         'orderChannelId': 7,
    //         'orderODId': 'OD00000002',
    //         'products': [{
    //             '_id': '5c10b16e1bb0877d120bcde0',
    //             'id': 6,
    //             'code': 'V207-C',
    //             'name': 'เดรสกระดุม-โอรส',
    //             'price': 690,
    //             'amount': 1,
    //             'total': 690,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncv2sob5hegk7c9jncv2soc.jpg'
    //         }],
    //         'orderSellerId': 1,
    //         'orderSellerName': 'risingadmin',
    //         'orderDiscount': 0,
    //         'orderTotal': 700,
    //         'orderLastupdate': '2018-12-13T13:50:22.169Z',
    //         'orderCreated': '2018-12-12T06:57:50.469Z',
    //         'orderId': 2,
    //         '__v': 0
    //     }, {
    //         'customer': {
    //             'orderCustomerId': 2,
    //             'orderCustomerChannelId': 9,
    //             'orderCustomerSocial': 'น้ำพริก กะปิ',
    //             'orderCustomerTel': '0890864485',
    //             'orderCustomerNameSurname': 'ปาลตรี สวัสดรปิติ',
    //             'orderCustomerIdhome': '1223',
    //             'orderCustomerAddress': 'ต.นาดอกคำ อ.นาด้วง จ.เลย',
    //             'orderCustomerZipcode': '42210'
    //         },
    //         'delivery': {'price': 0, 'orderShipmentId': 2},
    //         'payment': {
    //             'orderShipmentId': 2,
    //             'orderBankId': null,
    //             'orderPaymentDate': null,
    //             'orderPaymentTime': null,
    //             'orderPaymentImage': null,
    //             'method': 'cod'
    //         },
    //         'orderStatusCode': 1,
    //         'orderStatusName': 'waitpack',
    //         'orderStatus': false,
    //         'orderCheckedPrint': false,
    //         'orderSelectedPrint': false,
    //         'orderRemark': '',
    //         '_id': '5c10af4f10dd287c536b75c4',
    //         'orderChannelId': 9,
    //         'orderODId': 'OD00000001',
    //         'products': [{
    //             '_id': '5c10af4f10dd287c536b75c6',
    //             'id': 1,
    //             'code': 'V208-C',
    //             'name': 'เสื้อปักกวาง-เขียว',
    //             'price': 590,
    //             'amount': 2,
    //             'total': 1180,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncur6ls5hegk7c9jncur6lt.jpg'
    //         }, {
    //             '_id': '5c10af4f10dd287c536b75c5',
    //             'id': 2,
    //             'code': 'V208-B',
    //             'name': 'เสื้อปักกวาง-กรม',
    //             'price': 590,
    //             'amount': 1,
    //             'total': 590,
    //             'image': 'https://somsakreborn.com:8888/images/product/jncuuh925hegk7c9jncuuh93.jpg'
    //         }],
    //         'orderSellerId': 1,
    //         'orderSellerName': 'risingadmin',
    //         'orderDiscount': 50,
    //         'orderTotal': 1720,
    //         'orderLastupdate': '2018-12-12T06:54:42.542Z',
    //         'orderCreated': '2018-12-12T06:54:42.542Z',
    //         'orderId': 1,
    //         '__v': 0
    //     }];
    //
    //     const products = [{
    //         'productImage': 'jncv4bn05hegk7c9jncv4bn1.jpg',
    //         'productStatus': true,
    //         'warehouseId': 1,
    //         'productHold': 4,
    //         'productRemain': 0,
    //         '_id': '5bc6eb1f4175472529fb785f',
    //         'productName': 'เดรสกระดุม-ชมพู',
    //         'productCodename': 'V207-A',
    //         'productBarcode': 'V207-A',
    //         'categoryId': 5,
    //         'productComment': null,
    //         'productDetail': null,
    //         'productTag': null,
    //         'productCategory': 'สินค้าธรรมดา',
    //         'productCost': 0,
    //         'productPiece': 690,
    //         'productTotal': 4,
    //         'productMinimum': 0,
    //         'productWeight': 0,
    //         'productLastupdate': '2019-01-03T07:14:58.251Z',
    //         'productCreated': '2018-10-17T07:56:15.544Z',
    //         'productId': 8,
    //         '__v': 0,
    //         'productInventory': 120,
    //         'historys': []
    //     }, {
    //         'productImage': 'jncv3kei5hegk7c9jncv3kej.jpg',
    //         'productStatus': true,
    //         'warehouseId': 1,
    //         'productHold': 0,
    //         'productRemain': 0,
    //         '_id': '5bc6eafc4175472529fb785e',
    //         'productName': 'เดรสกระดุม-เขียว',
    //         'productCodename': 'V207-B',
    //         'productBarcode': 'V207-B',
    //         'categoryId': 5,
    //         'productComment': null,
    //         'productDetail': null,
    //         'productTag': null,
    //         'productCategory': 'สินค้าธรรมดา',
    //         'productCost': 0,
    //         'productPiece': 690,
    //         'productTotal': 10,
    //         'productMinimum': 0,
    //         'productWeight': 0,
    //         'productLastupdate': '2019-01-04T12:26:42.669Z',
    //         'productCreated': '2018-10-17T07:55:40.245Z',
    //         'productId': 7,
    //         '__v': 0,
    //         'productInventory': 52,
    //         'historys': [{
    //             'lastUpdate': '2019-01-04T12:26:26.513Z',
    //             'hisName': 'addStockInputTotal',
    //             'hisRemark': 'เพิ่มจำนวนสต๊อกสินค้าเข้า 0 + 20 => 20',
    //             'sellerId': 2,
    //             'sellerName': 'somsak'
    //         }, {
    //             'lastUpdate': '2019-01-04T12:26:42.669Z',
    //             'hisName': 'deductStockInputTotal',
    //             'hisRemark': 'ลดจำนวนสต๊อกสินค้าเข้า 20 - 10 => 10',
    //             'sellerId': 2,
    //             'sellerName': 'somsak'
    //         }]
    //     }, {
    //         'productImage': 'jncv2sob5hegk7c9jncv2soc.jpg',
    //         'productStatus': true,
    //         'warehouseId': 1,
    //         'productHold': 1,
    //         'productRemain': 0,
    //         '_id': '5bc6ead84175472529fb785d',
    //         'productName': 'เดรสกระดุม-โอรส',
    //         'productCodename': 'V207-C',
    //         'productBarcode': 'V207-C',
    //         'categoryId': 5,
    //         'productComment': '',
    //         'productDetail': '',
    //         'productTag': '',
    //         'productCategory': 'สินค้าธรรมดา',
    //         'productCost': 0,
    //         'productPiece': 690,
    //         'productTotal': 1,
    //         'productMinimum': 0,
    //         'productWeight': 0,
    //         'productLastupdate': '2018-12-12T06:45:08.837Z',
    //         'productCreated': '2018-10-17T07:55:04.314Z',
    //         'productId': 6,
    //         '__v': 0,
    //         'productInventory': 25,
    //         'historys': []
    //     }, {
    //         'productImage': 'jncv1kad5hegk7c9jncv1kae.jpg',
    //         'productStatus': true,
    //         'warehouseId': 1,
    //         'productHold': 0,
    //         'productRemain': 0,
    //         '_id': '5bc6ea9e4175472529fb785c',
    //         'productName': 'เดรสกระดุม-เขียวน้ำทะเล',
    //         'productCodename': 'V207-D',
    //         'productBarcode': 'V207-D',
    //         'categoryId': 5,
    //         'productComment': null,
    //         'productDetail': null,
    //         'productTag': null,
    //         'productCategory': 'สินค้าธรรมดา',
    //         'productCost': 0,
    //         'productPiece': 690,
    //         'productTotal': 0,
    //         'productMinimum': 0,
    //         'productWeight': 0,
    //         'productLastupdate': '2018-10-26T17:00:00.000Z',
    //         'productCreated': '2018-10-17T07:54:06.782Z',
    //         'productId': 5,
    //         '__v': 0,
    //         'productInventory': 320,
    //         'historys': []
    //     }, {
    //         'productImage': 'jncv02ve5hegk7c9jncv02vf.jpg',
    //         'productStatus': true,
    //         'warehouseId': 1,
    //         'productHold': 3,
    //         'productRemain': 0,
    //         '_id': '5bc6ea594175472529fb785b',
    //         'productName': 'เสื้อปักกวาง-แดง',
    //         'productCodename': 'V208-A',
    //         'productBarcode': 'V208-A',
    //         'categoryId': 5,
    //         'productComment': null,
    //         'productDetail': null,
    //         'productTag': null,
    //         'productCategory': 'สินค้าธรรมดา',
    //         'productCost': 0,
    //         'productPiece': 590,
    //         'productTotal': 3,
    //         'productMinimum': 0,
    //         'productWeight': 0,
    //         'productLastupdate': '2018-10-16T17:00:00.000Z',
    //         'productCreated': '2018-10-17T07:52:57.559Z',
    //         'productId': 4,
    //         '__v': 0,
    //         'productInventory': 82,
    //         'historys': []
    //     }, {
    //         'productImage': 'jncuuh925hegk7c9jncuuh93.jpg',
    //         'productStatus': true,
    //         'warehouseId': 1,
    //         'productHold': 23,
    //         'productRemain': 0,
    //         '_id': '5bc6e9544175472529fb7859',
    //         'productName': 'เสื้อปักกวาง-กรม',
    //         'productCodename': 'V208-B',
    //         'productBarcode': 'V208-B',
    //         'categoryId': 5,
    //         'productComment': null,
    //         'productDetail': null,
    //         'productTag': null,
    //         'productCategory': 'สินค้าธรรมดา',
    //         'productCost': 0,
    //         'productPiece': 590,
    //         'productTotal': 45,
    //         'productMinimum': 0,
    //         'productWeight': 0,
    //         'productLastupdate': '2019-01-03T07:56:49.466Z',
    //         'productCreated': '2018-10-17T07:48:36.257Z',
    //         'productId': 2,
    //         '__v': 0,
    //         'productInventory': 88,
    //         'historys': [{
    //             'lastUpdate': '2019-01-03T07:55:27.391Z',
    //             'hisName': 'addStockInputTotal',
    //             'hisRemark': 'เพิ่มจำนวนสต๊อกสินค้าเข้า 45 + 10 => 55',
    //             'sellerId': 2,
    //             'sellerName': 'somsak'
    //         }, {
    //             'lastUpdate': '2019-01-03T07:55:33.389Z',
    //             'hisName': 'deductStockInputTotal',
    //             'hisRemark': 'ลดจำนวนสต๊อกสินค้าเข้า 55 - 10 => 45',
    //             'sellerId': 2,
    //             'sellerName': 'somsak'
    //         }, {
    //             'lastUpdate': '2019-01-03T07:56:41.830Z',
    //             'hisName': 'addStockInputTotal',
    //             'hisRemark': 'เพิ่มจำนวนสต๊อกสินค้าเข้า 45 + 5 => 50',
    //             'sellerId': 1,
    //             'sellerName': 'risingadmin'
    //         }, {
    //             'lastUpdate': '2019-01-03T07:56:49.466Z',
    //             'hisName': 'deductStockInputTotal',
    //             'hisRemark': 'ลดจำนวนสต๊อกสินค้าเข้า 50 - 5 => 45',
    //             'sellerId': 1,
    //             'sellerName': 'risingadmin'
    //         }]
    //     }, {
    //         'productImage': 'jncur6ls5hegk7c9jncur6lt.jpg',
    //         'productStatus': true,
    //         'warehouseId': 1,
    //         'productHold': 18,
    //         'productRemain': 0,
    //         '_id': '5bc6e8ba4175472529fb7858',
    //         'productName': 'เสื้อปักกวาง-เขียว',
    //         'productCodename': 'V208-C',
    //         'productBarcode': 'V208-C',
    //         'categoryId': 5,
    //         'productComment': '',
    //         'productDetail': '',
    //         'productTag': '',
    //         'productCategory': 'สินค้าธรรมดา',
    //         'productCost': 0,
    //         'productPiece': 590,
    //         'productTotal': 55,
    //         'productMinimum': 0,
    //         'productWeight': 0,
    //         'productLastupdate': '2018-12-21T11:33:05.026Z',
    //         'productCreated': '2018-10-17T07:46:02.503Z',
    //         'productId': 1,
    //         '__v': 0,
    //         'productInventory': 99,
    //         'historys': [{
    //             'lastUpdate': '2018-12-21T11:32:21.069Z',
    //             'hisName': 'addStockInputTotal',
    //             'hisRemark': 'เพิ่มจำนวนสต๊อกสินค้าเข้า 55 + 10 => 65',
    //             'sellerId': 2,
    //             'sellerName': 'somsak'
    //         }, {
    //             'lastUpdate': '2018-12-21T11:33:05.026Z',
    //             'hisName': 'deductStockInputTotal',
    //             'hisRemark': 'ลดจำนวนสต๊อกสินค้าเข้า 65 - 10 => 55',
    //             'sellerId': 2,
    //             'sellerName': 'somsak'
    //         }]
    //     }];
    //     // ####################################### //
    //     const objects = [{'n': 4}, {'n': 2}, {'n': 8}, {'n': 6}];
    //     const a1 = _.sumBy(objects, 'n');
    //     this.SumCount = a1;
    //     const a2 = _.sumBy(orders, 'orderTotal');
    //     this.SumOrdersTotal = a2;
    //     const a3 = _.sumBy(products, 'orderTotal');
    //
    //     console.log('SumObject = ' + a1);
    //     console.log('SumOrders = ' + a2);
    //     console.log('SumProducts = ' + a3);
    //
    //     const merge = _.merge(orders, products);
    //     console.log(merge);
    //
    //     const split1 =_.split('a-b-c', '-', 2);
    //     console.log(split1);
    //
    //     // console.log('orders2 Length = ' + orders2.length);
    //     // console.log('diff = ' + JSON.stringify(aaaa));
    // }

    // test lodash functions data test //
}
