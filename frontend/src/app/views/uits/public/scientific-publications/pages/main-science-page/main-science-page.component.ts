import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {RegisterScienceService} from '../../service/register-science-service.service';
import {ScienceReadyPublication} from '../../interface/profile.interface';
import {AsyncPipe, JsonPipe, NgClass, NgForOf, NgIf} from '@angular/common';
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
    ProfileCardComponent, NgClass, RouterModule, NgIf, NgForOf, ReactiveFormsModule, FormsModule, AsyncPipe, NgSelectModule, JsonPipe
  ],
  templateUrl: './main-science-page.component.html',
  styleUrls: ['./main-science-page.component.css']
})
export class MainSciencePageComponent implements OnInit {
  scienceService = inject(RegisterScienceService);
  authService: AuthService = inject(AuthService);
  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  profilesMap: Map<ScienceReadyPublication, Map<string, string>> = new Map();
  originalProfilesMap: Map<ScienceReadyPublication, Map<string, string>> = new Map();

  tagsWithStylesMapForEditingCards: Map<string, string> = new Map();
  profilesTags: Map<string, string> = new Map<string, string>();

  yearsMap: Map<string, string> = new Map();
  sourceMap: Map<string, string> = new Map();

  isHiddenTagPage: boolean = false;
  isHiddenScientistPage: boolean = false;
  isHiddenYearPage: boolean = false;
  isHiddenSourcePage: boolean = false;

  authorsMap: Map<string, string> = new Map();
  selectedAuthors: string[] = [];

  searchString: string = '';

  adminMenu: adminMenu[] = [];
  constructor() {

  }

  ngOnInit() {
    this.initAdminMenu();

    this.scienceService.getALLTagsRest().subscribe(v => {
      // заполняем все для карточек теги
      this.initTagsWithStylesMapForEditingCards(v);

      //делаем запрос карточек
      this.scienceService.getListOfCards().subscribe(value => {
        value.forEach(v => this.profilesMap.set(v, new Map(this.tagsWithStylesMapForEditingCards)));
        value.forEach(v => this.originalProfilesMap.set(v, new Map(this.tagsWithStylesMapForEditingCards)));

        //заполняем кнопки для поиска
        this.fillSearchButtons();
        this.filterThrewAllSearch();
        this.cdr.detectChanges();
        console.log(this.profilesMap);
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
    this.scienceService.getAllAuthors(Array.from(this.profilesMap.keys()))
      .forEach(val => this.authorsMap.set(val, AppSettings.DEFAULT_TAG_STYLE));

    this.scienceService.getAllYears(Array.from(this.profilesMap.keys()))
      .forEach(val => this.yearsMap.set(val.toString(), AppSettings.DEFAULT_TAG_STYLE));

    this.scienceService.getAllSource(Array.from(this.profilesMap.keys()))
      .forEach(val => this.sourceMap.set(val, AppSettings.DEFAULT_TAG_STYLE));

    const tagsFromKeys = [];

    Array.from(this.profilesMap.keys()).forEach(val => val.tags.forEach(t => tagsFromKeys.push(t)));

    tagsFromKeys.filter(v => v !== undefined)
      .forEach(val => this.profilesTags.set(val, AppSettings.DEFAULT_TAG_STYLE));
  }

  //фильтруем карточки по фильтрам
  trackByFn: any;

  filterThrewAllSearch() {
    const forFilterSource = Array.from(this.sourceMap.keys()).filter(v => this.sourceMap.get(v) === AppSettings.ONCLICK_TAG_STYLE);
    const forFilterYear = Array.from(this.yearsMap.keys()).filter(v => this.yearsMap.get(v) === AppSettings.ONCLICK_TAG_STYLE);
    const forFilterAuthors = Array.from(this.authorsMap.keys()).filter(v => this.authorsMap.get(v) === AppSettings.ONCLICK_TAG_STYLE);
    const forFilterTag = Array.from(this.profilesTags.keys()).filter(v => this.profilesTags.get(v) === AppSettings.ONCLICK_TAG_STYLE);
    let filterNames: string[] = [];

    if (this.searchString.trim() !== '') {
      filterNames = Array.from(this.profilesMap.keys()).filter(v => v.name.toLowerCase().includes(this.searchString)).map(v => v.name);
    }

    const copyMap: Map<any, any> = new Map();
    Array.from(this.originalProfilesMap.keys())
      .sort((a, b) => {
        const yearA = Number(a.year);
        const yearB = Number(b.year);

        return yearB - yearA;
      })
      .filter(v => this.containsTsOrEmpty(forFilterSource, forFilterYear, forFilterAuthors, forFilterTag, filterNames, v))
      .map(v => copyMap.set(v, new Map(this.tagsWithStylesMapForEditingCards)));

    this.profilesMap = copyMap;
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
      && (forFilterTag.length === 0 || publication.tags?.some(item => forFilterTag.includes(item)))
      && (filterNames.length === 0 || filterNames.some(item => item.toLowerCase().includes(publication.name.toLowerCase()))))!;
  }

  initTagsWithStylesMapForEditingCards(v: string[]) {
    v.forEach(val => this.tagsWithStylesMapForEditingCards.set(val, AppSettings.DEFAULT_TAG_STYLE));
    this.tagsWithStylesMapForEditingCards.set(AppSettings.EMPTY_TAG_SEARCH_TEXT, AppSettings.DEFAULT_TAG_STYLE);
  }

  onTagsClick(tag: string) {
    if (this.profilesTags.get(tag) === AppSettings.ONCLICK_TAG_STYLE) {
      this.profilesTags.set(tag, AppSettings.DEFAULT_TAG_STYLE);
      this.filterThrewAllSearch();
    } else {
      this.profilesTags.set(tag, AppSettings.ONCLICK_TAG_STYLE);
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

  selectChange(event: any) {
    console.log(event);
    this.onAuthorClick(this.selectedAuthors[this.selectedAuthors.length - 1]);
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
    this.profilesMap = new Map(this.originalProfilesMap);
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
