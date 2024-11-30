import {Component, inject} from '@angular/core';
import {
  RegisterScienceService
} from "@app/views/uits/public/scientific-publications/service/register-science-service.service";
import {ScienceReadyPublication} from "@app/views/uits/public/scientific-publications/interface/profile.interface";
import {AppSettings} from "@app/views/uits/public/scientific-publications/utils/settings";

@Component({
  selector: 'app-manage-tags-page',
  templateUrl: './manage-tags-page.component.html',
  styleUrls: ['./manage-tags-page.component.css']
})
export class ManageTagsPageComponent {
  scienceService: RegisterScienceService = inject(RegisterScienceService);
  searchTerm: string = '';
  tagStringToSave: string = '';
  enableButton : boolean = false;

  tags: string[] = [];
  filteredTags: string[];
  authors: Map<string, string> = new Map();

  constructor() {
    this.scienceService.getALLTagsRest().subscribe(v =>{
      this.tags = v
      this.filteredTags = v
    });
  }

  searchTags(): void {
    if (this.searchTerm.trim() !== '') {
      this.filteredTags = this.tags.filter(tag =>
        tag.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredTags = this.tags;
    }
  }

  enableSaveButton() {
    if (this.tagStringToSave.length > 0) {
      this.enableButton = true
    } else {
      this.enableButton = false
    }
  }

  addTag(): void {
    console.log(this.tagStringToSave);
    this.scienceService.saveNewTags([this.tagStringToSave])
    this.tags.push(this.tagStringToSave)
    this.tagStringToSave = ''
    this.searchTags();
  }

  deleteTag(index: number): void {
    console.log(this.tags.splice(index, 1))
    this.scienceService.deleteTag(this.tags.splice(index, 1).join(''))
    this.searchTags();
  }
}
