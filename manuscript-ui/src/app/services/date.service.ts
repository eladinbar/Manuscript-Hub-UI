import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  toFormattedDate(timestamp: string): string {
    let date: Date = new Date(timestamp),
      month: string = this.validateDateDigits('' + (date.getMonth() + 1)),
      day: string = this.validateDateDigits('' + date.getDate()),
      year: number = date.getFullYear(),
      hours: string = this.validateDateDigits('' + date.getHours()),
      minutes: string = this.validateDateDigits('' + date.getMinutes());
    return [year, month, day].join('-') + " " + hours + ":" + minutes;
  }

  validateDateDigits = (date: string) => {
    if (date.length < 2)
      date = '0' + date;
    return date;
  }
}
