import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {environment} from '../environments/environment';
import {User} from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'RisingEnterprise';

  mUser: User;

  constructor(private router: Router) {
    this.mUser = new User();
  }

  onProfileChanged(_user: User){
    this.mUser = _user;
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  public get mIsAuthen() {
    try {
      let authenInfo = JSON.parse(sessionStorage.getItem(environment.localAuthenInfo))
      if (authenInfo.token != null && authenInfo.token != "") {
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }


}
