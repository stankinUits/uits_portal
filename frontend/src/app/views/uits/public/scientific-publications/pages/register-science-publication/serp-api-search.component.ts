import {ChangeDetectorRef, Component, inject, OnInit, ViewChild} from '@angular/core';
import {FormsModule, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RegisterScienceService} from '../../service/register-science-service.service';
import {Router, RouterLink} from '@angular/router';
import {ScienceRawPublication} from '../../interface/science-publications-from-scholar.interface';
import {
  EditablePublicationCardComponent
} from '../../common-ui/editable-publication-card/editable-publication-card.component';
import {ScienceReadyPublication} from '../../interface/profile.interface';
import {AppSettings} from '../../utils/settings';
import {AsyncPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {AuthService} from "@app/shared/services/auth.service";
import {BehaviorSubject} from "rxjs";
import {NgSelectComponent, NgSelectModule} from "@ng-select/ng-select";
import {AlertService} from "@app/shared/services/alert.service";
import {
  PublicationResponse
} from "@app/views/uits/public/scientific-publications/interface/publication-response.interface";

@Component({
  selector: 'serp-api-search',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, EditablePublicationCardComponent, NgClass, NgIf, NgForOf, AsyncPipe, NgSelectModule],
  templateUrl: './serp-api-search.component.html',
  styleUrls: ['./serp-api-search.component.css']
})
export class SerpApiSearchComponent implements OnInit {
  scienceService = inject(RegisterScienceService);

  data_from_scholar: ScienceRawPublication[] | null = null;

  isLoading$ = new BehaviorSubject(false);
  authorsName: string[] = [];
  selectedAuthor: string;

  isOverRequested: boolean = false;
  tagsWithStylesMap: Map<string, string> = new Map();

  authors: Map<string, string> = new Map();
  profileCardsForEditing: ScienceReadyPublication[] = [];
  profileCardsForEditingMap: Map<ScienceReadyPublication, Map<string, string>> = new Map();

  form = new FormGroup({
    search_string: new FormControl('', Validators.required)
  });

  constructor(private router: Router,
              private authService: AuthService,
              private cdr: ChangeDetectorRef,
              private alertService: AlertService,
  ) {
  }

  ngOnInit(): void {
    this.authService.canEdit().subscribe(isAdmin => {
      if (!isAdmin) {
        this.router.navigate(['/scientific-activities/publications/main-science-page']);
      }
    })

    this.scienceService.getAllAuthorsByRest().subscribe(value => {
      value.forEach(val => {
        this.authors.set(val, AppSettings.DEFAULT_TAG_STYLE);
        this.authorsName.push(val);
      });
      this.cdr.detectChanges();
    });
  }

  onChange(value: string) {
    this.form.get('search_string').setValue(value);
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading$.next(true);

      this.scienceService.getInfoFromGoogleScholar(this.form.value.search_string).subscribe(res => {
        this.data_from_scholar = res.sciencePublicationCards;
        this.isOverRequested = res.isOverRequested;

        this.data_from_scholar?.forEach(publication => {
          this.profileCardsForEditing.push({
            name: publication.title,
            url: publication.link,
            author: [this.form.value.search_string!],
            description: publication.description
          });
        });

        this.profileCardsForEditing.forEach(publication => {
          publication.id_for_unique_identify_component = AppSettings.generateRandomString(30);
          this.profileCardsForEditingMap.set(publication, new Map(this.tagsWithStylesMap));
        });

        this.scienceService.getALLTagsRest().subscribe(tags => {
          tags.forEach(tag => this.tagsWithStylesMap.set(tag, AppSettings.DEFAULT_TAG_STYLE));
          this.isLoading$.next(false);
          this.cdr.detectChanges();
        });
      });
    }
  }

  saveCard(formData: PublicationResponse) {
    this.scienceService.saveCard(formData).subscribe({
      next: () => {
        this.alertService.add('Публикация сохранена', 'success')
      },
      error: (err) => {
        this.alertService.add('Что-то пошло не так', 'danger')
      }
    })
  }
}
