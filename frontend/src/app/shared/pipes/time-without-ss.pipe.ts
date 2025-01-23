import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeWithoutSs'
})
export class TimeWithoutSsPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {return '';}
    const [hours, minutes] = value.split(':');
    return `${hours}:${minutes}`;
  }
}
