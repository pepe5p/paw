import { Component, OnInit } from '@angular/core';
import { DataService } from "../dataService/data.service";
import {ActivatedRoute, RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-single-photo',
  templateUrl: './single-photo.component.html',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  styleUrls: ['./single-photo.component.css']
})
export class SinglePhotoComponent implements OnInit {

  photo: any = {};
  id: number = 0;

  constructor(private dataService: DataService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.loadPhoto();
    });
  }

  loadPhoto(): void {
    this.dataService.getPhotos().subscribe((data) => {
      if (this.id >= 0 && this.id < data.length) {
        this.photo = data[this.id-1];
      } else {
        console.error(`Invalid id: ${this.id}`);
      }
    });
  }
}
