import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    constructor(
      public _aS: AuthService
    ) { }

  ngOnInit() {
  }

  logout() {
    return this._aS.logout();
  }

}
