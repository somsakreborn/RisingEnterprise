import { Component, OnInit, OnDestroy } from '@angular/core';
import {ChannelsService} from '../../channels/channels.service';
import {Channel} from '../../channels/channels.interface';
import {Subscription} from 'rxjs/Subscription';
import {Pixel} from '../settings.interface';
import {SettingsService} from '../settings.service';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {environment as env} from '../../../../environments/environment';

@Component({
    selector: 'app-pixels-create',
    templateUrl: './pixels-create.component.html',
    styleUrls: [
        './pixels-create.component.scss',
        '../../../../assets/icon/icofont/css/icofont.scss'
    ]
})
export class PixelsCreateComponent implements OnInit, OnDestroy {

    private sub: Subscription = null;
    private dataSub: Subscription = null;
    pixelData: Pixel[] = [] as Pixel[];
    channels: Channel[] = [] as Channel[];
    pixelCustomList: { 'id': number; 'customName': string; 'customDisable': number; }[];
    channelIdSet: number;

    constructor(
        private channelService: ChannelsService,
        private pixel: SettingsService,
        private routh: Router,
        private location: Location
    ) { }

    ngOnInit() {
        this.pixelCustomList = [
            { 'id': 0, 'customName': '-- กรุณาเลือกเหตุการณ์ --', 'customDisable': 1},
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
    onSubmit(addPixelForm) {
        // if (addPixelForm.pixelCustomId && addPixelForm.channelId) {
        if (addPixelForm.channelId) {
            // alert(addPixelForm.pixelName);
            // alert(addPixelForm.channelId);
            this.pixel.addPixel(addPixelForm).subscribe(() => {
                this.alertSuccess('เพิ่มข้อมูล เรียบร้อยแล้ว');
                this.routh.navigate(['/management/settings/pixels']);
            });
        } else {
            this.alertWarning('กรุณากรอกข้อมูลที่จำเป็นเพื่ออัพเดทข้อมูลใหม่');
        }
    }

    onBack() {
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
