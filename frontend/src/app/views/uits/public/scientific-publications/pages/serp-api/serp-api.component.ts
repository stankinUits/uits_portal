import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {
  RegisterScienceService
} from "@app/views/uits/public/scientific-publications/service/register-science-service.service";
import {
  ScienceRawPublication
} from "@app/views/uits/public/scientific-publications/interface/science-publications-from-scholar.interface";
import {BehaviorSubject} from "rxjs";
import {ScienceReadyPublication} from "@app/views/uits/public/scientific-publications/interface/profile.interface";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "@app/shared/services/auth.service";
import {AlertService} from "@app/shared/services/alert.service";
import {AppSettings} from "@app/views/uits/public/scientific-publications/utils/settings";
import {
  PublicationResponse
} from "@app/views/uits/public/scientific-publications/interface/publication-response.interface";

@Component({
  selector: 'app-serp-api',
  templateUrl: './serp-api.component.html',
  styleUrls: ['./serp-api.component.css']
})
export class SerpApiComponent implements OnInit {
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
    console.log('123213')
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
        console.log(res);
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
