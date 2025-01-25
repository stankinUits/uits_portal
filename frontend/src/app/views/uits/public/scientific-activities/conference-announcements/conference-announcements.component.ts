import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  ConferenceAnnouncementsService
} from '@app/views/uits/public/scientific-activities/conference-announcements/conference-announcements.service';
import {BehaviorSubject, Subject, takeUntil} from 'rxjs';
import {IConferenceAnnouncements} from '@app/shared/types/models/conference-announcements';
import {Router} from '@angular/router';
import {PagesConfig} from '@app/configs/pages.config';
import {Pagination} from '@app/shared/types/paginate.interface';
import {PageChangedEvent} from 'ngx-bootstrap/pagination';
import {PaginationService} from '@app/shared/services/pagination.service';

@Component({
  selector: 'app-conference-announcements',
  templateUrl: './conference-announcements.component.html',
  styleUrls: ['./conference-announcements.component.css']
})
export class ConferenceAnnouncementsComponent implements OnInit, OnDestroy {
  response$: BehaviorSubject<Pagination<IConferenceAnnouncements>> = new BehaviorSubject(null);
  destroy$: Subject<void> = new Subject<void>();

  page = 1;
  maxSize = this.paginationService.maxSize;
  limitDefault = this.paginationService.defaultLimit;
  offsetDefault = 0;

  constructor(private conferenceAnnouncementsService: ConferenceAnnouncementsService,
              private paginationService: PaginationService,
              private router: Router) {
  }

  get itemsPerPage(): number {
    return this.limitDefault - this.offsetDefault;
  }

  ngOnInit(): void {
    const {limit, offset} = this.paginationService.getPaginationParams();
    if (limit !== undefined && offset !== undefined) {
      this.page = Math.round(offset / limit) + 1;
    }
    this.getAnnouncements();
  }

  getAnnouncements(): void {
    const {limit, offset} = this.paginationService.getPaginationParams();
    this.conferenceAnnouncementsService.getAllConferenceAnnouncements(limit, offset)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(res => {
        this.response$.next(res);
      });
  }

  pageChanged($event: PageChangedEvent) {
    let {limit} = this.paginationService.getPaginationParams();
    if (!limit) {
      limit = this.limitDefault;
    }

    const newOffset = (limit * ($event.page - 1));
    this.page = $event.page;
    this.paginationService.setPaginationParams(limit, newOffset).then(
      () => this.getAnnouncements()
    );
  }

  redirectToDetail(id: number | string): void {
    this.router.navigate(['/scientific-activities/conferences', id]);
  }

  redirectToAdd() {
    window.open(`${PagesConfig.admin}/news/conferenceannouncement/add/`, '_blank');
  }

  redirectToEditPage(id: number) {
    window.open(`${PagesConfig.admin}/news/conferenceannouncement/${id}/change/`, '_blank');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
