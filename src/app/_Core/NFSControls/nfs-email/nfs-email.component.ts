import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, UntypedFormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { getErrorMessage } from '@NFS_Core/NFSControls/nfs-control-helper/GetErrorMessage';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { IsRequiredField } from '../nfs-control-helper/IsRequiredControl';
import { ControlFinder } from '../nfs-control-helper/Localization';

@Component({
    selector: 'nfs-email',
    templateUrl: './nfs-email.component.html',
    styleUrls: ['./nfs-email.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NfsEmailComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => NfsEmailComponent),
            multi: true,
        },
    ],
    standalone: false
})
export class NfsEmailComponent implements OnInit, ControlValueAccessor, Validator {
  @Input() label: string = "";
  @Input() type: string = "";
  @Input() placeholder: string = "";
  @Input() AlllowedCharsForMsg: string = "";
  @Input() autoComplete: string = "off";
  @Input() Name: string = '';
  @Input() Component: string = '';
  @Input() Index: number = 0;
  @Input() maxLength: number = 999;
  @Input() isControlDisable: boolean = false;

  public emailControl: UntypedFormControl = new UntypedFormControl('', { updateOn: 'blur' });
  public ErrorMessage: string = "";
  public isRequired: boolean = false;
  public LocalJson: any;
  public controlName!: string;

  constructor(
    private _store: ClientStoreService,
    private _appConfig: AppConfigService,
    private _formModeService: FormModeService,
    private _msgService: MessageService) {
    // ngControl.valueAccessor = this;
  }
  validate(control: AbstractControl): ValidationErrors | null {
    this.performLocalizationAndValidation(control);
    return null;
  }

  registerOnValidatorChange?(fn: () => void): void {
    this.onValidationChange = fn;
  }

  onChange: any = () => { }
  onTouch: any = () => { }
  onValidationChange: any = () => { }

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
    // const control = this.ngControl && this.ngControl?.control;

    this.isRequired = IsRequiredField(this.emailControl);
    if (this._formModeService.FormMode == FormMode.VIEW) {
      this.isControlDisable = true;
    }

    // if (control) {
    //   this.isRequired=IsRequiredField(this.emailControl);
    // }
    this.emailControl.valueChanges.subscribe(val => {
      this.value = val;
    });

  }

  set value(val: any) {
    if (val != null && val != undefined) {
      this.emailControl.setValue(val, { emitEvent: false });
      this.onChange(val);
      this.onTouch(val);
      this.onValidationChange();
    }
  }

  get tooltipValue() {
    return this.emailControl.value;
  }

  setDisabledState?(isDisabled: boolean): void {
    // isDisabled = this.isControlDisable;
    isDisabled ? this.emailControl.disable() : this.emailControl.enable();
  }

  isFieldNotValid() {
    if (this._formModeService.FormMode == FormMode.VIEW) {
      this.isControlDisable = true;
    }
    let key: any;
    if (this.Index > 0) {
      key = this.Component + "-" + this.Index + "-" + this.Name;
    }
    else {
      key = this.Component + "-" + this.Name;
    }
    if (this.emailControl.errors) {
      this.ErrorMessage = getErrorMessage(this.emailControl, this.label, this.AlllowedCharsForMsg);
      if (this._msgService.ErrorMessages.get(key) == undefined) {
        this._msgService.ErrorMessages.set(key, this._msgService.CreateControlCustomMessage(this.ErrorMessage, this.Component));
      }
      return true;
    }
    this._msgService.ErrorMessages.delete(key);
    return false;
  }

  performLocalizationAndValidation(control: AbstractControl) {
    var UMSValidator = ControlFinder(this._appConfig.LocalData, this.Name, this.Component, this._store.GetModule());

    if (this._appConfig.ValidationsData != null && this._appConfig.ValidationsData)
      var moduleValidator = ControlFinder(this._appConfig.ValidationsData, this.Name, this.Component);

    var _Validators: any[] = [];
    if (UMSValidator.length > 0) {
      if (UMSValidator[0]?.LocalValue)
        this.label = UMSValidator[0]?.LocalValue;
      if (UMSValidator[0]?.isMandatory) {
        this.isRequired = true;
        _Validators.push(Validators.required);
        _Validators.push(Validators.pattern(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/));
      }
      else {
        _Validators.push(Validators.pattern(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/));
      }
      if (!UMSValidator[0]?.isEnabled)
        this.isControlDisable = true; //control?.disable();
      else if (moduleValidator != undefined && moduleValidator?.length > 0 && !moduleValidator[0]?.isEnabled)
        this.isControlDisable = true; //control?.disable();
    }
    else {
      _Validators.push(Validators.pattern(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/));
    }

    if (_Validators.length > 0) {
      control?.setValidators(_Validators);
      this.emailControl.setValidators(_Validators);
    }

  }
  public SetTabIndex() : number
  {

    if (this.isControlDisable)
      return -1;
    else
      return 0;
  }
}
