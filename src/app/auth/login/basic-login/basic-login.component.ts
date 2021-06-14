import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {environment as env, environment} from '../../../../environments/environment';
import {AppComponent} from '../../../app.component';

import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AppserverService} from '../../../services/appserver.service';

// import user profile API data //
import {User} from '../../../protected/users/users.interface';
import {UsersService} from '../../../protected/users/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-basic-login',
  templateUrl: './basic-login.component.html',
  styleUrls: ['./basic-login.component.scss']
})
export class BasicLoginComponent implements OnInit {

  ngForm: FormGroup;
  submitted: boolean;

  user: User = {} as User;
  public isError = false;

  constructor(
    private router: Router,
    private location: Location,
    private server: AppserverService,
    private parent: AppComponent,
    private userService: UsersService
  ) {

    const userName = new FormControl('', Validators.required);
    const userPassword = new FormControl('', Validators.required);
    const checkbox = new FormControl(true);

    this.ngForm = new FormGroup({
      userName: userName,
      userPassword: userPassword,
      checkbox: checkbox
    });

  }

  ngOnInit() {
    document.querySelector('body').setAttribute('themebg-pattern', 'theme1');

    // console.log('login - ngOnInit');
    const authenInfoCheck = JSON.parse(localStorage.getItem(environment.localAuthenInfo));
    // console.log(authenInfoCheck);
    if (authenInfoCheck != null && authenInfoCheck !== '') {
        this.router.navigate(['/management/dashboard']);
        // this.appCom.mIsAuthen = true;
    }

    // this.appCom.mIsAuthen = false;
    const authenInfo = JSON.parse(sessionStorage.getItem(environment.localAuthenInfo));
    if (authenInfo != null && authenInfo !== '') {
      this.router.navigate(['/management/dashboard']);
      // this.appCom.mIsAuthen = true;
    }
      // console.log(authenInfo);
  }

  // onLogin() {
  //   this.router.navigate(['management']);
  // }

  // onSubmit(data) {
  //   this.submitted = true;
  //   console.log(this.ngForm);
  //   alert(JSON.stringify(data));
  // }
  //
  //   onBack() {
  //       this.location.back();
  //   }

  public onSubmit(credential) {
    // this.submitted = true;
    this.server.login(credential).subscribe(result => {
      // console.log(JSON.stringify(result));

      if (result.auth === true) {
        this.isError = false;
        localStorage.setItem(environment.localAuthenInfo, JSON.stringify(result));
        localStorage.setItem('ID', JSON.stringify(result.userId));
        localStorage.setItem('Name', JSON.stringify(result.userName));
        localStorage.setItem('Image', JSON.stringify(result.userImage));
        localStorage.setItem('Role', JSON.stringify(result.userLevel));
        // this.appCom.mIsAuthen = true;
        //   this.user = result;
          // this.profile = localStorage.getItem('localAuthenInfo');

          // console.log(result);
          // console.log(localStorage.getItem('localAuthenInfo'));
          // console.log("userName = " + this.user.userName);
          // console.log("userImage = " + this.user.userImage);
          // console.log("Name = " + localStorage.getItem('Name'));
          // console.log("Image = " + localStorage.getItem('Image'));
          const toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 6000
          });
          toast({
              imageUrl: env.serverAPI + '/images/user/' + JSON.parse(localStorage.getItem('Image')),
              imageHeight: 50,
              type: 'success',
              title: 'สวัสดีคุณ ' + JSON.parse(localStorage.getItem('Name')) + '\nยินดีต้อนรับเข้าสู่ระบบ Rising Admin'
          });

        this.parent.onProfileChanged(result);
        this.router.navigate(['/management/dashboard']);
        // location.reload(true);

      } else {
        this.isError = true;
      }

    });
  }

}
