import {Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import {NgbDate, NgbCalendar, NgbDateStruct, NgbTabsetConfig} from '@ng-bootstrap/ng-bootstrap';

import {SaleChannel} from '../sales.interface';
import {ReportsService} from '../sales.service';
import {environment as env} from '../../../../environments/environment';
import {Channel} from '../../channels/channels.interface';
import {ChannelsService} from '../../channels/channels.service';
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
  selector: 'app-sales-channel',
  templateUrl: './sales-channel.component.html',
  styleUrls: [
      './sales-channel.component.scss',
      '../../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class SalesChannelComponent implements OnInit, OnDestroy, AfterViewInit {

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

    reportData: SaleChannel[] = [] as SaleChannel[];
    // reportSumAPTotal: number;
    reportSumODTotal: number;
    reportSumPPATotal: number;
    reportOrderChannels: SaleChannel[] = [] as SaleChannel[];
    salechannels: SaleChannel[] = [] as SaleChannel[];
    channel: Channel = {} as Channel;
    channels: Channel[] = [] as Channel[];
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
        private channelService: ChannelsService,
        private xlsxService: XlsxService,
        private localeService: BsLocaleService
    ) {
        this.ActiveVal = 'Day';
        this.sub = this.channelService.fetchChannel()
            .subscribe((r: Channel[]) => {
                this.channels = r;
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

        // this.fetchChannels();
        // const rangeChannelAmount = '2019-03-01 - 2019-03-30';
        // this.rangeDateDefualt = '2019-03-01 - 2019-03-30';
        // this.fetchReportSalesChannelsAmount(rangeChannelAmount);
        // this.fetchReportSalesChannelsAmount(this.rangeDateDefualt);
        // this.fetchOrderMapChannel(this.rangeDateDefualt);
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

        // console.log('Count Channel = ' + this.channels.length);


        // this.fetchOrderMapChannel('2019-04-03 - 2019-04-03');
        // const date = new Date();
        // const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        // const lastDay = new Date(date.getFullYear(), date.getMonth() + 4, 0);
        //
        // this.firstDate = {year: firstDay.getFullYear(), month: firstDay.getMonth() + 1, day: 1} ;
        // this.lastDate = {year: lastDay.getFullYear(), month: lastDay.getMonth() + 4, day: (lastDay.getDate())};
        // this.selectToday();
        // this.selectDateRange();

        // this.sub = this.reportService.fetchReportSalesChannelsAmount(this.rangeDateDefualt)
        //     .map(resp => {
        //         // console.log('resp = ' + JSON.stringify(resp));
        //         this.reportOrderChannels = resp;
        //         this.reportSumAPTotal = 0;
        //         this.reportSumODTotal = 0;
        //         this.reportSumPPATotal = 0;
        //         this.reportOrderChannels.map((o) => {
        //             //     (console.log('oid = ' + o._id.idO));
        //             // this.channelService.fetchChannel()
        //             //     .subscribe((rr: Channel[]) => {
        //             //         this.channels = rr;
        //             //         // console.log(' id ' + o._id.idO);
        //
        //             this.channels.filter((rrr: Channel, err) => {
        //                 // if (err) {
        //                 //     // alert('err = ' + err);
        //                 //     console.log('err = ' + err);
        //                 // }
        //                 if (rrr.channelId === o._id.idO) {
        //                     // console.log('dataNew = ' + o._id.idO + ' && ' + rrr.channelCodename + ' && ' + rrr.channelName);
        //                     o.channelId = rrr.channelId;
        //                     o.channelName = rrr.channelName;
        //                     o.channelCodename = rrr.channelCodename;
        //                     o.channelPiece = rrr.channelPiece;
        //                     o.channelTotal = rrr.channelTotal;
        //                     o.channelHold = rrr.channelHold;
        //                     o.channelRemain = (rrr.channelTotal - rrr.channelHold);
        //                     o.channelsTotalPrice = (rrr.channelPiece * o.channelsAmount);
        //
        //                     this.reportSumAPTotal += o.channelsAmount;
        //                     this.reportSumODTotal += o.channelsSumCount;
        //                     this.reportSumPPATotal += o.channelsTotalPrice;
        //                 }
        //                 // return o;
        //             });
        //             //     } );
        //             return o;
        //         });
        //         return resp;
        //         // console.log(new Date() + '\n' + 'Resualt = ' + JSON.stringify(this.reportData));
        //     })
        //     .subscribe((resp: SaleChannel[]) => {
        //         this.reportData = resp;
        //         // console.log('Data = ' + JSON.stringify(this.reportData) + resp[0].channelName);
        //     });
    }

    // fetchReportSalesChannelsAmount(rangeChannelAmount) {
    //     // this.reportService.fetchReportSalesChannelsAmount(rangeChannelAmount)
    //     //     .subscribe(r => {
    //     //     this.reportData = r;
    //     //     // console.log('reportData = ' + JSON.stringify(this.reportData));
    //     // });
    //     this.sub = this.reportService.fetchReportSalesChannelsAmount(rangeChannelAmount)
    //         .map((r: SaleChannel[]) => {
    //
    //         // .subscribe(r => {
    //             // this.reportData = r;
    //             r.forEach((o: SaleChannel) => {
    //             //     (console.log('oid = ' + o._id.idO));
    //                 this.channelService.fetchViewChannelId(o._id.idO)
    //                     .map((m: Channel) => {
    //                         if (m.channelId === o._id.idO) {
    //                             o.channelName = m.channelName;
    //                             o.channelCodename = m.channelCodename;
    //                         }
    //                         return m;
    //                     });
    //                 // console.log('O =' + JSON.stringify(o));
    //                 return o;
    //             });
    //             // console.log('R =' + JSON.stringify(r));
    //             return r;
    //         })
    //         .subscribe((resp: SaleChannel[]) => {
    //         // console.log('resp = ' + JSON.stringify(resp));
    //             this.reportData = resp;
    //     });
    // }
    //
    // fetchChannels() {
    //     this.sub = this.channelService.fetchChannel()
    //         .map((m: Channel[]) => {
    //             let x = 0;
    //             m.map(r => {
    //                 r.index = ++x;
    //                 if (r.channelImage) {
    //                     r.channelImage = `${env.serverAPI}/images/channel/` + r.channelImage;
    //                 } else {
    //                     r.channelImage = `${env.serverAPI}/images/image-blank.jpg`;
    //                 }
    //                 return r;
    //             });
    //             return m;
    //         })
    //         .subscribe(resp => {
    //             this.channels = resp;
    //             // console.log('this.channels = ' + JSON.stringify(this.channels));
    //         });
    // }

    fetchOrderMapChannel(rangeDate) {
        if (!rangeDate) {
            return;
        }

        this.sub = this.reportService.fetchReportSalesChannelsAmount(rangeDate)
            .map((resp: SaleChannel[]) => {
                this.reportOrderChannels = resp;
                // this.reportSumAPTotal = 0;
                this.reportSumODTotal = 0;
                this.reportSumPPATotal = 0;
                this.reportOrderChannels.map((o: SaleChannel) => {
                    this.channels.filter((rrr: Channel) => {
                        if (rrr.channelId === o._id.channelId) {
                            o.channelId = rrr.channelId;
                            o.channelName = rrr.channelName;
                            // o.channelCodename = rrr.channelCodename;
                            // o.channelPiece = rrr.channelPiece;
                            // o.channelTotal = rrr.channelTotal;
                            // o.channelHold = rrr.channelHold;
                            // o.channelRemain = (rrr.channelTotal - rrr.channelHold);
                            // o.channelsTotalPrice = (rrr.channelPiece * o.channelsAmount);

                            // this.reportSumAPTotal += o.channelsAmount;
                            this.reportSumODTotal += o.channelsSumCount;
                            this.reportSumPPATotal += o.channelsTotal;
                        }
                    });
                    //     } );
                    return o;
                });
                return resp;
            })
            .subscribe((r: SaleChannel[]) => {
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
        this.fetchOrderMapChannel(this.bsRangeValueDefualtStr);
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
            // console.log('Channels Length = ' + this.channels.length);
            // console.log('reportChannel Length = ' + this.reportData);
        }
        setTimeout(() => {
            this.fetchOrderMapChannel(this.rangeDateDefualt);
            // this.fetchOrderMapChannel(this.bsRangeValueDefualtStr);
        }, 1000);
    }


    exportReportSaleChannelsAllToExcel(rchannels) {
        // const selectedOrders = this.orders.filter(o => o.selected);
        // console.log('channel = ' + JSON.stringify(this.channels));
        // console.log('shipment = ' + JSON.stringify(this.shipments));
        this.xlsxService.exportExcelReportSaleChannelsAll(rchannels);
    }
}
