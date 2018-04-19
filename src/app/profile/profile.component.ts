import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    tiles = [
      {url: 'https://i2.wp.com/beebom.com/wp-content/uploads/2016/01/Reverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg?resize=640%2C426'},
      {url: 'https://www.w3schools.com/howto/img_fjords.jpg'},
      {url: 'https://cloud.netlifyusercontent.com/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/68dd54ca-60cf-4ef7-898b-26d7cbe48ec7/10-dithering-opt.jpg'},
      {url: 'https://www.samcodes.co.uk/project/geometrize-haxe-web/assets/images/xseagull.jpg.pagespeed.ic.iK66EGA15-.jpg'},
      {url: 'https://justifiedgrid.com/wp-content/gallery/life/biking/137646854.jpg'},
      {url: 'https://cdn0.tnwcdn.com/wp-content/blogs.dir/1/files/2017/12/Screen-Shot-2017-12-04-at-10.39.57-796x447.png'},
      {url: 'http://globalmedicalco.com/photos/globalmedicalco/1/3565.jpg'},
      {url: 'https://thetechhacker.com/wp-content/uploads/2017/01/Best-Reverse-Image-Search-Engines.jpg'},
      {url: 'https://muzenly.com/stories/wp-content/uploads/2016/10/TOP-5-HOLI-MUSIC-FESTIVALS-AROUND-THE-WORLD.jpg'},
    ];
    user: any;
    editable: boolean = false;
    uploadProgress: number = 0;

    constructor(
      public _uS: UserService,
      public _authS: AuthService
    ) { }

  ngOnInit() {
    this._uS.getProfileInfo().subscribe(
      user => this.user = user
    );
  }

  toggleName() {
    this.editable = !this.editable
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
