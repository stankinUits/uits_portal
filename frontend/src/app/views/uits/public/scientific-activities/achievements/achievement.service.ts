import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

import { ApiConfig } from '@app/configs/api.config';
import { Injectable } from '@angular/core';
import {Pagination} from '@app/shared/types/paginate.interface';
import {Snaked} from '@app/shared/utils/SnakeToCamelCase';
import {Achievement, ListAchievement} from '@app/shared/types/models/achievement';

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
   paginatedResponse$: BehaviorSubject<Pagination<ListAchievement>>;

  constructor(private http: HttpClient) {
    this.paginatedResponse$ = new BehaviorSubject<Pagination<ListAchievement>>(null);
  }

  getAchievements(limit?: number, offset?: number): Observable<Pagination<ListAchievement>> {
    return this.http.get<Pagination<ListAchievement>>(ApiConfig.department.achievements.base, {
        params: {
          limit: limit ? limit: 7, offset: offset ? offset : 0,
        }
      })
      .pipe(
        map((response: Pagination<ListAchievement>) => {
          const achievements: ListAchievement[] = response.results.map(achievement => new ListAchievement(achievement));
          console.log(achievements);
          const camelResponse: Pagination<ListAchievement> = {...response, results: achievements};
          this.paginatedResponse$.next(camelResponse);
          return camelResponse;
        }),
        catchError(this.handleError)
      );
  }

  // getAchievements(limit?: number, offset?: number): Observable<any> {
    // return this.http
    //   .get<any[]>(ApiConfig.department.achievements.base)
    //   .pipe(
    //     map((achievements) => {
    //       this.achievements$.next(achievements);
    //       return achievements;
    //     }),
    //     catchError(this.handleError)
    //   );

  getAchievementByID(id: string): Observable<Achievement> {
    return this.http.get<Achievement>(ApiConfig.department.achievements.retrieve(id))
      .pipe(
        map((response: Achievement) => new Achievement(response)),
        catchError(this.handleError)
      );
  }

  // Получить одно достижение по ID
  // retrieveAchievement(id: string): Observable<any> {
  //   return this.http
  //     .get<any>(ApiConfig.department.achievements.retrieve(id))
  //     .pipe(catchError(this.handleError));
  // }


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
