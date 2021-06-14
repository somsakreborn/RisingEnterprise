import {Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {environment as env} from '../../../../environments/environment';
import {IOption} from 'ng-select';
import {NgOption} from '@ng-select/ng-select';
import {Subscription} from 'rxjs';
import {SelectOptionService} from '../../../shared/elements/select-option.service';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/first';
import * as _ from 'lodash';

// import customer data API //
import {CustomersService} from '../../customers/customers.service';
import {Customer} from '../../customers/customers.interface';

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
// import order data API //
import {Order} from '../../orders/orders.interface';
import {OrdersService} from '../../orders/orders.service';
// import counter data API //
import {Counter} from '../../products/counter.interface';
import {CounterService} from '../../products/counter.service';

// declare var $: any;
declare const $;

import '../../../../assets/jquery.ddslick.min';
import Swal from 'sweetalert2';
import {debounceTime, distinctUntilChanged, map, retry} from 'rxjs/operators';
import {TypeaheadMatch} from 'ngx-bootstrap/typeahead/typeahead-match.class';
import * as JSZip from 'jszip';

import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';

// const statesWithFlags: {name: string, flag: string}[] = [
//     {'name': 'Alabama', 'flag': '5/5c/Flag_of_Alabama.svg/45px-Flag_of_Alabama.svg.png'},
//     {'name': 'Alaska', 'flag': 'e/e6/Flag_of_Alaska.svg/43px-Flag_of_Alaska.svg.png'},
//     {'name': 'Arizona', 'flag': '9/9d/Flag_of_Arizona.svg/45px-Flag_of_Arizona.svg.png'},
//     {'name': 'Arkansas', 'flag': '9/9d/Flag_of_Arkansas.svg/45px-Flag_of_Arkansas.svg.png'},
//     {'name': 'California', 'flag': '0/01/Flag_of_California.svg/45px-Flag_of_California.svg.png'},
//     {'name': 'Colorado', 'flag': '4/46/Flag_of_Colorado.svg/45px-Flag_of_Colorado.svg.png'},
//     {'name': 'Connecticut', 'flag': '9/96/Flag_of_Connecticut.svg/39px-Flag_of_Connecticut.svg.png'},
//     {'name': 'Delaware', 'flag': 'c/c6/Flag_of_Delaware.svg/45px-Flag_of_Delaware.svg.png'},
//     {'name': 'Florida', 'flag': 'f/f7/Flag_of_Florida.svg/45px-Flag_of_Florida.svg.png'},
//     {
//         'name': 'Georgia',
//         'flag': '5/54/Flag_of_Georgia_%28U.S._state%29.svg/46px-Flag_of_Georgia_%28U.S._state%29.svg.png'
//     },
//     {'name': 'Hawaii', 'flag': 'e/ef/Flag_of_Hawaii.svg/46px-Flag_of_Hawaii.svg.png'},
//     {'name': 'Idaho', 'flag': 'a/a4/Flag_of_Idaho.svg/38px-Flag_of_Idaho.svg.png'},
//     {'name': 'Illinois', 'flag': '0/01/Flag_of_Illinois.svg/46px-Flag_of_Illinois.svg.png'},
//     {'name': 'Indiana', 'flag': 'a/ac/Flag_of_Indiana.svg/45px-Flag_of_Indiana.svg.png'},
//     {'name': 'Iowa', 'flag': 'a/aa/Flag_of_Iowa.svg/44px-Flag_of_Iowa.svg.png'},
//     {'name': 'Kansas', 'flag': 'd/da/Flag_of_Kansas.svg/46px-Flag_of_Kansas.svg.png'},
//     {'name': 'Kentucky', 'flag': '8/8d/Flag_of_Kentucky.svg/46px-Flag_of_Kentucky.svg.png'},
//     {'name': 'Louisiana', 'flag': 'e/e0/Flag_of_Louisiana.svg/46px-Flag_of_Louisiana.svg.png'},
//     {'name': 'Maine', 'flag': '3/35/Flag_of_Maine.svg/45px-Flag_of_Maine.svg.png'},
//     {'name': 'Maryland', 'flag': 'a/a0/Flag_of_Maryland.svg/45px-Flag_of_Maryland.svg.png'},
//     {'name': 'Massachusetts', 'flag': 'f/f2/Flag_of_Massachusetts.svg/46px-Flag_of_Massachusetts.svg.png'},
//     {'name': 'Michigan', 'flag': 'b/b5/Flag_of_Michigan.svg/45px-Flag_of_Michigan.svg.png'},
//     {'name': 'Minnesota', 'flag': 'b/b9/Flag_of_Minnesota.svg/46px-Flag_of_Minnesota.svg.png'},
//     {'name': 'Mississippi', 'flag': '4/42/Flag_of_Mississippi.svg/45px-Flag_of_Mississippi.svg.png'},
//     {'name': 'Missouri', 'flag': '5/5a/Flag_of_Missouri.svg/46px-Flag_of_Missouri.svg.png'},
//     {'name': 'Montana', 'flag': 'c/cb/Flag_of_Montana.svg/45px-Flag_of_Montana.svg.png'},
//     {'name': 'Nebraska', 'flag': '4/4d/Flag_of_Nebraska.svg/46px-Flag_of_Nebraska.svg.png'},
//     {'name': 'Nevada', 'flag': 'f/f1/Flag_of_Nevada.svg/45px-Flag_of_Nevada.svg.png'},
//     {'name': 'New Hampshire', 'flag': '2/28/Flag_of_New_Hampshire.svg/45px-Flag_of_New_Hampshire.svg.png'},
//     {'name': 'New Jersey', 'flag': '9/92/Flag_of_New_Jersey.svg/45px-Flag_of_New_Jersey.svg.png'},
//     {'name': 'New Mexico', 'flag': 'c/c3/Flag_of_New_Mexico.svg/45px-Flag_of_New_Mexico.svg.png'},
//     {'name': 'New York', 'flag': '1/1a/Flag_of_New_York.svg/46px-Flag_of_New_York.svg.png'},
//     {'name': 'North Carolina', 'flag': 'b/bb/Flag_of_North_Carolina.svg/45px-Flag_of_North_Carolina.svg.png'},
//     {'name': 'North Dakota', 'flag': 'e/ee/Flag_of_North_Dakota.svg/38px-Flag_of_North_Dakota.svg.png'},
//     {'name': 'Ohio', 'flag': '4/4c/Flag_of_Ohio.svg/46px-Flag_of_Ohio.svg.png'},
//     {'name': 'Oklahoma', 'flag': '6/6e/Flag_of_Oklahoma.svg/45px-Flag_of_Oklahoma.svg.png'},
//     {'name': 'Oregon', 'flag': 'b/b9/Flag_of_Oregon.svg/46px-Flag_of_Oregon.svg.png'},
//     {'name': 'Pennsylvania', 'flag': 'f/f7/Flag_of_Pennsylvania.svg/45px-Flag_of_Pennsylvania.svg.png'},
//     {'name': 'Rhode Island', 'flag': 'f/f3/Flag_of_Rhode_Island.svg/32px-Flag_of_Rhode_Island.svg.png'},
//     {'name': 'South Carolina', 'flag': '6/69/Flag_of_South_Carolina.svg/45px-Flag_of_South_Carolina.svg.png'},
//     {'name': 'South Dakota', 'flag': '1/1a/Flag_of_South_Dakota.svg/46px-Flag_of_South_Dakota.svg.png'},
//     {'name': 'Tennessee', 'flag': '9/9e/Flag_of_Tennessee.svg/46px-Flag_of_Tennessee.svg.png'},
//     {'name': 'Texas', 'flag': 'f/f7/Flag_of_Texas.svg/45px-Flag_of_Texas.svg.png'},
//     {'name': 'Utah', 'flag': 'f/f6/Flag_of_Utah.svg/45px-Flag_of_Utah.svg.png'},
//     {'name': 'Vermont', 'flag': '4/49/Flag_of_Vermont.svg/46px-Flag_of_Vermont.svg.png'},
//     {'name': 'Virginia', 'flag': '4/47/Flag_of_Virginia.svg/44px-Flag_of_Virginia.svg.png'},
//     {'name': 'Washington', 'flag': '5/54/Flag_of_Washington.svg/46px-Flag_of_Washington.svg.png'},
//     {'name': 'West Virginia', 'flag': '2/22/Flag_of_West_Virginia.svg/46px-Flag_of_West_Virginia.svg.png'},
//     {'name': 'Wisconsin', 'flag': '2/22/Flag_of_Wisconsin.svg/45px-Flag_of_Wisconsin.svg.png'},
//     {'name': 'Wyoming', 'flag': 'b/bc/Flag_of_Wyoming.svg/43px-Flag_of_Wyoming.svg.png'}
// ];

// const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
//     'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
//     'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
//     'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
//     'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
//     'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
//     'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
//     'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

// const states1 = [
//     {
//         'customerStatus': true,'_id': '5bc9c86edfc7763a7c349934','customerNameSurname': 'dasdasdg',
//         'customerSocial': 'sdgsadggsdh','customerTel': '4534534534','customerEmail': 'sadasdg@adga',
//         'customerIdcard': '4334634734734','customerAddress': 'ergdsfgdshdj dshj sfhsdd dsfhds',
//         'customerZipcode': '21312','customerCMId': 'CM00000006','customerChannelId': 15,
//          'customerLastupdate': '2018-10-19T12: 05: 02.839Z',
//         'customerCreated': '2018-10-19T12: 05: 02.839Z','customerId': 6,'__v': 0
//     },
//     {
//         'customerStatus': true,'_id': '5bc597e07338b05be0a8b12e',
//         'customerNameSurname': 'สมศักดิ์ พิทักษ์ศิลาธร','customerSocial': 'somsak','customerTel': '0868954403',
//         'customerEmail': 'somsak.phithaksilathorn@gmail.com','customerIdcard': '3200500123456',
//         'customerAddress': '35 หมู่ 1 ต.หนองหงษ์ อ.พานทอง จ.ชลบุรี','customerZipcode': '20160','customerCMId': 'CM00000005',
//         'customerChannelId': 12,'customerLastupdate': '2018-10-16T07: 48: 48.045Z','customerCreated': '2018-10-16T07: 48: 48.045Z',
//         'customerId': 5,'__v': 0
//     },
//     {
//         'customerStatus': true,'_id': '5bc572340fe1e857701ed1a5','customerNameSurname': '454544545454545',
//         'customerSocial': '454544545454545','customerTel': '4545445454','customerEmail': '454544545454545',
//         'customerIdcard': '4545445454545','customerAddress': '454544545454545','customerZipcode': '45454','customerCMId': 'CM00000003',
//         'customerChannelId': 15,'customerLastupdate': '2018-10-16T05: 08: 04.101Z','customerCreated': '2018-10-16T05: 08: 04.101Z',
//         'customerId': 3,'__v': 0
//     },
//     {
//         'customerStatus': true,'_id': '5bc56fab0fe1e857701ed1a4','customerNameSurname': '999998888',
//         'customerSocial': '999998888','customerTel': '999998888','customerEmail': '999998888','customerIdcard': '9999988885546',
//         'customerAddress': '999998888','customerZipcode': '99999','customerCMId': 'CM00000002','customerChannelId': 11,
//         'customerLastupdate': '2018-10-16T04: 57: 15.255Z','customerCreated': '2018-10-16T04: 57: 15.255Z','customerId': 2,'__v': 0
//     },
//     {
//         'customerStatus': true,'_id': '5bc56f660fe1e857701ed1a3','customerNameSurname': '123456789','customerSocial': '123456789',
//         'customerTel': '123456789','customerEmail': '123456789','customerIdcard': '123456789','customerAddress': '123456789',
//         'customerZipcode': '12345','customerCMId': 'CM00000001','customerChannelId': 14,
//          'customerLastupdate': '2018-10-16T04: 56: 06.714Z',
//         'customerCreated': '2018-10-16T04: 56: 06.714Z','customerId': 1,'__v':0
//     }
//     ];

const states22: {
    district: string, amphoe: string,
    province: string, zipcode: number,
    district_code: number, amphoe_code: number,
    province_code: number
}[] = [
    {
        'district': 'คลองท่อมเหนือ',
        'amphoe': 'คลองท่อม',
        'province': 'กระบี่',
        'zipcode': 81120,
        'district_code': 810402,
        'amphoe_code': 8104,
        'province_code': 81
    },
    {
        'district': 'คลองท่อมใต้',
        'amphoe': 'คลองท่อม',
        'province': 'กระบี่',
        'zipcode': 81120,
        'district_code': 810401,
        'amphoe_code': 8104,
        'province_code': 81
    },
    {
        'district': 'คลองพน',
        'amphoe': 'คลองท่อม',
        'province': 'กระบี่',
        'zipcode': 81170,
        'district_code': 810403,
        'amphoe_code': 8104,
        'province_code': 81
    },
    {
        'district': 'ทรายขาว',
        'amphoe': 'คลองท่อม',
        'province': 'กระบี่',
        'zipcode': 81170,
        'district_code': 810404,
        'amphoe_code': 8104,
        'province_code': 81
    },
    {
        'district': 'พรุดินนา',
        'amphoe': 'คลองท่อม',
        'province': 'กระบี่',
        'zipcode': 81120,
        'district_code': 810406,
        'amphoe_code': 8104,
        'province_code': 81
    },
    {
        'district': 'ห้วยน้ำขาว',
        'amphoe': 'คลองท่อม',
        'province': 'กระบี่',
        'zipcode': 81120,
        'district_code': 810405,
        'amphoe_code': 8104,
        'province_code': 81
    },
    {
        'district': 'เพหลา',
        'amphoe': 'คลองท่อม',
        'province': 'กระบี่',
        'zipcode': 81120,
        'district_code': 810407,
        'amphoe_code': 8104,
        'province_code': 81
    },
    {
        'district': 'คีรีวง',
        'amphoe': 'ปลายพระยา',
        'province': 'กระบี่',
        'zipcode': 81160,
        'district_code': 810604,
        'amphoe_code': 8106,
        'province_code': 81
    },
    {
        'district': 'ปลายพระยา',
        'amphoe': 'ปลายพระยา',
        'province': 'กระบี่',
        'zipcode': 81160,
        'district_code': 810599,
        'amphoe_code': 8106,
        'province_code': 81
    },
    {
        'district': 'เขาต่อ',
        'amphoe': 'ปลายพระยา',
        'province': 'กระบี่',
        'zipcode': 81160,
        'district_code': 810598,
        'amphoe_code': 8106,
        'province_code': 81
    },
    {
        'district': 'เขาเขน',
        'amphoe': 'ปลายพระยา',
        'province': 'กระบี่',
        'zipcode': 81160,
        'district_code': 810597,
        'amphoe_code': 8106,
        'province_code': 81
    },
    {
        'district': 'ดินอุดม',
        'amphoe': 'ลำทับ',
        'province': 'กระบี่',
        'zipcode': 81190,
        'district_code': 810702,
        'amphoe_code': 8107,
        'province_code': 81
    },
    {
        'district': 'ดินแดง',
        'amphoe': 'ลำทับ',
        'province': 'กระบี่',
        'zipcode': 81190,
        'district_code': 810704,
        'amphoe_code': 8107,
        'province_code': 81
    }
];


@Component({
    selector: 'app-orders-product-create',
    templateUrl: './orders-product-create.component.html',
    styleUrls: [
        './orders-product-create.component.scss',
        '../../../../assets/icon/icofont/css/icofont.scss',
        '../../../../../node_modules/famfamfam-flags/dist/sprite/famfamfam-flags.min.css'
    ]
})
export class OrdersProductCreateComponent implements OnInit, OnDestroy {
    // add data test //
    @Input() orderProducts = [];
    // @Input() trackingNumber = '';
    @Input() disabled = false;
    // @Input() isUpdate = false;

    // @Input() customerForm = new FormGroup();
    @Input() orderForm: FormGroup;
    @Input() customerForm: FormGroup;
    @Input() paymentForm: FormGroup;
    @Input() deliveryForm: FormGroup;
    @Input() OrderCreateForm: FormGroup;
    @Input() ngForm: FormGroup;

    @Output() changedFile = new EventEmitter();
    @Output() submittedOrder = new EventEmitter();
    @Output() resetForm = new EventEmitter();
    // public maskUsAmount = createNumberMask({
    //     prefix: ''
    // });

    // public emailMask = [/[0-9,A-z]/, /\d/, /\d/];
    public maskUsbank = [/[0-9]/, /\d/, /\d/, '-', /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/];
    public maskUsTime = [/[0-2]/, /[0-9]/, ':', /[0-5]/, /\d/];
    public maskUsMobile = [/[0-2]/, /[0-9]/, /[0-9]/, /\d/];

    // public maskUsPrice = [/[0-9]/, /[0-9]/, /[0-9]/, /\d/];

    // address2: string;
    // zipcode: any;
    // customerForm: FormGroup;
    searchProducts: any;
    // OrderForm: FormGroup;
    // submitted: boolean;
    submitted = false;

    selectedValue: string;
    selectedOption: any;
    states: any[] = [
        {id: 1, name: 'Alabama', region: 'South'},
        {id: 2, name: 'Alaska', region: 'West'},
        {id: 3, name: 'Arizona', region: 'West'},
        {id: 4, name: 'Arkansas', region: 'South'},
        {id: 5, name: 'California', region: 'West'},
        {id: 6, name: 'Colorado', region: 'West'},
        {id: 7, name: 'Connecticut', region: 'Northeast'},
        {id: 8, name: 'Delaware', region: 'South'},
        {id: 9, name: 'Florida', region: 'South'},
        {id: 10, name: 'Georgia', region: 'South'},
        {id: 11, name: 'Hawaii', region: 'West'},
        {id: 12, name: 'Idaho', region: 'West'},
        {id: 13, name: 'Illinois', region: 'Midwest'},
        {id: 14, name: 'Indiana', region: 'Midwest'},
        {id: 15, name: 'Iowa', region: 'Midwest'},
        {id: 16, name: 'Kansas', region: 'Midwest'},
        {id: 17, name: 'Kentucky', region: 'South'},
        {id: 18, name: 'Louisiana', region: 'South'},
        {id: 19, name: 'Maine', region: 'Northeast'},
        {id: 21, name: 'Maryland', region: 'South'},
        {id: 22, name: 'Massachusetts', region: 'Northeast'},
        {id: 23, name: 'Michigan', region: 'Midwest'},
        {id: 24, name: 'Minnesota', region: 'Midwest'},
        {id: 25, name: 'Mississippi', region: 'South'},
        {id: 26, name: 'Missouri', region: 'Midwest'},
        {id: 27, name: 'Montana', region: 'West'},
        {id: 28, name: 'Nebraska', region: 'Midwest'},
        {id: 29, name: 'Nevada', region: 'West'},
        {id: 30, name: 'New Hampshire', region: 'Northeast'},
        {id: 31, name: 'New Jersey', region: 'Northeast'},
        {id: 32, name: 'New Mexico', region: 'West'},
        {id: 33, name: 'New York', region: 'Northeast'},
        {id: 34, name: 'North Dakota', region: 'Midwest'},
        {id: 35, name: 'North Carolina', region: 'South'},
        {id: 36, name: 'Ohio', region: 'Midwest'},
        {id: 37, name: 'Oklahoma', region: 'South'},
        {id: 38, name: 'Oregon', region: 'West'},
        {id: 39, name: 'Pennsylvania', region: 'Northeast'},
        {id: 40, name: 'Rhode Island', region: 'Northeast'},
        {id: 41, name: 'South Carolina', region: 'South'},
        {id: 42, name: 'South Dakota', region: 'Midwest'},
        {id: 43, name: 'Tennessee', region: 'South'},
        {id: 44, name: 'Texas', region: 'South'},
        {id: 45, name: 'Utah', region: 'West'},
        {id: 46, name: 'Vermont', region: 'Northeast'},
        {id: 47, name: 'Virginia', region: 'South'},
        {id: 48, name: 'Washington', region: 'South'},
        {id: 49, name: 'West Virginia', region: 'South'},
        {id: 50, name: 'Wisconsin', region: 'Midwest'},
        {id: 51, name: 'Wyoming', region: 'West'}
    ];

    // public model: any;
    public model2: any;
    public modelCustomers: any;
    public modelProvince: any;

    xxx: number;
    sub: Subscription = null;
    fileToUpload: File = null;
    imageUrl = env.serverAPI + '/images/image-blank.jpg';
    imageUrlBlank = env.serverAPI + '/images/image-blank.jpg';
    imageUrlProduct = env.serverAPI + '/images/image-blank.jpg';
    customer: Customer = {} as Customer;
    customers: Customer[] = [] as Customer[];
    channel: Channel = {} as Channel;
    channels: Channel[] = [] as Channel[];
    shipment: Shipment = {} as Shipment;
    shipments: Shipment[] = [] as Shipment[];
    product: Product = {} as Product;
    products: Product[] = [] as Product[];
    bank: Bank = {} as Bank;
    banks: Bank[] = [] as Bank[];
    order: Order = {} as Order;
    dataOrder: Order = {} as Order;
    orders: Order[] = [] as Order[];

    paymentDate: any;
    orderPaymentDate: any;
    orderPaymentTime: any;
    orderPaymentImage: any;
    method: 'cod';

    // test str replace //
    CTId: any;
    // rex: number;
    CId: number;
    Chan: any;
    customerId_New: number;
    customerCMId_New: string;
    customerId: number;
    customerCMId: string;
    // counter: Counter;
    counterCTId: Counter = {} as Counter;
    // test str replace //
    // test str replace //
    ODId: any;
    rex: number;
    seqOrderId: any;
    seqCounterId: any;
    orderODId: string;
    // counter: Counter;
    counterODId: Counter = {} as Counter;
    // test str replace //

    // search = (text$: Observable<string>) =>
    //     text$.pipe(
    //         debounceTime(200),
    //         distinctUntilChanged(),
    //         map(term => term.length < 2 ? []
    //             : this.customers.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    //             // : states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    //     )

    searchCustomer = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term => term.length < 1 ? []
                : this.customers
                // .filter(v => v.customerTel.indexOf(term.toLowerCase()) > -1).slice(0, 20))
                    .filter(v => {
                        return (v.customerTel.toLowerCase().indexOf(term) !== -1 || !term
                            || v.customerNameSurname.toLowerCase().indexOf(term) !== -1 || !term);
                    })
            )
        );

    // formatterCustomer = (x: {customerNameSurname: string}) => x.customerNameSurname;
    formatterCustomerNameSurname = (x: { customerNameSurname: string }) => x.customerNameSurname;
    formatterCustomerId = (x: { customerId: number }) => x.customerId;
    formatterCustomerCMId = (x: { customerCMId: string }) => x.customerCMId;
    // formatterCustomerIdhome = (x: { customerIdhome: string }) => x.customerIdhome;
    // formatterCustomerAddress = (x: {customerAddress: string}) => x.customerAddress;
    // formatterCustomerZipcode = (x: {customerZipcode: string}) => x.customerZipcode;

    searchSocial = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term => term.length < 1 ? []
                : this.customers.filter(v => v.customerSocial.indexOf(term) > -1).slice(0, 15))
        );
    // : states1
    // .filter(v => v.customerNameSurname.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    //     .filter(v => v.customerNameSurname.indexOf(term) > -1).slice(0, 10))
    //     .filter(v => v.customerNameSurname.indexOf(term) > -1).slice(0, 10))
    //     .filter(v => v.customerNameSurname.indexOf(term) > -1).slice(0, 10))
    //     .filter(v => v.customerNameSurname.indexOf(term) > -1).slice(0, 15))

    formatterSocial = (x: { customerSocial: string }) => x.customerSocial;

    searchTel = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term => term.length < 1 ? []
                : this.customers.filter(v => v.customerTel.indexOf(term) > -1).slice(0, 15))
        );

    formatterTel = (x: { customerTel: string }) => x.customerTel;

    searchIdhome = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term => term.length < 1 ? []
                : this.customers.filter(v => v.customerIdhome.indexOf(term) > -1).slice(0, 15))
        );

    formatterIdhome = (x: { customerIdhome: string }) => x.customerIdhome;


    // searchCC = (text$: Observable<string>) =>
    //     text$.pipe(
    //         debounceTime(200),
    //         map(term => term === '' ? []
    //             : this.customers.filter(v => v.customerNameSurname.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    //     )
    //
    // // formatterCC = (x: Customer) => this.customer.customerCMId = x.customerCMId;
    // formatterCC = (x: Customer) => x.customerNameSurname;


    // search = (text$: Observable<string>) =>
    //     text$.pipe(
    //         debounceTime(200),
    //         map(term => term === '' ? []
    //             : statesWithFlags.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    //     )
    //
    // formatter = (x: {name: string}) => x.name;

    searchx = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(200),
            map(term => term === '' ? []
                : states22.filter(v => v.district.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
        )

    formatterx = (x: {
        district: string, amphoe: string,
        province: string, zipcode: number,
        district_code: number, amphoe_code: number,
        province_code: number
    }) => x.district + '>' + x.amphoe + '>' + x.zipcode;
    formatterXX = (x: { amphoe: string }) => x.amphoe;

    // searchCustomer = (text$: Observable<string>) =>
    //     text$.pipe(
    //         debounceTime(200),
    //         distinctUntilChanged(),
    //         map(term => term.length < 2 ? []
    //             : this.customers
    //             // : states1
    //             // .filter(v => v.customerNameSurname.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    //             //     .filter(v => v.customerNameSurname.indexOf(term) > -1).slice(0, 10))
    //             //     .filter(v => v.customerNameSurname.indexOf(term) > -1).slice(0, 10))
    //             //     .filter(v => v.customerNameSurname.indexOf(term) > -1).slice(0, 10))
    //                 .filter(v => v.customerNameSurname.indexOf(term) > -1).slice(0, 10))
    //     )

    // searchProvince = (text$: Observable<string>) =>
    //     text$.pipe(
    //         debounceTime(200),
    //         distinctUntilChanged(),
    //         map(term => term.length < 2 ? []
    //             // : this.customers
    //             : this.states222
    //             .filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 20))
    //             // : states22.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    //             //     .filter(v => v.customerNameSurname.indexOf(term) > -1).slice(0, 10))
    //             //     .filter(v => v.customerNameSurname.indexOf(term) > -1).slice(0, 10))
    //             //     .filter(v => v.customerNameSurname.indexOf(term) > -1).slice(0, 10))
    //             //     .filter(v => v.district.indexOf(term) > -1).slice(0, 10))
    //
    //
    //     )
    //         // .subscribe((res) => {
    //         //     this.modelProvince = res;
    //         // })
    //
    // formatterProvince = (x: {district: string}) => x.district;

    // const data1: string = [];
    // simpleOption: Array<IOption> = this.selectOptionService.getCharacters();
    // selectedOption = '3';
    // isDisabled = true;
    // characters: Array<IOption>;
    //   characters: Array<IOption> = this.selectOptionService.getCharacters();
    // channelData: Array<IOption> = this.fetchChannel();
    msg: string;
    myOptionData = 'LU';
    myOptions: Array<IOption> = [
        {label: 'Belgium', value: 'BE'},
        {label: 'Luxembourg', value: 'LU'},
        {label: 'Netherlands', value: 'NL'}
    ];
    selectedCharacter = '3';
    timeLeft = 5;

    public model: any;
    today: number = Date.now();
    modelPopup: NgbDateStruct = {} as NgbDateStruct;
    modelTime: NgbTimeStruct = {} as NgbTimeStruct;

    // public date: { year: number, month: number, day: number };
    // public time: { hour: number, minute: number};
    // meridian = true;

    isSelected = true;
    saving = false;
    // tab = 'order';

    selectedFile = null;
    showImg = '';

    ID: number;
    Name: string;
    Image: string;
    checkRole: string;


    private dataSub: Subscription = null;

    // selectedCountries: Array<string> = ['IN', 'BE', 'LU', 'NL'];
    selectedCountries: Array<string> = ['TH', 'US'];
    countries: Array<IOption> = this.selectOptionService.getCountries();
    selectedCountry = 'TH';
    defualtChannels: any;
    selectedChannel: Array<any> = [];

    constructor(
        private router: Router,
        private location: Location,
        public selectOptionService: SelectOptionService,
        private customerService: CustomersService,
        private channelService: ChannelsService,
        private shipmentService: ShipmentService,
        private productService: ProductsService,
        private bankService: BankService,
        private orderService: OrdersService,
        private counterService: CounterService,
        private formBuilder: FormBuilder
    ) {

        // this.channel = this.channelService.fetchChannel(r => r.limit(1));
        // console.log(this.channel);
        // console.log(env.serverAPI);

        // this.fetch((data) => {
        //     this.rows = data;
        // });

        // console.log(this.today);

        const today = new Date();
        const dd = today.getDate();
        const mm = today.getMonth() + 1;
        const yyyy = today.getFullYear();
        const hour = today.getHours();
        const minute = today.getMinutes();
        const second = today.getSeconds();

        // const time = <NgbTimeStruct>{hour: today.getHours(), minute: today.getMinutes()};

        this.modelPopup.day = dd;
        this.modelPopup.month = mm;
        this.modelPopup.year = yyyy;
        this.modelTime.hour = hour;
        this.modelTime.minute = minute;
        this.modelTime.second = second;
        // this.modelTime = time;

    }

    ngOnInit() {
        // const times = new Date();
        // console.log(times);
        //  const time = {hour: 13, minute: 30};
        //  this.ngForm = this.formBuilder.group({
        // customerId: new FormControl(),
        // customeTel: new FormControl(),
        // custemerAddress: new FormControl(),
        // custemerSocial: new FormControl()
        // });
        // this.paymentForm = this.formBuilder.group({
        //     orderShipmentId:  ['', Validators.required],
        //     orderPaymentId:  ['', Validators.required],
        //     orderBankId:  ['', Validators.required],
        //     orderTranferImage:  ['', Validators.required],
        //     orderPaymentDate:  ['', Validators.required],
        //     orderTime:  ['', Validators.required],
        //     orderTime1:  ['', Validators.required]
        // });

        this.counterService.fetchCounterCustomer()
            .subscribe((result) => {
                // console.log(result);
                if (result.id) {
                    this.counterCTId = result;
                    this.CTId = 'CM00000000';
                    this.rex = this.CTId.length - (this.counterCTId.seq + 1).toString().length;
                    this.customerId = (this.counterCTId.seq + 1);
                    this.customerCMId = this.CTId.slice(0, this.rex) + (this.counterCTId.seq + 1).toString();
                    // this.customerId_New = (this.counterCTId.seq + 1);
                    // this.customerCMId_New = this.CTId.slice(0, this.rex) + (this.counterCTId.seq + 1).toString();
                    // console.log(this.customerCMId);
                    // return this.customerCMId;
                } else {
                    this.customerId = 1;
                    this.customerCMId = 'CM00000001';
                    // this.customerCMId_New = 'CM00000001';
                    // this.customerId_New = 1;
                    // console.log(this.customerCMId);
                    // return this.customerCMId;
                }
                // console.log(this.customerCMId);
                // console.log(this.customerId);
                // console.log(result.seq);
                // return this.CId;
            });

        this.customerForm = this.formBuilder.group({
            orderCustomerChannelId: ['', Validators.required],
            orderCustomerIdhome: ['', [Validators.required, Validators.minLength(2)]],
            orderCustomerId: ['', Validators.required],
            orderCustomerCMId: ['', Validators.required],
            orderCustomerNameSurname: ['', Validators.required],
            orderCustomerSocial: ['', Validators.required],
            orderCustomerTel: ['', [
                Validators.required,
                Validators.pattern(/^(06|08|09)[0-9]*/),
                // Validators.minLength(10),
                Validators.maxLength(10)
            ]],
            address2: ['', Validators.required],
            zipcode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]]
        });

        // this.paymentForm = this.formBuilder.group({
        //     orderPaymentId: ['', Validators.required],
        //     orderShipmentId: ['', Validators.required],
        //     orderBankId: ['', Validators.required],
        //     orderPaymentDate: ['', Validators.required],
        //     orderTranferImage: ['', Validators.required],
        //     orderTime: ['', Validators.required],
        //     method: ['']
        // });
        this.paymentForm = new FormGroup({
            orderShipmentId: new FormControl(),
            orderBankId: new FormControl(),
            orderPaymentDate: new FormControl(),
            orderPaymentTime: new FormControl(),
            orderPaymentImage: new FormControl(),
            // orderTranferImage:  new FormControl(),
            // file: new FormControl(),
            // image: new FormControl(),
            // orderTime:  new FormControl(),
            method: new FormControl()
        });
        this.deliveryForm = this.formBuilder.group({
            // delivery: new FormControl(),
            // deliveryId: new FormControl(),
            price: [0]
        });
        // this.orderForm = new FormGroup({
        this.orderForm = this.formBuilder.group({
            discount: [0],
            total: [0]
        });

        this.setJqueryThailand();
        // console.log(this.setJqueryThailand());
        // console.log(JSON.stringify(this.customers.filter(x => x.customerId)));
        this.fetchCustomer();
        this.fetchShipment();
        this.fetchChannel();
        this.fetchBank();
        // this.clickedTimer();
        // this.fetchOrderODId();
        this.setOnchangePaymentMethod();
        this.ID = JSON.parse(localStorage.getItem('ID'));
        this.Name = JSON.parse(localStorage.getItem('Name'));
        this.checkRole = JSON.parse(localStorage.getItem('Role'));


        // console.log(this.channel.channelId);
        // this.fetchCustomer();
        // this.fetchViewCustomer(customer);
        // console.log(JSON.stringify(this.customers));
        // this.runTimer();
        // this.dataSub = this.selectOptionService.loadCharacters().subscribe((options) => {
        //     this.characters = options;
        // });


        // fetch(){
        //     const req = new XMLHttpRequest();
        //     req.open('GET', `http://178.128.117.155:9999/libs/jquery.Thailand.db.json`);
        //         console.log('http://178.128.117.155:9999/libs/jquery.Thailand.db.json');
        //     req.onload = () => {
        //         (JSON.parse(req.response));
        //     };
        //
        //     req.send();
        // }

        //  test data select image jquerry  //
        $('#options').ddslick(
            {
                // data: this.channels,
                // data: ddData,
                // width: 400,
                height: 200,
                imagePosition: 'right',
                selectText: 'Select your favorite social network',
                onSelected: function (data) {
                    // console.log(data);
                }
            }
        );

        $('#demo-htmlselect').ddslick({
            imagePosition: 'left',
            onSelected: function (Data) {
                // callback function: do something with selectedData;
            }
        });
        //  test data select image jquerry  //

    }

    // find check OrderODId into database //
    // fetchOrderODId() {
    //     this.counterService.fetchCounterOrder()
    //         .subscribe((result) => {
    //             // console.log(result);
    //             if (result.id) {
    //                 this.counterODId = result;
    //                 this.ODId = 'OD00000000';
    //                 this.rex = this.ODId.length - (this.counterODId.seq + 1).toString().length;
    //                 // console.log('rex = ' + this.rex);
    //                 // this.orderODId = this.ODId.slice(0, this.rex) + (this.counterODId.seq + 1).toString();
    //                 this.orderODId = this.ODId.slice(0, this.rex) + (this.counterODId.seq + 1).toString();
    //
    //             } else {
    //                 this.orderODId = 'OD00000001';
    //             }
    //             // console.log(this.orderODId);
    //             // return this.orderODId;
    //         });
    // }

    fetchLastOrderODId() {
        this.orderService.fetchLastOrderId()
            .subscribe((result) => {
                // console.log(result);
                this.seqOrderId = result.orderId;
                if (result) {
                    const counterODId = result.orderId;
                    this.ODId = 'OD00000000';
                    this.rex = this.ODId.length - (result.orderId + 1).toString().length;
                    this.orderODId = this.ODId.slice(0, this.rex) + (result.orderId + 1).toString();
                } else {
                    this.orderODId = 'OD00000001';
                }
                // console.log('new.id = ' + this.orderODId);
                // return this.orderODId;
            });
    }

    // setDateNow() {
    //
    //     this.modelPopup = {} as NgbDateStruct;
    //     this.modelTime = {} as NgbTimeStruct;
    //     const today = new Date();
    //     const dd = today.getDate();
    //     const mm = today.getMonth() + 1;
    //     const yyyy = today.getFullYear();
    //     const hour = today.getHours();
    //     const minute = today.getMinutes();
    //
    //     const time = <NgbTimeStruct>{hour: today.getHours(), minute: today.getMinutes()};
    //
    //     this.modelPopup.day = dd;
    //     this.modelPopup.month = mm;
    //     this.modelPopup.year = yyyy;
    //     this.modelTime.hour = hour;
    //     this.modelTime.minute = minute;
    // }

    runTimer() {
        const timer = setInterval(() => {
            this.timeLeft -= 1;
            if (this.timeLeft === 0) {
                clearInterval(timer);
            }
        }, 1000);
    }

    clickedTimer() {
        setInterval(() => {
            // this.timeLeft -= 1;
            // if (this.timeLeft === 0) {
            //     clearInterval(timer);
            this.getNewODId();
            // this.fetchOrderODId();
            // }
        }, 500)
        retry(5);
    }

    onSelected(option: IOption) {
        this.msg = `Selected ${option.label}`;
    }

    onDeselected(option: IOption) {
        this.msg = `Deselected ${option.label}`;
    }

    getStayData(stayData) {
        if (stayData) {
            // this.alertSuccessPosition(stayData, 'top');
            const dataGet = stayData.toString().split('\n');
            if (!dataGet[0]) {
                (<HTMLInputElement>document.getElementById('orderCustomerSocial')).value = '';
            } else {
                (<HTMLInputElement>document.getElementById('orderCustomerSocial')).value = dataGet[0];
            }
            if (!dataGet[1]) {
                (<HTMLInputElement>document.getElementById('orderCustomerTel')).value = '';
            } else {
                // const contents = this.onPastePhone(dataGet[1].toString());
                // let ddd = dataGet[1];
                let content = <string>dataGet[1].toString();
                content = content.replace(/[^0-9]/g, '');
                // dataGet[1].preventDefault();
                // alert('content = ' + content);
                // console.log(content);
                (<HTMLInputElement>document.getElementById('orderCustomerTel')).value = content;
                (<HTMLInputElement>document.getElementById('typeahead-template')).value = content;
            }
            if (!dataGet[2]) {
                (<HTMLInputElement>document.getElementById('orderCustomerNameSurname')).value = '';
            } else {
                (<HTMLInputElement>document.getElementById('orderCustomerNameSurname')).value = dataGet[2];
            }
            if (!dataGet[3]) {
                (<HTMLInputElement>document.getElementById('orderCustomerIdhome')).value = '';
            } else {
                (<HTMLInputElement>document.getElementById('orderCustomerIdhome')).value = dataGet[3];
            }
            if (!dataGet[4]) {
                (<HTMLInputElement>document.getElementById('address2')).value = '';
            } else {
                (<HTMLInputElement>document.getElementById('address2')).value = dataGet[4];
            }
            if (!dataGet[5]) {
                (<HTMLInputElement>document.getElementById('zipcode')).value = '';
            } else {
                (<HTMLInputElement>document.getElementById('zipcode')).value = dataGet[5];
            }
            if (!dataGet[6]) {
                (<HTMLInputElement>document.getElementById('orderRemark')).value = '';
            } else {
                (<HTMLInputElement>document.getElementById('orderRemark')).value = dataGet[6];
            }

            // (<HTMLInputElement>document.getElementById('typeahead-template')).value = dataGet[1];
            // (<HTMLInputElement>document.getElementById('orderCustomerSocial')).value = dataGet[0];
            // (<HTMLInputElement>document.getElementById('orderCustomerTel')).value = dataGet[1];
            // (<HTMLInputElement>document.getElementById('orderCustomerNameSurname')).value = dataGet[2];
            // (<HTMLInputElement>document.getElementById('orderCustomerIdhome')).value = dataGet[3];
            // (<HTMLInputElement>document.getElementById('address2')).value = dataGet[4];
            // (<HTMLInputElement>document.getElementById('zipcode')).value = dataGet[5];
            // (<HTMLInputElement>document.getElementById('orderRemark')).value = dataGet[6];
            this.alertSuccessPosition(`ดูดข้อมูลเรียบร้อยแล้ว...\n
                =>${dataGet[0]}\n=>${dataGet[1]}\n=>${dataGet[2]}\n=>${dataGet[3]}\n=>${dataGet[4]}\n=>${dataGet[5]}\n=>${dataGet[6]}`,
                'top-end');
        }
        // else {
        //     return alert('else = ' + stayData);
        // }
    }

    getNewODId() {

        this.counterService.fetchCounterOrder()
            .subscribe((resultCounter) => {
                // console.log(result);
                this.seqCounterId = resultCounter.seq;
                if (resultCounter.id) {
                    this.counterODId = resultCounter;
                    this.ODId = 'OD00000000';
                    this.rex = this.ODId.length - (this.counterODId.seq + 1).toString().length;
                    // console.log('rex = ' + this.rex);
                    // this.orderODId = this.ODId.slice(0, this.rex) + (this.counterODId.seq + 1).toString();
                    this.orderODId = this.ODId.slice(0, this.rex) + (this.counterODId.seq + 1).toString();

                } else {
                    this.orderODId = 'OD00000001';
                }
                // console.log(this.orderODId);
                // return seq;
            });
        // console.log('SeqCounterId = ' + this.seqCounterId);

        // this.orderService.fetchLastOrderId()
        //     .subscribe((result) => {
        //         // console.log(result);
        //         this.seqOrderId = result.orderId;
        //         if (result) {
        //             const counterODId = result.orderId;
        //             this.ODId = 'OD00000000';
        //             this.rex = this.ODId.length - (result.orderId + 1).toString().length;
        //             this.orderODId = this.ODId.slice(0, this.rex) + (result.orderId + 1).toString();
        //         } else {
        //             this.orderODId = 'OD00000001';
        //         }
        //         // console.log('new.id = ' + this.orderODId);
        //         // return this.orderODId;
        //     });
        // // console.log('SeqOrderId = ' + this.seqOrderId);


        // if (isNumber(this.seqCounterId)) {
        //     // console.log('Number CounterId');
        // }
        // if (isNumber(this.seqOrderId)) {
        //     // console.log('Number OrderId');
        // }

        // if (this.seqCounterId === this.seqOrderId) {
        //     console.log('Equil === True');
        //     this.fetchLastOrderODId();
        //
        // } else if (this.seqCounterId > this.seqOrderId) {
        //     console.log('CounterId >  OrderId');
        //     this.fetchCounterOrderODId();
        // } else if (this.seqOrderId > this.seqCounterId) {
        //     console.log('OrderId > CounterId');
        //     this.fetchCounterOrderODId();
        // } else {
        //     console.log('CounterId !== OrderId');
        //     this.fetchLastOrderODId();
        // }
    }

    onSubmitCustomer(
        channelId, customerId, customerCMId, customerSocial, customerTel, customerNameSurname,
        customerIdhome, address2, zipcode,
        OrderCreateForm, method, btnCheck
    ) {

        // this.getNewODId();
        this.dataOrder = OrderCreateForm.value;
        // alert(JSON.stringify(selectOrdersChannel));
        // if (channelId) {
        //     alert(JSON.stringify(channelId));
        //     return;
        // }
        // return false;
        // console.log(customerId);
        // console.log(customerCMId);

        // console.log(JSON.stringify(this.dataOrder));
        if (customerTel.length !== 10) {
            return this.alertWarningPosition(`Customer Telephone Wrong : \n กรุณาใส่ข้อมูลเบอร์โทรลุกค้าให้ครบ 10 หมายเลข ด้วยครับ.`, 'top');
        }

        // if ((!customerId) && (!customerCMId)) {
        // return alert('customer Created : ' + 'กรุณาเพิ่มข้อมูลลุกค้าก่อน ...');
        if (
            (!customerNameSurname) || (!customerTel) || (customerTel.length !== 10) || (!customerSocial)
            || (!customerIdhome) || (!address2) || (!zipcode)
        ) {
            return this.alertWarningPosition('Customer Created : \n กรุณาเพิ่มข้อมูลลุกค้าก่อน ...', 'top');
        } else {
            //  fetch customerCMId data  for add new customerId //
            const Chan = channelId.toString().split(':');
            this.Chan = Chan[1].trim();
            this.counterService.fetchCounterCustomer()
                .subscribe((result) => {

                    if (result.id) {
                        this.counterCTId = result;
                        this.CTId = 'CM00000000';
                        this.rex = this.CTId.length - (this.counterCTId.seq + 1).toString().length;
                        this.customerCMId = this.CTId.slice(0, this.rex) + (this.counterCTId.seq + 1).toString();

                        this.customerId = (result.seq + 1);
                    } else {
                        this.customerCMId = 'CM00000001';
                        this.customerId = 1;
                    }

                    if (customerTel.length === 10) {

                        const checkCustomerTel = this.customers
                            .find(p => p.customerTel === customerTel);
                        if (checkCustomerTel) {

                            // if ((customerId) && (customerCMId)) {
                            //     alert('TRUE ' + customerId + customerCMId);
                            //     this.customerId = checkCustomerTel.customerId;
                            //     this.customerCMId = checkCustomerTel.customerCMId;
                            // } else {
                            //     // this.customerId = this.customerId;
                            //     // this.customerCMId = this.customerCMId;
                            // }

                            this.customer.customerId = checkCustomerTel.customerId;
                            this.customer.customerCMId = checkCustomerTel.customerCMId;
                            this.customer.customerNameSurname = customerNameSurname;
                            this.customer.customerSocial = customerSocial;
                            this.customer.customerTel = customerTel;
                            this.customer.customerIdhome = customerIdhome;
                            this.customer.customerAddress = address2;
                            this.customer.customerZipcode = zipcode;
                            this.customer.customerChannelId = this.Chan;
                            this.customer.customerEmail = checkCustomerTel.customerEmail;
                            this.customer.customerIdcard = checkCustomerTel.customerIdcard;
                            // console.log('Update this.customer = ' + JSON.stringify(this.customer));
                            // console.log(customerId);
                            // console.log(customerCMId);
                            this.customerService.updateCustomer(this.customer)
                                .subscribe(() => {
                                    const toast = Swal.mixin({
                                        toast: true,
                                        position: 'top-end',
                                        showConfirmButton: false,
                                        timer: 3000
                                    });
                                    toast({
                                        type: 'success',
                                        title: 'Update Customer : \nอัพเดทข้อมูลลูกค้า เรียบร้อยแล้ว'
                                    });
                                });
                            // update customer same customerTel //
                            this.alertWarningPosition(`Update Customer : ${this.customer.customerId} |
                                                            ${this.customer.customerCMId}`, 'top');
                        }
                        if (!checkCustomerTel) {
                            // add new customer //
                            // if ((customerId) && (customerCMId)) {
                            //     this.customerId = customerId;
                            //     this.customerCMId = customerCMId;
                            // } else {
                            //     // this.customerId = this.customerId;
                            //     // this.customerCMId = this.customerCMId;
                            //     alert('ELSE ' + this.customerId + this.customerCMId);
                            // }
                            this.customer.customerId = this.customerId;
                            this.customer.customerCMId = this.customerCMId;
                            this.customer.customerNameSurname = customerNameSurname;
                            this.customer.customerSocial = customerSocial;
                            this.customer.customerTel = customerTel;
                            this.customer.customerIdhome = customerIdhome;
                            this.customer.customerAddress = address2;
                            this.customer.customerZipcode = zipcode;
                            this.customer.customerChannelId = this.Chan;
                            this.customer.customerEmail = '';
                            this.customer.customerIdcard = '';
                            // console.log('Add new this.customer = ' + JSON.stringify(this.customer));
                            // console.log(customerId);
                            // console.log(customerCMId);
                            this.customerService.addCustomer(this.customer)
                                .subscribe(() => {
                                    const toast = Swal.mixin({
                                        toast: true,
                                        position: 'top-end',
                                        showConfirmButton: false,
                                        timer: 3000
                                    });
                                    toast({
                                        type: 'success',
                                        title: 'New Customer : \nเพิ่มข้อมูลลูกค้าใหม่ เรียบร้อยแล้ว'
                                    });
                                });
                            // add new customer //
                            // console.log('false = ' + this.customerId + ', ' + this.customerCMId);
                            this.alertSuccessPosition(`New CustomerId : ${this.customerId} | ${this.customerCMId}`, 'top');
                        }
                    }
                });
        }
        // }

        const checkCustomerTelConfirm = this.customers
            .find(p => p.customerTel === customerTel);
        if (checkCustomerTelConfirm) {
            this.customerId = checkCustomerTelConfirm.customerId;
            this.customerCMId = checkCustomerTelConfirm.customerCMId;
            // alert(checkCustomerTelConfirm.customerId + '--' + checkCustomerTelConfirm.customerCMId);
        }
        // else {
        //     this.customerId = this.customerId;
        //     this.customerCMId = this.customerCMId;
        // }

        if (method === 'banktranfer') {
            const {year, month, day} = OrderCreateForm.value.orderPaymentDate;
            this.paymentDate = new Date(year, month - 1, day);
            // alert(this.paymentDate);
            // alert(method);
            this.orderPaymentDate = this.paymentDate;
            this.orderPaymentTime = OrderCreateForm.value.orderPaymentTime;
            this.orderPaymentImage = OrderCreateForm.value.orderPaymentImage;
        }
        if (method === 'cod') {
            // alert('ERROR_ORIGINAL_ERROR : image found');
            this.orderPaymentDate = null;
            this.orderPaymentTime = null;
            this.orderPaymentImage = null;
        }

        if (this.disabled) {
            return;
        }
        if (!channelId) {
            return alert('please selected value : ' + 'ช่องทาง :: orderCustomerChannelId');
        }
        // alert(channelId);
        // console.log(channelId);
        const chan = channelId.toString().split(':');
        // console.log('length =' + chan[1].trim().length);
        // console.log('value = ' + chan[1].trim());
        this.saving = true;

        // return;
        const customer = {
            orderCustomerId: this.customerId,
            orderCustomerCMId: this.customerCMId,
            // orderCustomerId:  customerId,
            // orderCustomerCMId:  customerCMId,
            orderCustomerChannelId: chan[1].trim(),
            orderCustomerSocial: customerSocial,
            orderCustomerTel: customerTel,
            orderCustomerNameSurname: customerNameSurname,
            orderCustomerIdhome: customerIdhome,
            orderCustomerAddress: address2,
            orderCustomerZipcode: zipcode
        };
        const payment = {
            ...this.paymentForm.value,
            orderPaymentDate: this.orderPaymentDate,
            orderPaymentTime: this.orderPaymentTime,
            orderPaymentImage: this.orderPaymentImage
        };
        const delivery = {
            ...this.deliveryForm.value,
            orderShipmentId: this.paymentForm.get('orderShipmentId').value
        };
        // add stock to hold product iventory //
        // add stock to hold product iventory //
        this.orderProducts.forEach(p => {
            delete p.remain;
            // calProduct-hole-total-remain product to stock inventory //
            // console.log('id: ' + p.id);
            // console.log('name: ' + p.name);
            // console.log('code: ' + p.code);
            // console.log('amount: ' + p.amount);
            // console.log('price: ' + p.price);
            // console.log('total: ' + p.total);
            // console.log('image: ' + p.image);
            // console.log('remain: ' + p.remain);
            this.productService.hold(p.id, p.amount).subscribe((r: Product) => {
                if (r.productId === p.id) {
                    if (p.id === r.productId) {
                        // const remainCheck = (r.productTotal - r.productHold);
                        // if ((remainCheck === 0) || (remainCheck < 1)) {
                        //     alert('สินค้าเหหลือน้อยเกินไป ---- ');
                        //     return;
                        // }
                        this.product.productId = p.id;
                        this.product.productHold += p.amount;
                        const calHold = (r.productHold + p.amount);
                        this.productService.updateHold(p.id, calHold).subscribe((re) => {
                            // this.product.productId = re.productId;
                            // this.product.productHold = re.productHold + p.amount;
                            // console.log('p.amount = ' + this.product.productHold);
                            // console.log(re);
                            const toast = Swal.mixin({
                                toast: true,
                                position: 'top-end',
                                showConfirmButton: false,
                                timer: 3000
                            });
                            toast({
                                type: 'success',
                                title: 'บันทึกข้อมูล ProductHold เรียบร้อยแล้ว'
                            });
                            // this.orderService.fetchOrder();
                        });
                    }
                }
            });
        });

        // add historys //
        const hisName = 'Create';
        const hisRemark = 'สร้างคำสั่งซื้อใหม่';
        // this.pushHistorysData(hisName, hisRemark);
        const historys = {
            hisName: hisName,
            hisRemark: hisRemark,
            sellerId: this.ID,
            sellerName: this.Name,
            lastUpdate: new Date()
        };
        // add historys //

        const order = {
            ...this.orderForm.value,
            orderCustomerChannelId: chan[1].trim(),
            orderChannelId: chan[1].trim(),
            // orderODId: this.orderODId,
            orderStatusCode: 0,
            orderStatusName: 'process',
            customer,
            products: this.orderProducts,
            delivery,
            orderPaymentImage: this.orderPaymentImage,
            // delivery: this.deliveryForm.value,
            payment,
            historys,
            orderSellerId: this.ID,
            orderSellerName: this.Name,
            orderDiscount: this.orderForm.get('discount').value,
            orderTotal: this.orderForm.get('total').value,
            orderLastupdate: new Date(),
            orderCreated: new Date(),
            orderRemark: OrderCreateForm.value.orderRemark
        };
        // console.log('orderRemark = ' + OrderCreateForm.value.orderRemark);

        this.submittedOrder.emit(order);
        // console.log(order);
        // console.log('***');
        // console.log(this.orderProducts);
        // alert('Image : '  + JSON.stringify(payment));
        // return;

        // add image to database //
        // add image to database //
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        if (this.selectedFile) {
            // alert('thisfile : ' + this.selectedFile + OrderCreateForm.value.orderPaymentImage);
            this.orderService.uploadFile(formData)
                .subscribe(result => {
                    order.payment.orderPaymentImage = result[0].name;
                    // order.orderPaymentImage = result[0].name;
                    this.orderPaymentImage = result[0].name;
                    // this.paymentForm.patchValue({
                    //     orderBankId: result[0].name
                    // });
                    // alert('Image1 : ' + result[0].name);
                    // alert('Image2 : ' + this.orderPaymentImage);
                    // console.log('Image3 : ' + this.orderPaymentImage);

                    this.orderService.addOrder(order).subscribe((r) => {
                        const toast = Swal.mixin({
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000
                        });
                        toast({
                            type: 'success',
                            title: 'บันทึกข้อมูล เรียบร้อยแล้ว'
                        });
                        this.orderService.fetchOrder();
                        // this.router.navigate(['/management/orders', 'details']);
                        if (btnCheck === 'true') {
                            window.location.reload();
                        } else {
                            this.router.navigate(['/management/orders', 'details']);
                        }
                    });
                });
            // this.orderService.fetchOrder();
        } else {
            this.orderService.addOrder(order).subscribe((r) => {
                const toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
                toast({
                    type: 'success',
                    title: 'บันทึกข้อมูล เรียบร้อยแล้ว'
                });
                this.orderService.fetchOrder();
                // this.router.navigate(['/management/orders', 'details']);
                if (btnCheck === 'true') {
                    window.location.reload();
                } else {
                    this.router.navigate(['/management/orders', 'details']);
                }
            });
            // this.orderService.fetchOrder();
        }
        // add image to database //
        // add image to database //
        //     this.orderService.addOrder(order).subscribe((r) => {
        //             const toast = Swal.mixin({
        //                 toast: true,
        //                 position: 'top-end',
        //                 showConfirmButton: false,
        //                 timer: 3000
        //             });
        //             toast({
        //                 type: 'success',
        //                 title: 'บันทึกข้อมูล เรียบร้อยแล้ว'
        //             });
        //     });

        // this.submittedOrder.emit(order);
        // this.orderService.fetchOrder();
        // this.router.navigate(['/management/orders', 'details' ]);
    }

    public pushHistorysData(hisName, hisRemark) {
        // if (this.checkRoleData()) {
        // this.alertSuccess(`คุณมีสิทธื์ใช้งาน เพื่อเข้าถึงข้อมูลนี้ได้`);
        this.order.historys.push({
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

    fetchCounterCustomerCMId() {
        this.counterService.fetchCounterCustomer()
            .subscribe((result) => {
                // console.log(result);
                if (result.id) {
                    this.counterCTId = result;
                    this.CTId = 'CM00000000';
                    this.CId = (this.counterCTId.seq + 1);
                    this.rex = this.CTId.length - (this.counterCTId.seq + 1).toString().length;
                    this.customerCMId = this.CTId.slice(0, this.rex) + (this.counterCTId.seq + 1).toString();
                    // console.log(this.customerCMId);
                    // return this.customerCMId;
                } else {
                    this.customerCMId = 'CM00000001';
                    this.CId = 1;
                    // console.log(this.customerCMId);
                    // return this.customerCMId;
                }
                // console.log(this.customerCMId);
                // console.log(this.CId);
                // console.log(result.seq);
                // return this.CId;
            });
        // return this.customerCMId;
    }

    fetchCustomer() {
        this.sub = this.customerService.fetchCustomer()
        // .map((m: Customer[]) => {
        //     let x = 0;
        //     m.map(r => {
        //         r.index = ++x;
        //         // if (r.customerImage) {
        //         //     r.customerImage = `${env.serverAPI}/images/customer/` + r.customerImage;
        //         // } else {
        //         //     r.customerImage = `${env.serverAPI}/images/image-blank.jpg`;
        //         // }
        //
        //         if (r.customerLastupdate) {
        //             const dd = r.customerLastupdate.toString().split('T');
        //             const ddConv = dd[0].split('-');
        //             r.customerLastupdate = ddConv[2]  + '-' + ddConv[1] + '-' + ddConv[0];
        //         }
        //         return r;
        //     });
        //     return m;
        // })
        // .subscribe((r: Customer[]) => this.customers = r);
            .subscribe((r: Customer[]) => {
                // console.log(r);
                this.customers = r;
            });
    }

    fetchViewCustomer(customer: Customer) {
        this.sub = this.customerService.fetchViewCustomer(customer)
        // .map((m: Customer[]) => {
        //     let x = 0;
        //     m.map(r => {
        //         r.index = ++x;
        //         // if (r.customerImage) {
        //         //     r.customerImage = `${env.serverAPI}/images/customer/` + r.customerImage;
        //         // } else {
        //         //     r.customerImage = `${env.serverAPI}/images/image-blank.jpg`;
        //         // }
        //
        //         if (r.customerLastupdate) {
        //             const dd = r.customerLastupdate.toString().split('T');
        //             const ddConv = dd[0].split('-');
        //             r.customerLastupdate = ddConv[2]  + '-' + ddConv[1] + '-' + ddConv[0];
        //         }
        //         return r;
        //     });
        //     return m;
        // })
        // .subscribe((r: Customer[]) => this.customers = r);
            .subscribe((r) => {
                // console.log(r);
                this.customer = r;
            });
    }

    fetchChannel() {
        this.sub = this.channelService.fetchChannel()
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
                this.defualtChannels = r[0].channelId;
                this.customerForm.patchValue({orderCustomerChannelId: r[0].channelId});
            });
    }

    fetchShipment() {
        this.sub = this.shipmentService.fetchShipment()
            .map((m: Shipment[]) => {
                let x = 0;
                m.map(r => {
                    r.index = ++x;
                    if (r.shipmentImage) {
                        r.shipmentImage = `${env.serverAPI}/images/shipment/` + r.shipmentImage;
                    } else {
                        r.shipmentImage = `${env.serverAPI}/images/image-blank.jpg`;
                    }

                    if (r.shipmentStartDate) {
                        const dd = r.shipmentStartDate.toString().split('T');
                        const ddConv = dd[0].split('-');
                        r.shipmentStartDate = ddConv[2] + '-' + ddConv[1] + '-' + ddConv[0];
                    }
                    return r;
                });
                return m;
            })
            // .subscribe((r: Shipment[]) => this.shipments = r);
            .subscribe((r: Shipment[]) => {
                // console.log(r);
                this.shipments = r;
                this.paymentForm.patchValue({orderShipmentId: r[0].shipmentId});
            });
    }

    fetchBank() {
        this.sub = this.bankService.fetchBank()
            .map((m: Bank[]) => {
                let x = 0;
                m.map(r => {
                    r.index = ++x;
                    if (r.bankImage) {
                        r.bankImage = `${env.serverAPI}/images/bank/` + r.bankImage;
                    } else {
                        r.bankImage = `${env.serverAPI}/images/image-blank.jpg`;
                    }

                    if (r.bankStartDate) {
                        const dd = r.bankStartDate.toString().split('T');
                        const ddConv = dd[0].split('-');
                        r.bankStartDate = ddConv[2] + '-' + ddConv[1] + '-' + ddConv[0];
                    }
                    return r;
                });
                return m;
            })
            // .subscribe((r: Bank[]) => this.banks = r);
            .subscribe((r: Bank[]) => {
                // console.log(r);
                this.banks = r;
                // this.paymentForm.patchValue({orderBankId: r[0].bankId});
            });
    }

    isInvalid(form: FormGroup, attr: string): boolean {
        const value = form.get(attr);
        return value.invalid && (value.dirty || value.touched);
        // console.log(value);
    }

    private setOnchangePaymentMethod() {
        this.paymentForm.get('method').valueChanges
            .subscribe(method => {
                if (method === 'cod') {
                    this.paymentForm.get('orderBankId').setValidators(null);
                    // this.paymentForm.patchValue({ orderBankId: null, date: null, time: null });
                    this.paymentForm.patchValue({orderBankId: null});
                    this.paymentForm.patchValue({orderPaymentDate: null});
                    this.paymentForm.patchValue({orderPaymentTime: null});
                    this.paymentForm.patchValue({orderPaymentImage: null});
                }
                if (method === 'banktranfer') {
                    this.paymentForm.get('orderBankId').setValidators([Validators.required]);
                    this.paymentForm.patchValue({
                        orderBankId: this.banks[0].bankId
                    });
                }
            });
    }

    // private setOrderPaymentDateTime() {
    //     const now = new Date();
    //     const date = <NgbDateStruct>{
    //         year: now.getFullYear(),
    //         month: now.getMonth() + 1,
    //         day: now.getDate()
    //     };
    //     const time = <NgbTimeStruct>{ hour: now.getHours(), minute: now.getMinutes() };
    //
    //     this.paymentForm.patchValue({
    //         date,
    //         time
    //     });
    // }

    // onKeydown(event) {
    //     if (event.code === 'Space') {
    //         console.log(event);
    //         return;
    //     }
    // }

    onPastePhone(e) {
        let content = <string>e.clipboardData.getData('text/plain');
        content = content.replace(/[^0-9]/g, '');
        e.preventDefault();
        (<HTMLInputElement>document.getElementById('orderCustomerTel')).value = content;
        // this.customerForm.patchValue({
        //     orderCustomerTel: content
        // });
    }

    onKeypressPhone(e) {
        const notNumber = e.keyCode > 57 || e.keyCode < 48;
        const length = e.target.value.length;
        if (notNumber || length === 10) {
            e.preventDefault();
        }
    }

    findProduct(value) {
        // const enum Key {
        //     Backspace = 8,
        //     Tab = 9,
        //     Enter = 13,
        //     Shift = 16,
        //     Ctrl = 17,
        //     Alt = 18,
        //     PauseBreak = 19,
        //     CapsLock = 20,
        //     Escape = 27,
        //     Space = 32,
        //     PageUp = 33,
        //     PageDown = 34,
        //     End = 35,
        //     Home = 36,
        //
        //     LeftArrow = 37,
        //     UpArrow = 38,
        //     RightArrow = 39,
        //     DownArrow = 40
        // }
        if ((value.length < 1) || (value === ' ')) {
            (<HTMLInputElement>document.getElementById('searchProductInput')).value = '';
            this.clearSearchProducts();
            return this.clearSearchProducts();
        }

        this.productService.findByName(value)
            .map((m: Product[]) => {
                let x = 0;
                m.map(r => {
                    r.index = ++x;
                    if (r.productImage) {
                        r.productImage = `${env.serverAPI}/images/product/` + r.productImage;
                    } else {
                        r.productImage = `${env.serverAPI}/images/image-blank.jpg`;
                    }
                    return r;
                });
                return m;
            })
            .subscribe(resp => {
                this.products = resp;
                // console.log(this.products);
                this.searchProducts = resp.slice(0, 20);
                // this.searchProducts = this.products.slice(0, 10);
                // console.log(this.searchProducts);
            });
    }

    addProduct(product, size = null) {
        // alert(JSON.stringify(product));
        // alert(product.productTotal);
        // alert(product.productHold);
        // alert(product.productRemain);
        const remain = (product.productTotal - product.productHold);
        // alert(remain);
        // alert(product.productCodename);
        // alert(product.productPiece);
        // alert(product.productInventory);

        if (remain <= 0 || (size && size.productTotal === 0)) {
            // alert('สินค้าหมดสต๊อกแล้วครับ...');
            const toast = Swal.mixin({
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 5000
            });
            toast({
                type: 'warning',
                title: 'สินค้าหมดสต๊อกแล้วครับ...'
            });

            (<HTMLInputElement>document.getElementById('searchProductInput')).value = '';
            this.clearSearchProducts();
            return;
        }

        // console.log(JSON.stringify(product) + ' -- ' + size);
        // console.log(product.productTotal + ' -- ' + size);
        let pid = product.productId;
        let code = product.productCodename;
        let name = product.productName;
        // let total = product.productTotal;
        // let inventory = product.productInventory;
        // let id = product.productId;
        // alert(code + name + total + inventory);
        // if (size) {
        //     code = size.code;
        //     name = `${product.name}-${size.name}`;   // -- ลบค่า -- ฝฝ
        // }
        // alert(size);
        // alert(name);
        // alert(id);

        const notExistInOrderProduct = !this.orderProducts
            .find(p => p.id === pid);
        // alert(notExistInOrderProduct);

        if (notExistInOrderProduct) {

            // if (product.productImage) {
            //     this.imageUrlProduct = `${env.serverAPI}/images/product/` + product.productImage;
            // } else {
            //     this.imageUrlProduct = `${env.serverAPI}/images/image-blank.jpg`;
            // }
            // alert(this.imageUrlProduct);
            this.orderProducts.push({
                id: product.productId,
                code: code,
                name: name,
                price: product.productPiece,
                amount: 1,
                remain: size ? size.productTotal : (product.productTotal - product.productHold),
                max: (product.productTotal - product.productHold),
                total: product.productPiece,
                image: product.productImage
            });
        }

        (<HTMLInputElement>document.getElementById('searchProductInput')).value = '';
        this.clearSearchProducts();
        this.calTotalOrder();
    }

    onChangeProductAmount(product) {
        if (product.amount < 1) {
            product.amount = 1;
        }
        if (product.amount > product.remain) {
            product.amount = product.remain;
        }
        product.total = product.amount * product.price;
        this.calTotalOrder();
    }

    calTotalOrder() {
        const productTotalPrice = +this.orderProducts.reduce(
            (sum, product) => sum + product.total, 0
        );
        // alert(productTotalPrice);
        const deliveryPrice = +this.deliveryForm.get('price').value;
        const discount = +this.orderForm.get('discount').value;
        const total = productTotalPrice + deliveryPrice - discount;
        this.orderForm.patchValue({total});
        // alert(deliveryPrice);
        // alert(discount);
        // alert(total);
    }

    removeProduct(product) {
        this.orderProducts = this.orderProducts.filter(p => p.code !== product.code);
        this.calTotalOrder();
    }

    private clearSearchProducts() {
        this.searchProducts = [];
    }

    private setJqueryThailand() {
        $.Thailand({
            database: `${env.serverAPI}/libs/jquery.Thailand.db.json`,
            // database: `${env.serverAPI}/images/jquery.Thailand.db.json`,
            // database: `lib/jquery.Thailand.db.json`,
            $search: $('#address2'),
            autocomplete_size: 20,
            onDataFill: (data) => {
                this.customerForm.patchValue({
                    // this.customerForm.setValue({
                    address2: `ต.${data.district} อ.${data.amphoe} จ.${data.province}`,
                    zipcode: data.zipcode
                });
            }
        });
    }

    handleFileInputAdd(file: FileList) {
        const formData = new FormData();
        formData.append('file', file.item(0));
        this.selectedFile = file.item(0);
        this.fileToUpload = file.item(0);

        const reader = new FileReader();
        if (this.fileToUpload) {
            reader.onload = (event: any) => {
                this.imageUrl = event.target.result;
            };
            reader.readAsDataURL(this.fileToUpload);
        } else {
            // ไม่เลือกรูปภาพ  ให้โชว์ภาพว่างๆ
            this.imageUrl = this.imageUrlBlank;
        }
    }

    checkTime(value) {
        if (value < 10) {
            value = '0' + value;
        }
        return value;
    }


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

    ngOnDestroy() {
        if (this.dataSub !== null) {
            this.dataSub.unsubscribe();
        }
        // this.sub.unsubscribe();
        if (this.sub !== null) {
            this.sub.unsubscribe();
        }
    }


}
