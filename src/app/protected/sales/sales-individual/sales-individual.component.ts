import {Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import {NgbDate, NgbCalendar, NgbDateStruct, NgbTabsetConfig} from '@ng-bootstrap/ng-bootstrap';

import {SaleUser} from '../sales.interface';
import {ReportsService} from '../sales.service';
import {environment as env} from '../../../../environments/environment';
import {User} from '../../users/users.interface';
import {UsersService} from '../../users/users.service';
import {Subscription} from 'rxjs/index';

import {BsDatepickerConfig} from 'ngx-bootstrap/datepicker';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {listLocales} from 'ngx-bootstrap/chronos';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {thLocale, enGbLocale} from 'ngx-bootstrap/locale';
defineLocale('th', thLocale);
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
    selector: 'app-sales-individual',
    templateUrl: './sales-individual.component.html',
    styleUrls: [
        './sales-individual.component.scss',
        '../../../../assets/icon/icofont/css/icofont.scss'
    ]
})
export class SalesIndividualComponent implements OnInit, OnDestroy, AfterViewInit {

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

    reportData: SaleUser[] = [] as SaleUser[];
    // reportSumAPTotal: number;
    reportSumODTotal: number;
    reportSumPPATotal: number;
    reportSumCommTotal: number;
    reportOrderUsers: SaleUser[] = [] as SaleUser[];
    saleusers: SaleUser[] = [] as SaleUser[];
    user: User = {} as User;
    users: User[] = [] as User[];
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
        private userService: UsersService,
        private localeService: BsLocaleService
    ) {
        this.ActiveVal = 'Day';
        this.sub = this.userService.fetchUser()
            .subscribe((r: User[]) => {
                this.users = r;
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

        // this.fetchUsers();
        // const rangeUserAmount = '2019-03-01 - 2019-03-30';
        // this.rangeDateDefualt = '2019-03-01 - 2019-03-30';
        // this.fetchReportSalesUsersAmount(rangeUserAmount);
        // this.fetchReportSalesUsersAmount(this.rangeDateDefualt);
        // this.fetchOrderMapUser(this.rangeDateDefualt);
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

        // console.log('Count User = ' + this.users.length);


        // this.fetchOrderMapUser('2019-04-03 - 2019-04-03');
        // const date = new Date();
        // const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        // const lastDay = new Date(date.getFullYear(), date.getMonth() + 4, 0);
        //
        // this.firstDate = {year: firstDay.getFullYear(), month: firstDay.getMonth() + 1, day: 1} ;
        // this.lastDate = {year: lastDay.getFullYear(), month: lastDay.getMonth() + 4, day: (lastDay.getDate())};
        // this.selectToday();
        // this.selectDateRange();

        // this.sub = this.reportService.fetchReportSalesUsersAmount(this.rangeDateDefualt)
        //     .map(resp => {
        //         // console.log('resp = ' + JSON.stringify(resp));
        //         this.reportOrderUsers = resp;
        //         this.reportSumAPTotal = 0;
        //         this.reportSumODTotal = 0;
        //         this.reportSumPPATotal = 0;
        //         this.reportOrderUsers.map((o) => {
        //             //     (console.log('oid = ' + o._id.idO));
        //             // this.userService.fetchUser()
        //             //     .subscribe((rr: User[]) => {
        //             //         this.users = rr;
        //             //         // console.log(' id ' + o._id.idO);
        //
        //             this.users.filter((rrr: User, err) => {
        //                 // if (err) {
        //                 //     // alert('err = ' + err);
        //                 //     console.log('err = ' + err);
        //                 // }
        //                 if (rrr.userId === o._id.idO) {
        //                     // console.log('dataNew = ' + o._id.idO + ' && ' + rrr.userCodename + ' && ' + rrr.userName);
        //                     o.userId = rrr.userId;
        //                     o.userName = rrr.userName;
        //                     o.userCodename = rrr.userCodename;
        //                     o.userPiece = rrr.userPiece;
        //                     o.userTotal = rrr.userTotal;
        //                     o.userHold = rrr.userHold;
        //                     o.userRemain = (rrr.userTotal - rrr.userHold);
        //                     o.usersTotalPrice = (rrr.userPiece * o.usersAmount);
        //
        //                     this.reportSumAPTotal += o.usersAmount;
        //                     this.reportSumODTotal += o.usersSumCount;
        //                     this.reportSumPPATotal += o.usersTotalPrice;
        //                 }
        //                 // return o;
        //             });
        //             //     } );
        //             return o;
        //         });
        //         return resp;
        //         // console.log(new Date() + '\n' + 'Resualt = ' + JSON.stringify(this.reportData));
        //     })
        //     .subscribe((resp: SaleUser[]) => {
        //         this.reportData = resp;
        //         // console.log('Data = ' + JSON.stringify(this.reportData) + resp[0].userName);
        //     });
    }

    // fetchReportSalesUsersAmount(rangeUserAmount) {
    //     // this.reportService.fetchReportSalesUsersAmount(rangeUserAmount)
    //     //     .subscribe(r => {
    //     //     this.reportData = r;
    //     //     // console.log('reportData = ' + JSON.stringify(this.reportData));
    //     // });
    //     this.sub = this.reportService.fetchReportSalesUsersAmount(rangeUserAmount)
    //         .map((r: SaleUser[]) => {
    //
    //         // .subscribe(r => {
    //             // this.reportData = r;
    //             r.forEach((o: SaleUser) => {
    //             //     (console.log('oid = ' + o._id.idO));
    //                 this.userService.fetchViewUserId(o._id.idO)
    //                     .map((m: User) => {
    //                         if (m.userId === o._id.idO) {
    //                             o.userName = m.userName;
    //                             o.userCodename = m.userCodename;
    //                         }
    //                         return m;
    //                     });
    //                 // console.log('O =' + JSON.stringify(o));
    //                 return o;
    //             });
    //             // console.log('R =' + JSON.stringify(r));
    //             return r;
    //         })
    //         .subscribe((resp: SaleUser[]) => {
    //         // console.log('resp = ' + JSON.stringify(resp));
    //             this.reportData = resp;
    //     });
    // }
    //
    // fetchUsers() {
    //     this.sub = this.userService.fetchUser()
    //         .map((m: User[]) => {
    //             let x = 0;
    //             m.map(r => {
    //                 r.index = ++x;
    //                 if (r.userImage) {
    //                     r.userImage = `${env.serverAPI}/images/user/` + r.userImage;
    //                 } else {
    //                     r.userImage = `${env.serverAPI}/images/image-blank.jpg`;
    //                 }
    //                 return r;
    //             });
    //             return m;
    //         })
    //         .subscribe(resp => {
    //             this.users = resp;
    //             // console.log('this.users = ' + JSON.stringify(this.users));
    //         });
    // }

    fetchOrderMapUser(rangeDate) {
        if (!rangeDate) {
            return;
        }

        this.sub = this.reportService.fetchReportSalesUsersAmount(rangeDate)
            .map((resp: SaleUser[]) => {
                this.reportOrderUsers = resp;
                // this.reportSumAPTotal = 0;
                this.reportSumODTotal = 0;
                this.reportSumPPATotal = 0;
                this.reportSumCommTotal = 0;
                this.reportOrderUsers.map((o: SaleUser) => {
                    this.users.filter((rrr: User) => {
                        if (rrr.userId === o._id.userId) {
                            o.userId = rrr.userId;
                            o.userName = rrr.userName;
                            o.userLevel = rrr.userLevel;
                            if (o.usersTotal >= 600000) {
                                o.userComm = ((o.usersTotal * 2) / 100);
                            } else {
                                o.userComm = ((o.usersTotal * 1) / 100);
                            }

                            // o.userCodename = rrr.userCodename;
                            // o.userPiece = rrr.userPiece;
                            // o.userTotal = rrr.userTotal;
                            // o.userHold = rrr.userHold;
                            // o.userRemain = (rrr.userTotal - rrr.userHold);
                            // o.usersTotalPrice = (rrr.userPiece * o.usersAmount);

                            // this.reportSumAPTotal += o.usersAmount;
                            this.reportSumODTotal += o.usersSumCount;
                            this.reportSumPPATotal += o.usersTotal;
                            this.reportSumCommTotal += o.userComm;
                        }
                    });
                    //     } );
                    return o;
                });
                return resp;
            })
            .subscribe((r: SaleUser[]) => {
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
        this.ActiveVal =val;
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
        this.fetchOrderMapUser(this.bsRangeValueDefualtStr);
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
            // console.log('Users Length = ' + this.users.length);
            // console.log('reportUser Length = ' + this.reportData);
        }
        setTimeout(() => {
            this.fetchOrderMapUser(this.rangeDateDefualt);
            // this.fetchOrderMapUser(this.bsRangeValueDefualtStr);
        }, 1000);
    }

}
