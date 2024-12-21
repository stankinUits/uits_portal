import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {ScienceReadyPublication} from '../../interface/profile.interface';
import {RegisterScienceService} from '../../service/register-science-service.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {AppSettings} from '../../utils/settings';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-editable-publication-card',
  standalone: true,
  imports: [
    NgClass,
    FormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './editable-publication-card.component.html',
  styleUrls: ['./editable-publication-card.component.css']
})
export class EditablePublicationCardComponent {
  @Input() publication!: ScienceReadyPublication;
  @Input() tagsWithStylesMap!: Map<string, string>;
  scienceService: RegisterScienceService = inject(RegisterScienceService);
  @Output() delete = new EventEmitter<any>();

  isTagsOpen = false;
  alertMessage: string | undefined = undefined;
  newTags: string[] = [];
  DEFAULT_URL = "Введите ссылку на публикацию, если она есть"
  DEFAULT_DESCRIPTION = "Введите описание статьи"
  DEFAULT_SOURCE = "Веедите название источника"
  DEFAULT_YEAR = "Введите год публикации статьи"
  DEFAULT_NAME = "Введите название публикации"
  DEFAULT_AUTHOR = "Введите авторов публикации"
  id_name_card: string | null = null;
  id_author_name: string | null = null;
  id_description: string | null = null;
  id_url: string | null = null;
  id_source: string | null = null;
  id_year: string | null = null;
  id_pages: string | null = null;
  id_isbn: string | null = null;
  id_vol_n: string | null = null;

  constructor() {
    this.id_name_card = this.generateRandomString(25);
    this.id_author_name = this.generateRandomString(25);
    this.id_description = this.generateRandomString(25);
    this.id_url = this.generateRandomString(25);
    this.id_year = this.generateRandomString(25);
    this.id_source = this.generateRandomString(25);
    this.id_pages = this.generateRandomString(25);
    this.id_isbn = this.generateRandomString(25);
    this.id_vol_n = this.generateRandomString(25);
  }

  private generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }


  onNewTag() {
    const input = document.getElementById(this.publication.name!) as HTMLInputElement;
    if (input) {
      const inputValue = input.value;
      if (inputValue.length > 0) {
        this.newTags.push(inputValue);

        this.tagsWithStylesMap.delete(AppSettings.EMPTY_TAG_SEARCH_TEXT);
        this.tagsWithStylesMap.set(inputValue, AppSettings.ONCLICK_TAG_STYLE);
        this.tagsWithStylesMap.set(AppSettings.EMPTY_TAG_SEARCH_TEXT, AppSettings.DEFAULT_TAG_STYLE);
      }
    }
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = (target.files as FileList)[0];

    if (file && file.type === AppSettings.PDF_MIME_TYPE) {
      this.publication.file = file;
      this.alertMessage = undefined;
    } else {
      this.alertMessage = 'Можно прикрепить только файл формата pdf';
    }
  }

  onTagClick(tag: string) {
    if (AppSettings.EMPTY_TAG_SEARCH_TEXT === tag) {
      this.tagsWithStylesMap.forEach((v, k) => this.tagsWithStylesMap.set(k, AppSettings.DEFAULT_TAG_STYLE));
    } else if (this.tagsWithStylesMap.get(tag) === AppSettings.DEFAULT_TAG_STYLE) {
      this.tagsWithStylesMap.set(tag, AppSettings.ONCLICK_TAG_STYLE);
      if (!this.publication.tags) {
        this.publication.tags = [];
      }
      this.publication.tags?.push(tag);
    } else {
      this.tagsWithStylesMap.set(tag, AppSettings.DEFAULT_TAG_STYLE);
      this.publication.tags = this.publication.tags?.filter(t => t !== tag);
    }
  }

  onChooseTag() {
    this.publication.tags?.forEach((tag) => {
      if (this.tagsWithStylesMap.has(tag)) {
        this.tagsWithStylesMap.set(tag, AppSettings.ONCLICK_TAG_STYLE);
      }
    });

    if (this.tagsWithStylesMap.size === 0) {
      this.scienceService.getALLTagsRest().subscribe(v => v.forEach(val => this.tagsWithStylesMap.set(val, AppSettings.DEFAULT_TAG_STYLE)));
    }

    this.isTagsOpen = !this.isTagsOpen;
  }

  clickOnSave() {
    const url = document.getElementById(this.id_url!) as HTMLInputElement;
    if (url && url.value !== this.DEFAULT_URL) {
      this.publication.url = url.value;
    }

    const name_card = document.getElementById(this.id_name_card!) as HTMLInputElement;
    if (name_card) {
      this.publication.name = name_card.value;
    }

    const author_name = document.getElementById(this.id_author_name!) as HTMLInputElement;
    if (author_name) {
      this.publication.author = author_name.value.split(';');
    }

    const description = document.getElementById(this.id_description!) as HTMLInputElement;
    if (description && description.value !== this.DEFAULT_DESCRIPTION) {
      this.publication.description = description.value;
    }

    const source = document.getElementById(this.id_source!) as HTMLInputElement;
    if (source && source.value !== this.DEFAULT_SOURCE) {
      this.publication.source = source.value;
    }


    const year = document.getElementById(this.id_year!) as HTMLInputElement;
    console.log(year.value)
    if (year && year.value !== this.DEFAULT_YEAR) {
      this.publication.year = Number(year.value);
    }

    const pages = document.getElementById(this.id_pages!) as HTMLInputElement;
    if (pages && pages.value !== '') {
      this.publication.pages = pages.value;
    }

    const vol_n = document.getElementById(this.id_vol_n!) as HTMLInputElement;
    if (vol_n && vol_n.value !== '') {
      this.publication.vol_n = vol_n.value;
    }

    const isbn = document.getElementById(this.id_isbn!) as HTMLInputElement;
    if (isbn && isbn.value !== '') {
      this.publication.isbn = isbn.value;
    }

    this.publication.tags = Array.from(
      [...this.tagsWithStylesMap.entries()].filter(([_, value]) => value === AppSettings.ONCLICK_TAG_STYLE),
      ([key, _]) => key
    );

    let isValid = false;
    //проверки перед сохранением
    if (this.publication.author.length < 1) {
      this.alertCall('Требуется добавить автора публикации');
      if (this.publication.name === '' || this.publication.name === undefined) {
        this.alertCall('Требуется добавить название публикации');
        if ((this.publication.url  === '' || this.publication.url === undefined) && (this.publication.file === undefined)) {
          this.alertCall('Требуется добавить файл публикации, или ссылку на нее');
        } else {
          isValid = true;
        }
      }
    }

    console.log(this.publication);

    if (isValid) {
      this.scienceService.saveCard(this.publication).subscribe((data: HttpResponse<any>) => {
          if (data.status === 200 || data.status === 202) {
            this.alertCall(`Успешно сохранено`);
          }
        },
        (err: HttpErrorResponse) => {
          if (err.status === 403) {
            this.alertCall('Ошибка при сохранении');
          }
        });
    }

    this.scienceService.saveNewTags(this.newTags).subscribe((data: HttpResponse<any>) => {
        if (data.status === 200 || data.status === 202) {
          this.alertCall(`Успешно сохранено`);
        }
      },
      (err: HttpErrorResponse) => {
        if (err.status === 403) {
          this.alertCall('Ошибка при сохранении');
        }
      });;
  }

  clickOnDelete() {
    this.delete.emit();
    this.scienceService.deleteCard(this.publication);
  }

  alertCall(message: string) {
    alert(message);
  }
}
