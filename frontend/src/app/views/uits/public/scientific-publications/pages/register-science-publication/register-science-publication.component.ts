import { Component, inject } from '@angular/core';
import { FormsModule, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterScienceService } from '../../service/register-science-service.service';
import {RouterLink} from '@angular/router';
import {ScienceRawPublication} from '../../interface/science-publications-from-scholar.interface';
import {
  EditablePublicationCardComponent
} from '../../common-ui/editable-publication-card/editable-publication-card.component';
import {ScienceReadyPublication} from '../../interface/profile.interface';
import {AppSettings} from '../../utils/settings';
import {NgClass, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-register-science-publication',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, EditablePublicationCardComponent, NgClass, NgIf, NgForOf],
  templateUrl: './register-science-publication.component.html',
  styleUrls: ['./register-science-publication.component.css']
})
export class RegisterSciencePublicationComponent {
  scienceService = inject(RegisterScienceService);
  data_from_scholar: ScienceRawPublication[] | null = null;
  isSearch: boolean = false;
  isAlarmTextShowOnEmptySearchString: boolean = false;
  isOverRequested: boolean = false;
  tagsWithStylesMap: Map<string, string> = new Map();
  isHiddenScientistPage: boolean = false;
  authors: Map<string, string> = new Map();
  profileCardsForEditing: ScienceReadyPublication[] = [];
  profileCardsReady: ScienceReadyPublication[] = [];
  profileCardsForEditingMap: Map<ScienceReadyPublication, Map<string, string>> = new Map();
  profileCardsForEmptyMap: Map<ScienceReadyPublication, Map<string, string>> = new Map();
  profileCardsReadyMap: Map<ScienceReadyPublication, Map<string, string>> = new Map();

  constructor() {
    this.scienceService.getAllAuthorsByRest().subscribe(value => {
      value.forEach(val => this.authors.set(val.name, AppSettings.DEFAULT_TAG_STYLE));
    });
  }

  form = new FormGroup({
    search_string: new FormControl('', Validators.required)
  });

  onSubmit() {
    if (!this.form.value.search_string) {
      this.isAlarmTextShowOnEmptySearchString = true;
    }
    if (this.form.value.search_string) {
      this.isSearch = true;
      this.isAlarmTextShowOnEmptySearchString = false;

      this.scienceService.getInfoFromGoogleScholar(this.form.value.search_string).subscribe(value => {
        this.data_from_scholar = value.sciencePublicationCards;
        this.isOverRequested = value.isOverRequested;
        this.isSearch = false;
      });

      this.data_from_scholar?.forEach(v => {
        this.profileCardsForEditing.push({
          name: v.title,
          url: v.link,
          author: [this.form.value.search_string!],
          source: v.source
        });
      });

      this.scienceService.getAllCardsByAuthorName(this.form.value.search_string!.toLowerCase()).subscribe(v => this.profileCardsReady = v);

      this.scienceService.getALLTagsRest().subscribe(v => v.forEach(val => this.tagsWithStylesMap.set(val, AppSettings.DEFAULT_TAG_STYLE)));
      this.tagsWithStylesMap.set(AppSettings.EMPTY_TAG_SEARCH_TEXT, AppSettings.DEFAULT_TAG_STYLE);

      this.profileCardsForEditing.forEach(v => {
        v.id_for_unique_identify_component = AppSettings.generateRandomString(30);
        this.profileCardsForEditingMap.set(v, new Map(this.tagsWithStylesMap));
      });

      this.profileCardsReady.forEach(v => {
        v.id_for_unique_identify_component = AppSettings.generateRandomString(30);
        this.profileCardsReadyMap.set(v, new Map(this.tagsWithStylesMap));
      });
    }
  }

  onAuthorClick(name: string) {
    const inputElement = document.getElementById('search-author_input') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = name;
      this.form.value.search_string = name;
      Array.from(this.authors.keys()).forEach(key => this.authors.set(key, AppSettings.DEFAULT_TAG_STYLE))
      this.authors.set(name, AppSettings.ONCLICK_TAG_STYLE);
    }
  }

  onChooseForScientistsClick() {
    this.isHiddenScientistPage = !this.isHiddenScientistPage;
  }

  deleteCard(id: string) {
    console.log(id);
    let key = Array.from(this.profileCardsReadyMap.keys()).find(k => k.id_for_unique_identify_component === id);

    if (!key) {
      key = Array.from(this.profileCardsForEditingMap.keys()).find(k => k.id_for_unique_identify_component === id);

      if (!key) {
        Array.from(this.profileCardsForEmptyMap.keys()).find(k => k.id_for_unique_identify_component === id);
        this.profileCardsForEmptyMap.delete(key!);
      }

      if (key) {
        this.profileCardsForEditingMap.delete(key);
      }
    } else {
      this.profileCardsReadyMap.delete(key);
    }
  }

  updateField() {
    const inputElement = document.getElementById('search-author_input') as HTMLInputElement;
    if (inputElement) {
      this.authors.forEach((v, k) => {
        if (k === inputElement.value) {
          this.authors.set(k, AppSettings.ONCLICK_TAG_STYLE);
        } else {
          this.authors.set(k, AppSettings.DEFAULT_TAG_STYLE);
        }
      });
    }
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
    this.profileCardsForEmptyMap.forEach((v, k) => copyMap.set(k, v));
    this.profileCardsForEmptyMap = copyMap;
  }
}
