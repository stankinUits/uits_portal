import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {ITag, ScienceReadyPublication} from '../../interface/profile.interface';
import {RegisterScienceService} from '../../service/register-science-service.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {AppSettings} from '../../utils/settings';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {tr} from "date-fns/locale";
import {BsModalRef} from "ngx-bootstrap/modal";
import {NgSelectModule} from "@ng-select/ng-select";

@Component({
  selector: 'app-editable-publication-card',
  standalone: true,
  imports: [
    NgClass,
    FormsModule,
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    NgSelectModule
  ],
  templateUrl: './editable-publication-card.component.html',
  styleUrls: ['./editable-publication-card.component.css']
})
export class EditablePublicationCardComponent implements OnInit {
  scienceService: RegisterScienceService = inject(RegisterScienceService);

  @Input() publication!: ScienceReadyPublication;
  @Input() tagsWithStylesMap!: Map<string, string>;
  @Output() delete = new EventEmitter<any>();

  form: FormGroup;
  selectedTags: ITag[] = [];
  allTags: ITag[] = [];

  alertMessage: string | undefined = undefined;

  constructor(public bsModalRef: BsModalRef, private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      "name": [this.publication.name, Validators.required],
      "year": [this.publication.year, Validators.required],
      "tags": [this.selectedTags],
      "author": [this.publication.author.join(';'), Validators.required],
      "description": [this.publication.description],
      "pages": [this.publication.pages],
      "vol_n": [this.publication.vol_n],
      "isbn": [this.publication.isbn],
      "source": [this.publication.source],
      "url": [this.publication.url],
      "file": [null]
    })

    if (this.publication.tags) {
      this.publication.tags.forEach(tag => {
        this.selectedTags.push(tag);
      });
    }

    this.scienceService.getALLTagsRest1().subscribe(res => {
      this.allTags = res;
    })

    console.log(this.form.value);
  }

  onTagsChange(selectedTags: ITag[]) {
    this.selectedTags = selectedTags;
    this.form.get('tags')?.setValue(selectedTags);
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = (target.files as FileList)[0];

    if (file && file.type === AppSettings.PDF_MIME_TYPE) {

      this.encodeFileToBase64(file).then((base64String) => {

        this.publication.file = base64String;
        this.form.get('file')?.setValue(base64String);
        this.alertMessage = undefined;
        console.log('File encoded to Base64:', base64String);
      }).catch((error) => {
        this.alertMessage = 'Ошибка при кодировании файла в Base64';
        console.error('Error encoding file to Base64:', error);
      });
    } else {
      this.alertMessage = 'Можно прикрепить только файл формата pdf';
    }
  }


  encodeFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }


  clickOnSave() {
    console.log('done', this.form.value);
    if (this.form.valid) {
      this.scienceService.saveCard(this.form.value).subscribe((data: HttpResponse<any>) => {
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
  }

  clickOnDelete() {
    this.delete.emit();
    this.scienceService.deleteCard(this.publication);
  }

  alertCall(message: string) {
    alert(message);
  }
}
