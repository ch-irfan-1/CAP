import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, UntypedFormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { getErrorMessage } from '../nfs-control-helper/GetErrorMessage';
import { ControlFinder } from '../nfs-control-helper/Localization';

@Component({
    selector: 'nfs-textarea',
    templateUrl: './nfs-textarea.component.html',
    styleUrls: ['./nfs-textarea.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NfsTextareaComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => NfsTextareaComponent),
            multi: true,
        },
    ],
    standalone: false
})
export class NfsTextareaComponent implements OnInit, ControlValueAccessor, Validator {
  @Input() Placeholder: string = "";
  @Input() Label: string = "";
  @Input() autocomplete: string = "off";
  @Input() AlllowedCharsForMsg: string = "" //string for allowed charcters list only for display in error message e.g "Alphanumber dot and dash"
  @Input() Type: "text" | "password" | "number" | "email" = "text";
  @Input() Name: string = '';
  @Input() Component: string = '';
  @Input() maxLength: number = 999;
  @Input() isControlDisable: boolean = false;
  @Input() ApplyRegex: string = '';
  // @Input() IsBlurEventRequired: boolean = false;

  public TextAreaControl: UntypedFormControl = new UntypedFormControl('');
  public IsRequiredField: boolean = false;
  public ErrorMessage: string = "";
  public LocalJson: any;
  public controlName!: string;
  public _ErrorMsg: string[] = [];


  onChange: any = () => { }
  onTouch: any = () => { }
  onValidationChange: any = () => { }

  constructor(private _store: ClientStoreService, private _appConfig: AppConfigService, private _formModeService: FormModeService) { }

  ngOnInit(): void {
    // if (this.LocalJson == null || this.LocalJson == undefined) {
    //   this.LocalJson = this._store.GetLocalData();
    // }
    // if(!this.IsBlurEventRequired)
    // this.TextAreaControl = new FormControl('', { updateOn: 'blur' })
    // else if(this.IsBlurEventRequired)
    // this.TextAreaControl = new FormControl('')

    if (this._formModeService.FormMode == FormMode.VIEW) {
      this.isControlDisable = true;
    }

    this.TextAreaControl.valueChanges.subscribe((newValue) => {
      if (newValue.trim())
        this.value = newValue;
      else
        this.value = '';
    });
  }

  set value(val: string) {
    if (val !== undefined && val !== null) {
      this.TextAreaControl.setValue(val, { emitEvent: false });
      this.onChange(val);
      this.onTouch(val);
      this.onValidationChange();
    }
  }


  writeValue(obj: string): void {
    this.value = obj;
    // throw new Error('writeValue Method not implemented.');
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
    isDisabled ? this.TextAreaControl.disable() : this.TextAreaControl.enable();
  }

  IsFieldValid() {
    
    if (this._formModeService.FormMode == FormMode.VIEW) {
      this.isControlDisable = true;
    }
    if (this.TextAreaControl.errors) {
      this.ErrorMessage = getErrorMessage(this.TextAreaControl, this.Label, this.AlllowedCharsForMsg, this._ErrorMsg);
      return true;
    }
    return false;
  }

  performLocalizationAndValidation(control: AbstractControl) {
    var validator = ControlFinder(this._appConfig.LocalData, this.Name, this.Component);
    if (this._appConfig.ValidationsData != undefined && Object.keys(this._appConfig.ValidationsData)?.length > 0)
      var moduleValidator = ControlFinder(this._appConfig.ValidationsData, this.Name, this.Component);
    var _Validators: any[] = [];
    if (validator.length > 0) {
      if (validator[0]?.LocalValue)
        this.Label = validator[0]?.LocalValue;
      if (validator[0]?.ErrorMessage)
        this._ErrorMsg = validator[0]?.ErrorMessage;
      if (validator[0]?.isMandatory) {
        this.IsRequiredField = true;
        // control?.setValidators([Validators.required]);
        // this.TextAreaControl.setValidators(control.validator);
        _Validators.push(Validators.required);
      }
      if (validator[0]?.pattern) {
        _Validators.push(Validators.pattern(validator[0]?.pattern));
      }
      if (!validator[0]?.isEnabled)
        this.isControlDisable = true;//control?.disable();
      else if (moduleValidator != undefined && moduleValidator?.length > 0 && !moduleValidator[0]?.isEnabled)
        this.isControlDisable = true;      
    }
    if(this.ApplyRegex!= ''){
      _Validators.push(Validators.pattern("[a-zA-Z0-9., ]*")); //*
    }
    if (_Validators.length > 0) {
      control?.setValidators(_Validators);
      this.TextAreaControl.setValidators(_Validators);
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.Name != '' && this.Name != null && this.Component != '' && this.Component != null)
      this.performLocalizationAndValidation(control);
    return null;
  }

  registerOnValidatorChange?(fn: () => void): void {
    this.onValidationChange = fn;
  }

  public SetTabIndex(): number {
    if (this.isControlDisable)
      return -1;
    else
      return 0;
  }
}
