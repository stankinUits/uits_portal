import {ChangeDetectorRef, Component, inject, Input} from '@angular/core';
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

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [
    EditablePublicationCardComponent,
    NgIf,
    NgForOf,
    AsyncPipe,
    EditButtonComponent,
    TooltipModule
  ],
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent {
  scienceService: RegisterScienceService = inject(RegisterScienceService);
  @Input() publication!: ScienceReadyPublication;
  @Input() tagsMap!: Map<string, string>;
  isEditing = false;
  authService: AuthService = inject(AuthService);

  bsModalRef: BsModalRef;

  constructor(private modalService: BsModalService,
              private alertService: AlertService,
              private cdr: ChangeDetectorRef,
              ) {
    if (this.publication) {
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

  onEditCard() {
    this.isEditing = true;
  }

  deleteCard() {
    this.scienceService.deleteCard(this.publication!);
  }

  editCard(formData: PublicationResponse) {
    this.scienceService.editCard(formData).subscribe(
      (res: { status: string, publication: ScienceReadyPublication }) => {
        this.bsModalRef.hide();
        this.alertService.add('Успешно отредактировано', 'success');
        console.log('do', this.publication);
        this.publication = res.publication;
        console.log('posle', this.publication);
        this.cdr.detectChanges();
      },
      (err: HttpErrorResponse) => {
        this.alertService.add('danger', 'Что-то пошло не так')
        console.error(err);
      }
    );
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

  protected readonly AppSettings = AppSettings;
}
