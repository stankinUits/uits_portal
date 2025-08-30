import {Component, HostListener, OnInit} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Post} from "@app/shared/types/models/news";
import {ActivatedRoute, Router} from "@angular/router";
import {AnnouncementsService} from "@app/views/uits/public/about/announcements/announcements.service";
import {PagesConfig} from "@app/configs/pages.config";

@Component({
  selector: 'app-announcement-post',
  templateUrl: './announcement-post.component.html',
  styleUrls: ['./announcement-post.component.css']
})
export class AnnouncementPostComponent implements OnInit {

  id: number;
  post$: BehaviorSubject<Post>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private announcementService: AnnouncementsService,
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
    this.announcementService.getPost(this.id).subscribe(post => {
      this.post$.next(post);
    });
  }

  get avatarName() {
    return this.post.author.firstName.charAt(0) + this.post.author.lastName.charAt(0)
  }

  goBack(): void {
    this.router.navigate(['/about/announcements']);
  }

  redirectToEditPage(): void {
    if (this.id) {
      window.open(PagesConfig.admin + '/news/post/' + this.id + '/change', '_blank');
    }
  }

  protected readonly PagesConfig = PagesConfig;

}
