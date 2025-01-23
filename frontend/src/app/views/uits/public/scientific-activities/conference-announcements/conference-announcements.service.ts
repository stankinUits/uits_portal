import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IConferenceAnnouncements} from '@app/shared/types/models/conference-announcements';
import {ApiConfig} from '@app/configs/api.config';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConferenceAnnouncementsService {

  constructor(private http: HttpClient) {}

  getAllConferenceAnnouncements(): Observable<IConferenceAnnouncements[]> {
    return this.http.get<IConferenceAnnouncements[]>(ApiConfig.department.news.conferences.all);
  }

  getConferenceAnnouncementByID(id: number | string): Observable<IConferenceAnnouncements> {
    return this.http.get<IConferenceAnnouncements>(ApiConfig.department.news.conferences.byID(id));
  }
}
