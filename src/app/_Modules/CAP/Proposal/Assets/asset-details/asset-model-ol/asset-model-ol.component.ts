import { Component, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorSelectConfig, PageEvent } from '@angular/material/paginator';
import { FormArray, FormBuilder } from 'src/Library';

@Component({
    selector: 'app-asset-model-ol',
    templateUrl: './asset-model-ol.component.html',
    styleUrls: ['./asset-model-ol.component.css'],
    standalone: false
})
export class AssetModelOlComponent implements OnInit {

  tempData: any = [{ code: "00001", TextValue: "one 1" }, { code: "00002", TextValue: "two 2" }, { code: "00003", TextValue: "three 3" }];
  panelOpenState = false;
  searchPanel = true;
  resultPanel = false;

  dataSourcelength = 10;
  selectedPageSize: number = 25;
  pageSizeOptions: number[] = [25, 50, 75, 100];
  public columns = ['TaxType', 'BaseAmount', 'TaxRate', 'TaxAmount'];
  public pipes = [null, null, null, null, null, null];
  public Labels = ['Tax Type', 'Base Amount', 'Tax Rate', 'Tax Amount'];
  object = { TaxType: '', BaseAmount: '', TaxRate: '', TaxAmount: ''} as testing
  group = this._formBuilder.group(this.object);
  public doctDataset: FormArray < testing > = this._formBuilder.array<testing>([this.group]);

  constructor(private _formBuilder: FormBuilder) { }

  paginatorSelectConfig:MatPaginatorSelectConfig = {
    panelClass: "paginator-select-overlay"
  }
  ngOnInit(): void {
  }

  public PageSelectionChanged(event: PageEvent) {
  }

  ShowResults()
  {
    this.searchPanel = !this.searchPanel;
    this.resultPanel = !this.resultPanel;
  }

}
export class testing {
  TaxType: string = '';
  BaseAmount: string = ''
  TaxRate: string = ''
  TaxAmount: string = ''

}
