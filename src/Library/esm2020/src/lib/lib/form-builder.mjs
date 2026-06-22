import { Injectable } from '@angular/core';
import { UntypedFormBuilder as NativeFormBuilder } from '@angular/forms';
import * as i0 from "@angular/core";
export class FormBuilder extends NativeFormBuilder {
    /**
     * Construct a new `FormGroup` instance.
     *
     * @param controlsConfig A collection of child controls. The key for each child is the name
     * under which it is registered.
     *
     * @param options Configuration options object for the `FormGroup`. The object can
     * have two shapes:
     *
     * 1) `AbstractControlOptions` object (preferred), which consists of:
     * - `validators`: A synchronous validator function, or an array of validator functions
     * - `asyncValidators`: A single async validator or array of async validator functions
     * - `updateOn`: The event upon which the control should be updated (options: 'change' | 'blur' |
     * submit')
     *
     * 2) Legacy configuration object, which consists of:
     * - `validator`: A synchronous validator function, or an array of validator functions
     * - `asyncValidator`: A single async validator or array of async validator functions
     */
    group(controlsConfig, options = null) {
        return super.group(controlsConfig, options);
    }
    /**
     * @description
     * Construct a new `FormControl` with the given state, validators and options.
     *
     * @param formState Initializes the control with an initial state value, or
     * with an object that contains both a value and a disabled status.
     *
     * @param validatorOrOpts A synchronous validator function, or an array of
     * such functions, or an `AbstractControlOptions` object that contains
     * validation functions and a validation trigger.
     *
     * @param asyncValidator A single async validator or array of async validator
     * functions.
     *
     * ### Initialize a control as disabled
     *
     * The following example returns a control with an initial value in a disabled state.
  ```ts
  import {Component, Inject} from '@angular/core';
  import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
  // ...
  @Component({
    selector: 'app-disabled-form-control',
    template: `
      <input [formControl]="control" placeholder="First">
    `
  })
  export class DisabledFormControlComponent {
    control: FormControl;
  
    constructor(private fb: FormBuilder) {
      this.control = fb.control({value: 'my val', disabled: true});
    }
  }
  ```
     */
    control(formState = null, validatorOrOpts, asyncValidator) {
        return super.control(formState, validatorOrOpts, asyncValidator);
    }
    /**
     * Constructs a new `FormArray` from the given array of configurations,
     * validators and options.
     *
     * @param controlsConfig An array of child controls or control configs. Each
     * child control is given an index when it is registered.
     *
     * @param validatorOrOpts A synchronous validator function, or an array of
     * such functions, or an `AbstractControlOptions` object that contains
     * validation functions and a validation trigger.
     *
     * @param asyncValidator A single async validator or array of async validator
     * functions.
     */
    array(controlsConfig, validatorOrOpts, asyncValidator) {
        return super.array(controlsConfig, validatorOrOpts, asyncValidator);
    }
}
FormBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.9", ngImport: i0, type: FormBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
FormBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.9", ngImport: i0, type: FormBuilder });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.9", ngImport: i0, type: FormBuilder, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1idWlsZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbXktbGliL3NyYy9saWIvc3JjL2xpYi9mb3JtLWJ1aWxkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsa0JBQWtCLElBQUksaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7QUFlekUsTUFBTSxPQUFPLFdBQVksU0FBUSxpQkFBaUI7SUFDaEQ7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQWtCRztJQUNNLEtBQUssQ0FDWixjQUE0RCxFQUM1RCxVQUF5QyxJQUFJO1FBRTdDLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFvQixDQUFDO0lBQ2pFLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FtQ0c7SUFDTSxPQUFPLENBQ2QsWUFBaUMsSUFBSSxFQUNyQyxlQUlRLEVBQ1IsY0FBNkQ7UUFFN0QsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUNsQixTQUFTLEVBQ1QsZUFBZSxFQUNmLGNBQWMsQ0FDTSxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7OztPQWFHO0lBQ00sS0FBSyxDQUNaLGNBQTBDLEVBQzFDLGVBSVEsRUFDUixjQUE2RDtRQUU3RCxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQ2hCLGNBQWMsRUFDZCxlQUFlLEVBQ2YsY0FBYyxDQUNPLENBQUM7SUFDMUIsQ0FBQzs7d0dBM0dVLFdBQVc7NEdBQVgsV0FBVzsyRkFBWCxXQUFXO2tCQUR2QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVW50eXBlZEZvcm1CdWlsZGVyIGFzIE5hdGl2ZUZvcm1CdWlsZGVyIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQge1xuICBGYkNvbnRyb2xDb25maWcsXG4gIEFic3RyYWN0Q29udHJvbE9wdGlvbnMsXG4gIFZhbGlkYXRvckZuLFxuICBBc3luY1ZhbGlkYXRvckZuLFxuICBWYWxpZGF0b3JzTW9kZWwsXG4gIEZvcm1Db250cm9sU3RhdGUsXG59IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgRm9ybUdyb3VwIH0gZnJvbSAnLi9mb3JtLWdyb3VwJztcbmltcG9ydCB7IEZvcm1Db250cm9sIH0gZnJvbSAnLi9mb3JtLWNvbnRyb2wnO1xuaW1wb3J0IHsgRm9ybUFycmF5IH0gZnJvbSAnLi9mb3JtLWFycmF5JztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEZvcm1CdWlsZGVyIGV4dGVuZHMgTmF0aXZlRm9ybUJ1aWxkZXIge1xuICAvKipcbiAgICogQ29uc3RydWN0IGEgbmV3IGBGb3JtR3JvdXBgIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0gY29udHJvbHNDb25maWcgQSBjb2xsZWN0aW9uIG9mIGNoaWxkIGNvbnRyb2xzLiBUaGUga2V5IGZvciBlYWNoIGNoaWxkIGlzIHRoZSBuYW1lXG4gICAqIHVuZGVyIHdoaWNoIGl0IGlzIHJlZ2lzdGVyZWQuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb3B0aW9ucyBvYmplY3QgZm9yIHRoZSBgRm9ybUdyb3VwYC4gVGhlIG9iamVjdCBjYW5cbiAgICogaGF2ZSB0d28gc2hhcGVzOlxuICAgKlxuICAgKiAxKSBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2Agb2JqZWN0IChwcmVmZXJyZWQpLCB3aGljaCBjb25zaXN0cyBvZjpcbiAgICogLSBgdmFsaWRhdG9yc2A6IEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZiB2YWxpZGF0b3IgZnVuY3Rpb25zXG4gICAqIC0gYGFzeW5jVmFsaWRhdG9yc2A6IEEgc2luZ2xlIGFzeW5jIHZhbGlkYXRvciBvciBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3IgZnVuY3Rpb25zXG4gICAqIC0gYHVwZGF0ZU9uYDogVGhlIGV2ZW50IHVwb24gd2hpY2ggdGhlIGNvbnRyb2wgc2hvdWxkIGJlIHVwZGF0ZWQgKG9wdGlvbnM6ICdjaGFuZ2UnIHwgJ2JsdXInIHxcbiAgICogc3VibWl0JylcbiAgICpcbiAgICogMikgTGVnYWN5IGNvbmZpZ3VyYXRpb24gb2JqZWN0LCB3aGljaCBjb25zaXN0cyBvZjpcbiAgICogLSBgdmFsaWRhdG9yYDogQSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24sIG9yIGFuIGFycmF5IG9mIHZhbGlkYXRvciBmdW5jdGlvbnNcbiAgICogLSBgYXN5bmNWYWxpZGF0b3JgOiBBIHNpbmdsZSBhc3luYyB2YWxpZGF0b3Igb3IgYXJyYXkgb2YgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9uc1xuICAgKi9cbiAgb3ZlcnJpZGUgZ3JvdXA8VCBleHRlbmRzIG9iamVjdCA9IGFueSwgViBleHRlbmRzIG9iamVjdCA9IFZhbGlkYXRvcnNNb2RlbD4oXG4gICAgY29udHJvbHNDb25maWc6IHsgW1AgaW4ga2V5b2YgVF06IEZiQ29udHJvbENvbmZpZzxUW1BdLCBWPiB9LFxuICAgIG9wdGlvbnM6IEFic3RyYWN0Q29udHJvbE9wdGlvbnMgfCBudWxsID0gbnVsbFxuICApOiBGb3JtR3JvdXA8VCwgVj4ge1xuICAgIHJldHVybiBzdXBlci5ncm91cChjb250cm9sc0NvbmZpZywgb3B0aW9ucykgYXMgRm9ybUdyb3VwPFQsIFY+O1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDb25zdHJ1Y3QgYSBuZXcgYEZvcm1Db250cm9sYCB3aXRoIHRoZSBnaXZlbiBzdGF0ZSwgdmFsaWRhdG9ycyBhbmQgb3B0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIGZvcm1TdGF0ZSBJbml0aWFsaXplcyB0aGUgY29udHJvbCB3aXRoIGFuIGluaXRpYWwgc3RhdGUgdmFsdWUsIG9yXG4gICAqIHdpdGggYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgYm90aCBhIHZhbHVlIGFuZCBhIGRpc2FibGVkIHN0YXR1cy5cbiAgICpcbiAgICogQHBhcmFtIHZhbGlkYXRvck9yT3B0cyBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2ZcbiAgICogc3VjaCBmdW5jdGlvbnMsIG9yIGFuIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYCBvYmplY3QgdGhhdCBjb250YWluc1xuICAgKiB2YWxpZGF0aW9uIGZ1bmN0aW9ucyBhbmQgYSB2YWxpZGF0aW9uIHRyaWdnZXIuXG4gICAqXG4gICAqIEBwYXJhbSBhc3luY1ZhbGlkYXRvciBBIHNpbmdsZSBhc3luYyB2YWxpZGF0b3Igb3IgYXJyYXkgb2YgYXN5bmMgdmFsaWRhdG9yXG4gICAqIGZ1bmN0aW9ucy5cbiAgICpcbiAgICogIyMjIEluaXRpYWxpemUgYSBjb250cm9sIGFzIGRpc2FibGVkXG4gICAqXG4gICAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSByZXR1cm5zIGEgY29udHJvbCB3aXRoIGFuIGluaXRpYWwgdmFsdWUgaW4gYSBkaXNhYmxlZCBzdGF0ZS5cbmBgYHRzXG5pbXBvcnQge0NvbXBvbmVudCwgSW5qZWN0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Rm9ybUJ1aWxkZXIsIEZvcm1Db250cm9sLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnN9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbi8vIC4uLlxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLWRpc2FibGVkLWZvcm0tY29udHJvbCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGlucHV0IFtmb3JtQ29udHJvbF09XCJjb250cm9sXCIgcGxhY2Vob2xkZXI9XCJGaXJzdFwiPlxuICBgXG59KVxuZXhwb3J0IGNsYXNzIERpc2FibGVkRm9ybUNvbnRyb2xDb21wb25lbnQge1xuICBjb250cm9sOiBGb3JtQ29udHJvbDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGZiOiBGb3JtQnVpbGRlcikge1xuICAgIHRoaXMuY29udHJvbCA9IGZiLmNvbnRyb2woe3ZhbHVlOiAnbXkgdmFsJywgZGlzYWJsZWQ6IHRydWV9KTtcbiAgfVxufVxuYGBgXG4gICAqL1xuICBvdmVycmlkZSBjb250cm9sPFQgPSBhbnksIFYgZXh0ZW5kcyBvYmplY3QgPSBWYWxpZGF0b3JzTW9kZWw+KFxuICAgIGZvcm1TdGF0ZTogRm9ybUNvbnRyb2xTdGF0ZTxUPiA9IG51bGwsXG4gICAgdmFsaWRhdG9yT3JPcHRzPzpcbiAgICAgIHwgVmFsaWRhdG9yRm5cbiAgICAgIHwgVmFsaWRhdG9yRm5bXVxuICAgICAgfCBBYnN0cmFjdENvbnRyb2xPcHRpb25zXG4gICAgICB8IG51bGwsXG4gICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZuIHwgQXN5bmNWYWxpZGF0b3JGbltdIHwgbnVsbFxuICApOiBGb3JtQ29udHJvbDxULCBWPiB7XG4gICAgcmV0dXJuIHN1cGVyLmNvbnRyb2woXG4gICAgICBmb3JtU3RhdGUsXG4gICAgICB2YWxpZGF0b3JPck9wdHMsXG4gICAgICBhc3luY1ZhbGlkYXRvclxuICAgICkgYXMgRm9ybUNvbnRyb2w8VCwgVj47XG4gIH1cblxuICAvKipcbiAgICogQ29uc3RydWN0cyBhIG5ldyBgRm9ybUFycmF5YCBmcm9tIHRoZSBnaXZlbiBhcnJheSBvZiBjb25maWd1cmF0aW9ucyxcbiAgICogdmFsaWRhdG9ycyBhbmQgb3B0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIGNvbnRyb2xzQ29uZmlnIEFuIGFycmF5IG9mIGNoaWxkIGNvbnRyb2xzIG9yIGNvbnRyb2wgY29uZmlncy4gRWFjaFxuICAgKiBjaGlsZCBjb250cm9sIGlzIGdpdmVuIGFuIGluZGV4IHdoZW4gaXQgaXMgcmVnaXN0ZXJlZC5cbiAgICpcbiAgICogQHBhcmFtIHZhbGlkYXRvck9yT3B0cyBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2ZcbiAgICogc3VjaCBmdW5jdGlvbnMsIG9yIGFuIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYCBvYmplY3QgdGhhdCBjb250YWluc1xuICAgKiB2YWxpZGF0aW9uIGZ1bmN0aW9ucyBhbmQgYSB2YWxpZGF0aW9uIHRyaWdnZXIuXG4gICAqXG4gICAqIEBwYXJhbSBhc3luY1ZhbGlkYXRvciBBIHNpbmdsZSBhc3luYyB2YWxpZGF0b3Igb3IgYXJyYXkgb2YgYXN5bmMgdmFsaWRhdG9yXG4gICAqIGZ1bmN0aW9ucy5cbiAgICovXG4gIG92ZXJyaWRlIGFycmF5PEl0ZW0gPSBhbnksIFYgZXh0ZW5kcyBvYmplY3QgPSBWYWxpZGF0b3JzTW9kZWw+KFxuICAgIGNvbnRyb2xzQ29uZmlnOiBGYkNvbnRyb2xDb25maWc8SXRlbSwgVj5bXSxcbiAgICB2YWxpZGF0b3JPck9wdHM/OlxuICAgICAgfCBWYWxpZGF0b3JGblxuICAgICAgfCBWYWxpZGF0b3JGbltdXG4gICAgICB8IEFic3RyYWN0Q29udHJvbE9wdGlvbnNcbiAgICAgIHwgbnVsbCxcbiAgICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm4gfCBBc3luY1ZhbGlkYXRvckZuW10gfCBudWxsXG4gICk6IEZvcm1BcnJheTxJdGVtLCBWPiB7XG4gICAgcmV0dXJuIHN1cGVyLmFycmF5KFxuICAgICAgY29udHJvbHNDb25maWcsXG4gICAgICB2YWxpZGF0b3JPck9wdHMsXG4gICAgICBhc3luY1ZhbGlkYXRvclxuICAgICkgYXMgRm9ybUFycmF5PEl0ZW0sIFY+O1xuICB9XG59XG4iXX0=