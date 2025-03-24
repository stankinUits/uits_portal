import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AchievementService} from '../achievement.service';
import {AuthService} from '@app/shared/services/auth.service';
import {Router} from '@angular/router';
import {PagesConfig} from '@app/configs/pages.config';
import {BehaviorSubject, catchError, finalize, Observable, Subject, Subscription, takeUntil, tap} from 'rxjs';
import {ListAchievement} from '@app/shared/types/models/achievement';
import {HttpErrorResponse} from '@angular/common/http';
import {AlertService} from '@app/shared/services/alert.service';
import {Pagination} from '@app/shared/types/paginate.interface';
import {PaginationService} from '@app/shared/services/pagination.service';
import {PageChangedEvent} from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-achievement-list',
  templateUrl: './achievement-list.component.html',
  styleUrls: ['./achievement-list.component.scss'],
})
export class AchievementListComponent implements OnInit, OnDestroy {
  destroy$: Subject<void> = new Subject<void>();

  maxSize: number;
  itemsPerPage: number;

  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private achievementService: AchievementService,
    public authService: AuthService,
    private router: Router,
    private alertService: AlertService,
    private paginationService: PaginationService
  ) {
  }

  get response$(): BehaviorSubject<Pagination<ListAchievement>> {
    return this.achievementService.paginatedResponse$;
  }

  ngOnInit(): void {
    this.itemsPerPage = this.paginationService.defaultLimit;
    this.maxSize = this.paginationService.maxSize;

    this.getAchievements();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAchievements(): void {
    const {limit, offset} = this.paginationService.getPaginationParams();
    this.achievementService.getAchievements(limit, offset)
      .pipe(
        tap(() => {
          this.isLoading = false;
        }),
        takeUntil(this.destroy$),
        catchError((error: HttpErrorResponse) => this.setError(error))
      )
      .subscribe();
  }

  setError(error: HttpErrorResponse): Observable<never> {
    this.alertService.add('Произошла ошибка при загрузке данных', 'danger');
    this.errorMessage = 'Произошла ошибка при загрузке данных';
    this.isLoading = false;
    throw error;
  }

  pageChanged(): void {
    this.getAchievements();
  }

  openAchievementById(achievement: any): void {
    this.router.navigate([
      '/scientific-activities/achievements',
      achievement.id,
    ]);
  }

  redirectToAdminPanel(): void {
    window.open(PagesConfig.admin + '/achievements/achievement/add', '_blank');
  }

  redirectToEditPage(id: number): void {
    if (id) {
      window.open(PagesConfig.admin + '/achievements/achievement/' + id + '/change', '_blank');
    }
  }
}
