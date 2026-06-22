import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import  moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FormatterService {

  constructor(private datePipe: DatePipe) { }

  public FormateDateToString(dateString: string, format: string = 'dd-MM-yyyy'): string | null {
    let date = new Date(dateString?.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
    return this.datePipe.transform(date, format);
  }

  public FormatCurrencyToNumber(currencyStr: string): number {
    if(currencyStr == ''){
      return 0
    }
    else{
      return parseFloat(currencyStr.replace(/,/g, ''));
    }
  }

  public ConvertEmptyStringToNull(value: string) {
    return (value === "") ? null : value;
  }

  public ConvertEmptyStringToNumber(value: string) {
    return (value === "") ? -1 : +value;
  }

  public GetDateWithoutTime() {
    var dateObj = new Date(Date.now());
    var momentObj = moment(dateObj);
    var momentString = momentObj.format('YYYY-MM-DD'); // 2016-07-15
    var date = moment(momentString, 'YYYY-MM-DD')
    return date.format('YYYY-MM-DD');
  }
}
