import { Component, OnInit } from '@angular/core';
import { ApiClient } from "../api_client/api.client";
import {ActivatedRoute, RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  styleUrls: ['./photo.component.css']
})
export class PhotoComponent implements OnInit {

  photo: any = {};
  id: number = 0;

  constructor(private dataService: ApiClient, private route: ActivatedRoute) {
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
