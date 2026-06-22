import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-asset-sub-type',
    templateUrl: './asset-sub-type.component.html',
    styleUrls: ['./asset-sub-type.component.css'],
    standalone: false
})
export class AssetSubTypeComponent implements OnInit {
  tempData: any = [{ code: "00001", TextValue: "one 1" }, { code: "00002", TextValue: "two 2" }, { code: "00003", TextValue: "three 3" }];

  searchPanel = true;
  resultPanel = false;

  constructor() { }

  ngOnInit(): void {
  }

  ShowResults()
  {
    this.searchPanel = !this.searchPanel;
    this.resultPanel = !this.resultPanel;
  }

}
