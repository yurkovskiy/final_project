import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentBookService {
  private URL = 'https://fierce-shore-32592.herokuapp.com/diaries';

  constructor(private _http: HttpClient) {}

  private months = [
    'Січня',
    'Лютого',
    'Березня',
    'Квітня',
    'Травня',
    'Червня',
    'Липня',
    'Серпня',
    'Вересня',
    'Жовтня',
    'Листопада',
    'Грудня'
  ];

  private dayOfWeek = [
    'Понеділок',
    'Вівторок',
    'Середа',
    'Четвер',
    "П'ятниця",
    'Субота'
  ];

  private getFormattedMonday(date: Date = new Date()): string {
    const day = date.getDay(),
      diff = date.getDate() - day + 1;
    const monday = new Date(date.setDate(diff));
    const mondayMonth =
      monday.getMonth() + 1 < 10
        ? `0${monday.getMonth() + 1}`
        : monday.getMonth() + 1;
    const mondayDate =
      monday.getDate() < 10 ? `0${monday.getDate()}` : monday.getDate();
    return `${monday.getFullYear()}-${mondayMonth}-${mondayDate}`;
  }

  private sortDataByWeekDay(data: Array<any>): Array<object> {
    let arr = [];
    const sortedArray = [];
    for (let i = 0; i < this.dayOfWeek.length; i++) {
      data.forEach(el => {
        const currDate = new Date(el.date.join('-')).getDay() - 1;
        if (currDate === i) {
          arr.push(el);
        }
      });
      if (arr.length) {
        sortedArray.push({
          dayOfWeek: this.dayOfWeek[i],
          daySchedule: arr,
          dayDate: new Date(arr[0].date)
        });
      }
      arr = [];
    }
    return sortedArray;
  }

  private convertedDate(data): string {
    const day = new Date(data.date.join('-')).getDate();
    const month = this.months[new Date(data.date.join('-')).getMonth()];
    const year = new Date(data.date.join('-')).getFullYear();
    return `${day} ${month} ${year}`;
  }

  public getDiariesList(date?: Date): Observable<any> {
    const formattedDate = this.getFormattedMonday(date);
    return this._http
      .get<any>(`${this.URL}?weekStartDate=${formattedDate}`)
      .map(response => {
        if (response.data.length) {
          const sortedWeekData = this.sortDataByWeekDay(response.data);
          const startEndOfWeek = {
            startOfWeek: this.convertedDate(response.data[0]),
            endOfWeek: this.convertedDate(
              response.data[response.data.length - 1]
            )
          };
          return [sortedWeekData, startEndOfWeek];
        } else {
          return 'Наразі немає даних про розклад';
        }
      });
  }
}