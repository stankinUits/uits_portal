import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {RegisterScienceService} from '../../service/register-science-service.service';
import {ScienceReadyPublication} from '../../interface/profile.interface';
import {AsyncPipe, JsonPipe, NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {RouterModule} from '@angular/router';
import {AppSettings} from '../../utils/settings';
import {
  ProfileCardComponent
} from '@app/views/uits/public/scientific-publications/common-ui/profile-card/profile-card.component';
import {AuthService} from "@app/shared/services/auth.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";

interface adminMenu {
  title: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-main-science-page',
  standalone: true,
  imports: [
    ProfileCardComponent,
    NgClass, RouterModule,
    NgIf, NgForOf, ReactiveFormsModule,
    FormsModule, AsyncPipe, NgSelectModule,
    JsonPipe, NgStyle
  ],
  templateUrl: './main-science-page.component.html',
  styleUrls: ['./main-science-page.component.css']
})
export class MainSciencePageComponent implements OnInit {
  // Внедрение зависимостей
  scienceService = inject(RegisterScienceService);
  authService: AuthService = inject(AuthService);
  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  adminMenu: adminMenu[] = [];

  publications: Map<ScienceReadyPublication, Map<string, string>> = new Map();
  copyPublications: Map<ScienceReadyPublication, Map<string, string>> = new Map();

  tagsMap: Map<string, string> = new Map();
  yearsMap: Map<string, string> = new Map();
  sourceMap: Map<string, string> = new Map();
  authorsMap: Map<string, string> = new Map();

  isHiddenTagPage: boolean = false;
  isHiddenScientistPage: boolean = false;
  isHiddenYearPage: boolean = false;
  isHiddenSourcePage: boolean = false;

  searchString: string = '';

  constructor() {

  }

  ngOnInit() {
    this.initAdminMenu();

    // Инициализация тегов
    this.scienceService.getALLTagsRest().subscribe(tags => {
      this.initTagsMap(tags);

      // Получаем все публикации
      this.scienceService.getListOfCards().subscribe(publications => {
        publications.forEach(publication => {
          this.publications.set(publication, new Map(this.tagsMap));
          this.copyPublications.set(publication, new Map(this.tagsMap));
        });

        //заполняем кнопки для фильтров
        this.fillSearchButtons();
        this.filterThrewAllSearch();
        this.cdr.detectChanges();
      });
    });
  }

  initAdminMenu(): void {
    this.adminMenu = [
      {
        title: 'Создать преподавателя, поиск по google scholar',
        route: '/scientific-activities/publications/create_new_author',
        icon: 'feather icon-user'
      },
      {
        title: 'Редактировать публикации преподавателя',
        route: '/scientific-activities/publications/edit_author',
        icon: 'feather icon-user'
      },
      {
        title: 'Редактировать теги',
        route: '/scientific-activities/publications/manage_tags',
        icon: 'feather icon-user'
      },
    ];
  }

  fillSearchButtons() {
    this.scienceService.getAllAuthors(Array.from(this.publications.keys()))
      .forEach(author => this.authorsMap.set(author, AppSettings.DEFAULT_TAG_STYLE));

    this.scienceService.getAllYears(Array.from(this.publications.keys()))
      .forEach(year => this.yearsMap.set(year.toString(), AppSettings.DEFAULT_TAG_STYLE));

    this.scienceService.getAllSource(Array.from(this.publications.keys()))
      .forEach(source => this.sourceMap.set(source, AppSettings.DEFAULT_TAG_STYLE));
  }

  //фильтруем карточки по фильтрам
  trackByFn: any;

  filterThrewAllSearch() {
    const forFilterSource = Array.from(this.sourceMap.keys()).filter(v => this.sourceMap.get(v) === AppSettings.ONCLICK_TAG_STYLE);
    const forFilterYear = Array.from(this.yearsMap.keys()).filter(v => this.yearsMap.get(v) === AppSettings.ONCLICK_TAG_STYLE);
    const forFilterAuthors = Array.from(this.authorsMap.keys()).filter(v => this.authorsMap.get(v) === AppSettings.ONCLICK_TAG_STYLE);
    const forFilterTag = Array.from(this.tagsMap.keys()).filter(v => this.tagsMap.get(v) === AppSettings.ONCLICK_TAG_STYLE);
    let filterNames: string[] = [];


    if (this.searchString.trim() !== '') {
      filterNames = Array.from(this.publications.keys()).filter(v => v.name.toLowerCase().includes(this.searchString)).map(v => v.name);
    }

    const copyMap: Map<any, any> = new Map();
    Array.from(this.copyPublications.keys())
      .sort((a, b) => {
        const yearA = Number(a.year);
        const yearB = Number(b.year);

        return yearB - yearA;
      })
      .filter(v => this.containsTsOrEmpty(forFilterSource, forFilterYear, forFilterAuthors, forFilterTag, filterNames, v))
      .map(v => copyMap.set(v, new Map(this.tagsMap)));

    this.publications = copyMap;
  }

  containsTsOrEmpty(forFilterSource: string[],
                    forFilterYear: string[],
                    forFilterAuthors: string[],
                    forFilterTag: string[],
                    filterNames: string[],
                    publication: ScienceReadyPublication
  ): boolean {

    return ((forFilterSource.length === 0 || forFilterSource.some(item => item === publication.source))
      && (forFilterYear.length === 0 || forFilterYear.some(item => item === publication.year?.toString()))
      && (forFilterAuthors.length === 0 || publication.author?.some(item => forFilterAuthors.includes(item)))
      && (forFilterTag.length === 0 || publication.tags?.some(item => forFilterTag.includes(item.name)))
      && (filterNames.length === 0 || filterNames.some(item => item.toLowerCase().includes(publication.name.toLowerCase()))))!;
  }

  initTagsMap(tags: string[]) {
    tags.forEach(tag => {
      this.tagsMap.set(tag, AppSettings.DEFAULT_TAG_STYLE)
    });
  }

  onTagsClick(tag: string) {
    if (this.tagsMap.get(tag) === AppSettings.ONCLICK_TAG_STYLE) {
      this.tagsMap.set(tag, AppSettings.DEFAULT_TAG_STYLE);
      this.filterThrewAllSearch();
    } else {
      this.tagsMap.set(tag, AppSettings.ONCLICK_TAG_STYLE);
      this.filterThrewAllSearch();
    }
  }

  onSourceClick(source: string) {
    if (this.sourceMap.get(source) === AppSettings.ONCLICK_TAG_STYLE) {
      this.sourceMap.set(source, AppSettings.DEFAULT_TAG_STYLE);
      this.filterThrewAllSearch();
    } else {
      this.sourceMap.set(source, AppSettings.ONCLICK_TAG_STYLE);
      this.filterThrewAllSearch();
    }
  }

  onYearClick(year: string) {
    if (this.yearsMap.get(year)! === AppSettings.ONCLICK_TAG_STYLE) {
      this.yearsMap.set(year, AppSettings.DEFAULT_TAG_STYLE);
      this.filterThrewAllSearch();
    } else {
      this.yearsMap.set(year, AppSettings.ONCLICK_TAG_STYLE);
      this.filterThrewAllSearch();
    }
  }

  onAuthorClick(name: string) {
    if (this.authorsMap.get(name) === AppSettings.ONCLICK_TAG_STYLE) {
      this.authorsMap.set(name, AppSettings.DEFAULT_TAG_STYLE);
      this.filterThrewAllSearch();
    } else {
      this.authorsMap.set(name, AppSettings.ONCLICK_TAG_STYLE);
      this.filterThrewAllSearch();
    }
  }

  onChooseForScientistsClick() {
    this.isHiddenScientistPage = !this.isHiddenScientistPage;
  }

  onChooseForTagsClick() {
    this.isHiddenTagPage = !this.isHiddenTagPage;
  }

  onChooseForYearClick() {
    this.isHiddenYearPage = !this.isHiddenYearPage;
  }

  onChooseForSourceClick() {
    this.isHiddenSourcePage = !this.isHiddenSourcePage;
  }

  cleanFilter() {
    this.publications = new Map(this.copyPublications);
    this.fillSearchButtons();
    this.filterThrewAllSearch();
  }

  searchScienceCards() {
    if (this.searchString.trim() !== '') {
      this.filterThrewAllSearch();
    } else {
      this.filterThrewAllSearch();
    }
  }
}
