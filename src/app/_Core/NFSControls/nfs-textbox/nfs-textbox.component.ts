import { Component, EventEmitter, forwardRef, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, ControlValueAccessor, UntypedFormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { getErrorMessage } from '../nfs-control-helper/GetErrorMessage';
import { ControlFinder } from '../nfs-control-helper/Localization';


@Component({
    selector: 'nfs-textbox',
    templateUrl: './nfs-textbox.component.html',
    styleUrls: ['./nfs-textbox.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NFSTextboxComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => NFSTextboxComponent),
            multi: true,
        },
    ],
    standalone: false
})
export class NFSTextboxComponent implements OnInit, ControlValueAccessor, Validator {

  /********* Start Inputs Properties ***********/
  @Input() Placeholder: string = "";
  @Input() Label: string = "";
  @Input() autocomplete: string = "off";
  @Input() AlllowedCharsForMsg: string = "" //string for allowed charcters list only for display in error message e.g "Alphanumber dot and dash"
  @Input() Type: "text" | "password" | "number" | "email" = "text";
  @Input() Name: string = '';
  @Input() Component: string = '';
  @Input() Index: number = 0;
  @Output() InputText = new EventEmitter;
  @Output() Change = new EventEmitter;
  @Output() OnKeyPress = new EventEmitter;
  @Input() maxLength: number = 999;
  @Input() IsMandatory: boolean = false;
  @Input() isControlDisable: boolean = false;
  @Input() ApplyDefaultRegex: boolean = true;
  @Input() blockSpaces: boolean = false;

  /****** Not Required fields for input element these should be handeled through reactive forms validations. ******/
  // @Input() maxlength: number = 524288; //Default Input element length;
  // @Input() minLength: number = 0;
  // @Input() AllowedCharsRegEx: string | RegExp = "";

  /********* End Inputs ***********/

  public TextBoxControl: UntypedFormControl = new UntypedFormControl('', { updateOn: 'blur' });
  public IsRequiredField: boolean = false;
  public ErrorMessage: string = "";
  public LocalJson: any;
  public ValidationsJson: any;
  public controlName!: string;
  public ErrorMsg: string[] = [];

  onChange: any = () => { }
  onTouch: any = () => { }
  onValidationChange: any = () => { }

  constructor(private _appConfig: AppConfigService,
    private _formModeService: FormModeService,
    private _msgService: MessageService) {

  }

  /**
   * On init life cycle hook
   */
  ngOnInit(): void {

    if (this._formModeService.FormMode == FormMode.VIEW) {
      this.isControlDisable = true;
    }

    this.TextBoxControl.valueChanges.subscribe((newValue) => {

      if (String(newValue)?.trim())
        this.value = newValue;
      else
        this.value = '';
    });

  }




  /**
 * Setter for drop down value
 */
  set value(val: string) {
    if (val === undefined || val === null) {
      val = '';
    }

    this.TextBoxControl.setValue(val, { emitEvent: false });
    this.onChange(val);
    this.onTouch(val);
    this.onValidationChange();
  }

  get tooltipValue() {
    return this.TextBoxControl.value;
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
    isDisabled ? this.TextBoxControl.disable() : this.TextBoxControl.enable();
  }

  IsFieldValid() {

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
    if (this.TextBoxControl.errors) {
      this.ErrorMessage = getErrorMessage(this.TextBoxControl, this.Label, this.AlllowedCharsForMsg, this.ErrorMsg);
      if (this._msgService.ErrorMessages.get(key) == undefined) {
        this._msgService.ErrorMessages.set(key, this._msgService.CreateControlCustomMessage(this.ErrorMessage, this.Component));
      }
      return true;
    }
    this._msgService.ErrorMessages.delete(key);
    return false;
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
      else if (this.ApplyDefaultRegex) {
        _Validators.push(Validators.pattern("[a-zA-Z0-9 \\[\\]/’;`@+(){}|?!\$%<=>\^#:*&_,.'-\\\\]*"));
      }
      if (this.isControlDisable != true) {
        if (!UMSValidator[0]?.isEnabled)
          this.isControlDisable = true;//control?.disable();
        else if (moduleValidator != undefined && moduleValidator?.length > 0 && !moduleValidator[0]?.isEnabled)
          this.isControlDisable = true;//control?.disable();
      }
    }
    else if (this.IsMandatory) {
      _Validators.push(Validators.required);
      //this.TextBoxControl.setValidators([Validators.required]);
    }

    if (_Validators.length > 0) {
      control?.setValidators(_Validators);
      this.TextBoxControl.setValidators(_Validators);
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

  registerOnValidatorChange?(fn: () => void): void {
    this.onValidationChange = fn;
  }

  applyFilter(): void {
    this.InputText.emit(this.TextBoxControl.value);
  }

  public onValueChanged(ev: any) {
    this.Change.emit(ev?.target?.value);
  }

  public onPasteEvent(event: ClipboardEvent) {
  const pasteData = event.clipboardData?.getData('text') ?? '';
  
  if (this.blockSpaces) {
    event.preventDefault(); // Block default paste behavior

    const trimmed = pasteData.trim(); // Trim only start & end

    const input = event.target as HTMLInputElement;
    input.value = trimmed;
    this.TextBoxControl.setValue(trimmed);
  }
}
public onBlurEvent(event: any) {
  if (this.blockSpaces) {
    const input = event.target as HTMLInputElement;
    const trimmed = input.value.trim();

    input.value = trimmed;
    this.TextBoxControl.setValue(trimmed);
  }
}

  public onKeypressEvent(event: any) {
    var x = event?.code;
    if (x === "Enter" || x === "NumpadEnter") {
      this.value = event?.target?.value;
      this.OnKeyPress.emit();
    }
  }

  // public restrictSpecialCharacters(event: any){
  //   var key;
  //   key = event.charCode;  //         key = event.keyCode;  (Both can be used)
  //   return ((key > 47 && key < 58) || key == 45 || key == 46 || (key >= 97 && key<= 122) || (key >= 65 && key <= 90));
  // }

  public onTabPress(event: any) {
    if (event?.key == 'Tab' || event?.code == 'Tab') {
      //event.preventDefault();
    }
  }

  public SetTabIndex(): number {

    if (this.isControlDisable)
      return -1;
    else
      return 0;
  }

}
