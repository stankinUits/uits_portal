import {Component, inject, Input} from '@angular/core';
import { ScienceReadyPublication } from '../../interface/profile.interface';
import { AppSettings } from '../../utils/settings';
import {EditablePublicationCardComponent} from '../editable-publication-card/editable-publication-card.component';
import {RegisterScienceService} from '../../service/register-science-service.service';
import {NgForOf, NgIf} from '@angular/common';

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

  constructor() {
    if (this.profile) {
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

  downloadFile(file: File) {
    if (file) {
      const url = window.URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  protected readonly AppSettings = AppSettings;
}
