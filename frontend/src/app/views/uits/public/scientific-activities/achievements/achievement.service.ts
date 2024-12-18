import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  private apiUrl = 'http://uits-backend:8000/api/department/achievements/';

  constructor(private http: HttpClient) {}

  // Метод для получения достижений
  getAchievements(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(catchError(this.handleError));
  }

  getAchievementById(id: string): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  // Обработчик ошибок
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Произошла ошибка';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Ошибка: ${error.error.message}`;
    } else {
      errorMessage = `Сервер вернул код ${error.status}. Сообщение: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}
