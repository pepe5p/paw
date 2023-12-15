import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NgForOf, NgOptimizedImage} from "@angular/common";
import {ApiClient} from "../api_client/api.client";
import {RouterLink, RouterLinkActive} from "@angular/router";
@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgForOf,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css',
  providers: [HttpClient],
})
export class GalleryComponent implements OnInit{
  photos: any[] = [];

  constructor(private dataService: ApiClient) {}

  ngOnInit(): void {
    this.dataService.getPhotos().subscribe((data) => {
      this.photos = data.slice(0, 10);
    });
  }
}

