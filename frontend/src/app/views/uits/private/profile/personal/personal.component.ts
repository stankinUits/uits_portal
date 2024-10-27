import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Clipboard } from '@angular/cdk/clipboard';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ApiConfig } from '@app/configs/api.config';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@app/shared/services/auth.service';
import { Profile } from '@app/shared/types/models/auth';
import { AVATAR_DEFAULT_URL } from '@app/configs/app.config';

interface PersonalInfo {
  username: string;
  email: string;
}

@Component({
  selector: 'profile-personal',
  templateUrl: './personal.component.html',
  styles: [`
    ::ng-deep .upload {
      width: 100%;
    }
  `]
})
export class PersonalComponent implements OnInit {
  hideIntegrationCode = true;
  defaultAvatar: SafeUrl = AVATAR_DEFAULT_URL;
  @Output() openMobilePanel = new EventEmitter();
  @ViewChild('deleteIntegrationConfirmModal') deleteIntegrationConfirmModal: TemplateRef<any>;
  @ViewChild('editProfileModal') editProfileModal: TemplateRef<any>;
  modalRef: BsModalRef;
  
  userProfile: PersonalInfo = { username: '', email: '' };

  constructor(
    public authService: AuthService,
    private clipboard: Clipboard,
    private modalService: BsModalService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.authService.profile$.subscribe(profile => {
      if (profile) {
        this.userProfile.username = profile.username;
        this.userProfile.email = profile.email;
      }
    });
  }

  toggleViewIntegrationCode() {
    this.hideIntegrationCode = !this.hideIntegrationCode;
  }

  copyCode(telegramCode: string) {
    this.clipboard.copy(telegramCode);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-dialog-centered' });
  }

  closeModal() {
    this.modalRef.hide();
  }

  deleteIntegration() {
    this.http.delete(`${ApiConfig.telegram.user}/${this.authService.profile$.getValue().telegramUser.id}`).subscribe({
      next: () => {
        this.authService.retrieveProfile().subscribe(() => {
          this.closeModal();
        });
      }
    });
  }

  openEditProfileModal() {
    this.modalRef = this.modalService.show(this.editProfileModal, { class: 'modal-dialog-centered' });
  }

  saveProfile() {
    // Логика для сохранения профиля
    const profileUpdate = {
      username: this.userProfile.username,
      email: this.userProfile.email
    };

    this.authService.updateProfile(profileUpdate).subscribe({
      next: () => {
        console.log('Профиль успешно обновлен');
        this.closeModal();
        this.loadUserProfile(); // Обновляем данные профиля
      },
      error: (err) => {
        console.error('Ошибка при обновлении профиля:', err);
      }
    });
  }
}
