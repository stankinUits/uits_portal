import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {UserStatus} from '../interface/user_status.interface';
import {Observable, of} from 'rxjs';
import {ScienceRawPublication} from '../interface/science-publications-from-scholar.interface';
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

  getInfoIfUserIsAdmin(): Observable<UserStatus> {
    //return this.http.get<UserStatus>(`${this.baseUrl}/get_if_admin_status`)
    const mockUserStatus = {
      username: 'test_user',
      isAdmin: true
    };

    return of(mockUserStatus);
  }

  getInfoFromGoogleScholar(name: string | null | undefined): Observable<SciencePublicationResponseInterface> {
    //return this.http.post(`${this.baseUrl}/search_for_scientist/${name}`, null)

    const publication1: ScienceRawPublication = {
      title: 'Quantum Computing Breakthrough',
      link: undefined,
      name: "John Doe",
      source: "Nature Journal"
    };

    const publication2: ScienceRawPublication = {
      title: "AI Ethics Report",
      link: "https://example.com/article2",
      name: "John Doe",
      source: "MIT Technology Review"
    };

    const publication3: ScienceRawPublication = {
      title: "Climate Change Study",
      link: "https://example.com/article3",
      name: "John Doe",
      source: "Scientific American"
    };

    return of({isOverRequested: false, sciencePublicationCards: [publication1, publication2, publication3]})
  }

  getALLTagsRest(): Observable<string[]> {
    return of(["Biotechnology", "Gene Editing", "Medical Research", "Astrophysics", "Black Holes", "Cosmology", "Machine Learning", "AI", "Data Science", "Gene Editing", "Biotechnology", "Gene Editing", "Medical Research"]) //this.http.get<string[]>(`${AppSettings.BASE_URL}/get_all_tags`)
  }

  saveCard(profile: ScienceReadyPublication): Observable<any> {
    return this.http.post(`${AppSettings.BASE_URL}\\save_card`, {
      profile: profile
    })
  }

  saveNewTags(tags: string[]) {
    return this.http.post(`${AppSettings.BASE_URL}\\save_new_tags`, {
      tags: tags
    })
  }

  deleteCard(publication: ScienceReadyPublication) {
    return this.http.post(`${AppSettings.BASE_URL}\\delete_card`, {publication: publication})
  }

  getListOfCards(): Observable<ScienceReadyPublication[]> {
    //return this.http.get<Profile[]>(`${this.baseUrl}/get`)

    const profileMock: ScienceReadyPublication = {
      id: 12345,
      name: "buildings",
      author: ["Jane Smith", "johnlee123"],
      description: "Renowned astrophysicist specializing in black hole research.",
      url: "https://www.janesmith.com",
      file: undefined, // Optional field, so we set it to null here
      tags: ["Astrophysics", "Black Holes", "Cosmology"],
      year: 2002,
      source: "Nature Journal"
    };

    const johnProfileMock: ScienceReadyPublication = {
      id: 34567,
      name: "Chemistry",
      author: ["johnlee123"],
      description: "Expert in machine learning and AI applications.",
      url: "https://www.johnlee.ai",
      file: undefined,
      tags: ["Machine Learning", "AI", "Data Science", "Gene Editing"],
      year: 2012,
      source: "MIT Technology Review"
    };

    const sophiaProfileMock: ScienceReadyPublication = {
      id: 24680,
      name: "Phisics",
      author: ["sophiapatel"],
      description: "Innovative biotech engineer specializing in gene editing.",
      url: "https://www.youtube.com/",
      file: undefined,
      tags: ["Biotechnology", "Gene Editing", "Medical Research"],
      year: 2006,
      source: "Scientific American"
    };

    return of([profileMock, johnProfileMock, sophiaProfileMock])
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
    return of([{name: "sophiapatel"}, {name: "johnlee123"}, {name: "Jane Smith"}])//this.http.get<AuthorInfo[]>(`${AppSettings.BASE_URL}/get_all_authors`)
  }

  getAllCardsByAuthorName(name: string): Observable<ScienceReadyPublication[]> {
    const sophiaProfileMock: ScienceReadyPublication = {
      id: 24680,
      name: "Phisics",
      author: ["sophiapatel"],
      description: "Innovative biotech engineer specializing in gene editing.",
      url: "https://www.youtube.com/",
      file: undefined,
      tags: ["Biotechnology", "Gene Editing", "Medical Research"],
      source: "Scientific American"
    };

    const sophiaProfileMock2: ScienceReadyPublication = {
      id: 24680,
      name: "Music",
      author: ["sophiapatel"],
      description: "Innovative biotech engineer specializing in gene editing.",
      url: "https://www.youtube.com/",
      file: undefined,
      tags: ["Medical Research"],
      source: "Scientific American"
    };

    return of([sophiaProfileMock, sophiaProfileMock2])//this.http.get<ScienceReadyPublication[]>(`${AppSettings.BASE_URL}/get/${name}`)
  }
}
