import { Component, OnInit } from '@angular/core';
import {DataService} from "../dataService/data.service";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-wpisy',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './wpisy.component.html',
  styleUrl: './wpisy.component.css'
})
export class WpisyComponent  implements OnInit{
  posts: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getPosts().subscribe((data) => {
      this.posts = data;
    });
  }

  onAddPost(postTitle: HTMLInputElement) {
    this.dataService.addPost(postTitle.value).subscribe((data) => {
      this.posts.push(data);
    });
    postTitle.value = '';
  }
}
