import {Component, OnInit, ViewChild, OnDestroy, AfterViewInit} from '@angular/core';
import {ChannelsService} from '../../channels/channels.service';
import {Channel} from '../../channels/channels.interface';
import {Subscription} from 'rxjs/Subscription';
import {Pixel} from '../settings.interface';
import {SettingsService} from '../settings.service';

import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {environment as env} from '../../../../environments/environment';

@Component({
    selector: 'app-pixels',
    templateUrl: './pixels.component.html',
    styleUrls: [
        './pixels.component.scss',
        '../../../../assets/icon/icofont/css/icofont.scss'
    ]
})
export class PixelsComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('modalDefault') modalDefaultView;

    private sub: Subscription = null;
    private dataSub: Subscription = null;
    pixels: Pixel[] = [] as Pixel[];
    channels: Channel[] = [] as Channel[];
    public pixelCustomList: { id: number; customName: string; customDisable: number }[];
    isReadyonly: boolean;
    rowsOnPage = 25;
    // filterQuery = '';
    public sortBy = '';
    public sortOrder = 'asc';
    channelIdSet: number;

    constructor(
        private router: Router,
        private channelService: ChannelsService,
        private pixelService: SettingsService
    ) { }

    ngOnInit() {

        // this.sub = this.channelService.fetchChannel().subscribe( r => this.channels = r);
        this.pixelCustomList = [
            { 'id': 0, 'customName': '-- กรุณาเลือกเหตุการณ์ --', 'customDisable': 1 },
            { 'id': 1, 'customName': 'Purchase', 'customDisable': 1 },
            { 'id': 2, 'customName': 'Lead', 'customDisable': 1 },
            { 'id': 3, 'customName': 'Complete Registration', 'customDisable': 1 },
            { 'id': 4, 'customName': 'Add Payment Info', 'customDisable': 1 },
            { 'id': 5, 'customName': 'Add to Cart', 'customDisable': 1 },
            { 'id': 6, 'customName': 'Add to Wishlist', 'customDisable': 1 },
            { 'id': 7, 'customName': 'Initiate Checkout', 'customDisable': 1 },
            { 'id': 8, 'customName': 'Search', 'customDisable': 1 },
            { 'id': 9, 'customName': 'View Content', 'customDisable': 1 },
            { 'id': 10, 'customName': 'Contact', 'customDisable': 1 },
            { 'id': 11, 'customName': 'Customize Product', 'customDisable': 1 },
            { 'id': 12, 'customName': 'Donate', 'customDisable': 1 },
            { 'id': 13, 'customName': 'Find Location', 'customDisable': 1 },
            { 'id': 14, 'customName': 'Schedule', 'customDisable': 1 },
            { 'id': 15, 'customName': 'Start Trial', 'customDisable': 1 },
            { 'id': 16, 'customName': 'Submit Application', 'customDisable': 1 },
            { 'id': 17, 'customName': 'Subscribe', 'customDisable': 1 },
        ];
        this.fetchChannel();
        this.fetchPixel();
        // this.dataSub = this.pixelService.fetchPixel().subscribe((r: Pixel[]) => { this.pixels = r; } );
    }

    fetchPixel() {
        this.sub = this.pixelService.fetchPixel().subscribe((r: Pixel[]) => {
            this.pixels = r;
            /*console.log('Pixel = ' + JSON.stringify(r));*/
        } );
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
                this.channelIdSet = r[0].channelId;
                // this.customerForm.patchValue({orderCustomerChannelId: r[0].channelId});
            });
    }

    onSubmit(dataForm) {
        // console.log(JSON.stringify(dataForm));
        this.pixelService.addPixel(dataForm).subscribe(() => {
            this.alertSuccess('บันทึกข้อมูล เรียบร้อยแล้ว');
            this.fetchPixel();
        });
    }

    editPixcel(pixelId) {
        if (!pixelId) {
            return;
        } else {
            this.router.navigate(['/management/settings/pixels-edit/' + pixelId]);
        }
    }

    deletePixcel(pixelId) {
        // alert(pixelId);
        if (!pixelId) {
            return;
        } else {
            Swal({
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
                    this.pixelService.deletePixel(pixelId).subscribe((r) => {
                        this.alertSuccess('ลบข้อมูล เรียบร้อยแล้ว');
                        this.fetchPixel();
                    });
                }
            });
        }
    }

    // AfterViewInit data Refresh IntervalTimeSet //
    ngAfterViewInit() {
        // console.log('afterinit');
        setInterval(() => {
            this.fetchPixel();
        }, 10000);
    }
    // AfterViewInit data Refresh IntervalTimeSet //

    // Destroy data unsubscript //
    ngOnDestroy() {
        if (this.dataSub !== null) {
            this.dataSub.unsubscribe();
        }
        if (this.sub !== null) {
            this.sub.unsubscribe();
        }
    }

    // function checkRole && alertData //
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

}
