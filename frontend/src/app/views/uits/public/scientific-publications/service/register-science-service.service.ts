import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {SciencePublicationResponseInterface} from '../interface/science-publication-response.interface';
import {AppSettings} from '../utils/settings';
import {ScienceReadyPublication} from '../interface/profile.interface';
import {AuthorInfo} from '../interface/autrhor_info.interface';
import {ResponseOnSave} from "../interface/response_on_save_object.interface";

@Injectable({
  providedIn: 'root'
})
export class RegisterScienceService {

  http = inject(HttpClient);

  constructor() {
  }

  getInfoFromGoogleScholar(name: string | null | undefined): Observable<SciencePublicationResponseInterface> {
    return this.http.get<SciencePublicationResponseInterface>(`${AppSettings.BASE_URL}/search_for_scientist/${name}`);
  }

  saveNewTags(tag: string[]) {
    const objectToSend = {
      tags: tag
    };

    return this.http.post(`${AppSettings.BASE_URL}/save_new_tags/`, {//не работает
      objectToSend
    });
  }

  saveCard(publication: ScienceReadyPublication) {
    return this.http.post(`${AppSettings.BASE_URL}/save_card/`, {publication});
  }

  onSaveCard(publication: ScienceReadyPublication) {
    this.saveCard(publication).subscribe(
      (response: ResponseOnSave) => {
        publication.id = response.id;
      },
      (error) => {
        console.error('Error saving card:', error);
      }
    );
  }

  deleteCard(publication: ScienceReadyPublication) {
    return this.http.post(`${AppSettings.BASE_URL}/delete_card/`, {publication});
  }

  deleteTag(tag: string) {
    return this.http.post(`${AppSettings.BASE_URL}/delete_tag/${tag}/`, {});
  }

  getALLTagsRest(): Observable<string[]> {
    return this.http.get<string[]>(`${AppSettings.BASE_URL}/get_all_tags`);
  }

  getListOfCards(): Observable<ScienceReadyPublication[]> {
    return this.http.get<ScienceReadyPublication[]>(`${AppSettings.BASE_URL}/get_cards`);
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
