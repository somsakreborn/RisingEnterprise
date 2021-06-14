import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import Swal from 'sweetalert2';
import {Customer} from '../customers.interface';
import {CustomersService} from '../customers.service';
import {environment as env} from '../../../../environments/environment';

import 'rxjs/add/observable/of';
import {IOption} from 'ng-select';
import {Subscription} from 'rxjs/Subscription';
import {SelectOptionService} from '../../../shared/elements/select-option.service';

declare var $: any;

import '../../../../assets/jquery.ddslick.min';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

// import API Channel Data //
import {Channel} from '../../channels/channels.interface';
import {ChannelsService} from '../../channels/channels.service';
// import API Couters-Id //
import {Counter} from '../../products/counter.interface';
import {CounterService} from '../../products/counter.service';

@Component({
  selector: 'app-customers-create',
  templateUrl: './customers-create.component.html',
  styleUrls: [
      './customers-create.component.scss',
      '../../../../../node_modules/famfamfam-flags/dist/sprite/famfamfam-flags.min.css'
  ]
})
export class CustomersCreateComponent implements OnInit, OnDestroy {

    sub: Subscription;
    fileToUpload: File = null;
    imageUrl = env.serverAPI + '/images/image-blank.jpg';
    imageUrlBlank = env.serverAPI + '/images/image-blank.jpg';
    rowsOnPage = 25;
    filterQuery = '';
    public sortBy = '';
    public sortOrder = 'asc';

    public model: any;
    today: number = Date.now();
    modelPopup: NgbDateStruct = {} as NgbDateStruct;

    modelPopupShipmentStartDate: NgbDateStruct;
    modelPopupShipmentCreated: NgbDateStruct;

    public date: { year: number, month: number, day: number };
    customer: Customer = {} as Customer;
    channel: Channel = {} as Channel;
    customerCache = '';

    // customer ===> {  . . ..  .. }
    customers: Customer[] = [] as Customer[];
    channels: Channel[] = [] as Channel[];

    // test str replace //
    CTId: any;
    rex: number;
    customerCMId: string;
    // counter: Counter;
    counterCTId: Counter = {} as Counter;
    // test str replace //

    // const data1: string = [];
    simpleOption: Array<IOption> = this.selectOptionService.getCharacters();
    selectedOption = '3';
    isDisabled = true;
    // characters: Array<IOption>;
    characters: Array<IOption> = this.selectOptionService.getCharacters();
    msg: string;
    myOptionData = 'LU';
    myOptions: Array<IOption> = [
        {label: 'Belgium', value: 'BE'},
        {label: 'Luxembourg', value: 'LU'},
        {label: 'Netherlands', value: 'NL'}
    ];
    selectedCharacter = '3';
    timeLeft = 5;

    private dataSub: Subscription = null;

    // selectedCountries: Array<string> = ['IN', 'BE', 'LU', 'NL'];
    selectedCountries: Array<string> = ['TH', 'US'];
    countries: Array<IOption> = this.selectOptionService.getCountries();
    selectedCountry = 'TH';

    constructor(
        private customerService: CustomersService,
        private channelService: ChannelsService,
        private counterService: CounterService,
        private router: Router,
        private location: Location,
        public selectOptionService: SelectOptionService
    ) {
        const today = new Date();
        const dd = today.getDate();
        const mm = today.getMonth() + 1;
        const yyyy = today.getFullYear();

        this.modelPopup.day = dd;
        this.modelPopup.month = mm;
        this.modelPopup.year = yyyy;
    }

    ngOnInit() {
        this.fetchCustomer();
        this.fetchChannel();
        this.fetchCounter();

        this.runTimer();
        this.dataSub = this.selectOptionService.loadCharacters().subscribe((options) => {
            this.characters = options;
        });

        //  test data select image jquerry  //
        $('#options').ddslick(
            {
                // data: ddData,
                width: 200,
                height: 200,
                imagePosition: 'right',
                selectText: 'Select your favorite social network',
                onSelected: function (data) {
                    // console.log(data);
                }
            }
        );

        $('#demo-htmlselect').ddslick({
            width: 250,
            height: 50,
            imagePosition: 'left',
            onSelected: function(Data) {
                // callback function: do something with selectedData;
            }
        });

        $('#customerSocial').ddslick({
            width: 250,
            height: 80,
            imagePosition: 'left',
            onSelected: function(Data) {
                // callback function: do something with selectedData;
            }
        });
        //  test data select image jquerry  //
    }

    ngOnDestroy() {
        if (this.dataSub !== null) { this.dataSub.unsubscribe(); }
    }

    runTimer() {
        const timer = setInterval(() => {
            this.timeLeft -= 1;
            if (this.timeLeft === 0) {
                clearInterval(timer);
            }
        }, 1000);
    }

    onSelected(option: IOption) {
        this.msg = `Selected ${option.label}`;
    }

    onDeselected(option: IOption) {
        this.msg = `Deselected ${option.label}`;
    }

    setDateNow() {
        this.modelPopup = {} as NgbDateStruct;
        const today = new Date();
        const dd = today.getDate();
        const mm = today.getMonth() + 1;
        const yyyy = today.getFullYear();

        this.modelPopup.day = dd;
        this.modelPopup.month = mm;
        this.modelPopup.year = yyyy;
    }

    fetchCustomer() {
        this.sub = this.customerService.fetchCustomer()
            .map((m: Customer[]) => {
                let x = 0;
                m.map(r => {
                    r.index = ++x;
                    // if (r.customerImage) {
                    //     r.customerImage = `${env.serverAPI}/images/customer/` + r.customerImage;
                    // } else {
                    //     r.customerImage = `${env.serverAPI}/images/image-blank.jpg`;
                    // }

                    if (r.customerLastupdate) {
                        const dd = r.customerLastupdate.toString().split('T');
                        const ddConv = dd[0].split('-');
                        r.customerLastupdate = ddConv[2]  + '-' + ddConv[1] + '-' + ddConv[0];
                    }
                    return r;
                });
                return m;
            })
            // .subscribe((r: Customer[]) => this.customers = r);
            .subscribe((r: Customer[]) => {
                // console.log(r);
                this.customers = r;
            });
    }

    fetchCounter() {
        this.counterService.fetchCounterCustomer()
            .subscribe((result) => {
                // console.log(result);
                if (result.id) {
                    this.counterCTId = result;
                    this.CTId = 'CM00000000';
                    this.rex = this.CTId.length - (this.counterCTId.seq + 1).toString().length;
                    this.customerCMId = this.CTId.slice(0, this.rex) + (this.counterCTId.seq + 1).toString();
                } else {
                    this.customerCMId = 'CM00000001';
                }
                // console.log(this.customerCMId);
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
            });
    }

    onSubmit(frm) {

        this.customer = frm.value;
        // alert(JSON.stringify(frm.value));

        // const {year, month, day} = frm.value.customerCreated;
        // this.customer.customerCreated = new Date(year, month - 1, day);

        // console.log(this.customer);
        // alert(this.customer.customerCreated.toJSON());
        // alert(this.customer.customerCreated.toDateString());
        // alert(this.customer.customerCreated.toISOString());
        // const formData = new FormData();
        // formData.append('file', this.selectedFile);

        // if ((frm.value.customerImage === '') || (frm.value.customerImage === null)) {
            // console.log('*-- undefined --*');

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
                        title: 'บันทึกข้อมูล เรียบร้อยแล้ว'
                    });
                    // Swal({
                    //     position: 'center',
                    //     type: 'success',
                    //     title: 'เพิ่มข้อมูลสาขา เรียบร้อยแล้ว',
                    //     showConfirmButton: false,
                    //     timer: 1200
                    // });
                    this.fetchCustomer();
                    this.location.back();
                    // this.selectedFile = null;
                    // this.customerFormModal.close('customerModal');
                });

        // } else {
        //     // console.log('--not undefined--');
        //     this.customerService.uploadFile(formData)
        //         .subscribe(result => {
        //             this.customer.customerImage = result[0].name;
        //             this.customerService.addCustomer(this.customer)
        //                 .subscribe(() => {
        //                     Swal({
        //                         position: 'center',
        //                         type: 'success',
        //                         title: 'เพิ่มข้อมูลสาขา เรียบร้อยแล้ว',
        //                         showConfirmButton: false,
        //                         timer: 1200
        //                     });
        //                     this.fetchCustomer();
        //                     this.selectedFile = null;
        //                     this.customerFormModal.close('customerModal');
        //                 });
        //         });
        // }

        // $('.md-modal').removeClass('md-show');
        //     window.location.reload(true);
        // console.log(JSON.stringify(frm.value));
        // alert(JSON.stringify(frm.value));
        // this.location.back();
        // this.router.navigate(['/management/customers']);
        // this.router.navigate(['/management/orders/orders-create']);
        // this.router.navigate(['/management/orders/orders-edit']);
    }


}
