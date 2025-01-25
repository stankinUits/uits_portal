import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AchievementService} from '../achievement.service';
import {AuthService} from '@app/shared/services/auth.service';
import {Router} from '@angular/router';
import {PagesConfig} from '@app/configs/pages.config';
import {BehaviorSubject, catchError, Observable, Subject, Subscription, takeUntil, tap} from 'rxjs';
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
  page = 1;
  defaultLimit = 7;
  defaultOffset = 0;
  maxSize = 5;
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

  get itemsPerPage(): number {
    return this.defaultLimit - this.defaultOffset;
  }

  ngOnInit(): void {
    const {limit, offset} = this.paginationService.getPaginationParams();
    if (limit !== undefined && offset !== undefined) {
      this.page = Math.round(offset / limit) + 1;
    }
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

  pageChanged($event: PageChangedEvent) {
    let {limit, offset} = this.paginationService.getPaginationParams();
    if (!limit) {
      limit = this.defaultLimit;
    }
    if (!offset) {
      offset = this.defaultOffset;
    }
    const newOffset = (limit * ($event.page - 1));
    this.page = $event.page;
    this.paginationService.setPaginationParams(limit, newOffset)
      .then(() => this.getAchievements());
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
