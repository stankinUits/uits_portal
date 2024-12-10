import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  private apiUrl = 'https://api.example.com/contacts/content'; // Замените на реальный URL

  constructor(private http: HttpClient) { }

  getContactContent(page: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/${page}`);
  }

  saveContactContent(page: string, content: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${page}`, { content });
  }
}
