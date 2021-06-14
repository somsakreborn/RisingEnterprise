import {Component, OnDestroy, OnInit, AfterViewInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {CustomersService} from '../../protected/customers/customers.service';
import {ChannelsService} from '../../protected/channels/channels.service';
import {ShipmentService} from '../../protected/shipments/shipments.service';
import {ProductsService} from '../../protected/products/products.service';
import {BankService} from '../../protected/banks/banks.service';
import {OrdersService} from '../../protected/orders/orders.service';

import {environment as env, environment} from '../../../environments/environment';
import {AppComponent} from '../../app.component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AppserverService} from '../../services/appserver.service';
// import {Customer} from '../../protected/customers/customers.interface';
import {Channel} from '../../protected/channels/channels.interface';
import {Shipment} from '../../protected/shipments/shipments.interface';
import {Product} from '../../protected/products/products.interface';
import {Bank} from '../../protected/banks/banks.interface';
import {Order, Products, Customer, Delivery, Historys} from '../../protected/orders/orders.interface';

import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
// import {map, filter, switchMap, debounceTime, distinctUntilChanged} from 'rxjs/operators';
declare const $;
declare var ClipboardJS: any;

@Component({
  selector: 'app-orderforcustomer',
  templateUrl: './orderforcustomer.component.html',
  styleUrls: [
      './orderforcustomer.component.scss',
      '../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class OrderforcustomerComponent implements OnInit, OnDestroy, AfterViewInit {


  private sub: Subscription = null;
  private dataSub: Subscription = null;
  ENVserverAPI = env.serverAPI;
  ENVserverCustomerLink = env.serverCustomerLink;

  customer: Customer = {} as Customer;
  customers: Customer[] = [] as Customer[];
  channel: Channel = {} as Channel;
  channels: Channel[] = [] as Channel[];
  shipment: Shipment = {} as Shipment;
  shipments: Shipment[] = [] as Shipment[];
  product: Product = {} as Product;
  productHold: Product = {} as Product;
  products: Product[] = [] as Product[];
  dataProducts: Product[] = [] as Product[];
  bank: Bank = {} as Bank;
  banks: Bank[] = [] as Bank[];
  order: Order = {} as Order;
  orders: Order[] = [] as Order[];

  orderCustomer: any;
  orderDeliveryPrice: number;
  orderSumProduct: number;

  mID: any;
  private ID: any;
  private Name: any;
  private checkRole: any;
  objDD: any;
  // mID = 'OD00000212';

  constructor(
      private router: Router,
      private location: Location,
      private route: ActivatedRoute,
      private customerService: CustomersService,
      private channelService: ChannelsService,
      private shipmentService: ShipmentService,
      private productService: ProductsService,
      private bankService: BankService,
      private orderService: OrdersService
  ) {
      if (this.sub !== null) {
        this.sub.unsubscribe();
      }

      // add script //
      this.route.params.subscribe(params => {
          // console.log(params);
          // this.mID = params['ODId'];
          // try {
              if (params) {
                  this.mID = params['ODId'];
                  this.fetch();
                  this.fetchShipment();
                  this.fetchChannel();
                  this.fetchBank();
                  // new ClipboardJS('#btnCopy');
                  // console.log('ODId = ' + this.mID);
              }
          // } catch (err) {
          //     return;
          // }
      });
      // add script //
  }

  ngOnInit() {
      document.querySelector('body').setAttribute('themebg-pattern', 'theme1');
      this.ID = JSON.parse(localStorage.getItem('ID'));
      this.Name = JSON.parse(localStorage.getItem('Name'));
      this.checkRole = JSON.parse(localStorage.getItem('Role'));

      // this.objDD = ['ViewPage', 'Search', 'Schedule'];
      this.objDD = ['Lead', 'Add to Cart', 'Donate', 'Subscribe'];
  }

    async fetch () {
        this.sub = await this.orderService.fetchViewOrderODId(this.mID)
            .subscribe((r) => {
                try {
                  this.order = r[0];
                  this.orderSumProduct = 0;
                  r[0].products.forEach(rr => {
                      this.orderSumProduct += (rr.price * rr.amount);
                  });
                  this.orderDeliveryPrice = r[0].delivery.price;
              } catch (e) {
                  // console.log(e);
              }
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
                // this.customerForm.patchValue({orderCustomerChannelId: r[0].channelId});
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
                // console.log(this.shipments);
                // this.paymentForm.patchValue({ orderShipmentId: r[0].shipmentId });
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

    // **** >>>  addd test script Pixel ads  <<< **** //
    onFBPixelScript(obj) {
        const dd = 'Contact Test';
        console.log(obj.length);
        const length = obj.length;
        for (let i = 0 ; i < length; i++) {

            const headscript = document.getElementById('headscript');
            const script = document.createElement('script');
            const noscript = document.createElement('noscript');
            const img = document.createElement('IMG');

            img.style.display = 'none';
            img.setAttribute('height', '1');
            img.setAttribute('width', '1');
            img.setAttribute('src', `https://www.facebook.com/tr?id=173421089998249&ev=${obj[i]}&noscript=1`);
            // noscript.style.display = 'none';
            // noscript.style.height = '1';
            // noscript.style.width = '1';

            // headscript.appendChild(noscript);
            // noscript.appendChild(script);
            headscript.appendChild(img);
            // headscript.appendChild(noscript1);
            // noscript1.appendChild(script1);
        }
    }
    // **** >>>  addd test script Pixel ads  <<< **** //

    // AfterViewInit data Refresh IntervalTimeSet //
    ngAfterViewInit() {
        // console.log('afterinit');
        setTimeout(() => {
            this.onFBPixelScript(this.objDD);
        }, 5000);
    }
    // AfterViewInit data Refresh IntervalTimeSet //

    // Destroy data unsubscript //
    ngOnDestroy() {
        // if (this.dataSub !== null) {
        //     this.dataSub.unsubscribe();
        // }
        // if (this.sub !== null) {
            this.sub.unsubscribe();
        // }
    }
}
