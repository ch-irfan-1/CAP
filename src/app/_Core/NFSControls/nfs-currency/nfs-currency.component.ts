import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, UntypedFormControl, ValidationErrors, Validator, Validators } from '@angular/forms';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { getErrorMessage } from '../nfs-control-helper/GetErrorMessage';
import { ControlFinder } from '../nfs-control-helper/Localization';

@Component({
    selector: 'nfs-currency',
    templateUrl: './nfs-currency.component.html',
    styleUrls: ['./nfs-currency.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NfsCurrencyComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => NfsCurrencyComponent),
            multi: true,
        }
    ],
    standalone: false
})

export class NfsCurrencyComponent implements OnInit, ControlValueAccessor, Validator {
  @Input() Label: string = "";
  @Input() type: string = "";
  @Input() Placeholder: string = "";
  @Input() AlllowedCharsForMsg: string = "";
  @Input() autoComplete: string = "off";
  @Input() isRightAlinged: boolean = false;
  @Input() mask: string = "separator.2";
  @Input() Name: string = "";
  @Input() IsMandatory: boolean = false;
  @Input() isControlDisable: boolean = false;
  @Input() Component: string = '';
  @Input() maxNumberLength: number = 13;
  @Input() maxLength: number = 20;
  @Output() Change = new EventEmitter;

  public currencyControl: UntypedFormControl = new UntypedFormControl('', { updateOn: 'blur' });
  public ErrorMessage: string = "";
  public IsRequiredField: boolean = false;
  public LocalJson: any;
  public controlName!: string;
  public ErrorMsg: string[] = [];

  public separatorLimit!: number;

  constructor(private _store: ClientStoreService,
    private _appConfig: AppConfigService,
    private _formModeService: FormModeService,
    private _msgService: MessageService) {
  }

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

  ngOnInit(): void {

    this.separatorLimit = Math.pow(10, this.maxNumberLength - 1)
    if (this._formModeService.FormMode == FormMode.VIEW) {
      this.isControlDisable = true;
    }

    this.controlName = this.Name || '';

    if (this.LocalJson == null || this.LocalJson == undefined) {
      this.LocalJson = this._store.GetLocalData();
    }

    this.currencyControl.valueChanges.subscribe(val => {
      this.value = val == "" ? null : val;
    });
  }

  set value(val: any) {
    if (val === undefined || val === null) {
      val = 0;
    }

    this.currencyControl.setValue(val, { emitEvent: false });
    this.onChange(val);
    this.onTouch(val);
  }

  get tooltipValue() {
    if (this.currencyControl.value !== undefined && this.currencyControl.value !== null) {
      return this.formatCurrency(this.currencyControl.value);
    }
    return "";
  }

  formatCurrency(currency: string): string | null {
    if (currency != 'null') {
      var format: string = "1.0-" + this.mask.split('.')[1];
      return new CurrencyPipe('en-US').transform(currency, '', '', format);
    }
    else
      return null
  }

  setDisabledState?(isDisabled: boolean): void {
    //isDisabled = this.isControlDisable;
    isDisabled ? this.currencyControl.disable() : this.currencyControl.enable();
  }

  isFieldNotValid() {
    if (this._formModeService.FormMode == FormMode.VIEW) {
      this.isControlDisable = true;
    }
    if (!this.isControlDisable) {
      let key = this.Component + "-" + this.Name;
      if (this.currencyControl.errors) {
        this.ErrorMessage = getErrorMessage(this.currencyControl, this.Label, this.AlllowedCharsForMsg, this.ErrorMsg);
        if (this._msgService.ErrorMessages.get(key) == undefined) {
          this._msgService.ErrorMessages.set(key, this._msgService.CreateControlCustomMessage(this.Label?.replace("*", "").trim() + " is invalid", this.Component));
        }
        return true;
      }
      this._msgService.ErrorMessages.delete(key);
      return false;
    }
    return false;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    this.performLocalizationAndValidation(control);
    return null;
  }

  performLocalizationAndValidation(control: AbstractControl) {
    var UMSValidator = ControlFinder(this._appConfig.LocalData, this.Name, this.Component);

    if (this._appConfig.ValidationsData != undefined && Object.keys(this._appConfig.ValidationsData)?.length > 0)
      var moduleValidator = ControlFinder(this._appConfig.ValidationsData, this.Name, this.Component);

    //var validator = PropertyFinder(component, this.Name);
    var _Validators: any[] = [];
    if (UMSValidator.length > 0) {
      if (UMSValidator[0]?.LocalValue)
        this.Label = UMSValidator[0]?.LocalValue;
      if (UMSValidator[0]?.ErrorMessage)
        this.ErrorMsg = UMSValidator[0]?.ErrorMessage;
      if (UMSValidator[0]?.isMandatory) {
        this.IsRequiredField = true;
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
      control.setValidators(_Validators);
      this.currencyControl.setValidators(_Validators);
    }
  }

  public onValueChanged(ev: any) {
    if (ev?.target?.value === undefined || ev?.target?.value === null || ev?.target?.value === '') {
      this.Change.emit(0);
    }
    else {
      this.Change.emit(parseFloat(ev?.target?.value.split(',').join('')));
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
