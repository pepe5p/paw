import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiClient {
  private baseUrl = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/posts`);
  }

  addPost(value: string, body: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/posts`, {
      title: value,
      body: body,
    });
  }

  getPhotos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/photos`);
  }
}
