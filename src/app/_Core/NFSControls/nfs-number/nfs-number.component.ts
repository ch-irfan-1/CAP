import { Component, EventEmitter, Input, OnInit, Optional, Output, Self } from '@angular/core';
import { ControlValueAccessor, UntypedFormControl, NgControl, Validators } from '@angular/forms';
import { getErrorMessage } from '@NFS_Core/NFSControls/nfs-control-helper/GetErrorMessage';
import { IsRequiredField } from '@NFS_Core/NFSControls/nfs-control-helper/IsRequiredControl';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { ControlFinder } from '../nfs-control-helper/Localization';

@Component({
    selector: 'nfs-number',
    templateUrl: './nfs-number.component.html',
    styleUrls: ['./nfs-number.component.css'],
    standalone: false
})
export class NfsNumberComponent implements OnInit, ControlValueAccessor {
  @Input() Label: string = "";
  @Input() type: string = "";
  @Input() Placeholder: string = "";
  @Input() AlllowedCharsForMsg: string = "";
  @Input() autoComplete: string = "off";
  @Input() maxLength: number = 999;
  @Input() Name: string = '';
  @Input() Component: string = '';
  @Input() isControlDisable: boolean = false;

  @Output() Change = new EventEmitter;

  public numberControl: UntypedFormControl = new UntypedFormControl('', { updateOn: 'blur' });
  public ErrorMessage: string = "";
  public isRequired: boolean = false;
  public LocalJson: any;
  public controlName!: string;
  public _ErrorMsg: string[] = [];

  onChange: any = () => { }
  onTouch: any = () => { }

  writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  constructor(@Optional() @Self() public ngControl: NgControl,
    private _appConfig: AppConfigService,
    private _formModeService: FormModeService,
    private _msgService: MessageService) {
    ngControl.valueAccessor = this;
  }

  ngOnInit(): void {
    const control = this.ngControl && this.ngControl.control;
    this.controlName = this.ngControl.name?.toString() || '';

    if (this._formModeService.FormMode == FormMode.VIEW) {
      this.isControlDisable = true;
    }

    if (this.controlName != '' && this.controlName != null && this.Component != '' && this.Component != null) {
      this.performLocalizationAndValidation();
    }
    // else {
    //   this.LocalJson = this._store.GetLocalData();
    //   this.performLocalizationAndValidation();
    // }
    if (control) {
      this.numberControl.setValidators(control.validator);
      this.numberControl.updateValueAndValidity();
      this.isRequired = IsRequiredField(this.numberControl);
    }

    this.numberControl.valueChanges.subscribe(val => {
      this.value = val;
    });
  }

  set value(val: string) {
    if (val != null && val != undefined) {
      this.numberControl.setValue(val, { emitEvent: false });
      this.onChange(val);
      this.onTouch(val);
    }
  }

  get tooltipValue() {
    return this.numberControl.value;
  }

  setDisabledState?(isDisabled: boolean): void {
    //isDisabled = this.isControlDisable;
    isDisabled ? this.numberControl.disable() : this.numberControl.enable();
  }

  isFieldNotValid() {
    if (this._formModeService.FormMode == FormMode.VIEW) {
      this.isControlDisable = true;
    }
    let key = this.Component + "-" + this.Name;
    if (this.numberControl.errors) {
      this.ErrorMessage = getErrorMessage(this.numberControl, this.Label, this.AlllowedCharsForMsg);
      if (this._msgService.ErrorMessages.get(key) == undefined) {
        this._msgService.ErrorMessages.set(key, this._msgService.CreateControlCustomMessage(this.ErrorMessage, this.Component));
      }
      return true;
    }
    this._msgService.ErrorMessages.delete(key);
    return false;
  }

  performLocalizationAndValidation() {
    var UMSValidator = ControlFinder(this._appConfig.LocalData, this.controlName, this.Component);

    if (this._appConfig.ValidationsData != null && Object.keys(this._appConfig.ValidationsData)?.length > 0)
      var moduleValidator = ControlFinder(this._appConfig.ValidationsData, this.controlName, this.Component);

    var _Validators: any[] = [];
    if (UMSValidator.length > 0) {
      if (UMSValidator[0]?.LocalValue)
        this.Label = UMSValidator[0]?.LocalValue;
      if (UMSValidator[0]?.ErrorMessage)
        this._ErrorMsg = UMSValidator[0]?.ErrorMessage;
      if (UMSValidator[0]?.isMandatory) {
        _Validators.push(Validators.required);
        //this.ngControl.control?.setValidators([Validators.required]);
      }
      if (UMSValidator[0]?.pattern) {
        _Validators.push(Validators.pattern(UMSValidator[0]?.pattern));
      }
      if (!UMSValidator[0]?.isEnabled)
        this.isControlDisable = true;//this.ngControl.control?.disable();
      else if (moduleValidator != undefined && moduleValidator?.length > 0 && !moduleValidator[0]?.isEnabled)
        this.isControlDisable = true;//this.ngControl.control?.disable();

        _Validators.push(Validators.pattern("[0-9 ]*"));

      if (_Validators.length > 0)
        this.ngControl.control?.setValidators(_Validators);
        this.numberControl.setValidators(_Validators);
    }
  }

  public onValueChanged(ev: any) {
    this.Change.emit(ev?.target?.value);
    //(ngModelChange)="modelChanged($event)"
  }

  public SetTabIndex(): number {

    if (this.isControlDisable)
      return -1;
    else
      return 0;
  }

}
