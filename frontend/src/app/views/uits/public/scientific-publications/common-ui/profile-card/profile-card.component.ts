import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {ScienceReadyPublication} from '../../interface/profile.interface';
import {AppSettings} from '../../utils/settings';
import {EditablePublicationCardComponent} from '../editable-publication-card/editable-publication-card.component';
import {RegisterScienceService} from '../../service/register-science-service.service';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {AuthService} from "@app/shared/services/auth.service";
import {EditButtonComponent} from "@app/shared/components/edit-button/edit-button.component";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {AlertService} from "@app/shared/services/alert.service";
import {
  PublicationResponse
} from "@app/views/uits/public/scientific-publications/interface/publication-response.interface";
import {SharedModule} from "@app/shared/shared.module";
import {DeleteButtonComponent} from "@app/shared/components/delete-button/delete-button.component";

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [
    EditablePublicationCardComponent,
    NgIf,
    NgForOf,
    AsyncPipe,
    EditButtonComponent,
    TooltipModule,
    SharedModule,
    DeleteButtonComponent
  ],
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent implements OnInit {
  scienceService: RegisterScienceService = inject(RegisterScienceService);
  @Input() publication!: ScienceReadyPublication;
  @Input() tagsMap!: Map<string, string>;
  @Output() delete: EventEmitter<number> = new EventEmitter<number>();

  isEditing = false;
  authService: AuthService = inject(AuthService);

  shortAuthorsView:string[] = [];

  bsModalRef: BsModalRef;
  @ViewChild('deleteModal') deleteModal: TemplateRef<any>;

  constructor(private modalService: BsModalService,
              private alertService: AlertService,
              private cdr: ChangeDetectorRef,
              ) {}

  ngOnInit() {
    if (this.publication) {
      this.makeShortName();
      if (!this.publication.id_for_unique_identify_component) {
        this.publication.id_for_unique_identify_component = '';
        this.publication.id_for_unique_identify_component = AppSettings.generateRandomString(30);
      } else {
        this.publication.id_for_unique_identify_component = AppSettings.generateRandomString(30);
      }
    }
  }

  openEditModal() {
    const initialState = {
      publication: this.publication,
      tagsWithStylesMap: this.tagsMap,
    };
    this.bsModalRef = this.modalService.show(EditablePublicationCardComponent, {
      initialState
    });
    this.bsModalRef.content.edit.subscribe((formData: PublicationResponse) => {
      this.editCard(formData);
    });
  }

  deleteCard() {
    this.delete.emit(this.publication.id);
  }

  editCard(formData: PublicationResponse) {
    this.scienceService.editCard(formData).subscribe(
      (res: { status: string, publication: ScienceReadyPublication }) => {
        this.bsModalRef.hide();
        this.alertService.add('Успешно отредактировано', 'success');
        this.publication = res.publication;
        this.cdr.detectChanges();
      },
      (err: HttpErrorResponse) => {
        this.alertService.add('Произошла ошибка', 'danger');
        console.error(err);
      }
    );
  }

  makeShortName() {
    this.publication.author.forEach((author) => {
      const parts = author.split(' ');
      const lastName = parts[0];
      const firstName = parts[1].charAt(0) + '.';
      let name = ''

      if (parts.length === 3) {
        const surname = parts[2].charAt(0) + '.';
        name = `${lastName} ${firstName}${surname}`;
      } else {
        name = `${lastName} ${firstName}`;
      }

      this.shortAuthorsView.push(name);
    })
  }

  downloadFile(file: string) {
    if (file) {
      const base64WithoutPrefix = file.split(',')[1];

      const binaryString = atob(base64WithoutPrefix);

      const uint8Array = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([uint8Array], {type: AppSettings.PDF_MIME_TYPE});

      const file_O = new File([blob], AppSettings.generateRandomString(30), {type: AppSettings.PDF_MIME_TYPE});

      if (file_O) {
        const url = window.URL.createObjectURL(file_O);
        const link = document.createElement('a');
        link.href = url;
        link.download = file_O.name;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  openDeleteModal() {
    this.bsModalRef = this.modalService.show(this.deleteModal, {
      class: 'modal-dialog-centered'
    });
  }

  hideDeleteModal() {
    this.bsModalRef?.hide();
  }

  confirmDelete() {
    this.deleteCard();
    this.hideDeleteModal();
  }

  protected readonly AppSettings = AppSettings;
}
