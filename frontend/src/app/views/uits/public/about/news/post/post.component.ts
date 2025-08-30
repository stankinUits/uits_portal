import {Component, HostListener, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NewsService} from '@app/views/uits/public/about/news/news.service';
import {Post} from '@app/shared/types/models/news';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ModalDirection} from '@app/shared/types/modal-direction';
import {PagesConfig} from '@app/configs/pages.config';
import {Permission} from '@app/shared/types/permission.enum';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  id: number;
  post$: BehaviorSubject<Post>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private newsService: NewsService,
  ) {
    this.post$ = new BehaviorSubject<Post>(null);
  }

  get post(): Post {
    return this.post$.getValue();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params.id;
      this.getPost();
    });
  }

  getPost() {
    this.newsService.getPost(this.id).subscribe(post => {
      this.post$.next(post);
      console.log(post)
    });
  }

  goBack(): void {
    this.router.navigate(['/about/news']);
  }

  redirectToEditPage(): void {
    if (this.id) {
      window.open(PagesConfig.admin + '/news/post/' + this.id + '/change', '_blank');
    }
  }

  get avatarName() {
    return this.post.author.firstName.charAt(0) + this.post.author.lastName.charAt(0)
  }

  protected readonly PagesConfig = PagesConfig;
}
