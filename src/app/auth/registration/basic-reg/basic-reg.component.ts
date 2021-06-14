import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {User} from '../../../models/user';
import {AppserverService} from '../../../services/appserver.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-basic-reg',
  templateUrl: './basic-reg.component.html',
  styleUrls: ['./basic-reg.component.scss']
})
export class BasicRegComponent implements OnInit {

  public mUser: User = new User();
  // public confirmPassword: string;
  public items: any[];

  constructor(
    private location: Location,
    private router: Router,
    private server: AppserverService
  ) {
  }

  ngOnInit() {
    document.querySelector('body').setAttribute('themebg-pattern', 'theme1');

    this.items = [
      {id: 99, disabled: true, level: 'superadmin'},
      {id: 1, disabled: true, level: 'admin'},
      {id: 2, disabled: false, level: 'manager'},
      {id: 3, disabled: false, level: 'stock'},
      {id: 4, disabled: false, level: 'sale'},
      {id: 5, disabled: false, level: 'packing'},
      {id: 7, disabled: false, level: 'user'},
      {id: 8, disabled: false, level: 'other'}
    ];
  }

  onBack() {
    this.location.back();
  }

  onRegister() {

    if (this.mUser.userPassword === this.mUser.confirmPassword && this.mUser.userPassword != null && this.mUser.userPassword.length >= 4
        && this.mUser.userLevel !== (null && undefined)) {

      this.server.addUser(this.mUser).subscribe(result => {
        Swal({
          position: 'center',
          type: 'success',
          title: 'เพิ่มข้อมูลผู้ใช้งานระบบของคุณ เรียบร้อยแล้ว',
          // title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1200
        });

        this.router.navigate(['auth/login']);
        // this.location.back();
      });

    } else {

      if (this.mUser.userName === '') {
        // alert("กรุณากรอกข้อมูลผู้ใช้งาน ด้วยครับ");
        Swal( {
          title: '\nกรุณากรอกข้อมูลผู้ใช้งาน ด้วยครับ\n\n',
          animation: true,
          customClass: 'animated tada',
          timer: 2000
      });
        return false;
      }
      if (this.mUser.userName.length < 4) {
        // alert("กรุณากรอกข้อมูลผู้ใช้งานมากกว่า 4 ตัวอักษรครับ");
        Swal({
          title: '\nกรุณากรอกข้อมูลผู้ใช้งาน \n\nมากกว่า 4 ตัวอักษรครับ\n\n',
          animation: true,
          customClass: 'animated tada',
          timer: 2000
        });
        return false;
      }
      if (this.mUser.userEmail === '') {
        Swal({
          title: '\nกรุณากรอกข้อมูล email ด้วยครับ\n\n',
          animation: true,
          customClass: 'animated tada',
          timer: 2000
        });
        return false;
      }
      if (this.mUser.userPassword === '') {
        // alert("กรุณาใส่พาสเวิร์ดด้วยครับ");
        Swal({
          title: '\nกรุณาใส่พาสเวิร์ดด้วยครับ\n\n',
          animation: true,
          customClass: 'animated tada',
          timer: 2000
        });
        return false;
      }
      if (this.mUser.userPassword !== this.mUser.confirmPassword) {
        // alert("พาสเวิร์ดของคุณไม่ตรงกัน กรุณาตรวจสอบใหม่ครับ");
        Swal({
          title: '\nพาสเวิร์ดของคุณไม่ตรงกัน กรุณาตรวจสอบใหม่ครับ\n\n',
          animation: true,
          customClass: 'animated tada',
          timer: 2000
        });
        return false;
      }
      if (this.mUser.userPassword.length < 4) {
        // alert("กรุณาใส่พาสเวิร์ด มากกว่า 4 ตัวอักษร");
        Swal({
          title: '\nกรุณาใส่พาสเวิร์ด มากกว่า 4 ตัวอักษร\n\n',
          animation: true,
          customClass: 'animated tada',
          timer: 2000
        });
        return false;
      }
      if (this.mUser.userLevel === (null && undefined)) {
        Swal({
          title: '\nกรุณาเลือก Level ของคุณสำหรับใช้งาน\n\n',
          animation: true,
          customClass: 'animated tada',
          timer: 2000
        });
        return false;

      }
    }

  }


}
