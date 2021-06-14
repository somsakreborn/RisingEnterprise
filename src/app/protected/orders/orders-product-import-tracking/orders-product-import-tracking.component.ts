import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ElementRef, ViewChild, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {environment as env} from '../../../../environments/environment';
import {Order} from '../orders.interface';
import {OrdersService} from '../orders.service';
declare const $;
import Swal from 'sweetalert2';

// import shipment data API //
import {ShipmentService} from '../../shipments/shipments.service';
import {Shipment} from '../../shipments/shipments.interface';
import 'rxjs/add/operator/map';

import * as XLSX from 'xlsx';
import {Subscription} from 'rxjs/index';
import {document} from 'ngx-bootstrap/utils/facade/browser';
type AOA = any[][];

@Component({
  selector: 'app-orders-product-print',
  templateUrl: './orders-product-import-tracking.component.html',
  styleUrls: [
      './orders-product-import-tracking.component.scss',
      '../../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class OrdersProductImportTrackingComponent implements OnInit, AfterViewInit, OnDestroy {
  // @Input() orders = [];
  // @Input() check = [];
@Output() back = new EventEmitter();
@ViewChild('table') table: ElementRef;
@ViewChild('content') content: ElementRef;
@ViewChild('printArea') printArea: ElementRef;
  private sub: Subscription = null;
  private dataSub: Subscription = null;
  order: Order = {} as Order;
  orderChk: Order = {} as Order;
  orders: Order[] = [] as Order[];
  dataFilter: Order[] = [] as Order[];
  ordersSelected: Order[] = [] as Order[];
  selected = [];
  orders1: Order[] = [] as Order[];
  ordersSelected1: Order[] = [] as Order[];
  selected1 = [];
  shipment: Shipment = {} as Shipment;
  shipments: Shipment[] = [] as Shipment[];
  // orders: Order[] = [] as Order[];
  private  printOrders: any = [];

    dataTelFalse: string;
    datachkAdd: Order[] = [] as Order[];
    // dataFilter: any;
    data: AOA = [
        // ['header'], ['saasgagasg', '48987', 5456456, '7879'],
        // [1, 2, 'saasgagasg', '48987', 5456456, '7879'],
        [],
        [],
        [],
        [],
        // [3, 4, 5, 7, 6, 7, 7, 8]
    ];

    wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
    fileName: string = 'SheetJS.xlsx';
    confirmTrue: boolean;
    countTelsFalse: number;
    dataTelsTrackTrue: number;
    newTrackTrue: number;
    newTrackFalse: number;
    countTelsAll: number;
    contPush: number;
    chkTracking: string;
    rangeDateStr: string;

    ID: number;
    Name: string;
    checkRole: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private orderService: OrdersService,
        private shipmentService: ShipmentService
    ) {

  }

  ngOnInit() {
      // this.orderService.fetchOrder().subscribe(r => {
      //     this.orders = r;
      //     this.ordersSelected = r.filter(p => (p.orderCheckedPrint === true) && (p.orderSelectedPrint === true));
      //     this.selected = r.filter(p => (p.orderCheckedPrint === true) && (p.orderSelectedPrint === true));
      //     if (this.selected.length === 0) { this.router.navigate(['/management/orders']); }
      // });

      // this.fetchOrders();
      // this.fetchShipment();
      this.confirmTrue = false;
      this.ID = JSON.parse(localStorage.getItem('ID'));
      this.Name = JSON.parse(localStorage.getItem('Name'));
      this.checkRole = JSON.parse(localStorage.getItem('Role'));

      // switch rangeDate and show ordersAll //

      const today = new Date();
      const dd = today.getDate();
      const mm = today.getMonth() + 1;
      const yyyy = today.getFullYear();
      const monthday = new Date(new Date().setDate(new Date().getDate() - 30));
      const ddM = monthday.getDate();
      const mmM = monthday.getMonth() + 1;
      const yyyyM = monthday.getFullYear();
      const ddTodayM = (yyyyM + '-' + this.checkMonth(mmM) + '-' + this.checkMonth(ddM));
      const ddToday = (yyyy + '-' + this.checkMonth(mm) + '-' + this.checkMonth(dd));
      const ddMonthStart = (yyyy + '-' + this.checkMonth(mm) + '-01');
      const ddMonthEnd = (yyyy + '-' + this.checkMonth(mm) + '-' + this.checkMonth(this.daysInMonth(yyyy, mm)));
      const ddYearStart = (yyyy + '-01-01');
      const ddYearEnd = (yyyy + '-12-31');
      const rangeDateVal = '2019-04-17 - 2019-04-24';
      const rangeDateMonth = `${ddTodayM} - ${ddToday}`;
      this.rangeDateStr = rangeDateMonth;
      // console.log(monthday);

      this.sub = this.orderService.fetchOrderRangDate(rangeDateMonth)
          .subscribe((r: Order[]) => {
      // switch rangeDate and show ordersAll //
      // this.sub = this.orderService.fetchOrder()
      //     .subscribe((r: Order[]) => {
              this.orders = r;
              // console.log('orders = ' + this.orders);
          });
  }

    onFileChange(evt: any) {
        /* wire up file reader */
        const target: DataTransfer = <DataTransfer>(evt.target);
        if (target.files.length !== 1) { throw new Error('Cannot use multiple files'); }

        // console.log(evt.target.value);
        const extension = evt.target.value.substr(evt.target.value.lastIndexOf('.'));
        // alert(extension);
        if ((extension.toLowerCase() !== '.xls') &&
            (extension.toLowerCase() !== '.xlsx') &&
            (extension !== '')) {
            this.alertWarningPosition('The \'FileUpload\' field contains an unapproved filename.', 'top');
            // evt.target.value.focus();
            evt.target.value = '';
            this.confirmTrue = false;
            return false;
        }
        // return true;

        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
            /* read workbook */
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

            /* grab first sheet */
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];

            /* save data */
            this.data = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}));
            // console.log('dataLength = ' + this.data.length);
            // console.log('dataLength[] = ' + this.data[6].length);
            const xLength = this.data.length;
            const yLength = this.data[8].length;
            // let x = 0;
            let xCount = 0;
            let xCountTrue = 0;
            let xCountFalse = 0;
            this.dataTelFalse = '';
            this.countTelsFalse = 0;
            this.countTelsAll = 0;
            this.dataTelsTrackTrue = 0;
            this.newTrackTrue = 0;
            this.newTrackFalse = 0;
            this.contPush = 0;
            // Reset Data All for New Values //
            this.dataFilter = [];
            // Reset Data All for New Values //
            for (let x = 0; x < xLength; x++) {

                for (let y = 0; y < yLength; y++) {
                    if (x > 6) {
                        xCount ++;
                        if (y = 4) {
                            // console.log(`Track.data[${x}][${y}] = ` + this.data[x][y]);
                            var chData4 = this.data[x][y];

                        }
                        if (y = 5) {
                            var chData5 = this.data[x][y];
                            // this.dataFill[x].price = chData5;
                            // this.dataFill.price = chData5;
                        }
                        if (y = 6) {
                            if (chData5) {
                                const chData6 = Number(this.data[x][y]);
                                // console.log(`Price.data6 = ${chData6}`);
                                // this.dataFill[x].price = chData5;
                            } else {
                                // console.log(`!!! Price.data[${x}][${y}] = ` + this.data[x][y]);
                                // this.dataFill[x].price = chData5;
                            }
                            // console.log(`data[${x}][${y}] = ` + Number(this.data[x][y]));
                        }
                        if (y = 22) {
                            // console.log(`Tel.data[${x}][${y}] = ` + this.data[x][y]);
                            var chData22 = this.data[x][y];
                            if (chData22.toString().length === 10) {
                                this.countTelsAll++;
                            }

                            const chkTel = this.orders.filter(r => r.customer.orderCustomerTel === chData22 );
                            // const chkTel = this.orders.filter(r => r.customer.orderCustomerTel === chData22 );
                            const chkAdd = chkTel.slice(0, 1);
                            if (chkTel.length > 0) {
                                if (chkTel[0].orderTracking !== '') {
                                    this.newTrackTrue++;
                                } else {
                                    this.newTrackFalse++;
                                }
                                // const map = new Map<any, any>();
                                // map.set('key', chData22);
                                // map.set('tracking', chData4);
                                // console.log(map.get('key'));
                                // console.log(map.get('tracking'));
                                if (this.dataFilter.length > 0) {
                                    const AAA = this.dataFilter.filter( rr => rr.orderODId === chkAdd[0].orderODId);
                                    if (AAA.length == 0) {
                                        this.contPush++;
                                        this.dataFilter.push(...chkAdd);
                                    }
                                } else {
                                    this.dataFilter.push(...chkAdd);
                                }
                                // this.dataFilter.push(...chkAdd);
                                this.dataFilter.forEach((r: Order) => {
                                    if (r.customer.orderCustomerTel === chData22 ) {
                                            r.tel = chData22;
                                            r.tracking = chData4;
                                    }
                                });
                                // console.log('ChkTel [True] = ' + chkTel[0].customer.orderCustomerTel);
                                xCountTrue++;
                                this.dataTelsTrackTrue++;

                            } else {
                                xCountFalse++;
                                if (xCountFalse === 1) {
                                    this.dataTelFalse += `\n`;
                                } else {
                                    this.dataTelFalse += `[${chData22} = ${chData4}],\n`;
                                }
                            }
                        }
                    }

                    if ((x + 1) === xLength) {
                        this.confirmTrue = true;
                    }
                }
            }
            console.log('dataFilterLength = ' + this.dataFilter.length);
            console.log('contPush = ' + this.contPush);
            // console.log('dataFilter = ' + JSON.stringify(this.dataFilter));

            if (xCountTrue === 0) {
                evt.target.value = '';
                this.dataFilter = [];
                this.confirmTrue = false;
                this.alertWarningPosition('dat is mistake !!!.', 'top');
                return false;
            } else {
                if (xCount > 0) {
                    this.countTelsFalse += xCountFalse;
                    // console.log('Count Tel = ' + xCount);
                    // console.log('Count[True] Tel = ' + xCountTrue);
                    // console.log('Count[False] Tel = ' + xCountFalse);
                    // this.alertWarningPosition(`${this.dataTelFalse}`, `top-end`); // skip alert //
                }
            }
            // console.log('dataExcel = ' + JSON.stringify(this.data));
            // console.log('this.dataFilter = ' + JSON.stringify(this.dataFilter));
        };
        reader.readAsBinaryString(target.files[0]);
    }

    export(): void {
        /* generate worksheet */
        // const aaaa = [
        // 	[],
        // 	[],
        // 	[],
        // 	[],
        // 	[],
        // 	[],
        // 	[],
        // 	[],
        // 	[],
        // 	[],
        // 	[3, 4, 5, 7, 6 ,7 ,7 ,8],
        // 	[this.data],
        // ];
        // const data = [
        // 	[],
        // 	[],
        // 	[],
        // 	[],
        // 	[],
        // 	[],
        // 	[],
        // 	[],
        // 	[],
        // 	[],
        // 	[3, 4, 5, 7, 6 ,7 ,7 ,8],
        // ];
        // const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, this.fileName);
    }

    updateTracking(dataFilter: Order[]) {

        const checkbox = (<HTMLInputElement>document.getElementById('checkbox')).checked;
        // alert(checkbox);
        let dataTrue = 0;
        let dataUpdateCount = 0;
        if (!dataFilter) {
            return;
        } else {
            // dataFilter.forEach(r => {
                // console.log('odODId = ' + r.orderODId);
                // console.log('odTracking = ' + r.orderTracking);
                // console.log('NewTracking = ' + r.tracking);
                // console.log('NewTel = ' + r.tel);
            // });
            dataFilter.forEach((sel: Order) => {
                this.chkTracking = '';
                if (dataFilter) {
                    this.order = sel;
                    // if ((sel.orderStatusCode === 0) && (sel.orderStatusName === 'process')) {
                    if ((sel.orderStatusCode <= 3) || (sel.orderStatusName === 'process')
                        || (sel.orderStatusName === 'print') || (sel.orderStatusName === 'waitpack')
                        || (sel.orderStatusName === 'pack')
                    ) {
                        dataTrue++;
                        this.order.orderId = sel.orderId;
                        // this.order.orderStatusCode = 1;
                        // this.order.orderStatusName = 'waitpack';
                        this.order.orderStatusCode = 3;
                        this.order.orderStatusName = 'pack';
                        this.order.orderLastupdate = new Date();
                        const hisName = 'ImportTracking';
                        var hisRemark = '';

                        if (sel.orderTracking === '') {
                            hisRemark = `เพิ่มสถานะการติดตาม (${this.order.orderODId}) (Import Tracking Number) => ${sel.tracking}`;
                            this.pushHistorysOrder(hisName, hisRemark);
                            this.order.orderTracking = sel.tracking;
                            this.order.delivery.orderTracking = sel.tracking;
                            dataUpdateCount++;
                            this.orderService.updateOrder(this.order).subscribe((update) => {
                            });

                        } else if ((sel.orderTracking.length > 0) || (sel.orderTracking.length === 13) ) {
                            hisRemark = `อัพเดทสถานะการติดตาม (${this.order.orderODId}) (${sel.orderTracking} => ${sel.tracking})`;
                            this.pushHistorysOrder(hisName, hisRemark);
                            this.order.orderTracking = sel.tracking;
                            this.order.delivery.orderTracking = sel.tracking;

                            if (checkbox) {
                                dataUpdateCount++;
                                this.orderService.updateOrder(this.order).subscribe((update) => {
                                });
                            }
                        }
                    } else {
                        // data += 'กรุณาคอนเฟิร์ม order : ' + sel.orderODId + ' ก่อนหน้านี้ก่อนนะครับ คุณข้ามขั้นตอนการทำงาน\n';
                    }
                }
            });
        }
        this.alertSuccessPosition(`ทำการอัพเดท Tracking Number (${dataUpdateCount} คำสั่งซื้อ) เรียบร้อยแล้ว`, 'top-end');
        // setTimeout(
        //     this.router.navigate(['management/orders/details']),
        //     10000);
        this.router.navigate(['management/orders/details']);
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

    onOpenpopup() {
        // this.route.url(`http://localhost:4567/`);
        // window.location.replace(`http://localhost:4567/`);
        // this.state =
        setTimeout(() => {
            // window.location.assign(`http://localhost:4567/`);
            window.open(`http://localhost:4567/`,'_blank');
        }, 3500);
    }

    fetchOrders() {
        this.sub = this.orderService.fetchOrder().subscribe(r => {
           this.orders = r;
           // this.ordersSelected = r.filter(p => (p.orderCheckedPrint === true) && (p.orderSelectedPrint === true));
           // this.selected = r.filter(p => (p.orderCheckedPrint === true) && (p.orderSelectedPrint === true));
           //  if (this.selected.length === 0) { this.router.navigate(['/management/orders', 'waitpacks']); }
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

    // this.fetchShipment();
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
            .subscribe( (r: Shipment[]) => {
                // console.log(r);
                this.shipments = r;
                // this.paymentForm.patchValue({ orderShipmentId: r[0].shipmentId });
            });
    }

    // fiveOrders(selected: any[], start: number): any[] {
    //     const end = start + 5;
    //     return selected.slice(start, end);
    // }

    ngAfterViewInit() {
      // console.log('afterinit');
      // setTimeout(() => {
              // console.log(this.table.nativeElement.innerText);
              // console.log(this.table.nativeElement.innerHTML);
          //     console.log(this.content.nativeElement.innerHTML);
          //     // console.log(this.table.nativeElement.value);
          //     console.log(this.orders);
      // }, 3000);
    }

    onBack() {
        // this.router.navigate(['/management/orders', 'waitpacks']);
        this.location.back();
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

    // add Sweetalert data conditions //
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
            timer: 10000
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
    // add Sweetalert data conditions //

    onSelect({selected}) {
        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
        // alert(this.selected.forEach(r => console.log(r + this.selected)));
        // this.selectedOrder = this.selected.push(...selected);
        // this.selectedtest = {...selected};
        // selected.forEach(r => console.log(r + this.selected));
    }

    onActivate(event) {
        // alert(event.target.checked);
        // console.log(event.target.checked);
        // console.log('Activate Event' + event.target.checked);
    }
}
