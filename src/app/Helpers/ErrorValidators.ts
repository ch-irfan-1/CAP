import { AbstractControl } from "@angular/forms";
import { IFormGroupControls } from "@NFS_Interfaces/OtherInterfaces/IFormGroupControls.interface";
import { IValidationErrors } from "@NFS_Interfaces/OtherInterfaces/IValidationErrors.interface";
import { FormGroup, ValidationErrors } from "src/Library";

function isFormGroup(control: AbstractControl): control is FormGroup {
  return !!(<FormGroup>control).controls;
}

export function getFormValidationErrors(controls: IFormGroupControls): IValidationErrors[] {
  let errors: IValidationErrors[] = [];
  Object.keys(controls).forEach(key => {
    const control = controls[key];
    if (isFormGroup(control)) {
      errors = errors.concat(getFormValidationErrors(control.controls));
    }
    const controlErrors: ValidationErrors = controls[key].errors;
    if (controlErrors !== null && controlErrors !== undefined) {
      Object.keys(controlErrors).forEach(keyError => {
        errors.push({
          control_name: key,
          error_name: keyError,
          error_value: controlErrors[keyError]
        });
      });
    }
  });
  return errors;
}