import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private baseUrl = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/posts`);
  }

  getPhotos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/photos`);
  }

  addPost(value: string) {
    return this.http.post<any>(`${this.baseUrl}/posts`, {
      title: value,
    });
  }
}
