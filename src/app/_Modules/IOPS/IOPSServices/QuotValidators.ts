import { analyzeAndValidateNgModules } from "@angular/compiler";
import { AbstractControl } from "@angular/forms";
import { IQuotEntity } from "@NFS_Entity/Quot-Entity/QuotEntity.model";
import { FormControl, FormGroup } from "src/Library";

export const SetValidator = (Quot: AbstractControl | null, data: any): any => {
  // let ApplicantKeys = Object.keys(Quot.controls.QuotApplicants.controls[0].controls.QuotApplicantInfo.controls);
  // ApplicantKeys.forEach(key => {
  //     console.log(Quot.controls.QuotApplicants.controls[0].controls.QuotApplicantInfo.get(key));

  // });
  // let AddressKeys = Object.keys(Quot.controls.QuotApplicants.controls[0].controls.ApplicantAddress.controls);

  // for (const k in Quot.controls.QuotApplicants.controls[0].controls.ApplicantAddress.controls) {
  //   //console.log(Quot.controls.QuotApplicants.controls[0].controls.ApplicantAddress.controls[k]);
  //   if(Quot.controls.QuotApplicants.controls[0].controls.ApplicantAddress.controls[k].controls) {
  //     for (const j in Quot.controls.QuotApplicants.controls[0].controls.ApplicantAddress.controls[k].controls) {
  //         console.log(Quot.controls.QuotApplicants.controls[0].controls.ApplicantAddress.controls[k]);
  //       }
  //   }

  // }
  // return '';
  // ;
  if (Quot instanceof FormControl) {
    // Return FormControl errors or null
    return Quot.valid ?? true;
  }
  if (Quot instanceof FormGroup) {
    const groupErrors = Quot.errors;
    // Form group can contain errors itself, in that case add'em
    const formErrors = groupErrors ? { groupErrors } : {};
    var errors: string[] = new Array(4)
    Object.keys(Quot.controls).forEach(key => {
      // Recursive call of the FormGroup fields
      const error = SetValidator(Quot.get(key), data);
      if (error !== null) {
        // Only add error if not null
        errors.push(error);
      }
    });
    // Return FormGroup errors or null
    return Object.keys(formErrors).length > 0 ? formErrors : null;
  }
}