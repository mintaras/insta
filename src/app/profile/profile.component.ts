import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { UserService } from '../_services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    user: any;
    editable: boolean = false;
    profileSettingsActive: boolean = false;
    uploadProgress: number = 0;
    id: string;

    constructor(
      private _uS: UserService,
      public _authS: AuthService,
      private aR: ActivatedRoute
    ) { }

  ngOnInit() {
    this.id = this.aR.snapshot.params['id'];
    if (this.id) {
      this._uS.getProfileInfo().subscribe(
        user => {console.log(user); return this.user = user }
      );
    } else {
      this._uS.getProfile(this.id).valueChanges().subscribe(
        user => this.user = user
      );
    }
  }

  toggleName() {
    this.editable = !this.editable
  }

  toggleProfileSettings() {
    this.profileSettingsActive = !this.profileSettingsActive
  }

  saveName() {
    this._uS.updateProfile(this.user.uid, this.user.displayName);
    this.editable = false;
  }

  detectFile(event: Event) {
    const selectFile = (event.target as HTMLInputElement).files;
    const files = selectFile;

    if (!files || files.length === 0) {
      return;
    }

    this._uS.uploadProfilePicture(files[0], this.user.uid);
  }

  logout() {
    return this._authS.logout();
  }

}
