import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { DialogBoxService } from '@NFS_Core/NFSServices/DialogBox/dialog-box.service';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { IActionList } from '@NFS_Interfaces/OtherInterfaces/IActionList.interface';
import { IContextMenu } from '@NFS_Interfaces/OtherInterfaces/IContextMenu.interface';
import { WorkQueueService } from '@NFS_Modules/CAP/CAPServices/work-queue.service';
import { FormArray, FormBuilder, FormGroup } from 'src/Library';
import { ResizeEvent } from 'angular-resizable-element';

@Component({
    selector: 'nfs-static-grid',
    templateUrl: './nfs-static-grid.component.html',
    styleUrls: ['./nfs-static-grid.component.css'],
    standalone: false
})
export class NfsStaticGridComponent implements OnInit, OnChanges, AfterViewInit {
  private sort!: MatSort;
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.sort = sort;
    this.dataSource.sort = sort;

  }
  // reference to the MatMenuTrigger in the DOM
  @ViewChild(MatMenuTrigger)
  PRPLqueueMenu!: MatMenuTrigger;
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  @Input() columns: Array<any> = [];
  @Input() Labels: Array<any> = [];
  @Input() pipes: Array<any> = [];
  @Input() showTooTip: Array<any> = [];
  @Input() contextMenu: Array<IContextMenu> = [];
  @Input() actionList: Array<IActionList> = []
  @Input() isRadioBtnRequired: boolean = false;
  @Input() isWorkQueue: boolean = false;
  @Input() WorkQueueSrc: string = "";
  @Input() radioPropertyName: string = "";
  @Input() radioPropertyName2: string = "";
  @Input() radioPropertyName3: string = "";
  @Input() checkboxPropertyName: string = "";
  @Input() inputArr: FormArray<any> = this.fb.array([]) as any;
  @Input() Mode: string = FormMode.NEW;
  @Output() ItemRemoved = new EventEmitter;
  @Output() SelectionChange = new EventEmitter;
  @Output() MultiActionOption = new EventEmitter;
  @Output() LoadApplicantData = new EventEmitter;
  @Output() LoadContractData = new EventEmitter;
  @Output() UserForSMSSelectionChange = new EventEmitter;
  @Input() IsDeleteRequired: boolean = true;
  @Input() IsMultiActionRequired: boolean = false;
  @Input() IsActionRequired: boolean = true;
  @Input() DisableSorting: boolean = true;
  @Input() ActionLabel: string = '';
  @Input() ConfirmationMsg: string = '';
  @Input() alwaysEnable = false;
  @Input() rightClickContextMenuEnable: boolean = false;
  @Output() LoadDealerData = new EventEmitter;
  @Input() isControlDisable: boolean = false;
  @Input() IsResizable: boolean = false;
  LoggedinUserRole: string = '';

  public actionIconArray: Array<any> = [{ 'icon': 'remove_red_eye', 'label': 'View' }, { 'icon': 'edit', 'label': 'Update' }, { 'icon': 'cloud_download', 'label': 'Load Dealer' },
  { 'icon': 'cloud_download', 'label': 'Load Applicant' }, { 'icon': 'cloud_download', 'label': 'Load Asset' }, { 'icon': 'remove_red_eye', 'label': 'View Documents' },
  { 'icon': 'edit', 'label': 'Upload/View Document' }, { 'icon': 'cloud_download', 'label': 'Load Contract' }, { 'icon': 'cloud_download', 'label': 'Rental Details' }];
  public dataSource = new MatTableDataSource<any>([]);
  public selectedElement: Object = {};
  public displayedColumns: Array<any> = [];
  public currentElement: any = {};
  isDisabled: boolean = false;
  menuTopLeftPosition = { x: '0', y: '0' }
  index!: number;
  icon: any;

  constructor(
    private fb: FormBuilder, private _storageService: ClientStoreService, private _WorkQueueService: WorkQueueService,
    private _formModeService: FormModeService, private _appConfig: AppConfigService, private _customDialog: DialogBoxService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.alwaysEnable && this._formModeService.FormMode == FormMode.VIEW) {
      this.isDisabled = true;
    }
    let array = [] as Array<any>;
    array = this.inputArr?.value?.filter(obj => obj.RowState !== DataRowState.Removed)
    this.dataSource = new MatTableDataSource<any>(array);
  }

  ngOnInit(): void {

    if (this.ActionLabel != "") {
      this.icon = this.actionIconArray.filter(p => (p.label == this.ActionLabel))[0].icon;
    }

    if (!this.alwaysEnable && this._formModeService.FormMode == FormMode.VIEW) {
      this.isDisabled = true;
    }

    if (this.IsActionRequired || (this.WorkQueueSrc == 'IOPS' && this.isWorkQueue == true)) {
      this.displayedColumns.push('remove');
    }

    this.LoggedinUserRole = this._storageService.GetUserGroupCode();
    //this.dataSource = new MatTableDataSource<any>(this.inputArr?.value);
    this.displayedColumns.unshift(...this.columns);
    this.inputArr?.valueChanges.subscribe((newValue) => {
      let array = this.inputArr?.value?.filter(obj => obj.RowState !== DataRowState.Removed)
      this.dataSource = new MatTableDataSource<any>(array);
    });
    this.setDisabled();
  }
  //removes item from the grid
  //TODO: need to implement row state management
  removeOption(obj: any): void {
    if (this.ConfirmationMsg != '') {
      var customDialog = this._customDialog.openDialog("Confirmation", this.ConfirmationMsg, false, "Yes", "No");
      customDialog.afterClosed().subscribe(
        result => {
          if (result === "ok") {
            this.deleteObj(obj);
          }
        })
    }
    else {
      this.deleteObj(obj);
    }
  }


  deleteObj(obj: any): void {
    var index = this.inputArr.value.indexOf(obj);
    if (obj.RowState == 3) {
      this.inputArr.removeAt(this.inputArr.value.indexOf(obj));
    }
    else {
      obj.RowState = DataRowState.Removed;
      this.inputArr.controls[index].setValue(obj);
    }
    let array = [] as Array<any>;
    array = this.inputArr?.value?.filter(obj => obj.RowState !== DataRowState.Removed)
    this.dataSource = new MatTableDataSource<any>(array);
    this.ItemRemoved.emit(obj);
  }
  onResizeEnd(event: ResizeEvent, columnName: string): void {
    if (event.edges.right) {
      const cssValue = event.rectangle.width + 'px';
      const columnElts = document.getElementsByClassName(
        'mat-column-' + columnName
      );
      for (let i = 0; i < columnElts.length; i++) {
        const currentEl = columnElts[i] as HTMLDivElement;
        currentEl.style.width = cssValue;
      }
    }
  }
  //marks the grid item as default on respective radio button selection
  OnDefaultRecordChange(element: any, indicator: string = '') {
    let currentIndex, previousIndex;
    if (element?.APPLICABLEIND != undefined && element?.APPLICABLEIND == true) {
      this.currentElement = element;

      let radioName = this.radioPropertyName || this.radioPropertyName3;
      this.inputArr.controls.forEach((control, index) => {
        //this.inputArr.controls[index].get(radioName)?.setValue(false, { emitEvent: false });
        var temp = control as FormGroup;
        //temp.controls[radioName].patchValue(false, { emitEvent: false });
        if (JSON.stringify(this.currentElement) === JSON.stringify(temp.value)) {
          //temp.controls[radioName].patchValue(true);
          currentIndex = index;
        }
        if (temp.controls.DEFAULTIND.value == true) {
          previousIndex = index;
        }
        (this.inputArr.controls[index] as FormGroup).get(this.radioPropertyName)?.setValue(false);
        if (temp.controls.RowState.value == DataRowState.None) {
          temp.controls.RowState.patchValue(DataRowState.Pristine);
        }
      });
      let array = this.inputArr?.value?.filter(obj => obj.RowState !== DataRowState.Removed)
      this.dataSource = new MatTableDataSource<any>(array);
      let isDefault = false;
      if (indicator == 'default')
        isDefault = true;
      this.SelectionChange.emit({ currentIndex, previousIndex, isDefault });
    }
    else if (!element.DEFAULTIND) {
      this.currentElement = element;

      let radioName = this.radioPropertyName || this.radioPropertyName3;
      this.inputArr.controls.forEach((control, index) => {
        (this.inputArr.controls[index] as FormGroup).get(radioName)?.setValue(false, { emitEvent: false });
        var temp = control as FormGroup;
        temp.controls[radioName].patchValue(false, { emitEvent: false });
        if (JSON.stringify(this.currentElement) === JSON.stringify(temp.value)) {
          temp.controls[radioName].patchValue(true);
        }
        if (temp.controls.RowState.value == DataRowState.None) {
          temp.controls.RowState.patchValue(DataRowState.Pristine);
        }
        if (temp.controls.RowState.value !== DataRowState.Added && temp.controls.RowState.value !== DataRowState.Removed) {
          temp.controls.RowState.patchValue(DataRowState.Updated);
        }
      });
      let array = this.inputArr?.value?.filter(obj => obj.RowState !== DataRowState.Removed)
      this.dataSource = new MatTableDataSource<any>(array);
      this.SelectionChange.emit(this.inputArr);
    }
  }

  userForSMSRecordChange(element: any) {
    let response = {} as object;
    if (!element.USEFORSMSIND) {
      this.currentElement = element;
      let currentIndex, previousIndex;
      this.inputArr.controls.forEach((control, index) => {
        var temp = control as FormGroup;
        //temp.controls[this.radioPropertyName2].patchValue(false, { emitEvent: false });
        if (JSON.stringify(this.currentElement) === JSON.stringify(temp.value)) {
          //temp.controls[this.radioPropertyName2].patchValue(true);
          currentIndex = index;
        }
        if (temp.controls.USEFORSMSIND.value == true) {
          previousIndex = index;
        }
        if (temp.controls.RowState.value == DataRowState.None) {
          temp.controls.RowState.patchValue(DataRowState.Pristine);
        }
        (this.inputArr.controls[index] as FormGroup).get(this.radioPropertyName2)?.setValue(false, { emitEvent: false });
      });
      let array = this.inputArr?.value?.filter(obj => obj.RowState !== DataRowState.Removed)
      this.dataSource = new MatTableDataSource<any>(array);

      this.UserForSMSSelectionChange.emit({ currentIndex, previousIndex });
    }

    this.UserForSMSSelectionChange.emit({});
  }

  // check the radio button if it is default item
  isDefault(i: number, obj: any): boolean {
    let dataSourceArray = this.inputArr?.value?.filter(obj => obj.RowState !== DataRowState.Removed);
    if (dataSourceArray[i].DEFAULTIND) {
      return true;
    }
    else {
      return false;
    }
  }

  selectedForSMS(i: number, obj: any): boolean {
    let dataSourceArray = this.inputArr?.value?.filter(obj => obj.RowState !== DataRowState.Removed);
    if (dataSourceArray[i].USEFORSMSIND) {
      return true;
    }
    else {
      return false;
    }
  }

  applicableOnChange(element: any) {
    if (!element.APPLICABLEIND) {
      this.currentElement = element;

      this.inputArr.controls.forEach((control, index) => {
        //this.inputArr.controls[index].get(this.radioPropertyName2)?.setValue(false, { emitEvent: false });
        var temp = control as FormGroup;
        //temp.controls[this.radioPropertyName2].patchValue(false, { emitEvent: false });
        if (JSON.stringify(this.currentElement) === JSON.stringify(temp.value)) {
          temp.controls[this.radioPropertyName2].patchValue(true);
        }
        if (temp.controls.RowState.value == DataRowState.None) {
          temp.controls.RowState.patchValue(DataRowState.Pristine);
        }
      });
      let array = this.inputArr?.value?.filter(obj => obj.RowState !== DataRowState.Removed)
      this.dataSource = new MatTableDataSource<any>(array);

      this.SelectionChange.emit(this.inputArr);
    }
  }

  isChecked(i: number, obj: any): boolean {
    let dataSourceArray = this.inputArr?.value?.filter(obj => obj.RowState !== DataRowState.Removed);
    if (dataSourceArray[i].APPLICABLEIND) {
      return true;
    }
    else {
      return false;
    }
  }

  checkValue(element: any, i: any) {
    this.inputArr.controls.forEach((control, index) => {
      var temp = control as FormGroup;

      if (JSON.stringify(element) === JSON.stringify(temp.value)) {
        if (temp.controls[this.checkboxPropertyName].value) {
          temp.controls[this.checkboxPropertyName].patchValue(false);
          temp.controls[this.radioPropertyName3].patchValue(false);
        }
        else if (!temp.controls[this.checkboxPropertyName].value) {
          temp.controls[this.checkboxPropertyName].patchValue(true);
        }
      }

    });

    let array = this.inputArr?.value?.filter(obj => obj.RowState !== DataRowState.Removed)
    this.dataSource = new MatTableDataSource<any>(array);
    this.SelectionChange.emit({ currentIndex: i, previousIndex: 0, isDefault: false });
  }

  isRowDisabled(i: number = 0, obj: any): boolean {
    var temp = this.inputArr.controls[i] as FormGroup;
    if (obj?.ISROWDISABLED) {
      return true;
    }
    else {
      return false;
    }
  }
  isDeleteDisabled(element: any) {
    if (element?.isDeleteDisabled) {
      return true;
    }
    else {
      return false;
    }
  }


  setDisabled() {
    if (this.Mode === FormMode.VIEW) {
      this.isDisabled = true;
    }
  }

  selectionChange(obj: any): void {
    this.SelectionChange.emit(obj);
  }

  multiActionOption(obj: any, action: any): void {
    this.MultiActionOption.emit({ Data: obj, Action: action });
  }

  queueOperation(obj: any, mode: any): void {
    this.SelectionChange.emit({ Quot: obj, Mode: mode });
  }

  ProposalQueueOperation(obj: any, mode: any): void {
    this.SelectionChange.emit({ Proposal: obj, Mode: mode });
  }

  setHeader(col: any) {
    let index = this.columns.indexOf(col)
    return this.Labels[index];
  }

  CanRenderMenu(data: any, menu: any): boolean {
    if (data.ASSNTO === 0 && data.EAPPROVALIND && data.STATUSCDE === '00001') {
      return menu.inputVal === 'Forward' || menu.inputVal === 'Take Control';
    }
    return this._WorkQueueService.CheckContextMenu(data, menu);
  }

  isDisableMenu(data: any, menu: any): boolean {
    return this._WorkQueueService.DisableContextMenu(data, menu);
  }

  CanRenderIOPSMenu(data: any, menu: any) {
    return (menu.status.includes(data.STATUSDSC) || menu.status.includes(data.APCSTATUSDSC))
  }

  isWorkQueueSelectedEvent(event: MouseEvent, item: any, index: number) {
    this.index = index
  }

  contextMenuOnRightClick(event: MouseEvent, item: any) {
    if (this.PRPLqueueMenu.menuOpen) {
      this.PRPLqueueMenu.closeMenu();
    }
    event.preventDefault();
    this.menuTopLeftPosition.x = event.clientX + 'px';
    this.menuTopLeftPosition.y = event.clientY + 'px';
    this.PRPLqueueMenu.menu?.focusFirstItem('mouse');
    this.PRPLqueueMenu.menuData = { data: item };
    this.PRPLqueueMenu.openMenu();
    event.stopPropagation();
  }

  @HostListener('document:contextmenu')
  @HostListener('document:click')
  closeMenu() {
    if (this.PRPLqueueMenu && this.PRPLqueueMenu.menuOpen && this.isWorkQueue) {
      this.PRPLqueueMenu.closeMenu();
    }
  }
}
