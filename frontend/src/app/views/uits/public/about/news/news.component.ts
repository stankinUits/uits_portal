import {Component, HostListener, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NewsService} from '@app/views/uits/public/about/news/news.service';
import {ListPost} from '@app/shared/types/models/news';
import {BehaviorSubject, Subject, takeUntil} from 'rxjs';
import {AuthService} from '@app/shared/services/auth.service';
import {Profile} from '@app/shared/types/models/auth';
import {PagesConfig} from '@app/configs/pages.config';
import {PostsBaseComponent} from '@app/views/uits/base/posts-base/posts-base.component';
import {Pagination} from '@app/shared/types/paginate.interface';
import {PageChangedEvent} from 'ngx-bootstrap/pagination';
import {PaginationService} from '@app/shared/services/pagination.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent extends PostsBaseComponent implements OnInit, OnDestroy {
  destroy$: Subject<void> = new Subject<void>();

  isMobile: boolean;
  maxSize = this.paginationService.maxSize;
  _page = 1;
  defaultLimit = this.paginationService.defaultLimit;
  defaultOffset = 0;

  constructor(private newsService: NewsService,
              private paginationService: PaginationService,
              public authService: AuthService) {
    super();
    this.isMobile = window.innerWidth < 992;
  }


  get profile(): Profile {
    return this.authService.profile$.getValue();
  }

  get response$(): BehaviorSubject<Pagination<ListPost>> {
    return this.newsService.paginatedResponse$;
  }

  get itemsPerPage(): number {
    return this.defaultLimit - this.defaultOffset;
  }

  get page(): number {
    return this._page;
  }

  set page(value: number) {
    this._page = value;
  }

  @HostListener('window:resize', ['$event']) onWindowResize(event) {
    if (event.target.innerWidth < 992) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  ngOnInit(): void {
    const {limit, offset} = this.paginationService.getPaginationParams();
    if (limit !== undefined && offset !== undefined) {
      this.page = Math.round(offset / limit) + 1;
    }
    this.setPosts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setPosts() {
    const {limit, offset} = this.paginationService.getPaginationParams();
    this.newsService.getPosts(limit, offset).pipe(
      takeUntil(this.destroy$)
    ).subscribe();
  }

  getPostURL(id: number) {
    return PagesConfig.about.news + id;
  }

  getDateFromString(dateISO: string): Date {
    return new Date(dateISO);
  }


  pageChanged($event: PageChangedEvent) {
    let {limit, offset} = this.paginationService.getPaginationParams();
    if (!limit) {limit = this.defaultLimit;}
    if (!offset) {offset = this.defaultOffset;}
    const newOffset = (limit * ($event.page - 1));
    this.page = $event.page;
    this.paginationService.setPaginationParams(limit, newOffset).then(ok => {
      this.setPosts();
    });
  }
}
