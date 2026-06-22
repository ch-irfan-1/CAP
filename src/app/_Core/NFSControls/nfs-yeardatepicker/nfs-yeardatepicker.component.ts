import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, Optional, Self, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, UntypedFormControl, NgControl, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
//import { default as _rollupMoment, Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import  moment from 'moment';
import { Moment } from 'moment';
import { getErrorMessage } from '../nfs-control-helper/GetErrorMessage';
import { IsRequiredField } from '../nfs-control-helper/IsRequiredControl';
import { ControlFinder } from '../nfs-control-helper/Localization';


export const MY_FORMATS_ORG = {
  parse: {
    dateInput: 'DD-MM-YYYY'
  },
  display: {
    dateInput: "YYYY",
    monthYearLabel: "YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "YYYY"
  }
};

@Component({
    selector: 'nfs-yeardatepicker',
    templateUrl: './nfs-yeardatepicker.component.html',
    styleUrls: ['./nfs-yeardatepicker.component.css'],
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
export class NfsYeardatepickerComponent implements OnInit, ControlValueAccessor, OnChanges {

  /************************** Start DatePicker @Input *************************/
  @Input() Placeholder: string = "";
  @Input() Label: string = "";
  @Input() Max?: Date;
  @Input() Min?: Date;
  @Input() Component: string = '';
  @Input() Name: string = '';
  @Input() isControlDisable: boolean = false;
  /************************** END Start DatePicker @Input *************************/

  public DatePickerControl: UntypedFormControl = new UntypedFormControl('', { updateOn: 'blur' });
  public IsRequiredField: boolean = false;
  public ErrorMessage: string = "";
  public LocalJson: any;
  public controlName!: string;
  isDisabled: boolean = false;

  onChange: any = () => { }
  onTouch: any = () => { }

  constructor(@Optional() @Self() public ngControl: NgControl, private datepipe: DatePipe, private _store: ClientStoreService, private _appConfig: AppConfigService, private _formModeService: FormModeService) {
    if (ngControl != null) {
      // Setting the value accessor directly (instead of using the providers) to avoid running into a circular import.
      ngControl.valueAccessor = this;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {

    this.Max = this._store.GetUserInfo().ProcessingDate;
    const control = this.ngControl && this.ngControl?.control;
    if (control?.value != null || control?.value != "") {
      this.setDate(control?.value);
    }
    if (this._formModeService.FormMode == FormMode.VIEW) {
      this.isControlDisable = true;
    }

    if (this.Name != '' && this.Name != null && this.Component != '' && this.Component != null) {
      this.performLocalizationAndValidation();
    }

    if (this.Min === null || this.Min === undefined) {
      this.Min = new Date('1900-01-01');
    }

    if (control) {
      this.DatePickerControl.setValidators(control.validator);
      this.DatePickerControl.updateValueAndValidity();
      this.IsRequiredField = IsRequiredField(this.DatePickerControl);
    }

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
    isDisabled = this.isControlDisable;
    isDisabled ? this.DatePickerControl.disable() : this.DatePickerControl.enable();
  }

  IsFieldValid() {
    if (this._formModeService.FormMode == FormMode.VIEW) {
      this.isControlDisable = true;
    }
    if (this.DatePickerControl.errors) {
      this.ErrorMessage = getErrorMessage(this.DatePickerControl, this.Label);
      return true;
    }
    return false;
  }

  public setDate(date: string) {
    this.DatePickerControl.setValue(moment(new Date(date)).format());
  }

  performLocalizationAndValidation() {
    var UMSValidator = ControlFinder(this._appConfig.LocalData, this.Name, this.Component, this._store.GetModule());

    if (this._appConfig.ValidationsData != null && Object.keys(this._appConfig.ValidationsData)?.length > 0)
      var moduleValidator = ControlFinder(this._appConfig.ValidationsData, this.Name, this.Component);

    if (UMSValidator.length > 0) {
      if (UMSValidator[0]?.LocalValue)
        this.Label = UMSValidator[0]?.LocalValue;
      if (UMSValidator[0]?.isMandatory)
        this.ngControl.control?.setValidators([Validators.required]);
      if (this.isControlDisable != true) {
        if (!UMSValidator[0]?.isEnabled) {
          this.ngControl.control?.disable();
          this.isControlDisable = true;//this.isDisabled = true;
        }
        else if (moduleValidator != undefined && moduleValidator?.length > 0 && !moduleValidator[0]?.isEnabled) {
          this.isControlDisable = true;//this.ngControl.control?.disable();
          this.isDisabled = true;
        }
      }
    }
  }

  _yearSelectedHandler(chosenDate: Moment, datepicker: MatDatepicker<Moment>) {
    datepicker.close();
    this.value = chosenDate.format('YYYY-MM-DD');
  }
}
