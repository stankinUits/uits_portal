import {Component, OnInit} from '@angular/core';
import {
  ConferenceAnnouncementsService
} from '@app/views/uits/public/scientific-activities/conference-announcements/conference-announcements.service';
import {BehaviorSubject} from 'rxjs';
import {IConferenceAnnouncements} from '@app/shared/types/models/conference-announcements';
import {Router} from '@angular/router';
import {PagesConfig} from '@app/configs/pages.config';

@Component({
  selector: 'app-conference-announcements',
  templateUrl: './conference-announcements.component.html',
  styleUrls: ['./conference-announcements.component.css']
})
export class ConferenceAnnouncementsComponent implements OnInit {
  conferenceAnnouncements$: BehaviorSubject<IConferenceAnnouncements[]> = new BehaviorSubject<IConferenceAnnouncements[]>([]);

  constructor(private conferenceAnnouncementsService: ConferenceAnnouncementsService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.conferenceAnnouncementsService.getAllConferenceAnnouncements()
      .subscribe(conferenceAnnouncements => {
        this.conferenceAnnouncements$.next(conferenceAnnouncements);
      });
  }

  redirectToDetail(id: number | string): void {
    this.router.navigate(['/scientific-activities/conferences', id]);
  }

  redirectToAdd() {
    window.open(`${PagesConfig.admin}/news/conferenceannouncement/add/`, '_blank');
  }
}
