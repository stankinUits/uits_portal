import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IConferenceAnnouncements} from '@app/shared/types/models/conference-announcements';
import {ApiConfig} from '@app/configs/api.config';
import {Observable} from 'rxjs';
import {Pagination} from '@app/shared/types/paginate.interface';
import {PaginationService} from '@app/shared/services/pagination.service';

@Injectable({
  providedIn: 'root'
})
export class ConferenceAnnouncementsService {
  constructor(private http: HttpClient, private paginationService: PaginationService) { }

  getAllConferenceAnnouncements(limit?: number, offset?: number): Observable<Pagination<IConferenceAnnouncements>> {
    return this.http.get<Pagination<IConferenceAnnouncements>>(ApiConfig.department.news.conferences.all, {
      params: {
        limit: limit ? limit : this.paginationService.defaultLimit,
        offset: offset ? offset : 0
      }
    });
  }

  getConferenceAnnouncementByID(id: number | string): Observable<IConferenceAnnouncements> {
    return this.http.get<IConferenceAnnouncements>(ApiConfig.department.news.conferences.byID(id));
  }
}
