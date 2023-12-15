import { Component, OnInit } from '@angular/core';
import {ApiClient} from "../api_client/api.client";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent  implements OnInit{
  posts: any[] = [];

  constructor(private dataService: ApiClient) {}

  ngOnInit(): void {
    this.dataService.getPosts().subscribe((data) => {
      this.posts = data;
    });
  }

  onAddPost(postTitle: HTMLInputElement, postBody: HTMLInputElement) {
    if (!postTitle.value) {
      return;
    }
    if (!postBody.value) {
      return;
    }
    this.dataService.addPost(postTitle.value, postBody.value).subscribe((data) => {
      this.posts.push(data);
    });
    postTitle.value = '';
  }
}
