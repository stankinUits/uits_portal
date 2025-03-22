import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {RegisterScienceService} from "@app/views/uits/public/scientific-publications/service/register-science-service.service";
import {ITag} from "@app/views/uits/public/scientific-publications/interface/profile.interface";
import {AuthService} from "@app/shared/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-manage-tags-page',
  templateUrl: './manage-tags-page.component.html',
  styleUrls: ['./manage-tags-page.component.css']
})
export class ManageTagsPageComponent implements OnInit {
  scienceService: RegisterScienceService = inject(RegisterScienceService);
  authService: AuthService = inject(AuthService);
  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  router: Router = inject(Router);

  searchTerm: string = '';
  tagStringToSave: string = '';

  tags: ITag[] = [];
  filteredTags: ITag[] = [];

  constructor() {
  }

  ngOnInit() {
    this.authService.canEdit().subscribe(isAdmin => {
      if (!isAdmin) {
        this.router.navigate(['/scientific-activities/publications/main-science-page']);
      }
    })
    this.getAllTags();
  }

  getAllTags() {
    this.scienceService.getALLTags().subscribe(tags =>{
      this.tags = tags;
      this.filteredTags = tags;
      this.cdr.detectChanges();
    });
  }

  searchTags(): void {
    if (this.searchTerm.trim() !== '') {
      this.filteredTags = this.tags.filter(tag =>
        tag.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredTags = this.tags;
    }
  }

  addTag(): void {
    this.scienceService.saveNewTags([this.tagStringToSave]).subscribe({
      next: () => {
        this.tagStringToSave = '';
        this.getAllTags();
      }
    });
  }

  deleteTag(tagName: string): void {
    this.scienceService.deleteTag(tagName).subscribe({
      next: () => {
        this.getAllTags();
      }
    });
  }
}
