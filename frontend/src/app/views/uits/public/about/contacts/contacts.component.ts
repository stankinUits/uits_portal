import { Component, OnInit } from '@angular/core';
import { ContactsService } from './contacts.service';
import { BehaviorSubject } from 'rxjs';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  markdownContent$ = new BehaviorSubject<string>('');

  constructor(private contactsService: ContactsService) { }

  ngOnInit(): void {
    this.loadContent();
  }

  loadContent(): void {
    this.contactsService.getContactContent('contacts').pipe(
      catchError(error => {
        console.error('Error fetching contact content', error);
        return of(''); // Возвращаем пустую строку в случае ошибки
      })
    ).subscribe(content => {
      this.markdownContent$.next(content);
    });
  }

  saveContent(): void {
    const content = this.markdownContent$.getValue();
    this.contactsService.saveContactContent('contacts', content).pipe(
      catchError(error => {
        console.error('Error saving contact content', error);
        return of(null); // Возвращаем null в случае ошибки
      })
    ).subscribe(() => {
      console.log('Content saved:', content);
    });
  }
}
