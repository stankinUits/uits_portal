import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

import { ApiConfig } from '@app/configs/api.config';
import { Injectable } from '@angular/core';
import {Pagination} from '@app/shared/types/paginate.interface';
import {Snaked} from '@app/shared/utils/SnakeToCamelCase';
import {Achievement, ListAchievement} from '@app/shared/types/models/achievement';
import {PaginationService} from '@app/shared/services/pagination.service';

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
   paginatedResponse$: BehaviorSubject<Pagination<ListAchievement>>;

  constructor(private http: HttpClient, private paginationService: PaginationService) {
    this.paginatedResponse$ = new BehaviorSubject<Pagination<ListAchievement>>(null);
  }

  getAchievements(limit?: number, offset?: number): Observable<Pagination<ListAchievement>> {
    return this.http.get<Pagination<ListAchievement>>(ApiConfig.department.achievements.base, {
        params: {
          limit: limit ? limit: this.paginationService.defaultLimit,
          offset: offset ? offset : 0,
        }
      })
      .pipe(
        map((response: Pagination<ListAchievement>) => {
          const achievements: ListAchievement[] = response.results.map(achievement => new ListAchievement(achievement));
          const camelResponse: Pagination<ListAchievement> = {...response, results: achievements};
          this.paginatedResponse$.next(camelResponse);
          return camelResponse;
        }),
        catchError(this.handleError)
      );
  }

  getAchievementByID(id: number): Observable<Achievement> {
    return this.http.get<Achievement>(ApiConfig.department.achievements.retrieve(id))
      .pipe(
        map((response: Achievement) => new Achievement(response)),
        catchError(this.handleError)
      );
  }

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
