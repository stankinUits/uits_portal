import {ChangeDetectorRef, Component, ElementRef, HostListener, inject, OnInit, ViewChild} from '@angular/core';
import {RegisterScienceService} from '../../service/register-science-service.service';
import {ITag, ScienceReadyPublication} from '../../interface/profile.interface';
import {AsyncPipe, JsonPipe, NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {RouterModule} from '@angular/router';
import {AppSettings} from '../../utils/settings';
import {
  ProfileCardComponent
} from '@app/views/uits/public/scientific-publications/common-ui/profile-card/profile-card.component';
import {AuthService} from "@app/shared/services/auth.service";
import {FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {AlertService} from "@app/shared/services/alert.service";
import {
  EditablePublicationCardComponent
} from "@app/views/uits/public/scientific-publications/common-ui/editable-publication-card/editable-publication-card.component";
import {
  PublicationResponse
} from "@app/views/uits/public/scientific-publications/interface/publication-response.interface";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {modeType} from "@app/views/uits/public/scientific-publications/interface/mode.type";

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
  styleUrls: ['./main-science-page.component.scss']
})
export class MainSciencePageComponent implements OnInit {
  scienceService = inject(RegisterScienceService);
  authService: AuthService = inject(AuthService);
  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  @ViewChild('filterContainer') filterContainer!: ElementRef;

  adminMenu: adminMenu[] = [];

  publications: Map<ScienceReadyPublication, Map<string, string>> = new Map();
  copyPublications: Map<ScienceReadyPublication, Map<string, string>> = new Map();

  tagsMap: Map<string, string> = new Map();
  yearsMap: Map<string, string> = new Map();
  sourceMap: Map<string, string> = new Map();
  authorsMap: Map<string, string> = new Map();

  searchString: string = '';

  visibilityMap = {
    authors: false,
    tags: false,
    years: false,
    sources: false,
  }

  activeFilter = {
    authors: false,
    tags: false,
    years: false,
    sources: false,
  }

  constructor(private alertService: AlertService,
              public bsModalRef: BsModalRef,
              private modalService: BsModalService) {

  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.filterContainer && !this.filterContainer.nativeElement.contains(target)) {
      this.closeAllFilters();
    }
  }

  ngOnInit() {
    this.initAdminMenu();
    this.initTags();
  }

  initTags() {
    this.scienceService.getALLTags().subscribe(tags => {
      this.initTagsMap(tags);
      this.initPublications();
    });
  }

  initPublications() {
    // Получаем все публикации
    this.scienceService.getListOfCards().subscribe(publications => {
      publications.forEach(publication => {
        this.publications.set(publication, new Map(this.tagsMap));
        this.copyPublications.set(publication, new Map(this.tagsMap));
      });

      this.fillFilters();
      this.cdr.detectChanges();
    });
  }

  fillFilters() {
    //заполняем кнопки для фильтров
    this.fillDataForFilters();
    this.filterThrewAllSearch();
  }

  initAdminMenu(): void {
    this.adminMenu = [
      {
        title: 'Поиск по google scholar',
        route: '/scientific-activities/publications/serp-api-search',
        icon: 'feather icon-user'
      },
      {
        title: 'Редактировать теги',
        route: '/scientific-activities/publications/manage_tags',
        icon: 'feather icon-user'
      },
    ];
  }

  fillDataForFilters() {
    this.scienceService.getAllAuthors(Array.from(this.publications.keys()))
      .forEach(author => this.authorsMap.set(author, AppSettings.DEFAULT_TAG_STYLE));

    this.scienceService.getAllYears(Array.from(this.publications.keys()))
      .forEach(year => this.yearsMap.set(year.toString(), AppSettings.DEFAULT_TAG_STYLE));

    this.scienceService.getAllSource(Array.from(this.publications.keys()))
      .forEach(source => this.sourceMap.set(source, AppSettings.DEFAULT_TAG_STYLE));

    for (const tag of this.tagsMap.keys()) {
      this.tagsMap.set(tag, AppSettings.DEFAULT_TAG_STYLE);
    }
  }

  //фильтруем карточки по фильтрам
  trackByFn: any;

  filterThrewAllSearch() {
    const forFilterSource = Array.from(this.sourceMap.keys()).filter(v => this.sourceMap.get(v) === AppSettings.ONCLICK_TAG_STYLE);
    console.log(forFilterSource);
    const forFilterYear = Array.from(this.yearsMap.keys()).filter(v => this.yearsMap.get(v) === AppSettings.ONCLICK_TAG_STYLE);
    console.log(forFilterYear);
    const forFilterAuthors = Array.from(this.authorsMap.keys()).filter(v => this.authorsMap.get(v) === AppSettings.ONCLICK_TAG_STYLE);
    console.log(forFilterAuthors);
    const forFilterTag = Array.from(this.tagsMap.keys()).filter(v => this.tagsMap.get(v) === AppSettings.ONCLICK_TAG_STYLE);
    console.log(forFilterTag);
    let filterNames: string[] = [];


    if (this.searchString.trim() !== '') {
      filterNames = Array.from(this.publications.keys()).filter(v =>
        v.name.toLowerCase().includes(this.searchString)).map(v => v.name);
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

  initTagsMap(tags: ITag[]) {
    tags.forEach(tag => {
      this.tagsMap.set(tag.name, AppSettings.DEFAULT_TAG_STYLE)
    });
  }

  private toggleFilterStyle(map: Map<string, string>, key: string, filterName: string) {
    const currentStyle = map.get(key);
    const newStyle = currentStyle === AppSettings.ONCLICK_TAG_STYLE ?
      AppSettings.DEFAULT_TAG_STYLE :
      AppSettings.ONCLICK_TAG_STYLE;

    map.set(key, newStyle);
    for (const keyMap of map.keys()) {
      if (map.get(keyMap) === AppSettings.ONCLICK_TAG_STYLE) {
        this.activeFilter[filterName] = true;
        break;
      } else {
        this.activeFilter[filterName] = false;
      }
    }
    this.filterThrewAllSearch();
  }

  deleteCard(id: number) {
    this.scienceService.deleteCard(id).subscribe({
      next: () => {
        this.alertService.add('Публикация удалена', 'success');
        this.publications.clear();
        this.copyPublications.clear();
        this.initPublications();
      },
      error: (err) => {
        this.alertService.add('Произошла ошибка', 'danger');
        console.error(err);
      }
    });
  }

  onTagsClick(tag: string, filterName: string) {
    this.toggleFilterStyle(this.tagsMap, tag, filterName);
  }

  onSourceClick(source: string, filterName: string) {
    this.toggleFilterStyle(this.sourceMap, source, filterName);
  }

  onYearClick(year: string, filterName: string) {
    this.toggleFilterStyle(this.yearsMap, year, filterName);
  }

  onAuthorClick(name: string, filterName: string) {
    this.toggleFilterStyle(this.authorsMap, name, filterName);
  }

  toggleFilterVisible(filterName: keyof typeof this.visibilityMap) {
    for (const key in this.visibilityMap) {
      if (this.visibilityMap.hasOwnProperty(key)) {
        this.visibilityMap[key] = key === filterName ? !this.visibilityMap[key] : false;
      }
    }
  }

  cleanFilter() {
    this.publications = new Map(this.copyPublications);
    this.fillDataForFilters();
    this.filterThrewAllSearch();
    for (const key in this.activeFilter) {
      if (this.activeFilter.hasOwnProperty(key)) {
        this.activeFilter[key] = false;
      }
    }
  }

  searchScienceCards() {
    this.filterThrewAllSearch();
  }

  closeAllFilters() {
    this.visibilityMap = {
      authors: false,
      tags: false,
      years: false,
      sources: false
    };
  }

  openEditModal() {
    const emptyPublication: ScienceReadyPublication = {
      name: "",
      year: null,
      tags: [],
      author: [],
      description: "",
      pages: "",
      vol_n: "",
      isbn: "",
      source: "",
      url: "",
      file: null
    };

    const initialState = {
      publication: emptyPublication,
      tagsWithStylesMap: this.tagsMap,
      mode: 'add' as modeType
    };
    this.bsModalRef = this.modalService.show(EditablePublicationCardComponent, {
      initialState
    });
    this.bsModalRef.content.edit.subscribe({
      next: (formData: PublicationResponse) => {
        this.alertService.add('Публикация успешно добавлена', 'success');
        this.bsModalRef.hide();
        this.scienceService.saveCard(formData).subscribe({
            next: () => {
              this.initPublications();
            }
          }
        );
      },
      error: (err) => {
        this.alertService.add('Что-то пошло не так', 'danger');
      }
    });
  }
}
