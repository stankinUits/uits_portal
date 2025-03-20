import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from "@app/shared/services/auth.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {TooltipModule} from "ngx-bootstrap/tooltip";

@Component({
  selector: 'app-delete-button',
  templateUrl: './delete-button.component.html',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    TooltipModule
  ]
})
export class DeleteButtonComponent implements OnInit {

  @Output() delete: EventEmitter<any> = new EventEmitter<any>();
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

}
