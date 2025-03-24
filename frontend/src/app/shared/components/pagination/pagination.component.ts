import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PageChangedEvent, PaginationModule} from "ngx-bootstrap/pagination";
import {FormsModule} from "@angular/forms";
import {PaginationService} from "@app/shared/services/pagination.service";

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
  imports: [
    PaginationModule,
    FormsModule
  ],
  standalone: true
})
export class PaginationComponent implements OnInit {
  @Input() totalItems: number;
  @Input() itemsPerPage: number;
  @Input() currentPage: number = 1;
  @Input() maxSize: number = 5;

  @Output() pageChange = new EventEmitter<any>();

  constructor(private paginationService: PaginationService) {
  }

  ngOnInit(): void {
    const {limit, offset} = this.paginationService.getPaginationParams();
    if (limit !== undefined && offset !== undefined) {
      this.currentPage = Math.round(offset / limit) + 1;
    }
  }

  onPageChanged(event: PageChangedEvent): void {
    const newOffset = (this.itemsPerPage * (event.page - 1));
    this.paginationService.setPaginationParams(this.itemsPerPage, newOffset).then(
      () => {
        this.currentPage = event.page;
        this.pageChange.emit();
      }
    );
  }
}
