import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
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
    constructor(
    ) { }

  ngOnInit() {
  }

}
