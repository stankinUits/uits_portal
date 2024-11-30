import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Clipboard } from '@angular/cdk/clipboard';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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
    private modalService: BsModalService
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

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-dialog-centered' });
  }

  closeModal() {
    this.modalRef?.hide();
  }

  openEditProfileModal() {
    this.modalRef = this.modalService.show(this.editProfileModal, { class: 'modal-dialog-centered' });
  }
  saveProfile() {
    const profileUpdate = {
      username: this.userProfile.username,
      email: this.userProfile.email
    };


    setTimeout(() => {
      console.log('Мок: профиль успешно обновлен:', profileUpdate);

      const updatedProfile: Profile = {
        ...this.authService.profile$.getValue(),
        ...profileUpdate 
      };

      this.authService.profile$.next(updatedProfile);


      this.closeModal();
    }, 500);

    // Реальный вызов будет выглядеть так:
    // this.authService.updateProfile(profileUpdate).subscribe({
    //   next: (updatedProfile) => {
    //     console.log('Профиль успешно обновлен:', updatedProfile);
    //     this.closeModal();
    //     this.loadUserProfile(); // Загружаем обновлённый профиль
    //   },
    //   error: (err) => {
    //     console.error('Ошибка при обновлении профиля:', err);
    //   }
    // });
  }

  toggleViewIntegrationCode() {
    this.hideIntegrationCode = !this.hideIntegrationCode;
  }

  copyCode(telegramCode: string) {
    this.clipboard.copy(telegramCode);
  
  }
}
