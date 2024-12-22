import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {SciencePublicationResponseInterface} from '../interface/science-publication-response.interface';
import {AppSettings} from '../utils/settings';
import {ScienceReadyPublication} from '../interface/profile.interface';
import {AuthorInfo} from '../interface/autrhor_info.interface';

@Injectable({
  providedIn: 'root'
})
export class RegisterScienceService {

  http = inject(HttpClient);

  constructor() {
  }

  getInfoFromGoogleScholar(name: string | null | undefined): Observable<SciencePublicationResponseInterface> {
    return this.http.post<SciencePublicationResponseInterface>(`${AppSettings.BASE_URL}/search_for_scientist/${name}`, null);
  }

  saveNewTags(tags: string[]) {
    return this.http.post(`${AppSettings.BASE_URL}\\save_new_tags`, {
      tags
    });
  }

  saveCard(publication: ScienceReadyPublication) {
    return this.http.post(`${AppSettings.BASE_URL}/save_card`, {publication});
  }

  deleteCard(publication: ScienceReadyPublication) {
    return this.http.post(`${AppSettings.BASE_URL}/delete_card`, {publication});
  }

  deleteTag(tag: string) {
    return this.http.post(`${AppSettings.BASE_URL}/delete_tag`, {tagName: tag});
  }

  getALLTagsRest(): Observable<string[]> {
    return this.http.get<string[]>(`${AppSettings.BASE_URL}/get_all_tags`);
  }

  getListOfCards(): Observable<ScienceReadyPublication[]> {
    return this.http.get<ScienceReadyPublication[]>(`${AppSettings.BASE_URL}/get`);
  }


  getAllAuthors(profiles: ScienceReadyPublication[]): string[] {
    const authorsSet: Set<string> = new Set();
    profiles.forEach(pr => pr.author.forEach(a => authorsSet.add(a)));
    return Array.from(authorsSet);
  }

  getAllYears(profiles: ScienceReadyPublication[]): number[] {
    const yearsSet: Set<number> = new Set();
    profiles.forEach(pr => yearsSet.add(pr.year));
    return Array.from(yearsSet);
  }

  getAllSource(profiles: ScienceReadyPublication[]): string[] {
    const sourceSet: Set<string> = new Set();
    profiles.forEach(pr => sourceSet.add(pr.source));
    return Array.from(sourceSet);
  }

  getAllAuthorsByRest(): Observable<AuthorInfo[]> {
    return this.http.get<AuthorInfo[]>(`${AppSettings.BASE_URL}/get_all_authors`);
  }

  getAllCardsByAuthorName(name: string): Observable<ScienceReadyPublication[]> {
    return this.http.get<ScienceReadyPublication[]>(`${AppSettings.BASE_URL}/get/${name}`);
  }
}
