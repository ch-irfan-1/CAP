import { AbstractControl } from '@angular/forms';

export const getErrorMessage = (abstractControl: AbstractControl, Label?: string, AlllowedCharacters?: string, ErrorMsg: string[] = []): string => {
    if (!abstractControl) {
        return "Invalid control.";
    }

    if (abstractControl.validator) {

        if (abstractControl.errors) {

            if (abstractControl.errors.required)
                return Label?.replace("*", "").trim() + " is required";
            else if (abstractControl.errors.minlength)
                return Label?.replace("*", "").trim() + " should have atleast " + abstractControl.errors.minlength.requiredLength + " characters";
            else if (abstractControl.errors.maxlength)
                return Label?.replace("*", "").trim() + " can have only " + abstractControl.errors.maxlength.requiredLength + " characters";
            else if ((abstractControl.errors.pattern && ErrorMsg.length === 0) || abstractControl.errors.matDatepickerParse || abstractControl.errors.matDatepickerMax || abstractControl.errors.matDatepickerMin)
                return Label?.replace("*", "").trim() + " is invalid";
            else if (abstractControl.errors.pattern && ErrorMsg.length > 0)
                return ErrorMsg.join(', ');
        }
    }

    return "";
};