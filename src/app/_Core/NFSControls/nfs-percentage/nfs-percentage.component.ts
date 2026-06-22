import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NgControl, Validators } from '@angular/forms';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { FormControl } from 'src/Library';
import { pairwise } from 'rxjs/operators';
import { getErrorMessage } from '../nfs-control-helper/GetErrorMessage';
import { IsRequiredField } from '../nfs-control-helper/IsRequiredControl';
import { ControlFinder } from '../nfs-control-helper/Localization';

@Component({
    selector: 'nfs-percentage',
    templateUrl: './nfs-percentage.component.html',
    styleUrls: ['./nfs-percentage.component.css'],
    standalone: false
})
export class NfsPercentageComponent implements OnInit, ControlValueAccessor {
  @Input() label: string = "";
  @Input() type: string = "";
  @Input() placeholder: string = "";
  @Input() AlllowedCharsForMsg: string = "";
  @Input() autoComplete: string = "off";
  @Input() decimalDigits: number = 2;
  @Input() isRightAlinged: boolean = false;
  @Input() Component: string = '';

  public percentageControl: FormControl = new FormControl('', {updateOn: 'blur'});
  public errorMsg: string = "";
  public isRequired: boolean = false;
  public decimals: string = "percent.";
  public LocalJson: any;
  public controlName!: string;
  public isControlDisable: boolean = false;

  onChange: any = () => { }
  onTouch: any = () => { }

  constructor(private ngControl: NgControl, private _store: ClientStoreService, private _appConfig: AppConfigService) {
    if (ngControl != null)
      ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  ngOnInit(): void {
    this.decimals = this.decimals + this.decimalDigits.toString();
    const control = this.ngControl && this.ngControl.control;
    this.controlName = this.ngControl.name?.toString() || '';
    if (this.controlName != '' && this.controlName != null && this.Component != '' && this.Component != null) {
      this.performLocalizationAndValidation();
    }
    // else {
    //   this.LocalJson = this._store.GetLocalData();
    //   this.performLocalizationAndValidation();
    // }
    if (control) {
      this.percentageControl.setValidators(control.validator);
      this.percentageControl.updateValueAndValidity();
      this.isRequired = IsRequiredField(this.percentageControl);
    }

    this.percentageControl.valueChanges.pipe(pairwise()).subscribe(([prev, val]) => {
      if (val !== prev)
        this.value = val;
    });
  }

  set value(val: string) {
    if (val != null && val != undefined) {
      this.percentageControl.setValue(val, { emitEvent: false });
      this.onChange(val);
      this.onTouch(val);
    }
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled = this.isControlDisable;
    isDisabled ? this.percentageControl.disable() : this.percentageControl.enable();
  }

  isFieldNotValid() {
    if (this.percentageControl.errors) {
      this.errorMsg = getErrorMessage(this.percentageControl, this.label, this.AlllowedCharsForMsg);
      return true;
    }
    return false;
  }

  performLocalizationAndValidation() {
    // var validator = Localize(this.LocalJson, this.controlName);
    var UMSValidator = ControlFinder(this._appConfig.LocalData, this.controlName, this.Component);

    if (this._appConfig.ValidationsData != null && Object.keys(this._appConfig.ValidationsData)?.length > 0)
      var moduleValidator = ControlFinder(this._appConfig.ValidationsData, this.controlName, this.Component);

    if (UMSValidator.length > 0) {
      if (UMSValidator[0]?.LocalValue)
        this.label = UMSValidator[0]?.LocalValue;
      if (UMSValidator[0]?.isMandatory)
        this.ngControl.control?.setValidators([Validators.required]);
      if (!UMSValidator[0]?.isEnabled)
        this.isControlDisable = true;//this.ngControl.control?.disable();
      else if (moduleValidator != undefined && moduleValidator?.length > 0 && !moduleValidator[0]?.isEnabled)
      this.isControlDisable = true;//this.ngControl.control?.disable();
    }
  }

}
