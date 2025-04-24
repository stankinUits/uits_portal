import {Clipboard} from '@angular/cdk/clipboard';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {SafeUrl} from '@angular/platform-browser';
import {AVATAR_DEFAULT_URL} from '@app/configs/app.config';
import {AuthService} from '@app/shared/services/auth.service';
import {Profile} from '@app/shared/types/models/auth';
import {PrivateServiceService} from '@app/views/uits/private/private-service.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {TeacherDegree, TeacherRank} from "@app/views/uits/public/about/employee/teachers/teachers.models";

interface PersonalInfo {
  username: string;
  email: string;
}

interface TeacherInfo {
  id: number;
  last_name: string;
  first_name: string;
  patronymic: string;
  position: string;
  degree: string;
  rank: string;
  experience: number;
  professional_experience: number;
  education: string;
  qualification: string;
  bio: string;
  phone_number: string;
  email: string;
  messenger: string;
  avatar: string;
}

@Component({
  selector: 'profile-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss'],
})
export class PersonalComponent implements OnInit {
  hideIntegrationCode = true;
  defaultAvatar: SafeUrl = AVATAR_DEFAULT_URL;
  @Output() openMobilePanel = new EventEmitter();
  @ViewChild('deleteIntegrationConfirmModal')
  deleteIntegrationConfirmModal: TemplateRef<any>;
  @ViewChild('editProfileModal') editProfileModal: TemplateRef<any>;
  modalRef: BsModalRef;

  @ViewChild('editTeacherModal') editTeacherModal: TemplateRef<any>;

  userProfile: PersonalInfo = {username: '', email: ''};
  teacherInfo: TeacherInfo | null = null;
  isLoadingTeacherInfo = false;
  teacherError: string | null = null;

  // Добавим свойства для селектов
  teacherDegrees = Object.entries(TeacherDegree).map(([key, value]) => ({key, value}));
  teacherRanks = Object.entries(TeacherRank).map(([key, value]) => ({key, value}));

  constructor(
    public authService: AuthService,
    private privateService: PrivateServiceService,
    private clipboard: Clipboard,
    private modalService: BsModalService,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.loadUserProfile();
    this.getTeacherInfo();
  }

  loadUserProfile() {
    this.authService.profile$.subscribe((profile) => {
      if (profile) {
        this.userProfile.username = profile.username;
        this.userProfile.email = profile.email;
      }
    });
  }

  getTeacherInfo() {
    this.isLoadingTeacherInfo = true;
    this.teacherError = null;

    this.privateService.getTeacherInfo().subscribe({
      next: (response: TeacherInfo) => {
        this.teacherInfo = response;
        this.isLoadingTeacherInfo = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.teacherError = 'Не удалось загрузить информацию о преподавателе';
        this.isLoadingTeacherInfo = false;
        console.error('Ошибка при загрузке информации о преподавателе:', error);
        this.cdr.detectChanges();
      },
    });
  }

  openEditTeacherModal() {
    this.modalRef = this.modalService.show(this.editTeacherModal, {
      class: 'modal-dialog-centered modal-lg'
    });
  }

  saveTeacherProfile() {
    if (!this.teacherInfo) return;

    // Создаем FormData для отправки файлов
    const formData = new FormData();

    // Добавляем все текстовые данные
    Object.keys(this.teacherInfo).forEach(key => {
      if (key !== 'avatar' && this.teacherInfo[key] !== null) {
        formData.append(key, this.teacherInfo[key]);
      }
    });

    // Если avatar - это строка (уже существующий путь), не добавляем его
    // Если это File - добавляем
    // @ts-ignore
    if (this.teacherInfo.avatar instanceof File) {
      formData.append('avatar', this.teacherInfo.avatar);
    }

    this.privateService.updateTeacherInfo(formData).subscribe({
      next: (updatedTeacher) => {
        this.teacherInfo = updatedTeacher;
        this.closeModal();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Ошибка при обновлении данных преподавателя:', err);
      }
    });
  }

  getFullName(): string {
    if (!this.teacherInfo) return '';
    return `${this.teacherInfo.last_name} ${this.teacherInfo.first_name} ${
      this.teacherInfo.patronymic || ''
    }`.trim();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog-centered',
    });
  }

  closeModal() {
    this.modalRef?.hide();
  }

  openEditProfileModal() {
    this.modalRef = this.modalService.show(this.editProfileModal, {
      class: 'modal-dialog-centered',
    });
  }

  saveProfile() {
    const profileUpdate = {
      username: this.userProfile.username,
      email: this.userProfile.email,
    }

    this.authService.updateProfile(profileUpdate).subscribe({
      next: (updatedProfile) => {
        console.log('Профиль успешно обновлен:', updatedProfile);
        this.closeModal();
        // this.loadUserProfile();
      },
      error: (err) => {
        console.error('Ошибка при обновлении профиля:', err);
      }
    });
  }

  toggleViewIntegrationCode() {
    this.hideIntegrationCode = !this.hideIntegrationCode;
  }

  copyCode(telegramCode: string) {
    this.clipboard.copy(telegramCode);
  }

  get rank() {
    return TeacherRank[this.teacherInfo.rank]
  }

  get degree() {
    return TeacherDegree[this.teacherInfo.degree]
  }

  onAvatarSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!this.teacherInfo) {
        this.teacherInfo = {} as TeacherInfo;
      }

      // Проверка типа файла
      if (!file.type.match(/image\/*/)) {
        alert('Пожалуйста, выберите файл изображения');
        return;
      }

      // Проверка размера файла (например, не более 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Размер файла не должен превышать 2MB');
        return;
      }

      // Сохраняем файл для отправки
      this.teacherInfo.avatar = file;

      // Предпросмотр изображения
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Временное отображение выбранного изображения
        this.teacherInfo.avatar = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }
}
