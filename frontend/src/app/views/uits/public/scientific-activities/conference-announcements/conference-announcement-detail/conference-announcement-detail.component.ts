import { Component, OnInit } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IConferenceAnnouncements} from '@app/shared/types/models/conference-announcements';
import {
  ConferenceAnnouncementsService
} from '@app/views/uits/public/scientific-activities/conference-announcements/conference-announcements.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PagesConfig} from "@app/configs/pages.config";

@Component({
  selector: 'app-conference-announcement-detail',
  templateUrl: './conference-announcement-detail.component.html',
  styleUrls: ['./conference-announcement-detail.component.css']
})
export class ConferenceAnnouncementDetailComponent implements OnInit {
  conference$: BehaviorSubject<IConferenceAnnouncements> = new BehaviorSubject<IConferenceAnnouncements>(null);
  id: number;

  constructor(private conferenceAnnouncementsService: ConferenceAnnouncementsService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id = +id;
    this.conferenceAnnouncementsService.getConferenceAnnouncementByID(id)
      .subscribe(conferenceAnnouncement => {
        this.conference$.next(conferenceAnnouncement);
      });
  }

  goBack(): void {
    this.router.navigate(['/scientific-activities/conferences']);
  }

  redirectToEditPage(): void {
    window.open(`${PagesConfig.admin}/news/conferenceannouncement/${this.id}/change/`);
  }
}
