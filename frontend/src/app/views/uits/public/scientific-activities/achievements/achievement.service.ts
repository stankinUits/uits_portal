import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ApiConfig } from '@app/configs/api.config';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  private achievements$: BehaviorSubject<any[]>;

  constructor(private http: HttpClient) {
    this.achievements$ = new BehaviorSubject<any[]>([]);
  }

  // Получить BehaviorSubject для всех достижений
  getAchievementsObservable(): Observable<any[]> {
    return this.achievements$.asObservable();
  }

  // Получить все достижения из API
  getAchievements(): Observable<any[]> {
    return this.http
      .get<any[]>(ApiConfig.department.achievements.base)
      .pipe(
        map((achievements) => {
          this.achievements$.next(achievements);
          return achievements;
        }),
        catchError(this.handleError)
      );
  }

  // Получить одно достижение по ID
  retrieveAchievement(id: string): Observable<any> {
    return this.http
      .get<any>(ApiConfig.department.achievements.retrieve(id))
      .pipe(catchError(this.handleError));
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
