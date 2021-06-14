import {Component, OnInit, OnDestroy} from '@angular/core';
import {Location} from '@angular/common';
import {SettingsService} from '../settings.service';
import {ChannelsService} from '../../channels/channels.service';
import {Channel} from '../../channels/channels.interface';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Router} from '@angular/router';
import {Pixel} from '../settings.interface';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-pixels-edit',
  templateUrl: './pixels-edit.component.html',
  styleUrls: [
      './pixels-edit.component.scss',
      '../../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class PixelsEditComponent implements OnInit, OnDestroy {
    channels: Channel[] = [] as Channel[];
    public sub: Subscription = null;
    mId: any;
    pixelData: Pixel = {} as Pixel;
    public pixelCustomList: { id: number; customName: string; customDisable: number }[];

    constructor(
      private location: Location,
      private router: Router,
      private routh: ActivatedRoute,
      private channel: ChannelsService,
      private pixel: SettingsService,
  ) {
    this.routh.params.subscribe(param => {
      // console.log('ID = ' + JSON.stringify(param) );
      if (param) {
        this.mId = param.id;
        this.sub = this.pixel.fetchViewPixel(this.mId).subscribe(r => {
          this.pixelData = r;
        });
      }
    });
  }

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
      this.sub = this.channel.fetchChannel().subscribe(r => this.channels = r );
  }

  onUpdatePixel(pixelForm: Pixel) {
      // console.log(JSON.stringify(pixelForm));
    // if (!pixelForm) {
    //   return alert(JSON.stringify(pixelForm));
    // } else {
      pixelForm.pixelLastupdate = new Date();
      this.pixel.updatePixel(pixelForm).subscribe((r) => {
        this.alertSuccess('อัพเดทข้อมูล เรียบร้อยแล้ว');
        this.router.navigate(['/management/settings/pixels']);
      });
    // }
  }

  onBack() {
    this.location.back();
  }

    // Destroy data unsubscript //
    ngOnDestroy() {
        // if (this.dataSub !== null) {
        //     this.dataSub.unsubscribe();
        // }
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
