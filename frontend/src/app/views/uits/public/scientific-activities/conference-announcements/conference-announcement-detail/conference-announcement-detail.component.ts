import { Component, OnInit } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IConferenceAnnouncements} from '@app/shared/types/models/conference-announcements';
import {
  ConferenceAnnouncementsService
} from '@app/views/uits/public/scientific-activities/conference-announcements/conference-announcements.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-conference-announcement-detail',
  templateUrl: './conference-announcement-detail.component.html',
  styleUrls: ['./conference-announcement-detail.component.css']
})
export class ConferenceAnnouncementDetailComponent implements OnInit {
  conference$: BehaviorSubject<IConferenceAnnouncements> = new BehaviorSubject<IConferenceAnnouncements>(null);

  constructor(private conferenceAnnouncementsService: ConferenceAnnouncementsService,
              private router: ActivatedRoute,) { }

  ngOnInit(): void {
    console.log('123');
    const id = this.router.snapshot.paramMap.get('id');
    this.conferenceAnnouncementsService.getConferenceAnnouncementByID(id)
      .subscribe(conferenceAnnouncement => {
        this.conference$.next(conferenceAnnouncement);
      });
  }
}
