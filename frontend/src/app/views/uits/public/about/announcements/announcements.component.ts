import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AnnouncementsService } from '@app/views/uits/public/about/announcements/announcements.service';
import { AuthService } from '@app/shared/services/auth.service';
import { Profile } from '@app/shared/types/models/auth';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ListPost } from '@app/shared/types/models/news';
import { PagesConfig } from '@app/configs/pages.config';
import { PostsBaseComponent } from '@app/views/uits/base/posts-base/posts-base.component';
import { Pagination } from '@app/shared/types/paginate.interface';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { PaginationService } from '@app/shared/services/pagination.service';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css'],
})
export class AnnouncementsComponent
  extends PostsBaseComponent
  implements OnInit, OnDestroy
{
  maxSize: number;
  itemsPerPage: number;

  destroy$: Subject<void> = new Subject<void>();
  isMobile: boolean;

  gradients = [
    'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  ];

  constructor(
    private announcementService: AnnouncementsService,
    public authService: AuthService,
    private paginationService: PaginationService
  ) {
    super();
    this.isMobile = window.innerWidth < 992;
  }

  get profile(): Profile {
    return this.authService.profile$.getValue();
  }

  get response$(): BehaviorSubject<Pagination<ListPost>> {
    return this.announcementService.paginatedResponse$;
  }

  @HostListener('window:resize', ['$event']) onWindowResize(event) {
    this.isMobile = event.target.innerWidth < 992;
  }

  ngOnInit(): void {
    this.itemsPerPage = this.paginationService.defaultLimit;
    this.maxSize = this.paginationService.maxSize;

    this.setPosts();
  }

  ngOnDestroy(): void {
    console.log('destroy called');
    this.destroy$.next();
    this.destroy$.complete();
  }

  setPosts() {
    const { limit, offset } = this.paginationService.getPaginationParams();
    this.announcementService
      .getPosts(limit, offset)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  getPostURL(id: number) {
    return PagesConfig.about.announcements + id;
  }

  getDateFromString(dateISO: string): Date {
    return new Date(dateISO);
  }

  pageChanged(): void {
    this.setPosts();
  }
}
