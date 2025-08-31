import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-history-of-department',
  templateUrl: './history-of-department.component.html',
  styleUrls: ['./history-of-department.component.scss']
})
export class HistoryOfDepartmentComponent implements OnInit {
  scrollPercent = 0;

  @ViewChild('progressBar') progressBar: ElementRef;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    const currentScrollY = window.scrollY; // сколько пикселей пролистали сверху
    const pageHeight = document.documentElement.scrollHeight; // вся высота страницы
    const windowHeight = window.innerHeight; // видимая часть окна

    const scrollableHeight = pageHeight - windowHeight;
    this.scrollPercent = (currentScrollY / scrollableHeight) * 100;
    this.progressBar.nativeElement.style.width = `${this.scrollPercent}%`;
  }

  constructor() { }

  ngOnInit(): void {}
}
