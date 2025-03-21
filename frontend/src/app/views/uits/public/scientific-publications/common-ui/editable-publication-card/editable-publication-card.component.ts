import {ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {ITag, ScienceReadyPublication} from '../../interface/profile.interface';
import {RegisterScienceService} from '../../service/register-science-service.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {AppSettings} from '../../utils/settings';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {tr} from "date-fns/locale";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {NgSelectModule} from "@ng-select/ng-select";
import {AlertService} from "@app/shared/services/alert.service";
import {modeType} from "@app/views/uits/public/scientific-publications/interface/mode.type";

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
  @Input() mode: modeType = 'edit';

  @Output() delete = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();

  form: FormGroup;
  selectedTags: ITag[] = [];
  allTags: ITag[] = [];
  compareTags = (t1: ITag, t2: ITag) => t1?.id === t2?.id;

  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.initForm();
    this.initTags();
    this.initAuthors();
  }

  initForm() {
    this.form = this.formBuilder.group({
      "name": [this.publication.name, Validators.required],
      "year": [this.publication.year, Validators.required],
      "tags": [this.selectedTags, Validators.required],
      "author": this.formBuilder.array([]),
      "description": [this.publication.description],
      "pages": [this.publication.pages, Validators.required],
      "vol_n": [this.publication.vol_n],
      "isbn": [this.publication.isbn],
      "source": [this.publication.source, Validators.required],
      "url": [this.publication.url],
      "file": [null]
    })
  }

  initTags() {
    if (this.publication.tags) {
      this.publication.tags.forEach(tag => {
        this.selectedTags.push(tag);
      });
    }

    this.scienceService.getALLTags().subscribe(res => {
      this.allTags = res;
    })
  }

  initAuthors() {
    if (this.mode === 'edit') {
      if (this.publication.author.length) {
        const authorsArray = this.form.get('author') as FormArray;
        this.publication.author.forEach(author => {
          authorsArray.push(this.formBuilder.control(author, Validators.required));
        })
      }
    } else {
      const authorsArray = this.form.get('author') as FormArray;
      authorsArray.push(this.formBuilder.control('', Validators.required));
    }
  }

  get authors(): FormArray {
    return this.form.get('author') as FormArray;
  }

  addAuthor(): void {
    this.authors.push(this.formBuilder.control('', Validators.required));
  }

  removeAuthor(index: number): void {
    this.authors.removeAt(index);
  }

  onTagsChange(selectedTags: ITag[]) {
    console.log(selectedTags);
    this.selectedTags = selectedTags;
    this.form.get('tags').setValue(selectedTags);
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = (target.files as FileList)[0];

    if (file && file.type === AppSettings.PDF_MIME_TYPE) {
      this.encodeFileToBase64(file).then((base64String) => {
        this.publication.file = base64String;
        this.form.get('file')?.setValue(base64String);
      }).catch((error) => {
        this.alertService.add('danger', 'Ошибка при кодировании файла в Base64')
      });
    } else {
      this.alertService.add('danger', 'Можно прикрепить только файл формата pdf')
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
    if (this.form.valid) {
      const formData = {
        id: this.publication.id,
        name: this.form.get('name')?.value,
        year: this.form.get('year')?.value,
        author: this.form.get('author')?.value,
        description: this.form.get('description')?.value,
        tags: this.selectedTags.map(tag => tag.name),
        pages: this.form.get('pages')?.value,
        vol_n: this.form.get('vol_n')?.value,
        isbn: this.form.get('isbn')?.value,
        source: this.form.get('source')?.value,
        url: this.form.get('url')?.value,
        file: this.form.get('file')?.value,
      };

      this.edit.emit(formData);
    }
  }
}
