import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from '@app/shared/services/auth.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-edit-button',
  templateUrl: './edit-button.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class EditButtonComponent implements OnInit {
  @Output() edit: EventEmitter<any> = new EventEmitter<any>();
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

}
