import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, UntypedFormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { getErrorMessage } from '../nfs-control-helper/GetErrorMessage';
import { ControlFinder } from '../nfs-control-helper/Localization';

@Component({
    selector: 'nfs-checkbox',
    templateUrl: './nfs-checkbox.component.html',
    styleUrls: ['./nfs-checkbox.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NFSCheckboxComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => NFSCheckboxComponent),
            multi: true,
        },
    ],
    standalone: false
})
export class NFSCheckboxComponent implements OnInit, ControlValueAccessor, ValidationErrors, Validator {

  @Input() AlllowedCharsForMsg: string = ""
  @Input() Label: string = "";
  @Input() Name: string = '';
  @Input() Component: string = '';
  @Input() IsMandatory: boolean = false;
  @Input() isControlDisable: boolean = false;
   /************************** Start DatePicker @Output *************************/
   @Output() Change = new EventEmitter;
   /************************** END Start DatePicker @Output *************************/

  public CheckboxControl: UntypedFormControl = new UntypedFormControl();
  public IsRequiredField: boolean = false;
  public ErrorMessage: string = "";
  public LocalJson: any;
  public ValidationsJson: any;
  public controlName!: string;
  public ErrorMsg: string[] = [];
  


  onChange: any = () => { }
  onTouch: any = () => { }
  onValidationChange: any = () => { }

  constructor(private _store: ClientStoreService, private router: Router, private _appConfig: AppConfigService, private _formModeService: FormModeService) {
  }

  ngOnInit(): void {

    if (this._formModeService.FormMode == FormMode.VIEW) {
      this.isControlDisable = true;
    }

    this.CheckboxControl.valueChanges.subscribe((newValue) => {
      this.value = newValue;;
    });
  }

  set value(val: string) {
    if (val !== undefined && val !== null) {
      this.CheckboxControl.setValue(val, { emitEvent: false });
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

  registerOnValidatorChange?(fn: () => void): void {
    this.onValidationChange = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled = this.isControlDisable;
    isDisabled ? this.CheckboxControl.disable() : this.CheckboxControl.enable();
  }

  IsFieldValid() {
    
    if (this._formModeService.FormMode == FormMode.VIEW) {
      this.isControlDisable = true;
    }
    
    if (this.CheckboxControl.errors) {
      this.ErrorMessage = getErrorMessage(this.CheckboxControl, this.Label, this.AlllowedCharsForMsg, this.ErrorMsg);
      return true;
    }
    return false;
  }

  onClick($event: Event) {

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
        //control?.setValidators([Validators.required]);
        _Validators.push(Validators.required);
        //this.TextBoxControl.setValidators(control.validator);
      }
      if (UMSValidator[0]?.pattern) {
        //control?.setValidators([Validators.pattern(validator[0]?.pattern)]);
        _Validators.push(Validators.pattern(UMSValidator[0]?.pattern));
        //this.TextBoxControl.setValidators(control.validator);
      }
      if (!UMSValidator[0]?.isEnabled)
        this.isControlDisable = true;//this.CheckboxControl?.disable();
      else if (moduleValidator != undefined && moduleValidator?.length > 0 && !moduleValidator[0]?.isEnabled)
        this.isControlDisable = true;//this.CheckboxControl?.disable();
    }
    else if (this.IsMandatory) {
      _Validators.push(Validators.required);
      //this.TextBoxControl.setValidators([Validators.required]);
    }

    if (_Validators.length > 0) {
      control?.setValidators(_Validators);
      this.CheckboxControl.setValidators(_Validators);
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {

    if (this.Name != '' && this.Name != null && this.Component != '' && this.Component != null)
      this.performLocalizationAndValidation(control);
    // if (this.value) {
    //   let isIncorrectCard: boolean = this.value.length !== 5;
    //   return isIncorrectCard ? { invalidInput: isIncorrectCard } : null;
    // }
    // if (control.validator) {
    //   const validator = control.validator({} as AbstractControl);
    //   if (validator && validator.required) {
    //     return { required: true };
    //   }
    // }
    return null;
  }
  onDateChange() {
    this.Change.emit(this.CheckboxControl.value);
  }

}
