import {Component, inject, Input} from '@angular/core';
import { ScienceReadyPublication } from '../../interface/profile.interface';
import { AppSettings } from '../../utils/settings';
import {EditablePublicationCardComponent} from '../editable-publication-card/editable-publication-card.component';
import {RegisterScienceService} from '../../service/register-science-service.service';
import {NgForOf, NgIf} from '@angular/common';
import {AuthService} from "@app/shared/services/auth.service";

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [
    EditablePublicationCardComponent,
    NgIf,
    NgForOf
  ],
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent {
  scienceService: RegisterScienceService = inject(RegisterScienceService);
  @Input() profile!: ScienceReadyPublication;
  @Input() tagsMap!: Map<string, string>;
  isEditing = false;
  authService: AuthService = inject(AuthService);
  isAdmin = false;

  constructor() {
    if (this.profile) {
      this.authService.canEdit().subscribe(v => this.isAdmin = v);
      if (!this.profile.id_for_unique_identify_component) {
        this.profile.id_for_unique_identify_component = '';
        this.profile.id_for_unique_identify_component = AppSettings.generateRandomString(30);
      } else {
        this.profile.id_for_unique_identify_component = AppSettings.generateRandomString(30);
      }
    }
  }

  onEditCard() {
    this.isEditing = true;
  }

  deleteCard() {
    this.scienceService.deleteCard(this.profile!);
  }

  downloadFile(file: string) {
    if (file) {
      const base64WithoutPrefix = file.split(',')[1];

      const binaryString = atob(base64WithoutPrefix);

      const uint8Array = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([uint8Array], { type: AppSettings.PDF_MIME_TYPE });

      const file_O = new File([blob], AppSettings.generateRandomString(30), { type: AppSettings.PDF_MIME_TYPE });

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
