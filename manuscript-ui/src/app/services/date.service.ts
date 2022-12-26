import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  toFormattedDate(timestamp: string) {
    let date = new Date(timestamp),
      month = this.validateDateDigits('' + (date.getMonth() + 1)),
      day = this.validateDateDigits('' + date.getDate()),
      year = date.getFullYear(),
      hours = this.validateDateDigits('' + date.getHours()),
      minutes = this.validateDateDigits('' + date.getMinutes());
    return [year, month, day].join('-') + " " + hours + ":" + minutes;
  }

  validateDateDigits = (date: string) => {
    if (date.length < 2)
      date = '0' + date;
    return date;
  }
}
