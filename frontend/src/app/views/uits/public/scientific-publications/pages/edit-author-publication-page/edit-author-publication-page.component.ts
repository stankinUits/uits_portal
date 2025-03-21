import {Component, inject, OnInit} from '@angular/core';
import {
  EditablePublicationCardComponent
} from '../../common-ui/editable-publication-card/editable-publication-card.component';
import {ScienceReadyPublication} from '../../interface/profile.interface';
import {RegisterScienceService} from '../../service/register-science-service.service';
import {Router, RouterLink} from '@angular/router';
import {AppSettings} from '../../utils/settings';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {AuthService} from "@app/shared/services/auth.service";

@Component({
  selector: 'app-edit-author-publication-page',
  standalone: true,
  imports: [
    EditablePublicationCardComponent,
    RouterLink,
    NgIf,
    NgForOf,
    NgClass
  ],
  templateUrl: './edit-author-publication-page.component.html',
  styleUrls: ['./edit-author-publication-page.component.css']
})
export class EditAuthorPublicationPageComponent implements OnInit {
  scienceService: RegisterScienceService = inject(RegisterScienceService);
  trackByFn: any;

  tagsWithStylesMap: Map<string, string> = new Map();
  isHiddenScientistPage: boolean = false;
  authors: Map<string, string> = new Map();
  profileCardsMap: Map<ScienceReadyPublication, Map<string, string>> = new Map();
  profileEmptyCardsMap: Map<ScienceReadyPublication, Map<string, string>> = new Map();

  constructor(private router: Router, private authService: AuthService) {
    this.scienceService.getAllAuthorsByRest().subscribe(a => a.forEach(author => this.authors.set(author, AppSettings.DEFAULT_TAG_STYLE)));

    this.scienceService.getALLTagsRest().subscribe(v => v.forEach(val => this.tagsWithStylesMap.set(val, AppSettings.DEFAULT_TAG_STYLE)));
    this.tagsWithStylesMap.set(AppSettings.EMPTY_TAG_SEARCH_TEXT, AppSettings.DEFAULT_TAG_STYLE);
  }

  ngOnInit() {
    this.authService.isAdmin().subscribe(isAdmin => {
      if (!isAdmin) {
        this.router.navigate(['/scientific-activities/publications/main-science-page']);
      }
    })
  }

  onAuthorClick(name: string) {
    if (this.authors.get(name) === AppSettings.DEFAULT_TAG_STYLE) {
      this.authors.forEach((v, k) => this.authors.set(k, AppSettings.DEFAULT_TAG_STYLE));
      this.authors.set(name, AppSettings.ONCLICK_TAG_STYLE);

      this.profileCardsMap = new Map();
      this.scienceService.getAllCardsByAuthorName(name).subscribe(v => v.forEach(val => this.profileCardsMap.set(val, new Map(this.tagsWithStylesMap))));
    } else {
      this.authors.set(name, AppSettings.DEFAULT_TAG_STYLE);
    }
  }

  onChooseForScientistsClick() {
    console.log(this.authors);
    this.isHiddenScientistPage = !this.isHiddenScientistPage;
  }

  addNewEmptyCard() {
    const emptyPublication: ScienceReadyPublication = {
      id: undefined,
      name: undefined,
      author: [],
      description: undefined,
      url: undefined,
      file: undefined,
      tags: [],
      source: undefined,
      id_for_unique_identify_component: AppSettings.generateRandomString(30)
    };

    const copyMap = new Map();
    copyMap.set(emptyPublication, new Map(this.tagsWithStylesMap));
    this.profileEmptyCardsMap.forEach((v, k) => copyMap.set(k, v));
    this.profileEmptyCardsMap = copyMap;
  }

  deleteCard(id: string) {
    let key = Array.from(this.profileCardsMap.keys()).find(k => k.id_for_unique_identify_component === id);

    if (key) {
      this.profileCardsMap.delete(key);
    } else {
      key = Array.from(this.profileEmptyCardsMap.keys()).find(k => k.id_for_unique_identify_component === id);
      if (key) {
        this.profileEmptyCardsMap.delete(key);
      }
    }
  }
}
