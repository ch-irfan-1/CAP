import { Component, EventEmitter, Input, OnChanges, OnInit, Optional, Output, Self, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, UntypedFormControl, NgControl, Validators } from '@angular/forms';
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material/core";
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import  moment from 'moment';
import { getErrorMessage } from '../nfs-control-helper/GetErrorMessage';
import { ControlFinder } from '../nfs-control-helper/Localization';


export const MY_FORMATS_ORG = {
  parse: {
    dateInput: 'DD-MM-YYYY'
  },
  display: {
    dateInput: "DD-MM-YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};

@Component({
    selector: 'nfs-datepicker',
    templateUrl: './nfs-datepicker.component.html',
    styleUrls: ['./nfs-datepicker.component.css'],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE]
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_ORG }
    ],
    standalone: false
})
export class NFSDatePickerComponent implements OnInit, ControlValueAccessor, OnChanges {

  /************************** Start DatePicker @Input *************************/
  @Input() Placeholder: string = "";
  @Input() Label: string = "";
  @Input() Max?: Date;
  @Input() Min?: Date;
  @Input() Component: string = '';
  @Input() Index: number = 0;
  @Input() Name: string = '';
  @Input() isControlDisable: boolean = false;
  @Input() IsMandatory: boolean = false;
  /************************** END Start DatePicker @Input *************************/


  /************************** Start DatePicker @Output *************************/
  @Output() Change = new EventEmitter;
  /************************** END Start DatePicker @Output *************************/



  public DatePickerControl: UntypedFormControl = new UntypedFormControl('', { updateOn: 'blur' });
  public IsRequiredField: boolean = false;
  public ErrorMessage: string = "";
  public LocalJson: any;
  public controlName!: string;
  isDisabled: boolean = false;
  public ErrorMsg: string[] = [];

  onChange: any = () => { }
  onTouch: any = () => { }

  constructor(@Optional() @Self() public ngControl: NgControl,
    private _msgService: MessageService,
    private _appConfig: AppConfigService,
    private _formModeService: FormModeService) {
    if (ngControl != null) {
      // Setting the value accessor directly (instead of using the providers) to avoid running into a circular import.
      ngControl.valueAccessor = this;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {
    const control = this.ngControl && this.ngControl?.control;

    if (this._formModeService.FormMode == FormMode.VIEW) {
      this.isControlDisable = true;
    }

    if (this.Name != '' && this.Name != null && this.Component != '' && this.Component != null) {
      this.performLocalizationAndValidation();
    }

    if (this.Min === null || this.Min === undefined) {
      this.Min = new Date('1900-01-01');
    }

    // if (control) {
    //   this.DatePickerControl.setValidators(control.validator);
    //   this.DatePickerControl.updateValueAndValidity();
    //   this.IsRequiredField = IsRequiredField(this.DatePickerControl);
    // }

    this.DatePickerControl.valueChanges.subscribe((newValue) => {
      if (this.DatePickerControl.valid && this.DatePickerControl.value !== null) {
        var dateString = newValue;
        var dateObj = new Date(dateString);
        var momentObj = moment(dateObj);
        var momentString = momentObj.format('YYYY-MM-DD'); // 2016-07-15
        var date = moment(momentString, 'YYYY-MM-DD')
        this.value = date.format('YYYY-MM-DD');
      }
      else if (this.DatePickerControl.valid && this.DatePickerControl.value === null) {
        this.value = null;
      }
      else {
        //this.value = this.DatePickerControl.errors?.matDatepickerParse.text;
        this.ngControl?.control?.setErrors(this.DatePickerControl.errors);
      }
    });
  }

  /**
   * Setter for drop down value
   */
  set value(val: string | null) {
    if (val !== undefined) {

      this.DatePickerControl.setValue(val, { emitEvent: false });
      this.onChange(val);
      this.onTouch(val);
    }
  }

  get tooltipValue() {
    if (this.DatePickerControl.value !== undefined && this.DatePickerControl.value !== null) {
      var momentObj = moment(this.DatePickerControl.value);
      return momentObj.format('DD-MM-YYYY');
    }
    return "";
  }

  writeValue(obj: string): void {
    this.value = obj;
    // throw new Error('Method not implemented.');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
    // throw new Error('registerOnChange Method not implemented.');
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn
    // throw new Error('registerOnTouched Method not implemented.');
  }

  setDisabledState?(isDisabled: boolean): void {
    //isDisabled = this.isControlDisable;
    isDisabled ? this.DatePickerControl.disable() : this.DatePickerControl.enable();
  }

  IsFieldValid() {
    if (this._formModeService.FormMode == FormMode.VIEW) {
      this.isControlDisable = true;
    }
    if (!this.isControlDisable) {
      let key: any;
      if (this.Index > 0) {
        key = this.Component + "-" + this.Index + "-" + this.Name;
      }
      else {
        key = this.Component + "-" + this.Name;
      }
      if (this.DatePickerControl.errors) {
        this.ErrorMessage = getErrorMessage(this.DatePickerControl, this.Label);
        if (this._msgService.ErrorMessages.get(key) == undefined) {
          this._msgService.ErrorMessages.set(key, this._msgService.CreateControlCustomMessage(this.ErrorMessage, this.Component));
        }
        return true;
      }
      this._msgService.ErrorMessages.delete(key);
    }
    return false;
  }

  public setDate(date: string) {
    this.DatePickerControl.setValue(moment(date).format("MM-DD-YYYY"));
  }

  performLocalizationAndValidation() {
    var UMSValidator = ControlFinder(this._appConfig.LocalData, this.Name, this.Component);

    if (this._appConfig.ValidationsData != undefined && Object.keys(this._appConfig.ValidationsData)?.length > 0)
      var moduleValidator = ControlFinder(this._appConfig.ValidationsData, this.Name, this.Component);

    var _Validators: any[] = [];
    if (UMSValidator.length > 0) {
      if (UMSValidator[0]?.LocalValue)
        this.Label = UMSValidator[0]?.LocalValue;
      if (UMSValidator[0]?.ErrorMessage)
        this.ErrorMsg = UMSValidator[0]?.ErrorMessage;
      if (UMSValidator[0]?.isMandatory) {
        this.IsRequiredField = true;
        _Validators.push(Validators.required);
      }
      if (UMSValidator[0]?.pattern) {
        _Validators.push(Validators.pattern(UMSValidator[0]?.pattern));
      }
      if (this.isControlDisable != true) {
        if (!UMSValidator[0]?.isEnabled)
          this.isControlDisable = true;
        else if (moduleValidator != undefined && moduleValidator?.length > 0 && !moduleValidator[0]?.isEnabled)
          this.isControlDisable = true;
      }
    }
    else if (this.IsMandatory) {
      _Validators.push(Validators.required);
    }

    if (_Validators.length > 0) {
      this.DatePickerControl.setValidators(_Validators);
    }
  }

  onDateChange(evnt: any) {
    if (evnt) {
      var momentString = evnt?.value?.format('YYYY-MM-DD');
      var date = moment(momentString, 'YYYY-MM-DD')
      this.Change.emit(date.format('YYYY-MM-DD'));
    }
  }

  public onTabPress(event: any) {
    if (event?.key == 'Tab' || event?.code == 'Tab') {
      //event.preventDefault();
    }
  }

  public SetTabIndex(): Number {

    if (this.isControlDisable)
      return -1;
    else
      return 0;
  }

}
