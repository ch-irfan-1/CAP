import { Component, Input, OnInit } from '@angular/core';
import  moment from 'moment';

@Component({
    selector: 'app-nfs-month-year-find',
    templateUrl: './nfs-month-year-find.component.html',
    styleUrls: ['./nfs-month-year-find.component.css'],
    standalone: false
})
export class NfsMonthYearFindComponent implements OnInit {

  @Input() FromDate:any;
  @Input() TimeTitle:any;
  @Input() ToDate: any;

  Total_Years = 0;
  Total_Months = 0;

  ngOnInit(): void {
  }

  constructor(  ) {
  }

  ngOnChanges(): void {
    this.CalculateYearMonth(this.FromDate, this.ToDate);
  }

  CalculateYearMonth(dateFrom: Date, dateTo: Date){
    if (dateTo == undefined && dateFrom != undefined){
      let data = this.getMonths(dateFrom);
      this.Total_Years = data[0];
      this.Total_Months = data[1];
    }
    else if(dateTo != undefined && dateFrom != undefined) {
      let data = this.getDuration(this.FromDate, this.ToDate);
      this.Total_Years = data[0];
      this.Total_Months = data[1];
    }

  }

  getMonths(date: Date | null) {
    let monthsMoment, years, months = 0;
    let yearmonthlist = []
    monthsMoment = moment().diff(date, 'months');
    years = Math.floor(monthsMoment / 12);
    months = monthsMoment % 12;
    yearmonthlist.push(years);
    yearmonthlist.push(months)
    return yearmonthlist;
  }

  getDuration(fromdte: Date, todte: Date) {
    var a = moment(todte);
    var b = moment(fromdte);
    let yearmonthlist = []
    var years = a.diff(b, 'year');
    b.add(years, 'years');

    var months = a.diff(b, 'months');
    b.add(months, 'months');

    yearmonthlist.push(years)
    yearmonthlist.push(months)
    return yearmonthlist;
  }

}
