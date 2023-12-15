import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NgForOf, NgOptimizedImage} from "@angular/common";
import {DataService} from "../dataService/data.service";
import {RouterLink, RouterLinkActive} from "@angular/router";
@Component({
  selector: 'app-photos',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgForOf,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './photos.component.html',
  styleUrl: './photos.component.css',
  providers: [HttpClient],
})
export class PhotosComponent implements OnInit{
  photos: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getPhotos().subscribe((data) => {
      this.photos = data.slice(0, 10);
    });
  }
}

