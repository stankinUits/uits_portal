import {Component, HostListener, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NewsService} from '@app/views/uits/public/about/news/news.service';
import {ListPost} from '@app/shared/types/models/news';
import {BehaviorSubject, Subject, takeUntil} from 'rxjs';
import {AuthService} from '@app/shared/services/auth.service';
import {Profile} from '@app/shared/types/models/auth';
import {PagesConfig} from '@app/configs/pages.config';
import {PostsBaseComponent} from '@app/views/uits/base/posts-base/posts-base.component';
import {Pagination} from '@app/shared/types/paginate.interface';
import {PaginationService} from '@app/shared/services/pagination.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent extends PostsBaseComponent implements OnInit, OnDestroy {
  destroy$: Subject<void> = new Subject<void>();

  isMobile: boolean;

  maxSize: number;
  itemsPerPage: number;

  gradients = [
    'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  ];

  constructor(private newsService: NewsService,
              private paginationService: PaginationService,
              private router: Router,
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

  @HostListener('window:resize', ['$event']) onWindowResize(event) {
    this.isMobile = event.target.innerWidth < 992;
  }

  ngOnInit(): void {
    this.itemsPerPage = this.paginationService.defaultLimit;
    this.maxSize = this.paginationService.maxSize;

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

  openDetails(id: number) {
    this.router.navigate([PagesConfig.about.news + id]);
  }

  pageChanged(): void {
    this.setPosts();
  }
}
