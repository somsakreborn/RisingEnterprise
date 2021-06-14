import {Component, OnDestroy, OnInit, Input, Output, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {Router, ActivatedRoute, NavigationStart, NavigationEnd} from '@angular/router';
import {Location} from '@angular/common';
import {environment as env} from '../../../../environments/environment';
import {Order, Historys, Products} from '../orders.interface';
import {OrdersService} from '../orders.service';
import {Subscription, Observable, AsyncSubject, forkJoin, of, range} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import * as _ from 'lodash';
import {debounceTime, distinctUntilChanged, map, tap, filter, takeLast} from 'rxjs/operators';

// import channel data API //
import {ChannelsService} from '../../channels/channels.service';
import {Channel} from '../../channels/channels.interface';
// import shipment data API //
import {ShipmentService} from '../../shipments/shipments.service';
import {Shipment} from '../../shipments/shipments.interface';
// import shipment data API //
import {BankService} from '../../banks/banks.service';
import {Bank} from '../../banks/banks.interface';
// import product data API //
import {ProductsService} from '../../products/products.service';
import {Product} from '../../products/products.interface';
import Swal from 'sweetalert2';
import * as jsPDF from 'jspdf';
import {FormBuilder, FormGroup, NgForm} from '@angular/forms';
import {NgbTabset, NgbTabChangeEvent, NgbTabsetConfig, NgbCalendar, NgbDate} from '@ng-bootstrap/ng-bootstrap';
// import {HttpClient, HttpHeaders} from '@angular/common/http';

// import pdfmake use generate data//
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
// import * as XLSX from 'xlsx';
import {XlsxService} from '../../../services/xlsx.service';
import {BsDatepickerConfig} from 'ngx-bootstrap/datepicker';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {listLocales} from 'ngx-bootstrap/chronos';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {thLocale, enGbLocale} from 'ngx-bootstrap/locale';
import {User} from '../../users/users.interface';
import {UsersService} from '../../users/users.service';
defineLocale('th', thLocale);

@Component({
    selector: 'app-orders-product',
    templateUrl: './orders-product.component.html',
    styleUrls: [
        './orders-product.component.scss',
        '../../../../assets/icon/icofont/css/icofont.scss'
    ],
    animations: [
        trigger('fadeInOutTranslate', [
            transition(':enter', [
                style({opacity: 0}),
                animate('400ms ease-in-out', style({opacity: 1}))
            ]),
            transition(':leave', [
                style({transform: 'translate(0)'}),
                animate('400ms ease-in-out', style({opacity: 0}))
            ])
        ])
    ]
})

export class OrdersProductComponent implements OnInit, OnDestroy, AfterViewInit {

    rows = [];
    rows2 = [];
    selected = [];
    selectedtest = [];
    processSelected = [];
    // ViewChild
    @ViewChild('modalDefault') modalDefaultView;
    @Input() searchOrderForm: NgForm;
    checkExportExcel: boolean;
    isReadOnly = false;
    // @Input('ngForm') ngForm: FormGroup;
    @ViewChild('table') table: ElementRef;
    @ViewChild('content') content: ElementRef;

// tabset data ngb-tabset //
// currentJustify = 'justified';
    prospectId: number;
    selectedTab: string;
    selectedTabActive: string;
    state: any;
    @ViewChild('tabs')
    private tabs: NgbTabset;
// currentJustify = 'justify';
// currentJustify = 'justified';
    currentJustify = 'center';
    currentOrientation = 'horizontal';
    rowsOnPage = 50;
// private tabs: NgbTabset;
// @ViewChild('tabs')  public set _tabs(tabs: NgbTabset) {
//     if (!tabs)
//         return;
//         // this.tabs = _tabs;
//         this.tabs.select('details');
// }
// tabset data ngb-tabset //

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
    endDate = new Date();
    rangeDate: any;
    // const stdDate = '15/02/2019';
    // const endDate = '26/03/2019';
    // rangDate = `15/02/2019 - 26/03/2019`;
// datepicker-range //

// @ViewChild(OrdersProductComponent) table: ElementRef;
// @ViewChild('printOrdersBox') table: ElementRef;
// @ViewChild(OrdersProductComponent) table: OrdersProductComponent;
    private sub: Subscription = null;
    private dataSub: Subscription = null;
    ENVserverAPI = env.serverAPI;
    user: User = {} as User;
    users: User[] = [] as User[];
    dataSearch: Order[] = [] as Order[];
    order: Order = {} as Order;
    orders: Order[] = [] as Order[];
    ordersStatus: Order[] = [] as Order[];
    ordersComplete: Order[] = [] as Order[];
    ordersProcess: Order[] = [] as Order[];
    ordersPack: Order[] = [] as Order[];
    ordersDelivery: Order[] = [] as Order[];
    ordersSuccess: Order[] = [] as Order[];
    ordersFail: Order[] = [] as Order[];
    ordersSelected: Order[] = [] as Order[];
    ordersSelectedOld: Order[] = [] as Order[];
    ordersHistorys: Historys[] = [] as Historys[];
    ordershistorysLimit: number;
    lastOrderId: any;

    tempOrder = [];
    tempProcess = [];  // [ 0,1,2 = {'process', 'waitpack', 'print'} ]
    tempPack = [];
    tempDelivery = [];
    tempSuccess = [];
    tempFail = [];
    ordersCalSumTotal: number;
    processCalSumTotal: number;
    packCalSumTotal: number;
    deliveryCalSumTotal: number;
    successCalSumTotal: number;
    failCalSumTotal: number;

    channel: Channel = {} as Channel;
    channels: Channel[] = [] as Channel[];
    shipment: Shipment = {} as Shipment;
    shipments: Shipment[] = [] as Shipment[];
    product: Product = {} as Product;
    products: Product[] = [] as Product[];
    bank: Bank = {} as Bank;
    banks: Bank[] = [] as Bank[];
    timeStart: number;
    timeLeft: number;
    interval;

// orders: any;
// printOrders: any = [];
    selectedOrder: any = [];
    ID: number;
    Name: string;
    checkRole: string;

// selectedOrder: any;
// export excel data //
    data: any;
    error: any;
    resp: any;
// export excel data //

    get selectedOrders() {
        return this.orders.filter(o => o.orderId);
    }

// private headers = new HttpHeaders({'Content-Type': 'application/json'});
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private orderService: OrdersService,
        private channelService: ChannelsService,
        private shipmentService: ShipmentService,
        private productService: ProductsService,
        private bankService: BankService,
        private userService: UsersService,
        private xlsxService: XlsxService,
        private formBuilder: FormBuilder,
        private localeService: BsLocaleService,
        private calendar: NgbCalendar,
        config: NgbTabsetConfig
    ) {
        // config.justify = 'center';
        config.justify = 'fill';
        config.type = 'tabs';

        this.localeService.use('th');
        this.bsConfig = Object.assign({},{
            containerClass: this.colorTheme,
            rangeInputFormat: 'YYYY-MM-DD', rangeSeparator: ' - '
        });
        // this.fromDate = this.calendar.getToday();
        // this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 2);
        // this.minDate = new Date();
        // this.maxDate = new Date();
        this.minDate.setDate(this.minDate.getDate() - 730);
        this.endDate.setDate(this.endDate.getDate());
        this.maxDate.setDate(this.maxDate.getDate() + 365);
        this.bsValue.setDate(this.endDate.getDate());
        this.bsRangeValue = [this.bsValue, this.endDate];
        this.bsRangeValueDayNow = [this.endDate, this.endDate];
        this.bsRangeValueMonthNow = [this.bsValue, this.endDate];
        this.bsRangeValueYearNow = [this.minDate, this.maxDate];
        // console.log('fromDate = ' + this.fromDate + this.fromDate.year + '/' + this.checkedMonths(this.fromDate.month) + '/' + this.checkedMonths(this.fromDate.day));
        // console.log('toDate = ' + this.toDate + this.toDate.year + '/' + this.checkedMonths(this.toDate.month) + '/' + this.checkedMonths(this.toDate.day));
        // this.rangDate = `${this.fromDate.year}'/'${this.checkedMonths(this.fromDate.month)}'/'${this.checkedMonths(this.fromDate.day)}
        //         ' - '${this.toDate.year}'/'${this.checkedMonths(this.toDate.month)}'/'${this.checkedMonths(this.toDate.day)}`;
        // this.selectedTabActive = 'details';
        // router.events.forEach((event) => {
        //     if (event instanceof NavigationStart) {
        //         console.log(NavigationStart);
        //     }
        //     // NavigationEnd
        //     // NavigationCancel
        //     // NavigationError
        //     // RoutesRecognized
        // });
        router.events
            .filter(event => event instanceof NavigationStart)
            .subscribe((event: NavigationStart) => {
                // console.log(event);  // skip to continute //
                // You only receive NavigationStart events
                //   console.log(event.navigationTrigger);
                //   console.log(event);
                //   console.log(NavigationStart.prototype);
                //   console.log('Start : ' + NavigationStart);
                //   console.log('End : ' + NavigationEnd);

                // if (event.navigationTrigger === void 0) {
                //     /** @docsNotRequired */
                //     event.navigationTrigger = 'imperative';
                //     console.log(event.navigationTrigger);
                // }
                // if (event.restoredState === void 0) {
                //     /** @docsNotRequired */
                //     event.restoredState = null;
                //     console.log(event.navigationTrigger);
                // }
                // const _this = _super.call(this, id, url) || this;
                // _this.navigationTrigger = event.navigationTrigger;
                // _this.restoredState = event.restoredState;
                // console.log(event.navigationTrigger);
            });

        // test settime Interval //
        // this.battleInit();
        // this.state = setInterval(() => {
        setInterval(() => {
            // this.maxDate.setDate(this.maxDate.getDate());
            // this.bsValue.setDate(this.maxDate.getDate() - 14);
            this.bsRangeValue = [this.bsValue, this.endDate];
            this.fetchOrder();
            this.selected = [];
            // console.log(this.state);
        }, 90000);
        // console.log(this.state);
        // this.state = {
        //     interval: Math.floor(Math.random() * 500),
        //     progress: 0,
        // };
        // console.log(this.state);
        // test settime Interval //

        // this.fetch((data) => {
        //     this.rows2 = data;
        // });

        // this.orderService.fetchOrder()
        //     .subscribe((r) => {
        //         this.temp = [...r];
        //     });

        this.route.data.subscribe(d => {
            this.selectedTab = d.name;
            this.selectedTabActive = d.name;
        });

        this.bankService.fetchBank()
            .subscribe((r) => {
                this.banks = r;
            });

        this.shipmentService.fetchShipment()
            .subscribe((r) => {
                this.shipments = r;
            });

        // this.sub = this.orderService.fetchOrder().subscribe((r: Order[]) => {
        //     this.orders = r;
        //     this.ordersSelected = this.orders.filter(p => (p.orderCheckedPrint === true) && (p.orderSelectedPrint === true));
        //     // console.log(this.ordersSelected.length);
        //     if (this.ordersSelected.length > 0) {
        //         console.log(this.ordersSelected);
        //         this.clearSelectedPrint(this.ordersSelected);
        //     }
        // });


    }

    ngOnInit() {
        // this.onSelectesRangDate();
        this.fetchChannel();
        this.fetchOrder();
        this.fetchLastOrderId();
        this.fetchUser();
        this.ID = JSON.parse(localStorage.getItem('ID'));
        this.Name = JSON.parse(localStorage.getItem('Name'));
        this.checkRole = JSON.parse(localStorage.getItem('Role'));
        // (<HTMLInputElement>document.getElementById('wp')).disabled = false;

        this.checkExportExcel = true;
    }

    checkedMonths(value) {
        if (value < 10) {
            value = '0' + value;
        }
        return value;
    }
    testObservable(selected) {
        // const subject = new AsyncSubject();
        //
        // subject.subscribe({
        //     next: (v) => console.log(`observerA: ${v}`)
        // });
        //
        // subject.next(1);
        // subject.next(2);
        // // subject.next(3);
        // // subject.next(4);
        //
        // subject.subscribe({
        //     next: (v) => console.log(`observerB: ${v}`)
        // });
        //
        // subject.next(5);
        // subject.complete();


        // forkjoin() //
        // const observable = forkJoin(
        //     of(1, 2, 3, 4),
        //     of(5, 6, 7, 8, 9),
        //     of(0, 33),
        //     of(123456, 7890),
        // );
        // observable.subscribe(
        //     value => console.log(value),
        //     err => {
        //     },
        //     () => console.log('This is how it ends!'),
        // );

    }

    onSelectedRangDate(searchOrderForm, rangeDate) {
        // console.log('rangDate = ' + rangDate);
        // const stdDate = '2018-11-01';
        // const endDate = '2019-01-31';
        if ( (searchOrderForm === '' ) || (searchOrderForm === undefined)) {
            // alert('Else : Null');
        } else {
            // alert(JSON.stringify(searchOrderForm));
            const rangeDateSearch = searchOrderForm.rangeDateSearch;
            const orderCustomerChannelId = searchOrderForm.orderCustomerChannelId;
            const channelId = searchOrderForm.channelId;
            // console.log('rangeDateSearch = ' + rangeDateSearch);
            // console.log('orderCustomerChannelId = ' + orderCustomerChannelId);
            // console.log('channelId = ' + channelId);
        }


        if (!rangeDate) {

            return this.alertWarningPosition(' กรุณาเลือกช่วงเวลาที่ต้องการค้นหา', 'top');
        }
        // this.sub = this.orderService.fetchOrderByRangDate(stdDate, endDate).subscribe((r: Order[]) => {
        this.sub = this.orderService.fetchOrderRangDate(rangeDate)
            .subscribe((r: Order[]) => {

                //// add order ngb-tabset ////
                this.ordersCalSumTotal = 0;
                this.processCalSumTotal = 0;
                this.packCalSumTotal = 0;
                this.deliveryCalSumTotal = 0;
                this.successCalSumTotal = 0;
                this.failCalSumTotal = 0;
                if (searchOrderForm) {
                    // console.log('orderCustomerChannelId (R) = ' + searchOrderForm.orderCustomerChannelId);
                    // this.orders = r.filter(re => (re.orderStatus === false) &&
                    //     (re.orderSellerId === searchOrderForm.searchUserId) &&
                    //     (re.customer.orderCustomerChannelId === searchOrderForm.orderCustomerChannelId) &&
                    //     (re.payment.method === searchOrderForm.searchPaymentName)
                    this.dataSearch = r.filter(re => (re.orderStatus === false));

                    if (searchOrderForm.orderCustomerChannelId) {
                        this.dataSearch = this.dataSearch.filter(rec =>
                            (rec.customer.orderCustomerChannelId === searchOrderForm.orderCustomerChannelId));
                    }
                    if (searchOrderForm.searchPaymentName) {
                        this.dataSearch = this.dataSearch.filter(rep =>
                            (rep.payment.method === searchOrderForm.searchPaymentName));
                    }
                    if (searchOrderForm.searchUserId) {
                        this.dataSearch = this.dataSearch.filter(reu =>
                            (reu.orderSellerId === searchOrderForm.searchUserId));
                    }
                    this.orders = this.dataSearch;
                    // console.log('re.orders-all = ' + JSON.stringify(this.orders));
                    this.tempOrder = [...r];
                    this.orders.forEach(p => {
                        this.ordersCalSumTotal = this.ordersCalSumTotal + p.orderTotal;
                    });
                } else {
                    this.orders = r.filter(re => re.orderStatus === false);
                    this.tempOrder = [...r];
                    this.orders.forEach(p => {
                        this.ordersCalSumTotal = this.ordersCalSumTotal + p.orderTotal;
                    });
                }
                // checked for export data to Excel //
                if (searchOrderForm.checkExportExcel) {
                    if (this.orders.length > 0) {
                        this.exportOrdersAllToExcel(this.orders);
                    } else {
                        this.alertWarningPosition(' ไม่พบข้อมูลที่ค้นหา', 'top');
                    }
                }
                // checked for export data to Excel //

                // this.orders = r.filter(re => re.orderStatus === false);
                // this.tempOrder = [...r];
                // this.orders.forEach(p => {
                //     this.ordersCalSumTotal = this.ordersCalSumTotal + p.orderTotal;
                // });

                this.ordersStatus = r.filter(re => re.orderStatus !== false);
                this.ordersComplete = r.filter(re => re.orderStatus === true);
                this.ordersProcess = r.filter(re => (re.orderStatusCode === 0) && (re.orderStatusName === 'process')
                    || (re.orderStatusCode === 1) && (re.orderStatusName === 'waitpack')
                    || (re.orderStatusCode === 2) && (re.orderStatusName === 'print'));
                this.tempProcess = this.ordersProcess;
                this.ordersProcess.forEach(p => {
                    this.processCalSumTotal = this.processCalSumTotal + p.orderTotal;
                });
                this.ordersPack = r.filter(re => (re.orderStatusCode === 3) && (re.orderStatusName === 'pack'));
                this.tempPack = this.ordersPack;
                this.ordersPack.forEach(p => {
                    this.packCalSumTotal = this.packCalSumTotal + p.orderTotal;
                });
                this.ordersDelivery = r.filter(re => (re.orderStatusCode === 4) && (re.orderStatusName === 'delivery'));
                this.tempDelivery = this.ordersDelivery;
                this.ordersDelivery.forEach(p => {
                    this.deliveryCalSumTotal = this.deliveryCalSumTotal + p.orderTotal;
                });
                this.ordersSuccess = r.filter(re => (re.orderStatusCode === 5) && (re.orderStatusName === 'success'));
                this.tempSuccess = this.ordersSuccess;
                this.ordersSuccess.forEach(p => {
                    this.successCalSumTotal = this.successCalSumTotal + p.orderTotal;
                });
                this.ordersFail = r.filter(re => (re.orderStatusCode === 6) && (re.orderStatusName === 'fail'));
                this.tempFail = this.ordersFail;
                this.ordersFail.forEach(p => {
                    this.failCalSumTotal = this.failCalSumTotal + p.orderTotal;
                });
                //// add order ngb-tabset ////

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
    setRangeDateSearch(rangeDate) {
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

        if (rangeDate === 'Day') {
            this.bsRangeValueDayNow = [new Date(ddToday), new Date(ddToday)];
        }
        if (rangeDate === 'Month') {
            this.bsRangeValueDayNow = [new Date(ddMonthStart), new Date(ddMonthEnd)];
        }
        if (rangeDate === 'Year') {
            this.bsRangeValueDayNow = [new Date(ddYearStart), new Date(ddYearEnd)];
        }
    }

    fetchUser() {
        this.sub = this.userService.fetchUser()
            .map((m: User[]) => {
                let x = 0;
                m.map(r => {
                    r.index = ++x;
                    if (r.userImage) {
                        r.userImage = `${env.serverAPI}/images/user/` + r.userImage;
                    } else {
                        r.userImage = `${env.serverAPI}/images/image-blank.jpg`;
                    }

                    if (r.userLastlogin) {
                        const dd = r.userLastlogin.toString().split('T');
                        const ddConv = dd[0].split('-');
                        r.userLastlogin = ddConv[2]  + '-' + ddConv[1] + '-' + ddConv[0];
                    }
                    return r;
                });
                return m;
            })
            // .subscribe((r: User[]) => this.users = r);
            .subscribe((r: User[]) => {
                // console.log(r);
                this.users = r;
                // this.users = r.filter(mm => mm.userLevel === 'sale');
                // console.log('this.users = ' + JSON.stringify(this.users));
            });
    }

    public onTabChange($event: NgbTabChangeEvent) {
        const routess = {
            details: `/orders/${this.prospectId}/details`,
            waitpacks: `/orders/${this.prospectId}/waitpacks`,
            packs: `/orders/${this.prospectId}/packs`,
            deliverys: `/orders/${this.prospectId}/deliverys`,
            success: `/orders/${this.prospectId}/success`,
            fails: `/orders/${this.prospectId}/fails`,
        };

        this.router.navigateByUrl(routess[$event.nextId]);
    }

    public beforeChange($event: NgbTabChangeEvent) {
        if ($event.nextId === 'details') {
            $event.preventDefault();
            // this.router.navigate(['/management/orders', 'details']);
            this.selectedTabActive = 'details';
            this.router.navigate(['/management/orders/details']);
        } else if ($event.nextId === 'waitpacks') {
            // $event.preventDefault();
            // this.router.navigate([`/management/orders/waitpacks`]);
            this.selectedTabActive = 'waitpacks';
            this.router.navigate([`/management/orders/waitpacks`]);
        } else if ($event.nextId === 'packs') {
            // $event.preventDefault();
            this.selectedTabActive = 'packs';
            this.router.navigate([`/management/orders/packs`]);
        } else if ($event.nextId === 'deliverys') {
            // $event.preventDefault();
            this.selectedTabActive = 'deliverys';
            this.router.navigate([`/management/orders/deliverys`]);
        } else if ($event.nextId === 'success') {
            // $event.preventDefault();
            this.selectedTabActive = 'success';
            this.router.navigate([`/management/orders/success`]);
        } else if ($event.nextId === 'fails') {
            // $event.preventDefault();
            this.selectedTabActive = 'fails';
            this.router.navigate([`/management/orders/fails`]);
        }
    }

    // checkedAll checkbox  //
    // toggleSelectOrders(checked) {
    //     this.orders.forEach(o => {
    //         o.orderId = checked;
    //         // console.log(JSON.stringify(o.orderId));
    //         // alert(JSON.stringify(o.orderId));
    //     });
    // }

    // selectOrders({ selected }) {
    //     if (this.selected.length > 0) { alert(this.selected.length); }
    //     this.selected.splice(0, this.selected.length);
    //     this.selected.push(...selected);
    // }

    routhOrdets(orderTab: string) {
        // alert(odid);
        // alert(checkEditStatus);
        // this.sub = this.orderService.fetchViewOrderODId(order)
        //     .subscribe((r) => {
        //         this.order = r;
        //         console.log(r);
        //         // console.log(this.order.orderODId);
        //     });
        // return;
        // this.router.navigate(['/management/orders/orders-edit/' + this.order.orderId ]);
        // this.router.navigate([`/management/orders/orders-edit/name/` + order + `?checkEditStatus=` + checkEditStatus]);
        // ['/management/orders', 'details']
        this.router.navigate([`/management/orders/${orderTab}`]);
        // return;
    }

    editOderODId(order: Order, checkEditStatus) {
        // alert(odid);
        // alert(checkEditStatus);
        // this.sub = this.orderService.fetchViewOrderODId(order)
        //     .subscribe((r) => {
        //         this.order = r;
        //         console.log(r);
        //         // console.log(this.order.orderODId);
        //     });
        // return;
        // this.router.navigate(['/management/orders/orders-edit/' + this.order.orderId ]);
        // this.router.navigate([`/management/orders/orders-edit/name/` + order + `?checkEditStatus=` + checkEditStatus]);
        this.router.navigate([`/management/orders/orders-edit/name/` + order], checkEditStatus);
        // return;
    }

    editOderODId_Process(order: Order) {
        // alert(odid);
        // this.sub = this.orderService.fetchViewOrderODId(order)
        //     .subscribe((r) => {
        //         this.order = r;
        //         console.log(r);
        //         // console.log(this.order.orderODId);
        //     });
        // return;
        // this.router.navigate(['/management/orders/orders-edit/' + this.order.orderId ]);
        this.router.navigate(['/management/orders/orders-edit/name/' + order]);
        // return;
    }

    fetchOrder() {
        //   const startDate = new Date(2018, 10, 1);
        //   const endDate = new Date(2018, 10, 30);
        //   console.log('startDate : ' + startDate + ' -- ' + 'EndDate : ' + endDate);

        // this.sub = await this.orderService.fetchOrder()
        this.sub = this.orderService.fetchOrder()
            .map((m: Order[]) => {
                let x = 0;
                m.map(rr => {
                    rr.index = ++x;
                    // if (r.orderImage) {
                    //     r.orderImage = `${env.serverAPI}/images/order/` + r.orderImage;
                    // } else {
                    //     r.orderImage = `${env.serverAPI}/images/image-blank.jpg`;
                    // }

                    if (rr.customer.orderCustomerChannelId) {
                        // const dd = r.orderCreated.toString().split('T');
                        // const ddConv = dd[0].split('-');
                        // r.orderCreated = ddConv[2] + '-' + ddConv[1] + '-' + ddConv[0];
                        // let idChannel = r.customer.orderCustomerChannelId;
                        this.channels.forEach(n => {
                            if (n.channelId === rr.customer.orderCustomerChannelId) {
                                rr.customer.orderCustomerChannelName = n.channelName;
                            }
                        });
                        // r.customer.orderCustomerChannelName = '';
                    }
                    return rr;
                })
                return m;
            })
            // .subscribe((r: Order[]) => this.orders = r);
            .subscribe((r: Order[]) => {
                // console.log(r);
                this.ordersCalSumTotal = 0;
                this.processCalSumTotal = 0;
                this.packCalSumTotal = 0;
                this.deliveryCalSumTotal = 0;
                this.successCalSumTotal = 0;
                this.failCalSumTotal = 0;
                // this.rows = r;
                // this.orders = r;
                this.orders = r.filter(re => re.orderStatus === false);
                this.tempOrder = [...r];
                this.orders.forEach(p => {
                    this.ordersCalSumTotal = this.ordersCalSumTotal + p.orderTotal;
                });
                this.ordersStatus = r.filter(re => re.orderStatus !== false);
                this.ordersComplete = r.filter(re => re.orderStatus === true);
                this.ordersProcess = r.filter(re => (re.orderStatusCode === 0) && (re.orderStatusName === 'process')
                    || (re.orderStatusCode === 1) && (re.orderStatusName === 'waitpack')
                    || (re.orderStatusCode === 2) && (re.orderStatusName === 'print'));
                this.tempProcess = this.ordersProcess;
                this.ordersProcess.forEach(p => {
                    this.processCalSumTotal = this.processCalSumTotal + p.orderTotal;
                });
                this.ordersPack = r.filter(re => (re.orderStatusCode === 3) && (re.orderStatusName === 'pack'));
                this.tempPack = this.ordersPack;
                this.ordersPack.forEach(p => {
                    this.packCalSumTotal = this.packCalSumTotal + p.orderTotal;
                });
                this.ordersDelivery = r.filter(re => (re.orderStatusCode === 4) && (re.orderStatusName === 'delivery'));
                this.tempDelivery = this.ordersDelivery;
                this.ordersDelivery.forEach(p => {
                    this.deliveryCalSumTotal = this.deliveryCalSumTotal + p.orderTotal;
                });
                this.ordersSuccess = r.filter(re => (re.orderStatusCode === 5) && (re.orderStatusName === 'success'));
                this.tempSuccess = this.ordersSuccess;
                this.ordersSuccess.forEach(p => {
                    this.successCalSumTotal = this.successCalSumTotal + p.orderTotal;
                });
                this.ordersFail = r.filter(re => (re.orderStatusCode === 6) && (re.orderStatusName === 'fail'));
                this.tempFail = this.ordersFail;
                this.ordersFail.forEach(p => {
                    this.failCalSumTotal = this.failCalSumTotal + p.orderTotal;
                });

            });
    }

    // START -- filterSearch data all //
    ordersFilter(event) {
        const val = event.target.value.toLowerCase();

        // filter our data
        const tempOrder = this.tempOrder.filter(function (d) {
            return (d.orderODId.toLowerCase().indexOf(val) !== -1 || !val
                || d.orderSellerName.toLowerCase().indexOf(val) !== -1 || !val
                || d.customer.orderCustomerNameSurname.toLowerCase().indexOf(val) !== -1 || !val
                || d.customer.orderCustomerTel.toString().indexOf(val) !== -1 || !val
                // || d.customer.orderCustomerChannelName.toLocaleLowerCase().indexOf(val) !== -1 || !val
                || d.orderStatusName.toString().indexOf(val) !== -1 || !val
                || d.orderTotal.toString().indexOf(val) !== -1 || !val);
        });

        // update the rows
        this.orders = tempOrder;
        this.ordersCalSumTotal = 0;
        this.orders.forEach(p => {
            this.ordersCalSumTotal = this.ordersCalSumTotal + p.orderTotal;
            // console.log(this.processCalSumTotal + 'this + '  + p.orderTotal);
        });
        // Whenever the filter changes, always go back to the first page
        // this.table.offset = 0;
    }

    processFilter(event) {
        const val = event.target.value.toLowerCase();

        // filter our data
        const tempProcess = this.tempProcess.filter(function (d) {
            return (d.orderODId.toLowerCase().indexOf(val) !== -1 || !val
                || d.orderSellerName.toLowerCase().indexOf(val) !== -1 || !val
                || d.customer.orderCustomerNameSurname.toLowerCase().indexOf(val) !== -1 || !val
                || d.customer.orderCustomerTel.toString().indexOf(val) !== -1 || !val
                || d.orderStatusName.toString().indexOf(val) !== -1 || !val
                || d.orderTotal.toString().indexOf(val) !== -1 || !val);
        });

        // update the rows
        this.ordersProcess = tempProcess;
        this.processCalSumTotal = 0;
        this.ordersProcess.forEach(p => {
            this.processCalSumTotal = this.processCalSumTotal + p.orderTotal;
            // console.log(this.processCalSumTotal + 'this + '  + p.orderTotal);
        });
        // Whenever the filter changes, always go back to the first page
        // this.table.offset = 0;
    }

    packFilter(event) {
        const val = event.target.value.toLowerCase();

        // filter our data
        const tempPack = this.tempPack.filter(function (d) {
            return (d.orderODId.toLowerCase().indexOf(val) !== -1 || !val
                || d.orderSellerName.toLowerCase().indexOf(val) !== -1 || !val
                || d.customer.orderCustomerNameSurname.toLowerCase().indexOf(val) !== -1 || !val
                || d.customer.orderCustomerTel.toString().indexOf(val) !== -1 || !val
                || d.orderStatusName.toString().indexOf(val) !== -1 || !val
                || d.orderTotal.toString().indexOf(val) !== -1 || !val);
        });

        // update the rows
        this.ordersPack = tempPack;
        this.packCalSumTotal = 0;
        this.ordersPack.forEach(p => {
            this.packCalSumTotal = this.packCalSumTotal + p.orderTotal;
            // console.log(this.processCalSumTotal + 'this + '  + p.orderTotal);
        });
        // Whenever the filter changes, always go back to the first page
        // this.table.offset = 0;
    }

    deliveryFilter(event) {
        const val = event.target.value.toLowerCase();

        // filter our data
        const tempDelivery = this.tempDelivery.filter(function (d) {
            return (d.orderODId.toLowerCase().indexOf(val) !== -1 || !val
                || d.orderSellerName.toLowerCase().indexOf(val) !== -1 || !val
                || d.customer.orderCustomerNameSurname.toLowerCase().indexOf(val) !== -1 || !val
                || d.customer.orderCustomerTel.toString().indexOf(val) !== -1 || !val
                || d.orderStatusName.toString().indexOf(val) !== -1 || !val
                || d.orderTotal.toString().indexOf(val) !== -1 || !val);
        });

        // update the rows
        this.ordersDelivery = tempDelivery;
        this.deliveryCalSumTotal = 0;
        this.ordersDelivery.forEach(p => {
            this.deliveryCalSumTotal = this.deliveryCalSumTotal + p.orderTotal;
            // console.log(this.processCalSumTotal + 'this + '  + p.orderTotal);
        });
        // Whenever the filter changes, always go back to the first page
        // this.table.offset = 0;
    }

    successFilter(event) {
        const val = event.target.value.toLowerCase();

        // filter our data
        const tempSuccess = this.tempSuccess.filter(function (d) {
            return (d.orderODId.toLowerCase().indexOf(val) !== -1 || !val
                || d.orderSellerName.toLowerCase().indexOf(val) !== -1 || !val
                || d.customer.orderCustomerNameSurname.toLowerCase().indexOf(val) !== -1 || !val
                || d.customer.orderCustomerTel.toString().indexOf(val) !== -1 || !val
                || d.orderStatusName.toString().indexOf(val) !== -1 || !val
                || d.orderTotal.toString().indexOf(val) !== -1 || !val);
        });

        // update the rows
        this.ordersSuccess = tempSuccess;
        this.successCalSumTotal = 0;
        this.ordersSuccess.forEach(p => {
            this.successCalSumTotal = this.successCalSumTotal + p.orderTotal;
            // console.log(this.processCalSumTotal + 'this + '  + p.orderTotal);
        });
        // Whenever the filter changes, always go back to the first page
        // this.table.offset = 0;
    }

    failFilter(event) {
        const val = event.target.value.toLowerCase();
        // filter our data
        const tempFail = this.tempFail.filter(function (d) {
            return (d.orderODId.toLowerCase().indexOf(val) !== -1 || !val
                || d.orderSellerName.toLowerCase().indexOf(val) !== -1 || !val
                || d.customer.orderCustomerNameSurname.toLowerCase().indexOf(val) !== -1 || !val
                || d.customer.orderCustomerTel.toString().indexOf(val) !== -1 || !val
                || d.orderStatusName.toString().indexOf(val) !== -1 || !val
                || d.orderTotal.toString().indexOf(val) !== -1 || !val);
        });

        // update the rows
        this.ordersFail = tempFail;
        this.failCalSumTotal = 0;
        this.ordersFail.forEach(p => {
            this.failCalSumTotal = this.failCalSumTotal + p.orderTotal;
            // console.log(this.processCalSumTotal + 'this + '  + p.orderTotal);
        });
        // Whenever the filter changes, always go back to the first page
        // this.table.offset = 0;
    }

    // END -- filterSearch data all //
    async fetchChannel() {
        this.sub = await this.channelService.fetchChannel()
            .map((m: Channel[]) => {
                let x = 0;
                m.map(r => {
                    r.index = ++x;
                    if (r.channelImage) {
                        r.channelImage = `${env.serverAPI}/images/channel/` + r.channelImage;
                    } else {
                        r.channelImage = `${env.serverAPI}/images/image-blank.jpg`;
                    }

                    if (r.channelLastupdate) {
                        const dd = r.channelLastupdate.toString().split('T');
                        const ddConv = dd[0].split('-');
                        r.channelLastupdate = ddConv[2] + '-' + ddConv[1] + '-' + ddConv[0];
                    }
                    return r;
                });
                return m;
            })
            // .subscribe((r: Channel[]) => this.channels = r);
            .subscribe((r: Channel[]) => {
                // console.log(r);
                this.channels = r;
            });
    }

    public checkStatusProcess(selected, code, name) {
        if (selected.length > 0) {
            // alert(selected.length + 'code =' + code + 'name =' + name);
            let countTrue = 0;
            let countError = 0;
            selected.forEach(sel => {
                if (selected) {
                    this.order = sel;
                    if ((sel.orderStatusCode === code) && (sel.orderStatusName === name)) {
                        countTrue++;
                    } else {
                        countError++;
                    }
                }
            });

            if (countError > 0) {
                // return alert('error =' + countError + data);
                return false;
            } else {
                // return alert('true =' + countTrue);
                return true;
            }
        }
    }

    checkedSelectedProcessUp(selected) {
        if (this.checkStatusProcess(selected, 0, 'process')) {
            // alert('true =');
            // let data = '';
            let dataTrue = 0;
            if (this.selected.length > 0) {
                selected.forEach(sel => {
                    if (selected) {
                        this.order = sel;
                        if ((sel.orderStatusCode === 0) && (sel.orderStatusName === 'process')) {
                            dataTrue++;
                            this.order.orderId = sel.orderId;
                            this.order.orderStatusCode = 1;
                            this.order.orderStatusName = 'waitpack';
                            this.order.orderLastupdate = new Date();
                            const hisName = 'Waitpack';
                            const hisRemark = 'อัพเดทสถานะรอดำเนินการ (Process => Waitpack)';
                            this.pushHistorysOrder(hisName, hisRemark);

                            this.orderService.updateOrder(this.order).subscribe((update) => {
                            });
                        } else {
                            // data += 'กรุณาคอนเฟิร์ม order : ' + sel.orderODId + ' ก่อนหน้านี้ก่อนนะครับ คุณข้ามขั้นตอนการทำงาน\n';
                        }
                    }
                });
                this.alertSuccess(`Complete Update : \nข้อมูลอัพเดท จำนวน ${dataTrue} ออร์เดอร์`);
                this.selected = [];
                this.fetchOrder();
                this.router.navigate(['management/orders/waitpacks']);
            }
        } else {
            // alert('error =');
            let data = '';
            let dataError = 0;
            selected.forEach(sel => {
                if (selected) {
                    this.order = sel;
                    if ((sel.orderStatusCode !== 0) && (sel.orderStatusName !== 'process')) {
                        dataError++;
                        data += 'กรุณาคอนเฟิร์ม order : ' + sel.orderODId + ' ก่อนหน้านี้ก่อนนะครับ คุณข้ามขั้นตอนการทำงาน\n';
                    }
                }
            });
            this.alertWarning(`Warning Error : \nข้อมูลผิดพลาด จำนวน ${dataError} ออร์เดอร์\n ${data}`);
            this.selected = [];
            this.router.navigate(['management/orders/waitpacks']);
        }
    }

    checkedSelectedProcessToPrint(selected) {
        // if (this.checkStatusProcess(selected, 0, 'process')) {
        // alert('true =');
        // let data = '';
        let dataTrue = 0;
        if (this.selected.length > 0) {
            selected.forEach(sel => {
                if (selected) {
                    this.order = sel;
                    if ((sel.orderStatusCode === 0) && (sel.orderStatusName === 'process')) {
                        dataTrue++;
                        this.order.orderId = sel.orderId;
                        this.order.orderStatusCode = 2;
                        this.order.orderStatusName = 'print';
                        this.order.orderLastupdate = new Date();
                        const hisName = 'Print';
                        const hisRemark = 'อัพเดทสถานะพิมพ์แล้ว (Process => Print)';
                        this.pushHistorysOrder(hisName, hisRemark);

                        this.orderService.updateOrder(this.order).subscribe((update) => {

                        });
                    } else {
                        // data += 'กรุณาคอนเฟิร์ม order : ' + sel.orderODId + ' ก่อนหน้านี้ก่อนนะครับ คุณข้ามขั้นตอนการทำงาน\n';
                    }
                }
            });
            this.alertSuccess(`Complete Update : \nข้อมูลอัพเดท จำนวน ${dataTrue} ออร์เดอร์`);
            this.genPrintPDFmake(selected);
            this.selected = [];
            this.fetchOrder();
            this.router.navigate(['management/orders/waitpacks']);
        }
    }

    checkedSelectedWaitpackUp(selected) {
        if (this.checkStatusProcess(selected, 1, 'waitpack')) {
            // alert('true =');
            // let data = '';
            let dataTrue = 0;
            if (this.selected.length > 0) {
                selected.forEach(sel => {
                    if (selected) {
                        this.order = sel;
                        if ((sel.orderStatusCode === 1) && (sel.orderStatusName === 'waitpack')) {
                            dataTrue++;
                            this.order.orderId = sel.orderId;
                            this.order.orderStatusCode = 2;
                            this.order.orderStatusName = 'print';
                            this.order.orderLastupdate = new Date();
                            const hisName = 'Print';
                            const hisRemark = 'อัพเดทสถานะพิมพ์แล้ว (Waitpack => Print)';
                            this.pushHistorysOrder(hisName, hisRemark);

                            this.orderService.updateOrder(this.order).subscribe((update) => {

                            });
                        } else {
                            // data += 'กรุณาคอนเฟิร์ม order : ' + sel.orderODId + ' ก่อนหน้านี้ก่อนนะครับ คุณข้ามขั้นตอนการทำงาน\n';
                        }
                    }
                });
                this.alertSuccess(`Complete Update : \nข้อมูลอัพเดท จำนวน ${dataTrue} ออร์เดอร์`);
                this.genPrintPDFmake(selected);
                this.selected = [];
                this.fetchOrder();
                this.router.navigate(['management/orders/waitpacks']);
            }
        } else {
            // alert('error =');
            let data = '';
            let dataError = 0;
            selected.forEach(sel => {
                if (selected) {
                    this.order = sel;
                    if ((sel.orderStatusCode !== 1) && (sel.orderStatusName !== 'waitpack')) {
                        dataError++;
                        data += 'กรุณาคอนเฟิร์ม order : ' + sel.orderODId + ' ก่อนหน้านี้ก่อนนะครับ คุณข้ามขั้นตอนการทำงาน\n';
                    }
                }
            });
            this.alertWarning(`Warning Error : \nข้อมูลผิดพลาด จำนวน ${dataError} ออร์เดอร์\n ${data}`);
            this.selected = [];
            this.router.navigate(['management/orders/waitpacks']);
        }
    }

    checkedSelectedWaitpackDown(selected) {
        if (this.checkStatusProcess(selected, 1, 'waitpack')) {
            // alert('true =');
            // let data = '';
            let dataTrue = 0;
            if (this.selected.length > 0) {
                selected.forEach(sel => {
                    if (selected) {
                        this.order = sel;
                        if ((sel.orderStatusCode === 1) && (sel.orderStatusName === 'waitpack')) {
                            dataTrue++;
                            this.order.orderId = sel.orderId;
                            this.order.orderStatusCode = 0;
                            this.order.orderStatusName = 'process';
                            this.order.orderLastupdate = new Date();
                            const hisName = 'Waitpack';
                            const hisRemark = 'ลดสถานะรอดำเนินการ (Waitpack => Process)';
                            this.pushHistorysOrder(hisName, hisRemark);

                            this.orderService.updateOrder(this.order).subscribe((update) => {
                            });
                        } else {
                            // data += 'กรุณาคอนเฟิร์ม order : ' + sel.orderODId + ' ก่อนหน้านี้ก่อนนะครับ คุณข้ามขั้นตอนการทำงาน\n';
                        }
                    }
                });
                this.alertSuccess(`Complete Update : \nข้อมูลอัพเดท จำนวน ${dataTrue} ออร์เดอร์`);
                this.selected = [];
                this.fetchOrder();
                this.router.navigate(['management/orders/waitpacks']);
            }
        } else {
            // alert('error =');
            let data = '';
            let dataError = 0;
            selected.forEach(sel => {
                if (selected) {
                    this.order = sel;
                    if ((sel.orderStatusCode !== 1) && (sel.orderStatusName !== 'waitpack')) {
                        dataError++;
                        data += 'กรุณาคอนเฟิร์ม order : ' + sel.orderODId + ' ก่อนหน้านี้ก่อนนะครับ คุณข้ามขั้นตอนการทำงาน\n';
                    }
                }
            });
            this.alertWarning(`Warning Error : \nข้อมูลผิดพลาด จำนวน ${dataError} ออร์เดอร์\n ${data}`);
            this.selected = [];
            this.router.navigate(['management/orders/waitpacks']);
        }
    }

    checkedSelectedPrintUp(selected) {
        if (this.checkStatusProcess(selected, 2, 'print')) {
            // alert('true =');
            // let data = '';
            let dataTrue = 0;
            if (this.selected.length > 0) {
                selected.forEach(sel => {
                    if (selected) {
                        this.order = sel;
                        if ((sel.orderStatusCode === 2) && (sel.orderStatusName === 'print')) {
                            dataTrue++;
                            this.order.orderId = sel.orderId;
                            this.order.orderStatusCode = 3;
                            this.order.orderStatusName = 'pack';
                            this.order.orderLastupdate = new Date();
                            const hisName = 'Pack';
                            const hisRemark = 'อัพเดทสถานะแพ็คแล้ว (Print => Pack)';
                            this.pushHistorysOrder(hisName, hisRemark);

                            this.orderService.updateOrder(this.order).subscribe((update) => {
                            });
                        } else {
                            // data += 'กรุณาคอนเฟิร์ม order : ' + sel.orderODId + ' ก่อนหน้านี้ก่อนนะครับ คุณข้ามขั้นตอนการทำงาน\n';
                        }
                    }
                });
                this.alertSuccess(`Complete Update : \nข้อมูลอัพเดท จำนวน ${dataTrue} ออร์เดอร์`);
                this.selected = [];
                this.fetchOrder();
                this.router.navigate(['management/orders/packs']);
            }
        } else {
            // alert('error =');
            let data = '';
            let dataError = 0;
            selected.forEach(sel => {
                if (selected) {
                    this.order = sel;
                    if ((sel.orderStatusCode !== 2) && (sel.orderStatusName !== 'print')) {
                        dataError++;
                        data += 'กรุณาคอนเฟิร์ม order : ' + sel.orderODId + ' ก่อนหน้านี้ก่อนนะครับ คุณข้ามขั้นตอนการทำงาน\n';
                    }
                }
            });
            this.alertWarning(`Warning Error : \nข้อมูลผิดพลาด จำนวน ${dataError} ออร์เดอร์\n ${data}`);
            this.selected = [];
            this.router.navigate(['management/orders/waitpacks']);
        }
    }

    checkedSelectedPrintDown(selected) {
        if (this.checkStatusProcess(selected, 2, 'print')) {
            // alert('true =');
            // let data = '';
            let dataTrue = 0;
            if (this.selected.length > 0) {
                selected.forEach(sel => {
                    if (selected) {
                        this.order = sel;
                        if ((sel.orderStatusCode === 2) && (sel.orderStatusName === 'print')) {
                            dataTrue++;
                            this.order.orderId = sel.orderId;
                            this.order.orderStatusCode = 1;
                            this.order.orderStatusName = 'waitpack';
                            this.order.orderLastupdate = new Date();
                            const hisName = 'Waitpack';
                            const hisRemark = 'ลดสถานะพิมพ์แล้วกลับเป็นรอดำเนินการ (Print => Waitpack)';;
                            this.pushHistorysOrder(hisName, hisRemark);

                            this.orderService.updateOrder(this.order).subscribe((update) => {
                            });
                        } else {
                            // data += 'กรุณาคอนเฟิร์ม order : ' + sel.orderODId + ' ก่อนหน้านี้ก่อนนะครับ คุณข้ามขั้นตอนการทำงาน\n';
                        }
                    }
                });
                this.alertSuccess(`Complete Update : \nข้อมูลอัพเดท จำนวน ${dataTrue} ออร์เดอร์`);
                this.selected = [];
                this.fetchOrder();
                this.router.navigate(['management/orders/waitpacks']);
            }
        } else {
            // alert('error =');
            let data = '';
            let dataError = 0;
            selected.forEach(sel => {
                if (selected) {
                    this.order = sel;
                    if ((sel.orderStatusCode !== 2) && (sel.orderStatusName !== 'print')) {
                        dataError++;
                        data += 'กรุณาคอนเฟิร์ม order : ' + sel.orderODId + ' ก่อนหน้านี้ก่อนนะครับ คุณข้ามขั้นตอนการทำงาน\n';
                    }
                }
            });
            this.alertWarning(`Warning Error : \nข้อมูลผิดพลาด จำนวน ${dataError} ออร์เดอร์\n ${data}`);
            this.selected = [];
            this.router.navigate(['management/orders/waitpacks']);
        }
    }

    checkedSelectedPackUp(selected) {
        if (this.checkStatusProcess(selected, 3, 'pack')) {
            // alert('true =');
            // let data = '';
            let dataTrue = 0;
            if (this.selected.length > 0) {
                selected.forEach(sel => {
                    if (selected) {
                        this.order = sel;
                        if ((sel.orderStatusCode === 3) && (sel.orderStatusName === 'pack')) {
                            dataTrue++;
                            this.order.orderId = sel.orderId;
                            this.order.orderStatusCode = 4;
                            this.order.orderStatusName = 'delivery';
                            this.order.orderLastupdate = new Date();
                            const hisName = 'Delivery';
                            const hisRemark = 'อัพเดทสถานะจัดส่งแล้ว (Pack => Delivery)';
                            this.pushHistorysOrder(hisName, hisRemark);

                            this.orderService.updateOrder(this.order).subscribe((update) => {
                            });
                        } else {
                            // data += 'กรุณาคอนเฟิร์ม order : ' + sel.orderODId + ' ก่อนหน้านี้ก่อนนะครับ คุณข้ามขั้นตอนการทำงาน\n';
                        }
                    }
                });
                this.alertSuccess(`Complete Update : \nข้อมูลอัพเดท จำนวน ${dataTrue} ออร์เดอร์`);
                this.selected = [];
                this.fetchOrder();
                this.router.navigate(['management/orders/deliverys']);
            }
        } else {
            // alert('error =');
            let data = '';
            let dataError = 0;
            selected.forEach(sel => {
                if (selected) {
                    this.order = sel;
                    if ((sel.orderStatusCode !== 3) && (sel.orderStatusName !== 'pack')) {
                        dataError++;
                        data += 'กรุณาคอนเฟิร์ม order : ' + sel.orderODId + ' ก่อนหน้านี้ก่อนนะครับ คุณข้ามขั้นตอนการทำงาน\n';
                    }
                }
            });
            this.alertWarning(`Warning Error : \nข้อมูลผิดพลาด จำนวน ${dataError} ออร์เดอร์\n ${data}`);
            this.selected = [];
            this.router.navigate(['management/orders/packs']);
        }
    }

    checkedSelectedPackDown(selected) {
        if (this.checkStatusProcess(selected, 3, 'pack')) {
            // alert('true =');
            // let data = '';
            let dataTrue = 0;
            if (this.selected.length > 0) {
                selected.forEach(sel => {
                    if (selected) {
                        this.order = sel;
                        if ((sel.orderStatusCode === 3) && (sel.orderStatusName === 'pack')) {
                            dataTrue++;
                            this.order.orderId = sel.orderId;
                            this.order.orderStatusCode = 2;
                            this.order.orderStatusName = 'print';
                            this.order.orderLastupdate = new Date();
                            const hisName = 'Print';
                            const hisRemark = 'ลดสถานะแพ็คแล้วกลับเป็นพิมพ์แล้ว (Pack => Print)';
                            this.pushHistorysOrder(hisName, hisRemark);

                            this.orderService.updateOrder(this.order).subscribe((update) => {
                            });
                        } else {
                            // data += 'กรุณาคอนเฟิร์ม order : ' + sel.orderODId + ' ก่อนหน้านี้ก่อนนะครับ คุณข้ามขั้นตอนการทำงาน\n';
                        }
                    }
                });
                this.alertSuccess(`Complete Update : \nข้อมูลอัพเดท จำนวน ${dataTrue} ออร์เดอร์`);
                this.selected = [];
                this.fetchOrder();
                this.router.navigate(['management/orders/waitpacks']);
            }
        } else {
            // alert('error =');
            let data = '';
            let dataError = 0;
            selected.forEach(sel => {
                if (selected) {
                    this.order = sel;
                    if ((sel.orderStatusCode !== 3) && (sel.orderStatusName !== 'pack')) {
                        dataError++;
                        data += 'กรุณาคอนเฟิร์ม order : ' + sel.orderODId + ' ก่อนหน้านี้ก่อนนะครับ คุณข้ามขั้นตอนการทำงาน\n';
                    }
                }
            });
            this.alertWarning(`Warning Error : \nข้อมูลผิดพลาด จำนวน ${dataError} ออร์เดอร์\n ${data}`);
            this.selected = [];
            this.router.navigate(['management/orders/packs']);
        }
    }

    async checkedSelectedDeliveryUpSuccess(selected) {
        if (this.checkStatusProcess(selected, 4, 'delivery')) {
            // alert('true =');
            // let data = '';
            let dataTrue = 0;
            if (this.selected.length > 0) {
                await selected.forEach(sel => {
                    if (selected) {
                        this.order = sel;
                        if ((sel.orderStatusCode === 4) && (sel.orderStatusName === 'delivery')) {
                            dataTrue++;
                            this.order.orderId = sel.orderId;

                            // // checked update product to stock checked //
                            // let x = 0;
                            //
                            // sel.products.forEach((u: Products) => {
                            //     x = x + 1;
                            //     // console.log('Update data to Stock ID : ' + u.id + ' , amount : ' + u.amount);
                            //     // update stock new value //
                            //     this.productService.fetchViewProductId(u.id)
                            //         .subscribe((r: Product) => {
                            //             this.product = r;
                            //             this.product.productId = r.productId;
                            //
                            //             if (r.productId === u.id) {
                            //                 console.log('N : ' + x);
                            //                 const newItemTotal = ((Number(r.productTotal) - Number(u.amount)));
                            //                 const newItemHold = ((Number(r.productHold) - Number(u.amount)));
                            //                 const newItemUpdateStock = `${r.productTotal} - ${u.amount} => ${newItemTotal}`;
                            //                 const newItemUpdateHold = `${r.productHold} - ${u.amount} => ${newItemHold}`;
                            //                 console.log('newItemTotal : ' + newItemTotal);
                            //                 console.log('newItemHold : ' + newItemHold);
                            //                 console.log('newItemTotal : ' + ((Number(r.productTotal) - Number(u.amount))));
                            //                 console.log('newItemHold : ' + ((Number(r.productHold) - Number(u.amount))));
                            //
                            //                 this.product.productTotal = newItemTotal;
                            //                 this.product.productHold = newItemHold;
                            //                 this.product.productLastupdate = new Date();
                            //                 // add historys //
                            //                 const PhisName = 'CutStockOrderSuccess';
                            //                 const PhisRemark = 'ลดสต็อกสินค้าจำนวน(Stock)' + newItemUpdateStock + '\n'
                            //                     + 'ลดจองจำนวน(Hold)' + newItemUpdateHold;
                            //                 this.pushHistorysProduct(PhisName, PhisRemark);
                            //                 console.log('productTotal = ' + JSON.stringify(this.product.productTotal));
                            //                 console.log('productHold = ' + JSON.stringify(this.product.productHold));
                            //                 // add historys //
                            //                 // if ((this.product) && (this.checkRoleData())) {
                            //                 // ทำการเช็ค id เพื่อ เพื่มข้อมูลสต๊อก //
                            //                 // Swal({
                            //                 //     title: 'คุณต้องการที่จะเพิ่มสต๊อกใช่ไหม?',
                            //                 //     text: `จำนวนสินค้าที่เพิ่มขึ้น ${newItemUpdate}`,
                            //                 //     // type: 'warning',
                            //                 //     showCancelButton: true,
                            //                 //     confirmButtonColor: '#3085d6',
                            //                 //     cancelButtonColor: '#d33a',
                            //                 //     confirmButtonText: 'เพิ่มสต๊อก',
                            //                 //     cancelButtonText: 'ยกเลิก'
                            //                 // }).then((result) => {
                            //                 //     if (result.value) {
                            //                 // อัพเดทข้อมูลลง Database เฉพาะ ProductTotal ใหม่ //
                            //
                            //                 // }
                            //                 // });
                            //                 // ทำการเช็ค id เพื่อ เพื่มข้อมูลสต๊อก //
                            //             }
                            //             this.productService.updateProduct(this.product)
                            //                 .subscribe(() => {
                            //                     // const textAlert = `อัพเดทสต๊อกสินค้า เรียบร้อยแล้ว
                            //                     // \nสต๊อกใหม่เป็น ${newItemUpdateStock} Pcs.
                            //                     // \nจองใหม่เป็น ${newItemUpdateHold} Pcs.`;
                            //                     // this.alertSuccess(textAlert);
                            //                     // this.fetchProduct();
                            //                 });
                            //             // }
                            //         });
                            //     // update stock new value //
                            // });
                            // checked update product to stock checked //

                            this.order.orderStatusCode = 5;
                            this.order.orderStatusName = 'success';
                            this.order.orderLastupdate = new Date();
                            const hisName = 'Success';
                            const hisRemark = 'อัพเดทสถานะสำเร็จ (Delivery => Success)';
                            this.pushHistorysOrder(hisName, hisRemark);

                            this.orderService.updateOrder(this.order).subscribe((update) => {
                            });
                        } else {
                            // data += 'กรุณาคอนเฟิร์ม order : ' + sel.orderODId + ' ก่อนหน้านี้ก่อนนะครับ คุณข้ามขั้นตอนการทำงาน\n';
                        }
                    }
                });
                this.alertSuccess(`Complete Update : \nข้อมูลอัพเดท จำนวน ${dataTrue} ออร์เดอร์`);
                this.selected = [];
                this.fetchOrder();
                this.router.navigate(['management/orders/success']);
            }
        } else {
            // alert('error =');
            let data = '';
            let dataError = 0;
            selected.forEach(sel => {
                if (selected) {
                    this.order = sel;
                    if ((sel.orderStatusCode !== 4) && (sel.orderStatusName !== 'delivery')) {
                        dataError++;
                        data += 'กรุณาคอนเฟิร์ม order : ' + sel.orderODId + ' ก่อนหน้านี้ก่อนนะครับ คุณข้ามขั้นตอนการทำงาน\n';
                    }
                }
            });
            this.alertWarning(`Warning Error : \nข้อมูลผิดพลาด จำนวน ${dataError} ออร์เดอร์\n ${data}`);
            this.selected = [];
            this.router.navigate(['management/orders/deliverys']);
        }
    }

    checkedSelectedDeliveryUpFail(selected) {
        if (this.checkStatusProcess(selected, 4, 'delivery')) {
            // alert('true =');
            // let data = '';
            let dataTrue = 0;
            if (this.selected.length > 0) {
                selected.forEach(sel => {
                    if (selected) {
                        this.order = sel;
                        if ((sel.orderStatusCode === 4) && (sel.orderStatusName === 'delivery')) {
                            dataTrue++;
                            this.order.orderId = sel.orderId;

                            // checked update product to stock checked //
                            // sel.products.forEach((u: Products) => {
                            //     console.log('Update data to Stock ID : ' + u.id + ' , amount : ' + u.amount);
                            //     // update stock new value //
                            //     this.productService.fetchViewProductId(u.id)
                            //         .subscribe((r: Product) => {
                            //             this.product = r;
                            //             this.product.productId = r.productId;
                            //             // const newItemTotal = (Number(r.productTotal) - Number(u.amount));
                            //             const newItemHold = (Number(r.productHold) - Number(u.amount));
                            //             // const newItemUpdateStock = `${r.productTotal} - ${u.amount} => ${newItemTotal}`;
                            //             const newItemUpdateHold = `${r.productHold} - ${u.amount} => ${newItemHold}`;
                            //             // this.product.productTotal = newItemTotal;
                            //             this.product.productHold = newItemHold;
                            //             this.product.productLastupdate = new Date();
                            //             // add historys //
                            //             const PhisName = 'CutStockOrderFail';
                            //             // const PhisRemark = 'ลดสต็อกสินค้าจำนวน(Stock)' + newItemUpdateStock + '\n'
                            //             const PhisRemark = 'ลดจองจำนวน(Hold)' + newItemUpdateHold;
                            //             this.pushHistorysProduct(PhisName, PhisRemark);
                            //             // add historys //
                            //             // if ((this.product) && (this.checkRoleData())) {
                            //             // ทำการเช็ค id เพื่อ เพื่มข้อมูลสต๊อก //
                            //             // Swal({
                            //             //     title: 'คุณต้องการที่จะเพิ่มสต๊อกใช่ไหม?',
                            //             //     text: `จำนวนสินค้าที่เพิ่มขึ้น ${newItemUpdate}`,
                            //             //     // type: 'warning',
                            //             //     showCancelButton: true,
                            //             //     confirmButtonColor: '#3085d6',
                            //             //     cancelButtonColor: '#d33a',
                            //             //     confirmButtonText: 'เพิ่มสต๊อก',
                            //             //     cancelButtonText: 'ยกเลิก'
                            //             // }).then((result) => {
                            //             //     if (result.value) {
                            //             // อัพเดทข้อมูลลง Database เฉพาะ ProductTotal ใหม่ //
                            //             this.productService.updateProduct(this.product)
                            //                 .subscribe(() => {
                            //                     const textAlert = `อัพเดทสต๊อกสินค้า เรียบร้อยแล้ว
                            //                                 \nจองใหม่เป็น ${newItemUpdateHold} Pcs.`;
                            //                     this.alertSuccess(textAlert);
                            //                     // this.fetchProduct();
                            //                 });
                            //             // }
                            //             // });
                            //             // ทำการเช็ค id เพื่อ เพื่มข้อมูลสต๊อก //
                            //             // }
                            //         });
                            //     // update stock new value //
                            // });
                            // checked update product to stock checked //

                            this.order.orderStatusCode = 6;
                            this.order.orderStatusName = 'fail';
                            this.order.orderLastupdate = new Date();
                            const hisName = 'Fail';
                            const hisRemark = 'อัพเดทสถานะล้มเหลว (Delivery => Fail)';
                            this.pushHistorysOrder(hisName, hisRemark);

                            this.orderService.updateOrder(this.order).subscribe((update) => {
                            });
                        } else {
                            // data += 'กรุณาคอนเฟิร์ม order : ' + sel.orderODId + ' ก่อนหน้านี้ก่อนนะครับ คุณข้ามขั้นตอนการทำงาน\n';
                        }
                    }
                });
                this.alertSuccess(`Complete Update : \nข้อมูลอัพเดท จำนวน ${dataTrue} ออร์เดอร์`);
                this.selected = [];
                this.fetchOrder();
                this.router.navigate(['management/orders/fails']);
            }
        } else {
            // alert('error =');
            let data = '';
            let dataError = 0;
            selected.forEach(sel => {
                if (selected) {
                    this.order = sel;
                    if ((sel.orderStatusCode !== 4) && (sel.orderStatusName !== 'delivery')) {
                        dataError++;
                        data += 'กรุณาคอนเฟิร์ม order : ' + sel.orderODId + ' ก่อนหน้านี้ก่อนนะครับ คุณข้ามขั้นตอนการทำงาน\n';
                    }
                }
            });
            this.alertWarning(`Warning Error : \nข้อมูลผิดพลาด จำนวน ${dataError} ออร์เดอร์\n ${data}`);
            this.selected = [];
            this.router.navigate(['management/orders/deliverys']);
        }
    }

    checkedSelectedDeliveryDown(selected) {
        if (this.checkStatusProcess(selected, 4, 'delivery')) {
            // alert('true =');
            // let data = '';
            let dataTrue = 0;
            if (this.selected.length > 0) {
                selected.forEach(sel => {
                    if (selected) {
                        this.order = sel;
                        if ((sel.orderStatusCode === 4) && (sel.orderStatusName === 'delivery')) {
                            dataTrue++;
                            this.order.orderId = sel.orderId;
                            this.order.orderStatusCode = 3;
                            this.order.orderStatusName = 'pack';
                            this.order.orderLastupdate = new Date();
                            const hisName = 'Pack';
                            const hisRemark = 'ลดสถานะจัดส่งแล้วกลับเป็นแพ็คแล้ว (Delivery => Pack)';
                            this.pushHistorysOrder(hisName, hisRemark);

                            this.orderService.updateOrder(this.order).subscribe((update) => {
                            });
                        } else {
                            // data += 'กรุณาคอนเฟิร์ม order : ' + sel.orderODId + ' ก่อนหน้านี้ก่อนนะครับ คุณข้ามขั้นตอนการทำงาน\n';
                        }
                    }
                });
                this.alertSuccess(`Complete Update : \nข้อมูลอัพเดท จำนวน ${dataTrue} ออร์เดอร์`);
                this.selected = [];
                this.fetchOrder();
                this.router.navigate(['management/orders/packs']);
            }
        } else {
            // alert('error =');
            let data = '';
            let dataError = 0;
            selected.forEach(sel => {
                if (selected) {
                    this.order = sel;
                    if ((sel.orderStatusCode !== 4) && (sel.orderStatusName !== 'delivery')) {
                        dataError++;
                        data += 'กรุณาคอนเฟิร์ม order : ' + sel.orderODId + ' ก่อนหน้านี้ก่อนนะครับ คุณข้ามขั้นตอนการทำงาน\n';
                    }
                }
            });
            this.alertWarning(`Warning Error : \nข้อมูลผิดพลาด จำนวน ${dataError} ออร์เดอร์\n ${data}`);
            this.selected = [];
            this.router.navigate(['management/orders/deliverys']);
        }
    }

    checkedSelectedSuccessDown(selected) {
        if (this.checkStatusProcess(selected, 5, 'success')) {
            // alert('true =');
            // let data = '';
            let dataTrue = 0;
            if (this.selected.length > 0) {

                // forkjoin() //
                // const observable = forkJoin(
                //     of(1, 2, 3, 4),
                //     of(5, 6, 7, 8, 9),
                //     of(0, 33),
                //     of(this.clearData(selected)),
                //     of(this.checkedSelectedPrintUp(selected)),
                //     of(123456, 7890),
                // );
                // observable.subscribe(
                //     value => console.log(value),
                //     err => {
                //     },
                //     () => console.log('This is how it ends!'),
                // );
                // forkjoin() //

                // const source = of(1, 2, 3, 4, 5);
                // const example = source.pipe(
                //     tap(val => console.log(`BEFORE MAP: ${val}`)),
                //     map(val => val + 10),
                //     tap(val => console.log(`AFTER MAP: ${val}`))
                // );
                // const subscribe = example.subscribe(val => console.log(val));

                selected.forEach(sel => {
                    if (selected) {
                        this.order = sel;
                        if ((sel.orderStatusCode === 5) && (sel.orderStatusName === 'success')) {
                            dataTrue++;
                            this.order.orderId = sel.orderId;

                            // checked update product to stock checked //
                            // sel.products.forEach((u: Products) => {
                            //     // console.log('Update data to Stock ID : ' + u.id + ' , amount : ' + u.amount);
                            //     // update stock new value //
                            //     this.productService.fetchViewProductId(u.id)
                            //         .subscribe((r: Product) => {
                            //             this.product = r;
                            //             this.product.productId = r.productId;
                            //             const newItemTotal = (Number(r.productTotal) + Number(u.amount));
                            //             const newItemHold = (Number(r.productHold) + Number(u.amount));
                            //             const newItemUpdateStock = `${r.productTotal} + ${u.amount} => ${newItemTotal}`;
                            //             const newItemUpdateHold = `${r.productHold} + ${u.amount} => ${newItemHold}`;
                            //             this.product.productTotal = newItemTotal;
                            //             this.product.productHold = newItemHold;
                            //             this.product.productLastupdate = new Date();
                            //             // add historys //
                            //             const PhisName = 'CutStockOrderSuccess';
                            //             const PhisRemark = 'เพิ่มสต็อกกลับสินค้าจำนวน(Stock)' + newItemUpdateStock + '\n'
                            //                 + 'เพิ่มจองกลับจำนวน(Hold)' + newItemUpdateHold;
                            //             this.pushHistorysProduct(PhisName, PhisRemark);
                            //             // add historys //
                            //             // if ((this.product) && (this.checkRoleData())) {
                            //             // ทำการเช็ค id เพื่อ เพื่มข้อมูลสต๊อก //
                            //             // Swal({
                            //             //     title: 'คุณต้องการที่จะเพิ่มสต๊อกใช่ไหม?',
                            //             //     text: `จำนวนสินค้าที่เพิ่มขึ้น ${newItemUpdate}`,
                            //             //     // type: 'warning',
                            //             //     showCancelButton: true,
                            //             //     confirmButtonColor: '#3085d6',
                            //             //     cancelButtonColor: '#d33a',
                            //             //     confirmButtonText: 'เพิ่มสต๊อก',
                            //             //     cancelButtonText: 'ยกเลิก'
                            //             // }).then((result) => {
                            //             //     if (result.value) {
                            //             // อัพเดทข้อมูลลง Database เฉพาะ ProductTotal ใหม่ //
                            //             this.productService.updateProduct(this.product)
                            //                 .subscribe(() => {
                            //                     // const textAlert = `อัพเดทสต๊อกสินค้า เรียบร้อยแล้ว
                            //                     //             \nสต๊อกใหม่เป็น ${newItemUpdateStock} Pcs.
                            //                     //             \nจองใหม่เป็น ${newItemUpdateHold} Pcs.`;
                            //                     // this.alertSuccess(textAlert);
                            //                     // this.fetchProduct();
                            //                 });
                            //             // }
                            //             // });
                            //             // ทำการเช็ค id เพื่อ เพื่มข้อมูลสต๊อก //
                            //             // }
                            //         });
                            //     // update stock new value //
                            // });
                            // checked update product to stock checked //

                            this.order.orderStatusCode = 4;
                            this.order.orderStatusName = 'delivery';
                            this.order.orderLastupdate = new Date();
                            const hisName = 'Delivery';
                            const hisRemark = 'ลดสถานะสำเร็จกลับเป็นจัดส่งแล้ว (Success => Delivery)';
                            this.pushHistorysOrder(hisName, hisRemark);

                            this.orderService.updateOrder(this.order).subscribe((update) => {
                            });
                        } else {
                            // data += 'กรุณาคอนเฟิร์ม order : ' + sel.orderODId + ' ก่อนหน้านี้ก่อนนะครับ คุณข้ามขั้นตอนการทำงาน\n';
                        }
                    }
                });
                this.alertSuccess(`Complete Update : \nข้อมูลอัพเดท จำนวน ${dataTrue} ออร์เดอร์`);
                this.selected = [];
                this.fetchOrder();
                this.router.navigate(['management/orders/deliverys']);
            }
        } else {
            // alert('error =');
            let data = '';
            let dataError = 0;
            selected.forEach(sel => {
                if (selected) {
                    this.order = sel;
                    if ((sel.orderStatusCode !== 5) && (sel.orderStatusName !== 'success')) {
                        dataError++;
                        data += 'กรุณาคอนเฟิร์ม order : ' + sel.orderODId + ' ก่อนหน้านี้ก่อนนะครับ คุณข้ามขั้นตอนการทำงาน\n';
                    }
                }
            });
            this.alertWarning(`Warning Error : \nข้อมูลผิดพลาด จำนวน ${dataError} ออร์เดอร์\n ${data}`);
            this.selected = [];
            this.router.navigate(['management/orders/success']);
        }
    }

    checkedSelectedFailDown(selected) {
        if (this.checkStatusProcess(selected, 6, 'fail')) {
            // alert('true =');
            // let data = '';
            let dataTrue = 0;
            if (this.selected.length > 0) {
                selected.forEach(sel => {
                    if (selected) {
                        this.order = sel;
                        if ((sel.orderStatusCode === 6) && (sel.orderStatusName === 'fail')) {
                            dataTrue++;
                            this.order.orderId = sel.orderId;

                            // checked update product to stock checked //
                            // sel.products.forEach((u: Products) => {
                            //     // console.log('Update data to Stock ID : ' + u.id + ' , amount : ' + u.amount);
                            //     // update stock new value //
                            //     this.productService.fetchViewProductId(u.id)
                            //         .subscribe((r: Product) => {
                            //             this.product = r;
                            //             this.product.productId = r.productId;
                            //             // const newItemTotal = (Number(r.productTotal) - Number(u.amount));
                            //             const newItemHold = (Number(r.productHold) + Number(u.amount));
                            //             // const newItemUpdateStock = `${r.productTotal} - ${u.amount} => ${newItemTotal}`;
                            //             const newItemUpdateHold = `${r.productHold} + ${u.amount} => ${newItemHold}`;
                            //             // this.product.productTotal = newItemTotal;
                            //             this.product.productHold = newItemHold;
                            //             this.product.productLastupdate = new Date();
                            //             // add historys //
                            //             const PhisName = 'CutStockOrderFail';
                            //             // const PhisRemark = 'ลดสต็อกสินค้าจำนวน(Stock)' + newItemUpdateStock + '\n'
                            //             const PhisRemark = 'ลดจองจำนวน(Hold)' + newItemUpdateHold;
                            //             this.pushHistorysProduct(PhisName, PhisRemark);
                            //             // add historys //
                            //             // if ((this.product) && (this.checkRoleData())) {
                            //             // ทำการเช็ค id เพื่อ เพื่มข้อมูลสต๊อก //
                            //             // Swal({
                            //             //     title: 'คุณต้องการที่จะเพิ่มสต๊อกใช่ไหม?',
                            //             //     text: `จำนวนสินค้าที่เพิ่มขึ้น ${newItemUpdate}`,
                            //             //     // type: 'warning',
                            //             //     showCancelButton: true,
                            //             //     confirmButtonColor: '#3085d6',
                            //             //     cancelButtonColor: '#d33a',
                            //             //     confirmButtonText: 'เพิ่มสต๊อก',
                            //             //     cancelButtonText: 'ยกเลิก'
                            //             // }).then((result) => {
                            //             //     if (result.value) {
                            //             // อัพเดทข้อมูลลง Database เฉพาะ ProductTotal ใหม่ //
                            //             this.productService.updateProduct(this.product)
                            //                 .subscribe(() => {
                            //                     // const textAlert = `อัพเดทสต๊อกสินค้า เรียบร้อยแล้ว
                            //                     //             \nจองใหม่เป็น ${newItemUpdateHold} Pcs.`;
                            //                     // this.alertSuccess(textAlert);
                            //                     // this.fetchProduct();
                            //                 });
                            //             // }
                            //             // });
                            //             // ทำการเช็ค id เพื่อ เพื่มข้อมูลสต๊อก //
                            //             // }
                            //         });
                            //     // update stock new value //
                            // });
                            // checked update product to stock checked //

                            this.order.orderStatusCode = 4;
                            this.order.orderStatusName = 'delivery';
                            this.order.orderLastupdate = new Date();
                            const hisName = 'Delivery';
                            const hisRemark = 'ลดสถานะล้มเหลวกลับเป็นจัดส่งแล้ว (Fail => Delivery)';
                            this.pushHistorysOrder(hisName, hisRemark);

                            this.orderService.updateOrder(this.order).subscribe((update) => {
                            });
                        } else {
                            // data += 'กรุณาคอนเฟิร์ม order : ' + sel.orderODId + ' ก่อนหน้านี้ก่อนนะครับ คุณข้ามขั้นตอนการทำงาน\n';
                        }
                    }
                });
                this.alertSuccess(`Complete Update : \nข้อมูลอัพเดท จำนวน ${dataTrue} ออร์เดอร์`);
                this.selected = [];
                this.fetchOrder();
                this.router.navigate(['management/orders/deliverys']);
            }
        } else {
            // alert('error =');
            let data = '';
            let dataError = 0;
            selected.forEach(sel => {
                if (selected) {
                    this.order = sel;
                    if ((sel.orderStatusCode !== 6) && (sel.orderStatusName !== 'fail')) {
                        dataError++;
                        data += 'กรุณาคอนเฟิร์ม order : ' + sel.orderODId + ' ก่อนหน้านี้ก่อนนะครับ คุณข้ามขั้นตอนการทำงาน\n';
                    }
                }
            });
            this.alertWarning(`Warning Error : \nข้อมูลผิดพลาด จำนวน ${dataError} ออร์เดอร์\n ${data}`);
            this.selected = [];
            this.router.navigate(['management/orders/fails']);
        }
    }

    async pushHistorysOrder(hisName, hisRemark) {
        // if (this.checkRoleData()) {
        // this.alertSuccess(`คุณมีสิทธื์ใช้งาน เพื่อเข้าถึงข้อมูลนี้ได้`);
        await this.order.historys.push({
            hisName: hisName,
            hisRemark: hisRemark,
            sellerId: this.ID,
            sellerName: this.Name,
            lastUpdate: new Date()
        });
        // } else {
        //     return this.alertWarning(`คุณไม่มีสิทธื์เข้าถึงข้อมูลนี้ กรุณาตรวจสอบอีกครั้ง!`);
        // }
    }

    async pushHistorysProduct(PhisName, PhisRemark) {
        // if (this.checkRoleData()) {
        // this.alertSuccess(`คุณมีสิทธื์ใช้งาน เพื่อเข้าถึงข้อมูลนี้ได้`);
        await this.product.historys.push({
            hisName: PhisName,
            hisRemark: PhisRemark,
            sellerId: this.ID,
            sellerName: this.Name,
            lastUpdate: new Date()
        });
        // } else {
        //     return this.alertWarning(`คุณไม่มีสิทธื์เข้าถึงข้อมูลนี้ กรุณาตรวจสอบอีกครั้ง!`);
        // }
    }

    onSelect({selected}) {
        this.selected.splice(0, this.selected.length);
        // alert(this.selected.forEach(r => console.log(r + this.selected)));
        this.selectedOrder = this.selected.push(...selected);
        // this.printOrders = this.selected.push(...selected);
        // console.log(...selected);
        this.selectedtest = {...selected};
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

    // toggleSelectOrders(checked) {
    //     this.orders.forEach(o => {
    //         o.selected = checked;
    //     });

    // (change)="toggleSelectOrders($event.target.checked)"
    // <input class="form-control" type="checkbox" [(ngModel)]="order.selected">
    //
    // get selectedOrders() {
    //     return this.orders.filter(o => o.selected);
    // }

    // private updateHold(products) {
    //     const holdProducts = this.findHoldProducts(products);
    //     const reqs = holdProducts.map(p => this.productService.hold(p.id, p));
    //     Observable.forkJoin(reqs).subscribe();
    // }

    // private findHoldProducts(products) {
    //     return products.reduce((ps, product) => {
    //         const hasSize = product.code.includes('-');
    //
    //         if (!hasSize) {
    //             ps.push({ id: product.id, hold: -product.amount });
    //             return ps;
    //         }
    //
    //         const exist = ps.find(p => p.id === product.id);
    //
    //         if (exist) {
    //             exist.hold -= product.amount;
    //             exist.size.push({ code: product.code, hold: -product.amount });
    //         } else {
    //             ps.push({
    //                 id: product.id,
    //                 hold: -product.amount,
    //                 size: [{ code: product.code, hold: -product.amount }]
    //             });
    //         }
    //
    //         return ps;
    //     }, []);
    // }
    // }

    viewHisOrder(id: number) {
        // this.productService.fetchViewOrder(product).subscribe((r) => this.order = r);
        // alert(order);
        this.orderService.fetchViewOrderId(id)
        //     .map((m) => {
        //
        //     m.orderLastupdate = new Date(m.orderLastupdate);
        //     m.orderCreated = new Date(m.orderCreated);
        //
        //     // const ddStart = new Date(m.orderLastupdate);
        //     // this.modelPopupOrderLastupdate = {year: ddStart.getFullYear(), month: ddStart.getMonth() + 1, day: ddStart.getDate()};
        //     //
        //     // const ddCreate = new Date(m.orderCreated);
        //     // this.modelPopupOrderCreated = {year: ddCreate.getFullYear(), month: ddCreate.getMonth() + 1, day: ddCreate.getDate()};
        //
        //     return m;
        //
        // })
            .subscribe((r) => {

                this.order = r;
                this.ordersHistorys = r.historys;

                if (this.ordersHistorys.length <= 10) {
                    this.ordershistorysLimit = this.ordersHistorys.length;
                    this.order.historys = r.historys.reverse().slice(0, this.ordersHistorys.length);
                } else {
                    this.ordershistorysLimit = 10;
                    this.order.historys = r.historys.reverse().slice(0, 10);
                }
                // console.log(this.ordershistorysLimit);
                // console.log(JSON.stringify(this.order.historys));

                // console.log('Length = ' + this.order.historys.length);
                //
                //     let count = 0 ;
                //     let sum = 0 ;
                //     const many = range(1, this.order.historys.length);
                //     const lastThree = many.pipe(takeLast(5));
                //     lastThree.subscribe(x => {
                //         console.log(x);
                //         count = count + x;
                //         sum++;
                //     });
                //     console.log('Count : ' + count + ', Sum = ' + sum);

                // if (r.orderImage) {
                //     r.orderImage = `${env.serverAPI}/images/order/` + r.orderImage;
                //     // this.showImg = r.orderImage;
                //     // this.orderCache = r.orderImage;
                // } else {
                //     r.orderImage = `${env.serverAPI}/images/image-blank.jpg`;
                //     // this.showImg = r.orderImage;
                //     // this.orderCache = r.productImage;
                // }
            });
        this.isReadOnly = true;
    }

    async fetchLastOrderId() {
        this.sub = await this.orderService.fetchLastOrderId()
            .subscribe((result) => {
                // console.log(result);
                this.lastOrderId = result.orderId;
            });
    }
    deleteOrder(order) {
        // this.fetchLastOrderId();
        // if (order === this.lastOrderId) {
        //     this.alertWarningPosition('ไม่สามารถลบข้อมูลคำสั่งซื้อล่าสุดได้ เป็นการ protect order ล่าสุดไว้\n- สามรถเพิ่มคำสั่งซื้อใหม่เข้าไป\n- แล้วค่อยลบคำสั่งซื้อตามต้องการได้', 'top');
        //     return ;
        // }

        if (this.checkRole === 'superadmin') {
            // alert(order);

            Swal({
                // title: 'Are you sure?',
                // text: "You won't be able to revert this!",
                title: '\nคุณต้องการที่จะลบข้อมูล ใช่ไหม?',
                text: '\nคุณจะไม่สามารถย้อนกลับได้!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                // confirmButtonText: 'Yes, delete it!'
                confirmButtonText: 'ใช่, ฉันต้องการ',
                cancelButtonText: 'ยกเลิก'
            }).then((result) => {
                if (result.value) {
                    // check orderID & amount for updateHold //
                    this.orderService.fetchViewOrderId(order).subscribe(m => {
                        this.order = m;
                        const checkStatusPack = this.order.orderStatusCode;
                        // alert(this.order.products);
                        // console.log(this.order.orderStatusCode + ' 5555 ' + this.order.products);
                        if (checkStatusPack < 3) {
                            // alert(this.order.orderStatusCode + ' < 3333 ' + this.order.products);
                            console.log('True < 3 => ' + this.order.orderStatusCode);
                            // return this.alertSuccess('True < 3');

                            // < 3 ทำการตัด stock balance ใหม่ //
                            console.log(this.order.products);
                            console.log(this.order.products.length);
                            let x = 0;

                            this.order.products.forEach((p) => {
                                ++x;
                                const id = p.id;
                                const amount = p.amount;
                                // console.log(p.id);
                                // console.log(p.amount);
                                // console.log('id = ' + id + ' & amount =' + amount);

                                this.productService.hold(p.id, p.amount).subscribe((r: Product) => {
                                    if (r.productId === p.id) {
                                        if (p.id === r.productId) {
                                            // const remainCheck = (r.productTotal - r.productHold);
                                            // if ((remainCheck === 0) || (remainCheck < 1)) {
                                            //     alert('สินค้าเหหลือน้อยเกินไป ---- ');
                                            //     return;
                                            // }
                                            this.product = r;
                                            this.product.productId = p.id;
                                            // this.product.productHold = (r.productHold - p.amount);
                                            // this.product.productTotal = (r.productTotal - p.amount);
                                            // ไม่ต้องหัก stock (Total) เพราะยังไม่ได้ยิง barcode ออก
                                            // this.product.productRemain = (this.product.productTotal - this.product.productHold);
                                            // this.product.productLastupdate = new Date();
                                            // const calHold = this.product.productHold;
                                            // console.log('this.product.productId = ' + this.product.productId); // 57
                                            // console.log('this.product.productHold is cal = ' + this.product.productHold); // 9
                                            // console.log('calHold = ' + calHold); // 11
                                            // console.log('Total = ' +  this.product.productTotal);
                                            // console.log('this.product = ' + JSON.stringify(this.product));

                                            // return; // for check //
                                            // this.productService.updateHold(p.id, this.product.productHold)
                                            // .subscribe((re) => { updateHold (+-)
                                            // return;

                                            // console.log('N : ' + x);
                                            const newItemTotal = (r.productTotal);
                                            const newItemHold = (r.productHold - p.amount);
                                            const newItemRemain = (newItemTotal - newItemHold);
                                            const newItemUpdateStock = `${r.productTotal} => ${newItemTotal}`;
                                            const newItemUpdateHold = `${r.productHold} - ${p.amount} => ${newItemHold}`;
                                            const newItemUpdateRemain = `${newItemTotal} - ${newItemHold} => ${newItemRemain}`;

                                            this.product.productTotal = newItemTotal;
                                            this.product.productHold = newItemHold;
                                            this.product.productRemain = (this.product.productTotal - this.product.productHold);
                                            this.product.productLastupdate = new Date();
                                            // add historys //
                                            const PhisName = `OrderDelete`;
                                            // const PhisRemark = '' + sel.orderODId + '\nลดสต็อกสินค้าจำนวน(Stock)' + newItemUpdateStock
                                            //     + '\nลดจองจำนวน(Hold)' + newItemUpdateHold
                                            //     + '\n สต๊อกคงเหลือ(Remain)' + newItemUpdateRemain;
                                            const PhisRemark = `ลบออเดอร์ (${this.order.orderODId}) \nสต็อกสินค้าคงเดิม(Stock) ${newItemUpdateStock}
                                            \nลดจองจำนวน(Hold) ${newItemUpdateHold} \nสต๊อกคงเหลือ(Remain) ${newItemUpdateRemain}`;
                                            this.pushHistorysProduct(PhisName, PhisRemark);

                                            this.productService.updateProduct(this.product).subscribe((re) => {
                                                // this.product.productId = re.productId;
                                                // this.product.productHold = re.productHold + p.amount;
                                                // console.log('p.amount = ' + this.product.productHold);
                                                // console.log(re);
                                                if (x === this.order.products.length) {
                                                    const toast = Swal.mixin({
                                                        toast: true,
                                                        position: 'top',
                                                        showConfirmButton: false,
                                                        timer: 5000
                                                    });
                                                    toast({
                                                        type: 'success',
                                                        title: 'BalanceStock และ อัพเดทข้อมูลสินค้า เรียบร้อยแล้ว'
                                                    });
                                                }
                                            });
                                        }
                                    }
                                });
                            });
                            // < 3 ทำการตัด stock balance ใหม่ //
                            // ทำการลบ order คำสั้งซื้อทิ้ง //
                            // return;
                            this.orderService.deleteOrder(order)
                                .subscribe((r) => {
                                    // this.data = this.productService.fetchProduct();
                                    this.fetchOrder();
                                    this.alertSuccess(`ทำการลบข้อมูล ${order.orderODId} เรียบร้อยแล้ว`);
                                });
                            // ทำการลบ order คำสั้งซื้อทิ้ง //
                        } else {
                            return this.alertWarning('คุณไม่สามารถลบคำสั่งซื้อนี้ได้ครับ... \nหรือ แจ้ง AdminRising ผู้ดูแลระบบให้รับทราบ');
                        }


                    });
                    // check orderID & amount for updateHold //
                    // return; // for check //
                    // this.orderService.deleteOrder(order)
                    //     .subscribe((r) => {
                    //         // this.data = this.productService.fetchProduct();
                    //         this.fetchOrder();
                    //     });
                }
            });
        }
    }

    // add() {
    //     this.selected.push(this.rows[1], this.rows[3]);
    // }
    //
    // update() {
    //     this.selected = [this.rows[1], this.rows[3]];
    // }
    //
    // remove() {
    //     this.selected = [];
    // }

    //  Types of property 'position' are incompatible. //
    //  Type 'string' is not assignable to type //
    //  '"center" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-st...'. //
    public alertWarningPosition(val: string, positions) {
        const toast = Swal.mixin({
            toast: true,
            position: positions,
            showConfirmButton: false,
            timer: 8000
        });
        toast({
            type: 'warning',
            title: val
        });
    }

    public alertSuccessPosition(val: string, positions) {
        const toast = Swal.mixin({
            toast: true,
            position: positions,
            showConfirmButton: false,
            timer: 8000
        });
        toast({
            type: 'success',
            title: val
        });
    }

    public alertWarning(val: string) {
        const toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000
        });
        toast({
            type: 'warning',
            title: val
        });
    }

    public alertSuccess(val: string) {
        const toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000
        });
        toast({
            type: 'success',
            title: val
        });
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
        // console.log('afterinit');
        if (this.tabs) {
            this.tabs.select(this.selectedTab);
            // console.log(this.selectedTab);
            // console.log(event);
        }
        setTimeout(() => {
            //     // console.log(this.table.nativeElement.innerText);
            //     // console.log(this.table.nativeElement.innerHTML);
            //     console.log(this.content.nativeElement.innerHTML);
            //     // console.log(this.table.nativeElement.value);
            //     console.log(this.orders);
        }, 1000);
    }

    // function checkRole && alertData //
    public checkRoleData() {
        // this.ID = JSON.parse(localStorage.getItem('ID'));
        // this.Name = JSON.parse(localStorage.getItem('Name'));
        // this.checkRole = JSON.parse(localStorage.getItem('Role'));
        const roleValue = this.checkRole.toString().toLowerCase();
        // alert(roleValue);
        if (roleValue === 'superadmin') {
            // this.alertSuccess(`คุณมีสิทธื์ใช้งาน เพื่อเข้าถึงข้อมูลนี้ได้`);
            return true;
        } else {
            // this.alertWarning(`คุณไม่มีสิทธื์เข้าถึงข้อมูลนี้ กรุณาตรวจสอบอีกครั้ง!`);
            return false;
        }
    }
    // function checkRole && alertData //

    // End print pdfMake //
    formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

    currencyFormat(num) {
        return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

    genPrintPDFmake(selected) {
        if (selected.length !== 0) {
            // alert('Data-Selected-orders count = ' + selected.length);
            const chkCount = true;
            const itemsCount = selected.length;
            const now = new Date();
            const nameDownload = now.getDate() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + now.getFullYear()
                + 'T' + now.getHours() + '.' + now.getMinutes();
            const ccc = '';
            const pageSizeset = 'a7';
            const pageOrientationset = 'landscape';
            // console.log('Count = ' + itemsCount);
            // selected.forEach((r) => {
            //     console.log(r)
            // });

            if (chkCount) {
                pdfMake.fonts = {
                    Athiti: {
                        normal: 'Athiti-Light.ttf',
                        bold: 'Athiti-Bold.ttf',
                        italics: 'Athiti-Regular.ttf',
                        bolditalics: 'Athiti-Medium.ttf'
                    },
                    Sarabun: {
                        normal: 'Sarabun-Regular.ttf',
                        bold: 'Sarabun-Bold.ttf',
                        light: 'Sarabun-Light.ttf',
                        thin: 'Sarabun-Thin.ttf'
                    },
                    Code128: {
                        normal: 'code128.ttf'
                    },
                    Ean13: {
                        normal: 'ean13.ttf'
                    },
                    Fre3of9x: {
                        normal: 'fre3of9x.ttf'
                    },
                    Free3of9: {
                        normal: 'free3of9.ttf'
                    },
                    Roboto: {
                        normal: 'Roboto-Regular.ttf',
                        bold: 'Roboto-Medium.ttf',
                        italics: 'Roboto-Italic.ttf',
                        bolditalics: 'Roboto-MediumItalic.ttf'
                    }
                };

                pdfMake.vfs = pdfFonts.pdfMake.vfs;
                const contents = [];

                // for loop print PDF //
                let x = 0;
                // Start selected forEach //
                this.selected.forEach(p => {
                    var orderTotal = '';
                    var re = /\n/gi;
                    if ((p.orderRemark !== null) || (p.orderRemark !== '')) {
                        if (p.orderRemark.search(re) === -1) {
                            var orderRemarkList = p.orderRemark;
                        } else {
                            var orderRemarkList = p.orderRemark.replace('\n', '');
                        }
                    } else {
                        var orderRemarkList = p.orderRemark;
                    }
                    var orderShipmentName = '';
                    var orderShipmentList = '';
                    var orderProductList = '';
                    var productMax = 0;
                    var textPage = '';
                    var y = 1;
                    x++;
                    if (p.payment.orderShipmentId !== null) {
                        this.shipments.filter((rec: Shipment) => {
                            if (rec.shipmentId === p.payment.orderShipmentId) {
                                orderShipmentName = rec.shipmentName;
                            }
                        });
                    }
                    if (p.orderTotal.toString().length > 3) {
                        orderTotal += this.formatNumber(p.orderTotal) + '฿';
                    } else {
                        orderTotal += p.orderTotal + '฿';
                    }

                    if (p.payment.method === 'cod') {
                        orderShipmentList += orderShipmentName.toLocaleUpperCase()
                            + '/' + p.payment.method.toLocaleUpperCase() + '/' + orderTotal;
                    }
                    if (p.payment.method === 'banktranfer') {
                        orderShipmentList += orderShipmentName.toLocaleUpperCase();
                    }
                    if (p.products.length > 0) {
                        p.products.forEach(r => {
                            productMax = p.products.length;
                            if ((y < productMax) && (y !== productMax)) {
                                orderProductList += (r.code + '(' + r.amount + '), ');
                            } else {
                                orderProductList += (r.code + '(' + r.amount + ')');
                            }
                            y++;
                        });
                    }

                    // set pageBreak //
                    if ((x < itemsCount)) {
                        textPage = 'after';
                    } else {
                        textPage = '';
                    }

                    const row_cont =
                        [
                            {
                                alignment: 'justify',
                                layout: 'lightHorizontalLines', // optional
                                table: {
                                    // headers are automatically repeated if the table spans over multiple pages
                                    // you can declare how many rows should be treated as headers
                                    headerRows: 1,
                                    // headerRows: 1,
                                    // widths: [ '*', 'auto', 100, '*' ],
                                    // widths: [ '*', 'auto'],
                                    body: [
                                        // [ 'First', 'Second', 'Third', 'The last one' ],
                                        // [ 'Value 1', 'Value 2', 'Value 3', 'Value 4' ],
                                        // [
                                        //   {text: 'Bold 1234', normal: true, style: 'barcodeCode128' },
                                        //   {text: aaa, style: 'header'}, {text: bbb, font: 'Sarabun'},
                                        // {text: ccc, style: 'header', bold: true, pageBreak: 'after'},
                                        {text: ccc, style: 'header'},
                                        // body
                                        // ]
                                    ]
                                }
                            },
                            // {text: 'Headers', pageBreak: 'before', style: 'header'},
                            // {text: '2 side columns', style: 'header', pageBreak: 'before'},
                            {
                                alignment: 'justify',
                                columns:
                                    [
                                        {
                                            alignment: 'left',
                                            fontSize: 10,
                                            font: 'Sarabun',
                                            bold: true,
                                            text: 'ผู้รับ'
                                        },
                                        {
                                            alignment: 'right',
                                            font: 'Sarabun',
                                            fontSize: 10,
                                            bold: true,
                                            text: orderShipmentList
                                        }
                                    ],
                            },
                            {
                                alignment: 'left',
                                font: 'Sarabun',
                                fontSize: 10,
                                bold: true,
                                border: [false, false, false, false],
                                text: p.customer.orderCustomerNameSurname + '  โทร. ' + p.customer.orderCustomerTel
                            },
                            {
                                alignment: 'left',
                                font: 'Sarabun',
                                fontSize: 10,
                                bold: true,
                                border: [false, false, false, false],
                                text: ''
                            },
                            {
                                alignment: 'left',
                                font: 'Sarabun',
                                fontSize: 10,
                                bold: false,
                                border: [false, false, false, false],
                                text: p.customer.orderCustomerIdhome
                            },
                            {
                                alignment: 'left',
                                font: 'Sarabun',
                                fontSize: 10,
                                bold: false,
                                border: [false, false, false, false],
                                text: p.customer.orderCustomerAddress
                            },
                            {
                                alignment: 'left',
                                font: 'Sarabun',
                                fontSize: 10,
                                bold: true,
                                border: [false, false, false, false],
                                text: 'รหัสไปรษณีย์ : ' + p.customer.orderCustomerZipcode
                            },
                            {
                                alignment: 'left',
                                font: 'Sarabun',
                                fontSize: 8,
                                bold: false,
                                border: [false, false, false, false],
                                text: orderRemarkList
                            },
                            {
                                style: 'tableExample',
                                table: {
                                    widths: ['*', '*'],
                                    // widths: [210],
                                    // heights: [20, 30, 20],
                                    body:
                                        [
                                            [{
                                                text: orderProductList,
                                                border: [false, false, false, false],
                                                style: 'tableExample',
                                                font: 'Sarabun',
                                                fontSize: 11,
                                                bold: true,
                                                colSpan: 2,
                                                alignment: 'left'
                                            }],
                                            [{
                                                text: ccc,
                                                border: [false, false, false, false],
                                                style: 'tableExample',
                                                colSpan: 2,
                                                alignment: 'left'
                                            }],
                                            // [{text: ccc, border:[false,false,false,false],
                                            // style: 'tableExample', colSpan: 2, alignment: 'left'}],
                                            // [{text: ccc, border:[false,false,false,false],
                                            // style: 'tableExample', colSpan: 2, alignment: 'left'}],
                                            [
                                                {
                                                    text: '*' + p.orderODId + '*',
                                                    font: 'Fre3of9x',
                                                    fontSize: 30,
                                                    alignment: 'center',
                                                    border: [false, false, false, false],
                                                    margin: [0, 15, 0, 0],
                                                    colSpan: 2,
                                                },
                                            ],
                                            [
                                                {
                                                    text: p.orderODId,
                                                    font: 'Sarabun',
                                                    fontSize: 8,
                                                    bold: true,
                                                    border: [false, false, false, false],
                                                    colSpan: 2,
                                                    margin: [0, -5, 0, 0],
                                                    alignment: 'center',
                                                },
                                            ]
                                        ]
                                }
                            },
                            {
                                text: ccc,
                                style: 'header',
                                pageBreak: textPage
                            }
                            // '\n',
                            // {text: ccc, style: 'header',  'after'}
                        ];

                    contents.push(row_cont);
                });
                // End selected forEach //

                const dataGen = {
                    pageSize: pageSizeset,
                    // pageSize: {
                    //   width: 210,
                    //   height: 298
                    // },
                    // pageOrientation: 'landscape',
                    // pageOrientation: 'portal',
                    pageOrientation: pageOrientationset,
                    pageMargins: [15, 5, 15, 5],
                    content: [contents],
                    styles: {
                        header: {
                            font: 'Sarabun',
                            fontSize: 12,
                            alignment: 'justify'
                        },
                        barcodeCode128: {
                            font: 'Code128',
                            fontSize: 50,
                            normal: true,
                            alignment: 'justify'
                        },
                        barcodeEan13: {
                            font: 'Ean13',
                            fontSize: 50,
                            height: 10,
                            normal: true,
                            alignment: 'justify'
                        },
                        Fre3of9x: {
                            font: 'Fre3of9x',
                            fontSize: 50,
                            height: 10,
                            normal: true,
                            alignment: 'justify'
                        },
                        Free3of9: {
                            font: 'Free3of9',
                            fontSize: 40,
                            height: 10,
                            normal: true,
                            alignment: 'justify'
                        },
                        textbarcode: {
                            font: 'Sarabun',
                            fontSize: 12,
                            alignment: 'justify'
                        },
                        spit2left: {
                            alignment: 'left'
                        },
                        spit2right: {
                            alignment: 'right'
                        },
                        tableExample: {
                            margin: [0, 0, 0, 0]
                        },
                        tableHeader: {
                            bold: true,
                            fontSize: 12,
                            color: 'black'
                        }
                    },
                    defaultStyle: {
                        // columnGap: 10
                    }
                };

                // const pdfData = pdfMake.createPdf(dataGen).download('(' + itemsCount + ')barcode_' + nameDownload + '.pdf');
                // pdfMake.createPdf(dataGen).print(pdfData);
                pdfMake.createPdf(dataGen).print();
                this.selected = [];

            }
        }

    }

    genBillPDFmake(selected) {
        if (selected.length !== 0) {
            // alert('Data-Selected-orders count = ' + selected.length);
            const chkCount = true;
            const itemsCount = selected.length;
            const now = new Date();
            const dateNow = now.getDate() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + now.getFullYear();
            const nameDownload = now.getDate() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + now.getFullYear()
                + 'T' + now.getHours() + '.' + now.getMinutes();
            const ccc = '';
            const pageSizeset = 'a4';
            // const pageOrientationset = 'landscape';
            const pageOrientationset = 'portrait';
            // console.log('Count = ' + itemsCount);
            // selected.forEach((r) => {
            //     console.log(JSON.stringify(r))
            // });

            if (chkCount) {
                pdfMake.fonts = {
                    Athiti: {
                        normal: 'Athiti-Light.ttf',
                        bold: 'Athiti-Bold.ttf',
                        italics: 'Athiti-Regular.ttf',
                        bolditalics: 'Athiti-Medium.ttf'
                    },
                    Sarabun: {
                        normal: 'Sarabun-Regular.ttf',
                        bold: 'Sarabun-Bold.ttf',
                        light: 'Sarabun-Light.ttf',
                        thin: 'Sarabun-Thin.ttf'
                    },
                    Code128: {
                        normal: 'code128.ttf'
                    },
                    Ean13: {
                        normal: 'ean13.ttf'
                    },
                    Fre3of9x: {
                        normal: 'fre3of9x.ttf'
                    },
                    Free3of9: {
                        normal: 'free3of9.ttf'
                    },
                    Roboto: {
                        normal: 'Roboto-Regular.ttf',
                        bold: 'Roboto-Medium.ttf',
                        italics: 'Roboto-Italic.ttf',
                        bolditalics: 'Roboto-MediumItalic.ttf'
                    }
                };

                pdfMake.vfs = pdfFonts.pdfMake.vfs;
                const contents = [];

                // for loop print PDF //
                let x = 0;
                // Start selected forEach //
                this.selected.forEach(p => {
                    var orderTotal = '';
                    var re = /\n/gi;
                    if ((p.orderRemark !== null) || (p.orderRemark !== '')) {
                        if (p.orderRemark.search(re) === -1) {
                            var orderRemarkList = p.orderRemark;
                        } else {
                            var orderRemarkList = p.orderRemark.replace('\n', '');
                        }
                    } else {
                        var orderRemarkList = p.orderRemark;
                    }
                    var orderShipmentName = '';
                    var orderShipmentList = '';
                    var orderProductList = '';
                    var productMax = 0;
                    var textPage = '';
                    var y = 1;
                    x++;

                    var productNo = '';
                    var productCode = '';
                    var productName = '';
                    var productAmount = '';
                    var productPrice = '';
                    var productDiscount = '';
                    var productTotal = '';


                    if ((p.delivery.price === '') || (p.delivery.price === undefined) || (p.delivery.price === null)) {
                        var deliveryPrice = '0.00';
                    } else {
                        var deliveryPrice = this.formatNumber(p.delivery.price) + '.00';
                    }
                    // const deliveryPrice = this.formatNumber(p.delivery.price) + '.00';
                    if ((p.orderDiscount === '') || (p.orderDiscount === undefined) || (p.orderDiscount === null)) {
                        var orderDiscount = '0.00';
                    } else {
                        var orderDiscount = this.formatNumber(p.orderDiscount) + '.00';
                    }
                    // const orderDiscount = this.formatNumber(p.orderDiscount) + '.00';
                    const orderSumTotal = this.formatNumber(p.orderTotal) + '.00';

                    // console.log(deliveryPrice);
                    // console.log(orderDiscount);
                    // console.log(orderSumTotal);
                    // console.log(p.customer.orderCustomerId);
                    // console.log(p.customer.orderCustomerCMId);

                    if (p.payment.orderShipmentId !== null) {
                        this.shipments.filter((rem: Shipment) => {
                            if (rem.shipmentId === p.payment.orderShipmentId) {
                                orderShipmentName = rem.shipmentName;
                            }
                        });
                    }
                    if (p.orderTotal.toString().length > 3) {
                        orderTotal += this.formatNumber(p.orderTotal) + '฿';
                    }

                    if (p.payment.method === 'cod') {
                        orderShipmentList += orderShipmentName.toLocaleUpperCase()
                            + '/' + p.payment.method.toLocaleUpperCase() + '/' + orderTotal;
                    }
                    if (p.payment.method === 'banktranfer') {
                        orderShipmentList += orderShipmentName.toLocaleUpperCase();
                    }

                    if ((p.customer.orderCustomerId !== null) || (p.customer.orderCustomerId !== '')) {
                        var orderCustomerId = p.customer.orderCustomerId;
                    } else {
                        var orderCustomerId = p.customer.orderCustomerId;
                    }

                    if ((p.customer.orderCustomerCMId !== null) || (p.customer.orderCustomerCMId !== '')) {
                        var orderCustomerCMId = p.customer.orderCustomerCMId;
                    } else {
                        var orderCustomerCMId = p.customer.orderCustomerCMId;
                    }

                    let pp = 0;
                    if (p.products.length > 0) {
                        // console.log('p-length = ' + p.products.length);
                        // console.log('y = ' + y);

                        p.products.forEach(r => {
                            // console.log('x = ' + x);
                            // console.log('pp = ' + pp);

                            productMax = p.products.length;
                            if ((y < productMax) && (y !== productMax)) {
                                orderProductList += (r.code + '(' + r.amount + '), ');
                                productNo += (pp + 1) + '\n';
                                productCode += r.code + '\n';
                                productName += r.name + '\n';
                                productAmount += r.amount + '\n';
                                productPrice += this.formatNumber(r.price) + '.00\n';
                                productDiscount += '0.00' + '\n';
                                productTotal += this.formatNumber((r.amount * r.price)) + '.00\n';
                            } else {
                                orderProductList += (r.code + '(' + r.amount + ')');
                                // orderProductList += (r.code + '(' + r.amount + '), ');
                                productNo += (pp + 1);
                                productCode += r.code;
                                productName += r.name;
                                productAmount += r.amount;
                                productPrice += this.formatNumber(r.price) + '.00';
                                productDiscount += '0.00';
                                productTotal += this.formatNumber((r.amount * r.price)) + '.00';
                            }

                            // dataProducts.push(dataProduct);
                            pp++;
                            // dataProducts.push(dataProduct);
                            // console.log('y = ' + y);
                        });
                        y++;
                        // dataProducts.push(dataProduct);
                        // dataProducts.push(dataProducts);

                    }
                    // console.log('pp = ' + pp);
                    // console.log('y = ' + y);
                    // console.log('x = ' + x);
                    // console.log('itemsCount = ' + itemsCount);

                    // set pageBreak //
                    if ((x < itemsCount)) {
                        textPage = 'after';
                    } else {
                        textPage = '';
                    }
                    const pageNum = 0;
                    const pageMax = 1;

                    const row_dataHeadlines = [
                        {
                            alignment: 'justify',
                            columns:
                                [
                                    {
                                        alignment: 'left',
                                        fontSize: 10,
                                        font: 'Sarabun',
                                        bold: true,
                                        text: ''
                                    },
                                    {
                                        alignment: 'right',
                                        font: 'Sarabun',
                                        fontSize: 10,
                                        bold: true,
                                        text: 'ต้นฉบับ'
                                    },
                                ],
                        },
                    ];

                    const row_dataCompanyOrders = [
                        // add new data Company //
                        {
                            style: 'tableExample',
                            table: {
                                widths: ['*', '*', '*', 5, 70, 70],
                                body: [
                                    [
                                        {
                                            image: 'rising_old_logo.png',
                                            fit: [60, 60],
                                            // image: 'rising_logo_x45.png',
                                            // fit: [35, 35],
                                            colSpan: 3, style: 'tableCompanyOff',
                                            bold: true,
                                        },
                                        {text: ''},
                                        {text: ''},
                                        {text: ''},
                                        {text: '\n\nเลขที่ใบสั่งซื้อ : ' + p.orderODId, colSpan: 2, style: 'tableSelectC'},
                                        {text: ''},
                                    ],
                                    [
                                        {
                                            text: 'Rising Enterprise Limited\nตู้ปณ 10 ปณ.พนัสนิคม พนัสนิคม ชลบุรี 20140\n'
                                            + 'โทรศัพท์\nเลขประจำตัวผู้เสียภาษี 02055559022401',
                                            rowSpan: 4, colSpan: 3, style: 'tableCompanyOff', bold: true,
                                        },
                                        {text: ''},
                                        {text: ''},
                                        {text: ''},
                                        {
                                            text: '*' + p.orderODId + '*',
                                            font: 'Fre3of9x',
                                            fontSize: 30,
                                            colSpan: 2,
                                            alignment: 'center',
                                        },
                                        {text: ''},
                                    ],
                                    [
                                        {text: ''},
                                        {text: ''},
                                        {text: ''},
                                        {text: ''},
                                        {
                                            text: 'ใบเสร็จรับเงิน/ใบกำกับภาษี',
                                            colSpan: 2,
                                            style: 'tableSelectC',
                                        },
                                        {text: ''},
                                    ],
                                    [
                                        {text: ''},
                                        {text: ''},
                                        {text: ''},
                                        {text: ''},
                                        {text: '', colSpan: 2, style: 'tableSelectC'},
                                        {text: ''},
                                    ],
                                    [
                                        {text: ''},
                                        {text: ''},
                                        {text: ''},
                                        {text: ''},
                                        {
                                            text: 'แผ่นที่ ' + (pageNum + 1) + '/' + pageMax,
                                            colSpan: 2,
                                            style: 'tableSelectC',
                                        },
                                        {text: ''},
                                    ],
                                ],
                            },
                            layout: 'noBorders',
                            // absolutePosition: {x: -30, y: 50},
                        },
                        // add new data Company //
                    ];

                    const row_dataCustomers = [
                        // data new Customers //
                        {
                            canvas: [
                                {
                                    type: 'rect',
                                    x: -10,
                                    y: 0,
                                    w: 380,
                                    h: 140,
                                    r: 10,
                                    lineColor: 'black',
                                },
                            ]
                        },
                        {
                            canvas: [
                                {
                                    type: 'rect',
                                    x: 398,
                                    y: -85,
                                    w: 120,
                                    h: 35,
                                    r: 10,
                                    lineColor: 'black',
                                },
                            ]
                        },
                        {
                            canvas: [
                                {
                                    type: 'rect',
                                    x: 398,
                                    y: -135,
                                    w: 120,
                                    h: 35,
                                    r: 10,
                                    lineColor: 'black',
                                },
                            ],
                        },
                        {
                            style: 'tableExample',
                            table: {
                                // widths: [30, '*', 100, 60, '*', 50, 40],
                                // widths: [25, 60, '*', 20, 60, 65, 40, 45],
                                // widths: ['*', '*', '*', '*', '*', '*', '*', '*'],
                                widths: [100, '*', '*', 5, 65, 65],
                                body: [
                                    [
                                        {
                                            text: 'รหัสลูกค้า : ',
                                            style: 'tableCompanyOff',
                                            bold: true,
                                        },
                                        {
                                            // image: 'rising_old_logo.png',
                                            // fit: [60, 60],
                                            // image: 'rising_logo_x45.png',
                                            // fit: [35, 35],
                                            // text: p.customer.orderCustomerCMId,
                                            text: orderCustomerCMId,
                                            colSpan: 2, style: 'tableCompanyOff',
                                        },
                                        {text: ''},
                                        {text: ''},
                                        {
                                            text: 'วันที่ \n' + dateNow,
                                            rowSpan: 2,
                                            colSpan: 2,
                                            style: 'tableSelectC'
                                        },
                                        {text: ''},
                                    ],
                                    [
                                        {
                                            text: 'นามลูกค้า : ',
                                            style: 'tableCompanyOff',
                                            bold: true,
                                        },
                                        {
                                            text: p.customer.orderCustomerNameSurname,
                                            colSpan: 2,
                                            style: 'tableCompanyOff',
                                        },
                                        {text: ''},
                                        {text: ''},
                                        {
                                            text: '',
                                            colSpan: 2,
                                            style: 'tableSelectC'
                                        },
                                        {text: ''},
                                    ],
                                    [
                                        {
                                            text: 'เลขประจำตัวผู้เสียภาษี ',
                                            style: 'tableCompanyOff',
                                            bold: true,
                                        },
                                        {
                                            text: '-',
                                            colSpan: 2,
                                            style: 'tableCompanyOff',
                                        },
                                        {text: ''},
                                        {text: ''},
                                        {
                                            text: '',
                                            colSpan: 2,
                                            style: 'tableSelectC',
                                        },
                                        {text: ''},
                                    ],
                                    [
                                        {
                                            text: 'ที่อยู่ : ',
                                            style: 'tableCompanyOff',
                                            bold: true,
                                        },
                                        {
                                            text: p.customer.orderCustomerIdhome + '\n'
                                            + p.customer.orderCustomerAddress + '\n'
                                            + 'รหัสไปรษณีย์ ' +  p.customer.orderCustomerZipcode,
                                            colSpan: 2,
                                            style: 'tableCompanyOff',
                                        },
                                        {text: ''},
                                        {text: ''},
                                        {
                                            text: 'เลขที่ใบเสร็จรับเงิน\n' + p.orderODId,
                                            rowSpan: 2,
                                            colSpan: 2,
                                            style: 'tableSelectC'},
                                        {text: ''},
                                    ],
                                    [
                                        {
                                            text: 'โทรศัพท์. ',
                                            style: 'tableCompanyOff',
                                            bold: true,
                                        },
                                        {
                                            text: p.customer.orderCustomerTel,
                                            colSpan: 2,
                                            style: 'tableCompanyOff',
                                        },
                                        {text: ''},
                                        {text: ''},
                                        {
                                            text: '',
                                            colSpan: 2,
                                            style: 'tableSelectC'
                                        },
                                        {text: ''},
                                    ],
                                ],
                            },
                            layout: 'noBorders',
                            absolutePosition: {x: 40, y: 173},
                        },
                        // {
                        //     canvas: [
                        //         {
                        //             type: 'rect',
                        //             x: -10,
                        //             y: -120,
                        //             w: 380,
                        //             h: 130,
                        //             r: 10,
                        //             lineColor: 'black',
                        //         },
                        //     ]
                        // },
                        // {
                        //     canvas: [
                        //         {
                        //             type: 'rect',
                        //             x: 398,
                        //             y: -73,
                        //             w: 120,
                        //             h: 35,
                        //             r: 10,
                        //             lineColor: 'black',
                        //         },
                        //     ]
                        // },
                        // {
                        //     canvas: [
                        //         {
                        //             type: 'rect',
                        //             x: 398,
                        //             y: -123,
                        //             w: 120,
                        //             h: 35,
                        //             r: 10,
                        //             lineColor: 'black',
                        //         },
                        //     ],
                        // },
                        // data new Customers //
                    ];

                    const row_dataProducts = [
                        {
                            style: 'tableExample',
                            table: {
                                // widths: [30, '*', 100, 60, '*', 50, 40],
                                widths: [25, 60, '*', 40, 65, 40, 50],
                                body: [
                                    [
                                        {text: 'ลำดับที่\nNo.', style: 'tableHeader'},
                                        {text: 'รหัส\n(SKU)', style: 'tableHeader'},
                                        {text: 'รายการ\nDescription', style: 'tableHeader'},
                                        {text: 'จำนวน\nQuanlity', style: 'tableHeader'},
                                        {text: 'ราคาต่อหน่วย\nPrice', style: 'tableHeader'},
                                        {text: 'ส่วนลด\nDiscount', style: 'tableHeader'},
                                        {text: 'ยอดรวม\nTotal', style: 'tableHeader'}
                                    ],
                                    [
                                        {text: productNo, style: 'tableBodyC', color: 'gray'},
                                        {text: productCode, style: 'tableBodyC', color: 'black'},
                                        {text: productName, style: 'tableBody', color: 'green'},
                                        {text: productAmount, style: 'tableBodyC'},
                                        {text: productPrice, style: 'tableBodyC'},
                                        {text: productDiscount, style: 'tableBodyC', color: 'gray'},
                                        {text: productTotal, style: 'tableBodyR', color: 'green'}
                                    ],
                                    [
                                        {text: 'หมายเหตุ :-', rowSpan: 5, colSpan: 4, style: 'tableBody', color: 'gray', aliqnment: 'left'},
                                        {},
                                        {},
                                        {},
                                        {text: 'ส่วนลด (บาท)', colSpan: 2, style: 'tableBody', color: 'gray'},
                                        {},
                                        {text: orderDiscount, style: 'tableBodyR', color: 'green'}
                                    ],
                                    [
                                        {},
                                        {},
                                        {},
                                        {},
                                        {text: 'ค่าขนส่ง (บาท)', colSpan: 2, style: 'tableBody', color: 'gray'},
                                        {},
                                        {text: deliveryPrice, style: 'tableBodyR', color: 'green'}
                                    ],
                                    [
                                        {},
                                        {},
                                        {},
                                        {},
                                        {text: 'รวมเงิน (บาท)', colSpan: 2, style: 'tableBody', color: 'gray'},
                                        {},
                                        {text: orderSumTotal, style: 'tableBodyR', color: 'green'}
                                    ],
                                    [
                                        {},
                                        {},
                                        {},
                                        {},
                                        {text: 'ภาษีมูลค่าเพิ่ม 7%(Vat 7%)', colSpan: 2, style: 'tableBody', color: 'gray'},
                                        {},
                                        {text: '0.00', style: 'tableBodyR', color: 'green'}
                                    ],
                                    [
                                        {},
                                        {},
                                        {},
                                        {},
                                        {text: 'จำนวนเงินรวมเงินทั้งหมด (บาท)', colSpan: 2, style: 'tableBody', color: 'gray'},
                                        {},
                                        {text: orderSumTotal, style: 'tableBodyR', color: 'navy'}
                                    ],
                                ]
                            },
                        },
                    ];

                    const row_dataSelectChannel = [
                        {
                            style: 'tableExample',
                            canvas: [
                                {
                                    type: 'rect',
                                    x: 40,
                                    y: 40,
                                    w: 10,
                                    h: 100,
                                    r: 0,
                                    lineColor: 'black',
                                },
                            ],
                            table: {
                                // widths: [30, '*', 100, 60, '*', 50, 40],
                                widths: [25, 60, '*', 20, 60, 65, 40, 45],
                                // widths: ['*', '*', '*', '*', '*', '*', '*'],
                                body: [
                                    [
                                        {text: 'รูปแบบการชำระเงิน ชำระเงินผ่านช่องทาง  ', rowSpan: 3, colSpan: 3, style: 'tableSelectR'},
                                        {text: ''},
                                        {text: ''},
                                        {
                                            image: 'img_checkbox_new.png',
                                            fit: [15, 15]
                                        },
                                        {text: 'ผ่านช่องทางธนาคาร ................................. ', colSpan: 4, style: 'tableSelect'},
                                        {text: ''},
                                        {text: ''},
                                        {text: ''}
                                    ],
                                    [
                                        {text: ''},
                                        {text: ''},
                                        {text: ''},
                                        {
                                            image: 'img_checkbox_new.png',
                                            fit: [15, 15]
                                        },
                                        {text: 'ผ่านบัตรเครดิต', colSpan: 4, style: 'tableSelect'},
                                        {text: ''},
                                        {text: ''},
                                        {text: ''}
                                    ],
                                    [
                                        {text: ''},
                                        {text: ''},
                                        {text: ''},
                                        {
                                            image: 'img_checkbox_new.png',
                                            fit: [15, 15]
                                        },
                                        {text: 'เงินสด', colSpan: 4, style: 'tableSelect'},
                                        {text: ''},
                                        {text: ''},
                                        {text: ''}
                                    ],
                                ]
                            },
                            layout: 'noBorders',
                            // absolutePosition: {x: -30, y: 50},
                        },
                    ];

                    const row_dataSiqnatures = [
                        {
                            style: 'tableExample',
                            table: {
                                widths: ['*', '*'],
                                // widths: [210],
                                // heights: [20, 30, 20],
                                body:
                                    [
                                        [
                                            {
                                                text: 'ผู้รับเงิน',
                                                font: 'Sarabun',
                                                bold: true,
                                                fontSize: 12,
                                                alignment: 'center',
                                                border: [false, false, false, false],
                                                margin: [0, 0, 0, 0]
                                            },
                                            {
                                                text: 'ผู้อนุมัติ',
                                                font: 'Sarabun',
                                                fontSize: 12,
                                                bold: true,
                                                border: [false, false, false, false],
                                                margin: [0, 0, 0, 0],
                                                alignment: 'center',
                                            },
                                        ],
                                        [
                                            {
                                                text: '................................................................',
                                                font: 'Sarabun',
                                                fontSize: 10,
                                                alignment: 'center',
                                                border: [false, false, false, false],
                                                margin: [0, 0, 0, 0]
                                            },
                                            {
                                                text: '................................................................',
                                                font: 'Sarabun',
                                                fontSize: 10,
                                                bold: false,
                                                border: [false, false, false, false],
                                                margin: [0, 0, 0, 0],
                                                alignment: 'center',
                                            },
                                        ],
                                        [
                                            {
                                                text: '(................................................................)',
                                                font: 'Sarabun',
                                                fontSize: 10,
                                                alignment: 'center',
                                                border: [false, false, false, false],
                                                margin: [0, 0, 0, 0]
                                            },
                                            {
                                                text: '(................................................................)',
                                                font: 'Sarabun',
                                                fontSize: 10,
                                                bold: false,
                                                border: [false, false, false, false],
                                                margin: [0, 0, 0, 0],
                                                alignment: 'center',
                                            },
                                        ],
                                        [
                                            {
                                                text: 'วันที่ ........... / ........... / ........... ',
                                                font: 'Sarabun',
                                                fontSize: 10,
                                                alignment: 'center',
                                                border: [false, false, false, false],
                                                margin: [0, 0, 0, 0]
                                            },
                                            {
                                                text: 'วันที่ ........... / ........... / ........... ',
                                                font: 'Sarabun',
                                                fontSize: 10,
                                                bold: false,
                                                border: [false, false, false, false],
                                                margin: [0, 0, 0, 0],
                                                alignment: 'center',
                                            },
                                        ]
                                    ]
                            },
                            layout: 'headerLineOnly',
                            // absolutePosition: {x: 35, y: 480}
                        },
                        {
                            canvas: [
                                {
                                    type: 'rect',
                                    x: 20,
                                    y: -80,
                                    w: 220,
                                    h: 100,
                                    r: 10,
                                    lineColor: 'black',
                                },
                            ]
                        },
                        {
                            canvas: [
                                {
                                    type: 'rect',
                                    x: 288,
                                    y: -100,
                                    w: 220,
                                    h: 100,
                                    r: 10,
                                    lineColor: 'black',
                                },
                            ]
                        },
                    ];

                    const row_cont =
                        [
                            {
                                alignment: 'justify',
                                layout: 'lightHorizontalLines', // optional
                                table: {
                                    // headers are automatically repeated if the table spans over multiple pages
                                    // you can declare how many rows should be treated as headers
                                    headerRows: 1,
                                    // headerRows: 1,
                                    // widths: [ '*', 'auto', 100, '*' ],
                                    // widths: [ '*', 'auto'],
                                    body: [
                                        // [ 'First', 'Second', 'Third', 'The last one' ],
                                        // [ 'Value 1', 'Value 2', 'Value 3', 'Value 4' ],
                                        // [
                                        //   {text: 'Bold 1234', normal: true, style: 'barcodeCode128' },
                                        //   {text: aaa, style: 'header'}, {text: bbb, font: 'Sarabun'},
                                        // {text: ccc, style: 'header', bold: true, pageBreak: 'after'},
                                        {text: ccc, style: 'header'},
                                        // ]
                                    ]
                                }
                            },
                            row_dataHeadlines,
                            row_dataCompanyOrders,
                            {
                                text: '\n',
                                font: 'Sarabun',
                                fontSize: 10,
                            },
                            {
                                text: '\n',
                                font: 'Sarabun',
                                fontSize: 10,
                            },
                            {
                                text: '',
                                font: 'Sarabun',
                                fontSize: 10,
                            },
                            row_dataCustomers,
                            {
                                text: '\n',
                                font: 'Sarabun',
                                fontSize: 10,
                            },
                            {
                                text: '\n',
                                font: 'Sarabun',
                                fontSize: 10,
                            },
                            row_dataProducts,
                            {
                                text: '\n',
                                font: 'Sarabun',
                                fontSize: 10,
                            },
                            row_dataSelectChannel,
                            {
                                text: '\n',
                                font: 'Sarabun',
                                fontSize: 10,
                            },
                            {
                                text: '\n',
                                font: 'Sarabun',
                                fontSize: 10,
                            },
                            row_dataSiqnatures,
                            {
                                text: ccc,
                                style: 'header',
                                pageBreak: textPage
                            }
                            // '\n',
                            // {text: ccc, style: 'header',  'after'}
                        ];

                    contents.push(row_cont);
                });
                // End selected forEach //

                const dataGen = {
                    pageSize: pageSizeset,
                    // pageSize: {
                    //   width: 210,
                    //   height: 298
                    // },
                    // pageOrientation: 'landscape',
                    // pageOrientation: 'portal',
                    pageOrientation: pageOrientationset,
                    pageMargins: [35, 15, 35, 15],
                    content: [contents],
                    styles: {
                        header: {
                            font: 'Sarabun',
                            fontSize: 12,
                            alignment: 'justify'
                        },
                        barcodeCode128: {
                            font: 'Code128',
                            fontSize: 50,
                            normal: true,
                            alignment: 'justify'
                        },
                        barcodeEan13: {
                            font: 'Ean13',
                            fontSize: 50,
                            height: 10,
                            normal: true,
                            alignment: 'justify'
                        },
                        Fre3of9x: {
                            font: 'Fre3of9x',
                            fontSize: 50,
                            height: 10,
                            normal: true,
                            alignment: 'justify'
                        },
                        Free3of9: {
                            font: 'Free3of9',
                            fontSize: 40,
                            height: 10,
                            normal: true,
                            alignment: 'justify'
                        },
                        textbarcode: {
                            font: 'Sarabun',
                            fontSize: 12,
                            alignment: 'justify'
                        },
                        spit2left: {
                            alignment: 'left'
                        },
                        spit2right: {
                            alignment: 'right'
                        },
                        tableExample: {
                            margin: [0, 0, 0, 0]
                        },
                        tableExampleRirht: {
                            alignment: 'right',
                            margin: [0, 0, 0, 0]
                        },
                        tableHeader: {
                            bold: true,
                            font: 'Sarabun',
                            fontSize: 8,
                            alignment: 'center',
                            color: 'black'
                        },
                        tableBody: {
                            bold: true,
                            font: 'Sarabun',
                            fontSize: 8,
                            alignment: 'left',
                            color: 'black'
                        },
                        tableBodyC: {
                            bold: true,
                            font: 'Sarabun',
                            fontSize: 8,
                            alignment: 'center',
                            color: 'black'
                        },
                        tableBodyR: {
                            bold: true,
                            font: 'Sarabun',
                            fontSize: 8,
                            alignment: 'right',
                            color: 'black'
                        },
                        tableSelect: {
                            bold: false,
                            font: 'Sarabun',
                            fontSize: 10,
                            alignment: 'left',
                            color: 'black'
                        },
                        tableSelectC: {
                            bold: false,
                            font: 'Sarabun',
                            fontSize: 10,
                            alignment: 'center',
                            color: 'black'
                        },
                        tableSelectR: {
                            bold: false,
                            font: 'Sarabun',
                            fontSize: 12,
                            alignment: 'right',
                            color: 'black'
                        },
                        tableCompanyOff: {
                            bold: false,
                            font: 'Sarabun',
                            fontSize: 10,
                            alignment: 'left',
                            color: 'black',
                            margin: [-5, 0, 0, 0]
                        },
                        tableCompany: {
                            layout: 'headerLineOnly',
                            absolutePosition: {x: 45, y: 350}
                        }
                    },
                    defaultStyle: {
                        // columnGap: 10
                    },
                };

                // const pdfData = pdfMake.createPdf(dataGen).download('(' + itemsCount + ')barcode_' + nameDownload + '.pdf');
                // pdfMake.createPdf(dataGen).print(pdfData);
                pdfMake.createPdf(dataGen).print();
                this.selected = [];

            }
        }

    }
    // End print pdfMake //

    exportKerryToExcel(selected) {
        // const selectedOrders = this.orders.filter(o => o.selected);
        this.xlsxService.exportExcelKerry(selected);
    }

    exportOrdersAllToExcel(selected) {
        // const selectedOrders = this.orders.filter(o => o.selected);
        // console.log('channel = ' + JSON.stringify(this.channels));
        // console.log('shipment = ' + JSON.stringify(this.shipments));
        this.xlsxService.exportExcelOrdersAll(selected, this.channels, this.shipments);
    }

    exportSelectedToCSV(selected) {
        // const selectedOrders = this.orders.filter(o => o.selected);
        return this.alertWarning('อยู่ระหว่างการจัดทำ...');
        // this.xlsxService.exportCSV(selected);
    }
}
