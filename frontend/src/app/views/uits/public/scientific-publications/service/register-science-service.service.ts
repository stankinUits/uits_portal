import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {SciencePublicationResponseInterface} from '../interface/science-publication-response.interface';
import {AppSettings} from '../utils/settings';
import {ITag, ScienceReadyPublication} from '../interface/profile.interface';
import {
  PublicationResponse
} from "@app/views/uits/public/scientific-publications/interface/publication-response.interface";

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

  saveNewTags(tags: string[]) {
    return this.http.post(`${AppSettings.BASE_URL}/save_new_tags/`, {
      tags
    });
  }

  saveCard(publication: PublicationResponse) {
    return this.http.post(`${AppSettings.BASE_URL}/save_card/`, {...publication});
  }

  editCard(publication: PublicationResponse) {
    return this.http.post(`${AppSettings.BASE_URL}/edit_card/`, {...publication});
  }

  deleteCard(id: number) {
    return this.http.post(`${AppSettings.BASE_URL}/delete_card/`, {id});
  }

  deleteTag(tag: string) {
    return this.http.post(`${AppSettings.BASE_URL}/delete_tag/${tag}/`, {});
  }

  getALLTagsRest(): Observable<string[]> {
    return this.http.get<string[]>(`${AppSettings.BASE_URL}/get_all_tags`);
  }

  getALLTags(): Observable<ITag[]> {
    return this.http.get<ITag[]>(`${AppSettings.BASE_URL}/get_all_tags`);
  }

  getListOfCards(): Observable<ScienceReadyPublication[]> {
    return this.http.get<ScienceReadyPublication[]>(`${AppSettings.BASE_URL}/get_cards`).pipe(
      map(cards => {
        cards.map(card => {
          if (typeof card.author === 'string') {
            return card.author = [card.author];
          }
        })
        return cards;
      })
    );
  }

  getAllAuthors(publications: ScienceReadyPublication[]): string[] {
    const authorsSet: Set<string> = new Set();
    publications.forEach(pr => pr.author.forEach(a => authorsSet.add(a)));
    return Array.from(authorsSet);
  }

  getAllYears(publications: ScienceReadyPublication[]): number[] {
    const yearsSet: Set<number> = new Set();
    publications.forEach(pr => yearsSet.add(pr.year));
    return Array.from(yearsSet);
  }

  getAllSource(publications: ScienceReadyPublication[]): string[] {
    const sourceSet: Set<string> = new Set();
    publications.forEach(pr => sourceSet.add(pr.source));
    return Array.from(sourceSet);
  }

  getAllAuthorsByRest(): Observable<string[]> {
    return this.http.get<string[]>(`${AppSettings.BASE_URL}/get_all_authors`);
  }

  getAllCardsByAuthorName(name: string): Observable<ScienceReadyPublication[]> {
    return this.http.get<ScienceReadyPublication[]>(`${AppSettings.BASE_URL}/get/${name}`);
  }
}
