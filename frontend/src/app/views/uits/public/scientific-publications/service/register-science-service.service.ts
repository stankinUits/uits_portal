import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {UserStatus} from '../interface/user_status.interface';
import {Observable, of} from 'rxjs';
import {ScienceRawPublication} from '../interface/science-publications-from-scholar.interface';
import {SciencePublicationResponseInterface} from '../interface/science-publication-response.interface';
import {AppSettings} from '../utils/settings';
import {ScienceReadyPublication} from '../interface/profile.interface';
import {AuthorInfo} from '../interface/autrhor_info.interface';

//todo waiting rest for this
@Injectable({
  providedIn: 'root'
})
export class RegisterScienceService {

  http = inject(HttpClient);

  constructor() {
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
    return this.http.post(`${AppSettings.BASE_URL}\\delete_card`, {publication: publication});
  }

  deleteTag(tag: string) {
    return this.http.post(`${AppSettings.BASE_URL}\\delete_tag`, {tagName: tag});
  }

  getListOfCards(): Observable<ScienceReadyPublication[]> {
    //return this.http.get<Profile[]>(`${this.baseUrl}/get`)

    const mockObjects: ScienceReadyPublication[] = [
      {
        id: 1,
        name: "Quantum Physics Breakthrough",
        author: ["Dr. Maria Rodriguez", "Prof. John Smith"],
        description: "A groundbreaking study on quantum entanglement.",
        url: "https://example.com/quantum-physics-paper",
        file: null,
        tags: ["physics", "quantum", "research"],
        source: "Nature Journal",
        year: 2023,
        pages: "pp. 12-20",
        vol_n: "Vol. 123, No. 456",
        isbn: "978-3-16-148410-0",
      },
      {
        id: 2,
        name: "Climate Change Impact Study",
        author: ["Dr. Jane Doe", "Prof. Bob Johnson"],
        description: "An analysis of global warming effects on coastal ecosystems.",
        url: "https://example.com/climate-change-study",
        file: null,
        tags: ["climate", "ecology", "environmental"],
        source: "Science Magazine",
        year: 2022,
        pages: "pp. 45-55",
        vol_n: "Vol. 124, No. 567",
        isbn: "978-3-16-149410-0",
      },
      {
        id: 3,
        name: "Artificial Intelligence Ethics",
        author: ["Prof. Sarah Lee", "Dr. Michael Brown"],
        description: "Exploring ethical implications of AI development.",
        url: "https://example.com/ai-ethics",
        file: null,
        tags: ["AI", "ethics", "technology"],
        source: "IEEE Spectrum",
        year: 2021,
        pages: "pp. 67-75",
        vol_n: "Vol. 125, No. 890",
        isbn: "978-3-16-150410-0",
      },
      {
        id: 4,
        name: "Neuroscience Breakthrough",
        author: ["Dr. Emily Chen", "Prof. David Lee"],
        description: "Discoveries in brain-computer interfaces.",
        url: "https://example.com/neuroscience-breakthrough",
        file: null,
        tags: ["neuroscience", "technology", "innovation"],
        source: "Nature Neuroscience",
        year: 2020,
        pages: "pp. 89-98",
        vol_n: "Vol. 126, No. 123",
        isbn: "978-3-16-151410-0",
      },
      {
        id: 5,
        name: "Renewable Energy Solutions",
        author: ["Prof. Maria Rodriguez", "Dr. John Smith"],
        description: "Exploring sustainable energy alternatives.",
        url: "https://example.com/renewable-energy-solutions",
        file: null,
        tags: ["sustainability", "energy", "environmental"],
        source: "Science Advances",
        year: 2019,
        pages: "pp. 101-110",
        vol_n: "Vol. 127, No. 456",
        isbn: "978-3-16-152410-0",
      },
      {
        id: 6,
        name: "Quantum Computing Advancements",
        author: ["Dr. Sarah Johnson", "Prof. Michael Chen"],
        description: "Recent developments in quantum computing hardware.",
        url: "https://example.com/quantum-computing",
        file: null,
        tags: ["computing", "quantum", "research"],
        source: "Physical Review X",
        year: 2018,
        pages: "pp. 113-122",
        vol_n: "Vol. 128, No. 789",
        isbn: "978-3-16-153410-0",
      }
    ];

    return of(mockObjects)
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
