import {AfterViewInit, Component, OnInit, OnDestroy, ViewEncapsulation, NgZone} from '@angular/core';
import {ShipmentService} from '../../shipments/shipments.service';
import {ProductsService} from '../../products/products.service';
import {ChannelsService} from '../../channels/channels.service';
import {ActivatedRoute, Router} from '@angular/router';
import {OrdersService} from '../../orders/orders.service';
import {Location} from '@angular/common';
import {Order} from '../../orders/orders.interface';
import {Report, SaleReport} from '../../orders/reports.interface';
import {forkJoin, of, Subscription} from 'rxjs';
import {environment as env} from '../../../../environments/environment';


// /*import {NotificationsService} from 'angular2-notifications';*/
// declare const AmCharts: any;
// declare var $: any;
// import '../../../../assets/charts/amchart/amcharts.js';
// import '../../../../assets/charts/amchart/gauge.js';
// import '../../../../assets/charts/amchart/pie.js';
// import '../../../../assets/charts/amchart/serial.js';
// import '../../../../assets/charts/amchart/light.js';
// import '../../../../assets/charts/amchart/ammap.js';
// import '../../../../assets/charts/amchart/usaLow.js';
//
// import '../../../../assets/charts/float/jquery.flot.js';
// import '../../../../assets/charts/float/jquery.flot.categories.js';
// import '../../../../assets/charts/float/curvedLines.js';
// import '../../../../assets/charts/float/jquery.flot.tooltip.min.js';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
am4core.useTheme(am4themes_animated);

@Component({
    selector: 'app-default',
    templateUrl: './default.component.html',
    styleUrls: ['./default.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DefaultComponent implements OnInit, OnDestroy, AfterViewInit {

    private chart: am4charts.XYChart;
    private chartYearly: am4charts.XYChart;

    private sub: Subscription = null;
    private dataSub: Subscription = null;
    ENVserverAPI = env.serverAPI;
    private timer: number;
    stateChange = 'Monthly';
    order: Order = {} as Order;
    orders: Order[] = [] as Order[];
    ordersDayNow: Order[] = [] as Order[];
    ordersMonthNow: Order[] = [] as Order[];
    ordersYearNow: Order[] = [] as Order[];

    reportsDayNow: Report[] = [] as Report[];
    reportsMonthNow: Report[] = [] as Report[];
    reportsYearNow: Report[] = [] as Report[];

    saleReportsMonthly: SaleReport[] = [] as SaleReport[];
    saleReportsYearly: SaleReport[] = [] as SaleReport[];
    sumsaleReportsMonthlyTotalPrices: number;
    sumsaleReportsMonthlyTotalOrders: number;
    sumSaleReportsYearlyTotalPrices: number;
    sumSaleReportsYearlyTotalOrders: number;

    ordersCalSumTotal: number;
    ordersCalSumTotalByYear: number;
    ordersCalSumTotalByMonth: number;
    ordersCalSumTotalByDay: number;
    ordersCalSumTotalProductAmountByDay: number;
    rangeToday: any;
    rangeWeekday: any;
    rangeMonth: any;
    rangeYear: any;
    thisYearNow: any;
    thisYearMonthNow: any;
    now = new Date();
    dataYearNow = [];
    monthsNow = this.now.getMonth() + 1;

    selectedChartByMonth: boolean;
    selectedChartByYear: boolean;
    dataChart: string;
    // selectedChartByMonth: string;
    // selectedChartByYear: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private orderService: OrdersService,
        private channelService: ChannelsService,
        private shipmentService: ShipmentService,
        private productService: ProductsService,
        private zone: NgZone
    ) {
        // private servicePNotify: NotificationsService
    }

    ngOnInit() {
        // this.selectedChartByMonth = true;
        // test setInterval runtime //
        // const ti = 75;
        // const count = 0;
        // let sum = 0;
        // setInterval(() => {
        //     // sum = (count + ti);
        //     // console.log('data = ' + sum);
        // // }, 1000);
        // // console.log('data = ' + (sum + sum));
        // // test setInterval runtime //
        //
        const today = new Date();
        const dd = today.getDate();
        const mm = today.getMonth() + 1;
        const yyyy = today.getFullYear();
        // const rangeToday = (yyyy + '-' + this.checkMonth(mm) + '-' + this.checkMonth(dd));
        this.rangeToday = (yyyy + '-' + this.checkMonth(mm) + '-' + this.checkMonth(dd)) + ' - ' + (yyyy + '-' + this.checkMonth(mm) + '-' + this.checkMonth(dd));
        this.rangeWeekday = (yyyy + '-02-11 - ' + yyyy + '-02-31');
        this.rangeMonth = (yyyy + '-' + this.checkMonth(mm) + '-01 - ' + yyyy + '-' + this.checkMonth(mm) + '-' + this.checkMonth(this.daysInMonth(yyyy, mm)));
        this.rangeYear = (yyyy + '-01-01 - ' + yyyy + '-12-31');
        this.thisYearNow = today.getFullYear();
        this.thisYearMonthNow = today.getFullYear() + '-' + this.checkMonth(mm);
        // console.log('toDay = ' + yyyy + '-' + this.checkMonth(mm) + '-' + this.checkMonth(dd));
        // console.log('rangetoDay = ' + this.rangeToday);
        // console.log('rangetoMonth = ' + this.rangeMonth);
        // console.log('rangetoYear = ' + this.rangeYear);

        // start query orders function to report //
        this.onSelectedRangDateByDay(this.rangeToday);
        // console.log('OnInit this.rangeToday = ' + this.rangeToday);
        // console.log('OnInit this.rangeMonth = ' + this.rangeMonth);
        // console.log('OnInit this.thisYearMonthNow = ' + this.thisYearMonthNow);
        // console.log('OnInit this.thisYearNow = ' + this.thisYearNow);
        this.onSelectedRangDateByMonth(this.rangeMonth);
        // this.onSelectedRangDateByYear(this.rangeYear);
        this.onSaleReportsMonthly(this.thisYearMonthNow);
        this.onSaleReportsYearly(this.thisYearNow);
        // start query orders function to report //
        if (this.stateChange === 'Yearly') {
            // this.onfetchDashboardYearly(this.thisYearNow);
            this.onSelectedRangDateByYear(this.rangeYear);
        } else {
            // this.onSelectedRangDateByMonth(this.rangeMonth);
            this.onfetchDashboardMonthly(this.thisYearMonthNow);
        }
        //
        // }, 1000);
    }

    onChangeState (stateVal) {
        if (stateVal) {
            this.stateChange = stateVal;
        }
    }
    checkYearMonth(year, month) {
        if ( month > 12 ) {
            // const newMonth = (month - 12);
            var numMonth = ('0' + (month - 12)).slice(-2);
            var newYear = (year + 1);
            return newYear + '-' + numMonth + '-01';
        } else {
            var numMonth = ('0' + month).slice(-2);
            var newYear = year;
            return newYear + '-' + numMonth + '-01';
        }
    }
    daysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }
    monthsInMonth(year, month) {
        return new Date(year, month).getMonth();
    }
    yearsInMonth(year, month) {
        return new Date(year, month).getFullYear();
    }
    checkDays(days: any) {
        if ( days.length !== 2) {
            var day = ('0' + days).slice(-2);
            return day;
        } else {
            return days;
        }
    }

    onSelectedRangDateByDay(rangDate?: any) {
        this.sub = this.orderService.fetchOrderRangDate(rangDate).subscribe((r: Order[]) => {
            //// summary orderToday report dashboard ////
            this.ordersCalSumTotalByDay = 0;
            this.ordersCalSumTotalProductAmountByDay = 0;
            this.ordersDayNow = r;
            this.ordersDayNow.forEach(p => {
                this.ordersCalSumTotalByDay = this.ordersCalSumTotalByDay + p.orderTotal;
                p.products.forEach(a => {
                    this.ordersCalSumTotalProductAmountByDay = this.ordersCalSumTotalProductAmountByDay + a.amount;
                });
            });
            //// summary orderToday report dashboard ////
        });
    }
    onSelectedRangDateByMonth(rangDate?: any) {
        this.sub = this.orderService.fetchOrderRangDate(rangDate).subscribe((r: Order[]) => {
            //// summary orderYearNow report dashboard ////
            this.ordersCalSumTotalByMonth = 0;
            this.ordersMonthNow = r;
            this.ordersMonthNow.forEach(p => {
                this.ordersCalSumTotalByMonth = this.ordersCalSumTotalByMonth + p.orderTotal;
            });
            this.dataChart = `ยอดขายเดือนนี้: (฿${this.formatNumber(this.ordersCalSumTotalByMonth)} บาท) | คำสั่งซื้อทั้งหมด: ${this.formatNumber(this.ordersMonthNow.length)} ออเดอร์`;
            //// summary orderYearNow report dashboard ////
        });
    }
    onSelectedRangDateByYear(rangDate?: any) {
        this.sub = this.orderService.fetchOrderRangDate(rangDate).subscribe((r: Order[]) => {
            //// summary orderYearNow report dashboard ////
            this.ordersCalSumTotalByYear = 0;
            this.ordersYearNow = r;
            this.ordersYearNow.forEach(p => {
                this.ordersCalSumTotalByYear = this.ordersCalSumTotalByYear + p.orderTotal;
            });
            this.dataChart = `ยอดขายประจำปี ${this.now.getFullYear()}: (฿${this.formatNumber(this.ordersCalSumTotalByYear)} บาท) | คำสั่งซื้อทั้งหมด: ${this.formatNumber(this.ordersYearNow.length)} ออเดอร์`;
            //// summary orderYearNow report dashboard ////
        });
    }
    onSaleReportsMonthly(rangDate?: any) {
        this.sumsaleReportsMonthlyTotalPrices = 0;
        this.sumsaleReportsMonthlyTotalOrders = 0;
        this.sub = this.orderService.fetchDashboardMonthlySale(rangDate).subscribe((r: SaleReport[]) => {
            this.saleReportsMonthly = r;
            r.map(rr => {
                this.sumsaleReportsMonthlyTotalPrices += rr.totalPrice;
                this.sumsaleReportsMonthlyTotalOrders += rr.sumCount;
            });
        });
    }
    onSaleReportsYearly(rangDate?: any) {
        this.sumSaleReportsYearlyTotalPrices = 0;
        this.sumSaleReportsYearlyTotalOrders = 0;
        this.sub = this.orderService.fetchDashboardYearlySale(rangDate)
            .subscribe((r: SaleReport[]) => {
                this.saleReportsYearly = r;
                r.map(rr => {
                    this.sumSaleReportsYearlyTotalPrices += rr.totalPrice;
                    this.sumSaleReportsYearlyTotalOrders += rr.sumCount;
                });
            });
    }

    checkMonth(value) {
        if (value < 10) {
            value = '0' + value;
        }
        return value;
    }

    // Destroy data unsubscript //
    ngOnDestroy() {
        clearInterval(this.timer);
        if (this.dataSub !== null) {
            this.dataSub.unsubscribe();
        }
        if (this.sub !== null) {
            this.sub.unsubscribe();
        }
        // this.zone.runOutsideAngular(() => {
        //     if (this.chart) {
        //         this.chart.dispose();
        //     }
        // });
    }

    ngAfterViewInit() {
        /*setTimeout(() => {
          const windowWidth = window.innerWidth;
          if (windowWidth > 992) {
            this.options = {
              position: ['bottom', 'right'],
              maxStack: 8,
              timeOut: 2000,
              showProgressBar: true,
              pauseOnHover: true,
              lastOnBottom: true,
              clickToClose: true,
              preventDuplicates: false,
              preventLastDuplicates: false,
              theClass: 'bg-c-red no-icon',
              rtl: false,
              animate: 'rotate'
            };
            let html = '<h4>Live customizer</h4> <p>Click on Right Gear icon <i class="feather icon-settings"></i>';
            html += 'for apply live styles very first time in Angular 5.</p>';
            this.servicePNotify.html(
              html,
              'success'
            );
          }
        }, 75);*/
        //
        //     this.zone.runOutsideAngular(() => {
        //         // let chart = am4core.create('chartdiv', am4charts.XYChart);
        //         //
        //         // chart.paddingRight = 20;
        //         //
        //         // let data = [];
        //         // let visits = 10;
        //         // for (let i = 1; i < 366; i++) {
        //         //     visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
        //         //     data.push({ date: new Date(2018, 0, i), name: 'name' + i, value: visits });
        //         // }
        //         //
        //         // chart.data = data;
        //         //
        //         // let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        //         // dateAxis.renderer.grid.template.location = 0;
        //         //
        //         // let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        //         // valueAxis.tooltip.disabled = true;
        //         // valueAxis.renderer.minWidth = 35;
        //         //
        //         // let series = chart.series.push(new am4charts.LineSeries());
        //         // series.dataFields.dateX = 'date';
        //         // series.dataFields.valueY = 'value';
        //         //
        //         // series.tooltipText = '{valueY.value}';
        //         // chart.cursor = new am4charts.XYCursor();
        //         //
        //         // let scrollbarX = new am4charts.XYChartScrollbar();
        //         // scrollbarX.series.push(series);
        //         // chart.scrollbarX = scrollbarX;
        //         //
        //         // this.chart = chart;
        //
        //
        //
        //         // add new data amchart4 //
        //         const chart = am4core.create('chartdiv', am4charts.XYChart);
        //         const data = [];
        //
        //         // this.orderService.fetchOrderRangDate(this.rangeYear).subscribe((r: Order[]) => {
        //         //     //// summary orderYearNow report dashboard ////
        //         //     // this.ordersCalSumTotalByYear = 0;
        //         //     // console.log(r);
        //         //     this.ordersYearNow = r;
        //         //     this.ordersYearNow.forEach(p => {
        //         //         // this.ordersCalSumTotalByYear = this.ordersCalSumTotalByYear + p.orderTotal;
        //         //         data.push({
        //         //             'year': p.orderCreated, 'income': p.orderTotal, 'expenses': p.orderTotal
        //         //         });
        //         //
        //         //         // 'year': '2014',
        //         //         //     'income': 23.5,
        //         //         //     'expenses': 21.1,
        //         //         //     'lineColor': chart.colors.next()
        //         //       // return this.ordersYearNow;
        //         //     });
        //         //     // return this.dataYearNow;
        //         //     //// summary orderYearNow report dashboard ////
        //         //
        //         //     // data.push({
        //         //     //      'year': '2019-02', 'income': 46, 'expanses': 55,
        //         //     //  });
        //         // });
        //         // console.log(this.ordersYearNow);
        //
        //         // let id = '';
        //         // let income = '';
        //         // let expanses = '';
        //
        //         this.orderService.fetchOrderRangDate(this.rangeWeekday)
        //                 .subscribe( (r) => {
        //                         this.ordersYearNow = r;
        //                         console.log(this.ordersYearNow.length);
        //                         this.ordersYearNow.forEach((p) => {
        //                     // id = p.orderId;
        //                     // income = p.orderId;
        //                     // expanses = p.orderId;
        //
        //                     console.log(p.orderId);
        //                     console.log(p.orderTotal);
        //                     // console.log(expanses);
        //
        //                     data.push({
        //                         // date: new Date(2018, 0, i), name: 'name' + i, value: visits
        //                         'year': p.orderId, 'income': p.orderId, 'expanses': p.orderId
        //
        //                     });
        //                 });
        //                 // data.push({
        //                 //     // date: new Date(2018, 0, i), name: 'name' + i, value: visits
        //                 //     // year: '' + p.orderId + '', income: p.orderId, expanses: p.orderTotal
        //                 //     year: id, income: income, expanses: expanses
        //                 //
        //                 //
        //                 // });
        //
        //             } );
        //         // const data = [];
        //         // let visits = 10;
        //         // for (let i = 1; i <= 12; i++) {
        //         //           //         // visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
        //         //           //         if (i % 3) {
        //         //           //           console.log('$' + i + ' = ' + i);
        //         //           //             data.push({
        //         //           //                 // date: new Date(2018, 0, i), name: 'name' + i, value: visits
        //         //           //                 'year': i, 'income': i, 'expanses': visits, 'lineColor': chart.colors.next()
        //         //           //
        //         //           //             });
        //         //           //         } else {
        //         //           //           console.log('false ' + i + ' = ' + i);
        //         //           //             data.push({
        //         //           //                 // date: new Date(2018, 0, i), name: 'name' + i, value: visits
        //         //           //                 'year': i, 'income': i, 'expanses': visits
        //         //           //             });
        //         //           //         }
        //         //           //     }
        //         // this.ordersYearNow;
        //
        //         // chart.data = [
        //         //     {
        //         //         'year': '2019-01', 'income': 45, 'expanses': 55,
        //         //     }, {
        //         //         'year': '2019-02', 'income': 46, 'expanses': 55,
        //         //     }];
        //         // chart.data = data.push(
        //         //     {
        //         //         'year': '2019-01', 'income': 45, 'expanses': 55,
        //         //     }, {
        //         //         'year': '2019-02', 'income': 46, 'expanses': 55,
        //         //     }
        //         // );
        //         // chart.data = data;
        //         chart.data = data;
        //
        //         console.log('chart log =' + chart.data);
        //         // chart.data = [{
        //         //     'year': '2014',
        //         //     'income': 23.5,
        //         //     'expenses': 21.1,
        //         //     // 'lineColor': chart.colors.next()
        //         // }, {
        //         //     'year': '2015',
        //         //     'income': 26.2,
        //         //     'expenses': 30.5
        //         // }, {
        //         //     'year': '2016',
        //         //     'income': 30.1,
        //         //     'expenses': 34.9
        //         // }, {
        //         //     'year': '2017',
        //         //     'income': 20.5,
        //         //     'expenses': 23.1
        //         // }, {
        //         //     'year': '2018',
        //         //     'income': 30.6,
        //         //     'expenses': 28.2,
        //         //     // 'lineColor': chart.colors.next()
        //         // }, {
        //         //     'year': '2019',
        //         //     'income': 34.1,
        //         //     'expenses': 31.9
        //         // }, {
        //         //     'year': '2020',
        //         //     'income': 34.1,
        //         //     'expenses': 31.9
        //         // }, {
        //         //     'year': '2021',
        //         //     'income': 34.1,
        //         //     'expenses': 31.9,
        //         //     // 'lineColor': chart.colors.next()
        //         // }, {
        //         //     'year': '2022',
        //         //     'income': 34.1,
        //         //     'expenses': 31.9
        //         // }, {
        //         //     'year': '2023',
        //         //     'income': 34.1,
        //         //     'expenses': 31.9
        //         // }, {
        //         //     'year': '2024',
        //         //     'income': 34.1,
        //         //     'expenses': 31.9
        //         // }];
        //
        //         const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        //         categoryAxis.renderer.grid.template.location = 0;
        //         categoryAxis.renderer.ticks.template.disabled = true;
        //         categoryAxis.renderer.line.opacity = 0;
        //         categoryAxis.renderer.grid.template.disabled = true;
        //         categoryAxis.renderer.minGridDistance = 40;
        //         categoryAxis.dataFields.category = 'year';
        //         categoryAxis.startLocation = 0.4;
        //         categoryAxis.endLocation = 0.6;
        //
        //         const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        //         valueAxis.tooltip.disabled = true;
        //         valueAxis.renderer.line.opacity = 0;
        //         valueAxis.renderer.ticks.template.disabled = true;
        //         valueAxis.min = 0;
        //
        //         const lineSeries = chart.series.push(new am4charts.LineSeries());
        //         lineSeries.dataFields.categoryX = 'year';
        //         lineSeries.dataFields.valueY = 'income';
        //         lineSeries.tooltipText = 'income: {valueY.value}';
        //         lineSeries.fillOpacity = 0.5;
        //         lineSeries.strokeWidth = 3;
        //         lineSeries.propertyFields.stroke = 'lineColor';
        //         lineSeries.propertyFields.fill = 'lineColor';
        //
        //         const bullet = lineSeries.bullets.push(new am4charts.CircleBullet());
        //         bullet.circle.radius = 6;
        //         bullet.circle.fill = am4core.color('#fff');
        //         bullet.circle.strokeWidth = 3;
        //
        //         chart.cursor = new am4charts.XYCursor();
        //         chart.cursor.behavior = 'panX';
        //         chart.cursor.lineX.opacity = 0;
        //         chart.cursor.lineY.opacity = 0;
        //
        //         chart.scrollbarX = new am4core.Scrollbar();
        //         // chart.scrollbarX.parent = chart.bottomAxesContainer;
        //         chart.scrollbarX.parent = chart.topAxesContainer;
        //         // add new data amchart4 //
        //     });


        // setInterval(() => {
        // sum = (count + ti);
        // console.log('data = ' + sum);
        // }, 1000);
        // console.log('data = ' + (sum + sum));
        // test setInterval runtime //


        // const today = new Date();
        // const dd = today.getDate();
        // const mm = today.getMonth() + 1;
        // const yyyy = today.getFullYear();
        // this.rangeToday = (yyyy + '-' + this.checkMonth(mm) + '-' + this.checkMonth(dd)) + ' - ' + (yyyy + '-' + this.checkMonth(mm) + '-' + this.checkMonth(dd));
        // this.rangeWeekday = (yyyy + '-02-11 - ' + yyyy + '-02-31');
        // this.rangeMonth = (yyyy + '-' + this.checkMonth(mm) + '-01 - ' + yyyy + '-' + this.checkMonth(mm) + '-' + this.checkMonth(this.daysInMonth(yyyy, mm)));
        // this.rangeYear = (yyyy + '-01-01 - ' + yyyy + '-12-31');
        // this.thisYearNow = today.getFullYear();
        // this.thisYearMonthNow = today.getFullYear() + '-' + this.checkMonth(mm);


        // console.log('toDay = ' + yyyy + '-' + this.checkMonth(mm) + '-' + this.checkMonth(dd));
        // console.log('rangetoDay = ' + this.rangeToday);
        // console.log('rangetoMonth = ' + this.rangeMonth);
        // console.log('rangetoYear = ' + this.rangeYear);

        // start query orders function to report //
        setInterval(() => {
            this.onSelectedRangDateByDay(this.rangeToday);
            // console.log('AfterView this.rangeToday = ' + this.rangeToday);
            // console.log('AfterView this.rangeMonth = ' + this.rangeMonth);
            // console.log('AfterView this.thisYearMonthNow = ' + this.thisYearMonthNow);
            // console.log('AfterView this.thisYearNow = ' + this.thisYearNow);
        }, 5000);

        setInterval(() => {
            this.onSelectedRangDateByMonth(this.rangeMonth);
            // this.onSelectedRangDateByYear(this.rangeYear);
            this.onSaleReportsMonthly(this.thisYearMonthNow);
            this.onSaleReportsYearly(this.thisYearNow);
            if (this.stateChange === 'Yearly') {
                // this.onfetchDashboardYearly(this.thisYearNow);
                this.onSelectedRangDateByYear(this.rangeYear);
            }
            if (this.stateChange === 'Monthly') {
                // this.onfetchDashboardMonthly(this.thisYearMonthNow);
                this.onSelectedRangDateByMonth(this.rangeMonth);
            }

        }, 60000);
        // start query orders function to report //

        // this.onfetchDashboardMonthly(this.thisYearMonthNow);
    }

    onfetchDashboardMonthly(thisYearMonthNow) {
        // add new data amchart4 //
        // if (this.selectedChartByMonth) {
        // const chart = am4core.create('chartdivMonthly', am4charts.XYChart);
        this.onSelectedRangDateByMonth(this.rangeMonth);
        // this.onSelectedRangDateByYear(this.rangeYear);
        const chart = am4core.create('chartdiv', am4charts.XYChart);
        const data = [];
        // this.fetchReportMonthly();
        // this.sub = await this.orderService.fetchDashboardMonthly('2019-03')
        // this.sub = await this.orderService.fetchDashboardMonthly(thisYearMonthNow)
        this.sub = this.orderService.fetchDashboardMonthly(thisYearMonthNow)
            .subscribe((rr: Report[]) => {

                this.reportsMonthNow = rr.sort((a, b): number => (a.days - b.days));
                // this.reportsMonthNow.sort((a, b): number => (a.days - b.days));
                // this.reportsMonthNow
                // console.log('count = ' + JSON.stringify(this.reportsMonthNow));
                this.reportsMonthNow.forEach((p) => {

                    // id = p._id;
                    // days = p.days;
                    // income = p.totalPrice;
                    // expanses = p.count;
                    // sumTotal += p.count
                    // console.log(p.orderId);
                    // console.log(p.orderTotal);

                    // if (p.orderCreated) {
                    //     const dd1 = p.orderCreated.toString().split('T');
                    //     const ddConv = dd1[0].split('-');
                    //     newDate = ddConv[2] + '-' + ddConv[1] + '-' + ddConv[0];
                    //     // newDate2 = ddConv[0] + '-' + ddConv[1] + '-' + ddConv[2];
                    //     newDate2 = ddConv[2];
                    // }
                    // console.log(expanses);

                    data.push({
                        // date: new Date(2018, 0, i), name: 'name' + i, value: visits
                        'year': p.days, 'income': p.totalPrice, 'expanses': p.count, 'day': p.days, 'daystr': p.dayStr, 'count': p.count
                    });
                });
                chart.data = data;

                // console.log('chart log =' + JSON.stringify(data));

                const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
                categoryAxis.renderer.grid.template.location = 0;
                categoryAxis.renderer.ticks.template.disabled = true;
                categoryAxis.renderer.line.opacity = 0;
                categoryAxis.renderer.grid.template.disabled = true;
                categoryAxis.renderer.minGridDistance = 40;
                categoryAxis.dataFields.category = 'year';
                categoryAxis.startLocation = 0.4;
                categoryAxis.endLocation = 0.6;

                const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                valueAxis.tooltip.disabled = true;
                valueAxis.renderer.line.opacity = 0;
                valueAxis.renderer.ticks.template.disabled = true;
                valueAxis.min = 0;

                const lineSeries = chart.series.push(new am4charts.LineSeries());
                lineSeries.dataFields.categoryX = 'year';
                lineSeries.dataFields.valueY = 'income';
                lineSeries.tooltipText = 'ขายได้: {valueY.value} บาท\nจำนวน: {count} ออเดอร์\nวันที่: {daystr}';
                lineSeries.fillOpacity = 0.5;
                lineSeries.strokeWidth = 3;
                lineSeries.propertyFields.stroke = 'lineColor';
                lineSeries.propertyFields.fill = 'lineColor';

                const bullet = lineSeries.bullets.push(new am4charts.CircleBullet());
                bullet.circle.radius = 6;
                bullet.circle.fill = am4core.color('#fff');
                bullet.circle.strokeWidth = 3;

                chart.cursor = new am4charts.XYCursor();
                chart.cursor.behavior = 'panX';
                chart.cursor.lineX.opacity = 0;
                chart.cursor.lineY.opacity = 0;

                // chart.scrollbarX = new am4core.Scrollbar();
                // chart.scrollbarX.parent = chart.topAxesContainer;

            });
        // }
        // this.onSelectedRangDateByMonth(this.rangeMonth);
        // this.dataChart = `ยอดขายเดือนนี้: (${this.ordersCalSumTotalByMonth} บาท) | คำสั่งซื้อทั้งหมด: ${this.ordersMonthNow.length} ออเดอร์`;
        // add new data amchart4 //
    }

    onfetchDashboardYearly(thisYearNow) {
        // add new dataYearly amchart4 //
        // this.onSelectedRangDateByMonth(this.rangeMonth);
        this.onSelectedRangDateByYear(this.rangeYear);
        // if (this.selectedChartByYear) {
        // const chartYearly = am4core.create('chartdivYearly', am4charts.XYChart);
        const chartYearly = am4core.create('chartdiv', am4charts.XYChart);
        const dataYearly = [];

        // this.sub = await this.orderService.fetchDashboardYearly('2019')
        // this.sub = await this.orderService.fetchDashboardYearly(thisYearNow)
        this.sub = this.orderService.fetchDashboardYearly(thisYearNow)
            .subscribe((rrr: Report[]) => {

                this.reportsYearNow = rrr.sort((a, b): number => (a.days - b.days));
                // console.log('count = ' + this.reportsYearNow.length);
                this.ordersCalSumTotalByYear = 0;
                this.reportsYearNow.forEach((pp) => {
                    // id = p._id;
                    // days = p.days;
                    // income = p.totalPrice;
                    // expanses = p.count;
                    // sumTotal += p.count
                    // console.log(p.orderId);
                    // console.log(p.orderTotal);

                    // if (p.orderCreated) {
                    //     const dd1 = p.orderCreated.toString().split('T');
                    //     const ddConv = dd1[0].split('-');
                    //     newDate = ddConv[2] + '-' + ddConv[1] + '-' + ddConv[0];
                    //     // newDate2 = ddConv[0] + '-' + ddConv[1] + '-' + ddConv[2];
                    //     newDate2 = ddConv[2];
                    // }
                    // console.log(expanses);

                    // this.ordersYearNow = r;
                    // this.ordersYearNow.forEach(p => {
                    this.ordersCalSumTotalByYear = this.ordersCalSumTotalByYear + pp.totalPrice;
                    // });

                    dataYearly.push({
                        // date: new Date(2018, 0, i), name: 'name' + i, value: visits
                        'year': pp.dayStr,
                        'income': pp.totalPrice,
                        'expanses': pp.count,
                        'day': pp.days,
                        'daystr': pp.dayStr,
                        'count': pp.count
                    });
                });
                chartYearly.data = dataYearly;

                // console.log('chart log =' + JSON.stringify(dataYearly));

                const categoryAxis = chartYearly.xAxes.push(new am4charts.CategoryAxis());
                categoryAxis.renderer.grid.template.location = 0;
                categoryAxis.renderer.ticks.template.disabled = true;
                categoryAxis.renderer.line.opacity = 0;
                categoryAxis.renderer.grid.template.disabled = true;
                categoryAxis.renderer.minGridDistance = 40;
                categoryAxis.dataFields.category = 'year';
                categoryAxis.startLocation = 0.4;
                categoryAxis.endLocation = 0.6;

                const valueAxis = chartYearly.yAxes.push(new am4charts.ValueAxis());
                valueAxis.tooltip.disabled = true;
                valueAxis.renderer.line.opacity = 0;
                valueAxis.renderer.ticks.template.disabled = true;
                valueAxis.min = 0;

                const lineSeries = chartYearly.series.push(new am4charts.LineSeries());
                lineSeries.dataFields.categoryX = 'year';
                lineSeries.dataFields.valueY = 'income';
                lineSeries.tooltipText = 'ขายได้: {valueY.value} บาท\nจำนวน: {count} ออเดอร์\nวันที่: {daystr}';
                lineSeries.fillOpacity = 0.5;
                lineSeries.strokeWidth = 3;
                lineSeries.propertyFields.stroke = 'lineColor';
                lineSeries.propertyFields.fill = 'lineColor';

                const bullet = lineSeries.bullets.push(new am4charts.CircleBullet());
                bullet.circle.radius = 6;
                bullet.circle.fill = am4core.color('#fff');
                bullet.circle.strokeWidth = 3;

                chartYearly.cursor = new am4charts.XYCursor();
                chartYearly.cursor.behavior = 'panX';
                chartYearly.cursor.lineX.opacity = 0;
                chartYearly.cursor.lineY.opacity = 0;

                // chartYearly.scrollbarX = new am4core.Scrollbar();
                // chartYearly.scrollbarX.parent = chartYearly.topAxesContainer;

            });
        // }
        // this.dataChart = `ยอดขายประจำปี ${this.now.getFullYear()}: (${this.ordersCalSumTotalByYear} บาท) | คำสั่งซื้อทั้งหมด: ${this.ordersYearNow.length} ออเดอร์`;
        // console.log('dataChart = ' + this.dataChart);
        // console.log('this.ordersCalSumTotalByYear = ' + this.ordersCalSumTotalByYear);

        // add new data amchart4 //
    }

    formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
}
