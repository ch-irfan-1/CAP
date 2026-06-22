import { Directive, HostListener, forwardRef, Input, Output, EventEmitter, HostBinding, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i0 from "@angular/core";
export class InputFileDirective {
    constructor(elementRef, renderer) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.select = new EventEmitter();
        this.onChange = (value) => { };
        this.onTouched = () => { };
    }
    get multiple() {
        if (this._multiple !== undefined &&
            this._multiple !== false &&
            this._multiple !== 'false') {
            return '';
        }
        else {
            return undefined;
        }
    }
    set multiple(value) {
        this._multiple = value;
    }
    /**
     * Callback function that should be called when
     * the control's value changes in the UI.
     */
    callOnChange(event) {
        this.onTouched();
        const files = Array.from(this.elementRef.nativeElement.files);
        const formData = new FormData();
        let formInputName = this.elementRef.nativeElement.name || 'uploadFile';
        if (this.multiple !== undefined &&
            this.multiple !== false &&
            this.multiple !== 'false') {
            formInputName += '[]';
        }
        files.forEach((file) => formData.append(formInputName, file));
        this.onChange(formData);
        this.select.next(files);
        if (this.preserveValue === undefined ||
            this.preserveValue === false ||
            this.preserveValue === 'false') {
            event.target.value = null;
        }
    }
    /**
     * Writes a new value to the element.
     * This method will be called by the forms API to write
     * to the view when programmatic (model -> view) changes are requested.
     *
     * See: [ControlValueAccessor](https://angular.io/api/forms/ControlValueAccessor#members)
     */
    writeValue(fileList) {
        if (fileList && !(fileList instanceof FileList)) {
            throw new TypeError('Value for input[type=file] must be an instance of FileList');
        }
        this.renderer.setProperty(this.elementRef.nativeElement, 'files', fileList);
    }
    /**
     * Registers a callback function that should be called when
     * the control's value changes in the UI.
     *
     * This is called by the forms API on initialization so it can update
     * the form model when values propagate from the view (view -> model).
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }
    /**
     * Registers a callback function that should be called when the control receives a change event.
     * This is called by the forms API on initialization so it can update the form model on change.
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
}
InputFileDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.9", ngImport: i0, type: InputFileDirective, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive });
InputFileDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.9", type: InputFileDirective, selector: "\n  input[type=file][ngModel],\n  input[type=file][formControl],\n  input[type=file][formControlName]", inputs: { multiple: "multiple", preserveValue: "preserveValue" }, outputs: { select: "select" }, host: { listeners: { "change": "callOnChange($event)" }, properties: { "attr.multiple": "this.multiple", "attr.preserveValue": "this.preserveValue" } }, providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputFileDirective),
            multi: true,
        },
    ], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.9", ngImport: i0, type: InputFileDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: `
  input[type=file][ngModel],
  input[type=file][formControl],
  input[type=file][formControlName]`,
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => InputFileDirective),
                            multi: true,
                        },
                    ],
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }]; }, propDecorators: { multiple: [{
                type: HostBinding,
                args: ['attr.multiple']
            }, {
                type: Input
            }], preserveValue: [{
                type: HostBinding,
                args: ['attr.preserveValue']
            }, {
                type: Input
            }], select: [{
                type: Output
            }], callOnChange: [{
                type: HostListener,
                args: ['change', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQtZmlsZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9teS1saWIvc3JjL2xpYi9zcmMvbGliL2lucHV0LWZpbGUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBR1QsWUFBWSxFQUNaLFVBQVUsRUFDVixLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixXQUFXLEdBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDOztBQWV6RSxNQUFNLE9BQU8sa0JBQWtCO0lBeUI3QixZQUFvQixVQUFzQixFQUFVLFFBQW1CO1FBQW5ELGVBQVUsR0FBVixVQUFVLENBQVk7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBSjdELFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQ3RDLGFBQVEsR0FBRyxDQUFDLEtBQWUsRUFBRSxFQUFFLEdBQUUsQ0FBQyxDQUFDO1FBQ25DLGNBQVMsR0FBRyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUM7SUFFNkMsQ0FBQztJQXRCM0UsSUFFSSxRQUFRO1FBQ1YsSUFDRSxJQUFJLENBQUMsU0FBUyxLQUFLLFNBQVM7WUFDNUIsSUFBSSxDQUFDLFNBQVMsS0FBSyxLQUFLO1lBQ3hCLElBQUksQ0FBQyxTQUFTLEtBQUssT0FBTyxFQUMxQjtZQUNBLE9BQU8sRUFBRSxDQUFDO1NBQ1g7YUFBTTtZQUNMLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO0lBQ0gsQ0FBQztJQUVELElBQUksUUFBUSxDQUFDLEtBQW1DO1FBQzlDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQ3pCLENBQUM7SUFRRDs7O09BR0c7SUFFSCxZQUFZLENBQUMsS0FBVTtRQUNyQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDakIsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwRSxNQUFNLFFBQVEsR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO1FBRWhDLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksSUFBSSxZQUFZLENBQUM7UUFDdkUsSUFDRSxJQUFJLENBQUMsUUFBUSxLQUFLLFNBQVM7WUFDM0IsSUFBSSxDQUFDLFFBQVEsS0FBSyxLQUFLO1lBQ3ZCLElBQUksQ0FBQyxRQUFRLEtBQUssT0FBTyxFQUN6QjtZQUNBLGFBQWEsSUFBSSxJQUFJLENBQUM7U0FDdkI7UUFDRCxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRTlELElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEIsSUFDRSxJQUFJLENBQUMsYUFBYSxLQUFLLFNBQVM7WUFDaEMsSUFBSSxDQUFDLGFBQWEsS0FBSyxLQUFLO1lBQzVCLElBQUksQ0FBQyxhQUFhLEtBQUssT0FBTyxFQUM5QjtZQUNBLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztTQUMzQjtJQUNILENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxVQUFVLENBQUMsUUFBa0I7UUFDM0IsSUFBSSxRQUFRLElBQUksQ0FBQyxDQUFDLFFBQVEsWUFBWSxRQUFRLENBQUMsRUFBRTtZQUMvQyxNQUFNLElBQUksU0FBUyxDQUNqQiw0REFBNEQsQ0FDN0QsQ0FBQztTQUNIO1FBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxnQkFBZ0IsQ0FBQyxFQUFjO1FBQzdCLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxpQkFBaUIsQ0FBQyxFQUFjO1FBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0lBQ3RCLENBQUM7OytHQTNGVSxrQkFBa0I7bUdBQWxCLGtCQUFrQiwwWEFSbEI7UUFDVDtZQUNFLE9BQU8sRUFBRSxpQkFBaUI7WUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztZQUNqRCxLQUFLLEVBQUUsSUFBSTtTQUNaO0tBQ0Y7MkZBRVUsa0JBQWtCO2tCQWI5QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRTs7O29DQUd3QjtvQkFDbEMsU0FBUyxFQUFFO3dCQUNUOzRCQUNFLE9BQU8sRUFBRSxpQkFBaUI7NEJBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLG1CQUFtQixDQUFDOzRCQUNqRCxLQUFLLEVBQUUsSUFBSTt5QkFDWjtxQkFDRjtpQkFDRjt5SEFNSyxRQUFRO3NCQUZYLFdBQVc7dUJBQUMsZUFBZTs7c0JBQzNCLEtBQUs7Z0JBZ0JzQyxhQUFhO3NCQUF4RCxXQUFXO3VCQUFDLG9CQUFvQjs7c0JBQUcsS0FBSztnQkFDL0IsTUFBTTtzQkFBZixNQUFNO2dCQVdQLFlBQVk7c0JBRFgsWUFBWTt1QkFBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIFJlbmRlcmVyMixcbiAgSG9zdExpc3RlbmVyLFxuICBmb3J3YXJkUmVmLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RCaW5kaW5nLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgXG4gIGlucHV0W3R5cGU9ZmlsZV1bbmdNb2RlbF0sXG4gIGlucHV0W3R5cGU9ZmlsZV1bZm9ybUNvbnRyb2xdLFxuICBpbnB1dFt0eXBlPWZpbGVdW2Zvcm1Db250cm9sTmFtZV1gLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IElucHV0RmlsZURpcmVjdGl2ZSksXG4gICAgICBtdWx0aTogdHJ1ZSxcbiAgICB9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBJbnB1dEZpbGVEaXJlY3RpdmUgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIHByaXZhdGUgX211bHRpcGxlOiBib29sZWFuIHwgc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gIEBIb3N0QmluZGluZygnYXR0ci5tdWx0aXBsZScpXG4gIEBJbnB1dCgpXG4gIGdldCBtdWx0aXBsZSgpOiBib29sZWFuIHwgc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLl9tdWx0aXBsZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICB0aGlzLl9tdWx0aXBsZSAhPT0gZmFsc2UgJiZcbiAgICAgIHRoaXMuX211bHRpcGxlICE9PSAnZmFsc2UnXG4gICAgKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgc2V0IG11bHRpcGxlKHZhbHVlOiBib29sZWFuIHwgc3RyaW5nIHwgdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5fbXVsdGlwbGUgPSB2YWx1ZTtcbiAgfVxuICBASG9zdEJpbmRpbmcoJ2F0dHIucHJlc2VydmVWYWx1ZScpIEBJbnB1dCgpIHByZXNlcnZlVmFsdWU6IGJvb2xlYW4gfCBzdHJpbmc7XG4gIEBPdXRwdXQoKSBzZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyPEZpbGVbXT4oKTtcbiAgcHJpdmF0ZSBvbkNoYW5nZSA9ICh2YWx1ZTogRm9ybURhdGEpID0+IHt9O1xuICBwcml2YXRlIG9uVG91Y2hlZCA9ICgpID0+IHt9O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7fVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmdW5jdGlvbiB0aGF0IHNob3VsZCBiZSBjYWxsZWQgd2hlblxuICAgKiB0aGUgY29udHJvbCdzIHZhbHVlIGNoYW5nZXMgaW4gdGhlIFVJLlxuICAgKi9cbiAgQEhvc3RMaXN0ZW5lcignY2hhbmdlJywgWyckZXZlbnQnXSlcbiAgY2FsbE9uQ2hhbmdlKGV2ZW50OiBhbnkpIHtcbiAgICB0aGlzLm9uVG91Y2hlZCgpO1xuICAgIGNvbnN0IGZpbGVzID0gQXJyYXkuZnJvbTxGaWxlPih0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5maWxlcyk7XG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblxuICAgIGxldCBmb3JtSW5wdXROYW1lID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQubmFtZSB8fCAndXBsb2FkRmlsZSc7XG4gICAgaWYgKFxuICAgICAgdGhpcy5tdWx0aXBsZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICB0aGlzLm11bHRpcGxlICE9PSBmYWxzZSAmJlxuICAgICAgdGhpcy5tdWx0aXBsZSAhPT0gJ2ZhbHNlJ1xuICAgICkge1xuICAgICAgZm9ybUlucHV0TmFtZSArPSAnW10nO1xuICAgIH1cbiAgICBmaWxlcy5mb3JFYWNoKChmaWxlKSA9PiBmb3JtRGF0YS5hcHBlbmQoZm9ybUlucHV0TmFtZSwgZmlsZSkpO1xuXG4gICAgdGhpcy5vbkNoYW5nZShmb3JtRGF0YSk7XG4gICAgdGhpcy5zZWxlY3QubmV4dChmaWxlcyk7XG4gICAgaWYgKFxuICAgICAgdGhpcy5wcmVzZXJ2ZVZhbHVlID09PSB1bmRlZmluZWQgfHxcbiAgICAgIHRoaXMucHJlc2VydmVWYWx1ZSA9PT0gZmFsc2UgfHxcbiAgICAgIHRoaXMucHJlc2VydmVWYWx1ZSA9PT0gJ2ZhbHNlJ1xuICAgICkge1xuICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogV3JpdGVzIGEgbmV3IHZhbHVlIHRvIHRoZSBlbGVtZW50LlxuICAgKiBUaGlzIG1ldGhvZCB3aWxsIGJlIGNhbGxlZCBieSB0aGUgZm9ybXMgQVBJIHRvIHdyaXRlXG4gICAqIHRvIHRoZSB2aWV3IHdoZW4gcHJvZ3JhbW1hdGljIChtb2RlbCAtPiB2aWV3KSBjaGFuZ2VzIGFyZSByZXF1ZXN0ZWQuXG4gICAqXG4gICAqIFNlZTogW0NvbnRyb2xWYWx1ZUFjY2Vzc29yXShodHRwczovL2FuZ3VsYXIuaW8vYXBpL2Zvcm1zL0NvbnRyb2xWYWx1ZUFjY2Vzc29yI21lbWJlcnMpXG4gICAqL1xuICB3cml0ZVZhbHVlKGZpbGVMaXN0OiBGaWxlTGlzdCk6IHZvaWQge1xuICAgIGlmIChmaWxlTGlzdCAmJiAhKGZpbGVMaXN0IGluc3RhbmNlb2YgRmlsZUxpc3QpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAnVmFsdWUgZm9yIGlucHV0W3R5cGU9ZmlsZV0gbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiBGaWxlTGlzdCdcbiAgICAgICk7XG4gICAgfVxuICAgIHRoaXMucmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdmaWxlcycsIGZpbGVMaXN0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IHNob3VsZCBiZSBjYWxsZWQgd2hlblxuICAgKiB0aGUgY29udHJvbCdzIHZhbHVlIGNoYW5nZXMgaW4gdGhlIFVJLlxuICAgKlxuICAgKiBUaGlzIGlzIGNhbGxlZCBieSB0aGUgZm9ybXMgQVBJIG9uIGluaXRpYWxpemF0aW9uIHNvIGl0IGNhbiB1cGRhdGVcbiAgICogdGhlIGZvcm0gbW9kZWwgd2hlbiB2YWx1ZXMgcHJvcGFnYXRlIGZyb20gdGhlIHZpZXcgKHZpZXcgLT4gbW9kZWwpLlxuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IHNob3VsZCBiZSBjYWxsZWQgd2hlbiB0aGUgY29udHJvbCByZWNlaXZlcyBhIGNoYW5nZSBldmVudC5cbiAgICogVGhpcyBpcyBjYWxsZWQgYnkgdGhlIGZvcm1zIEFQSSBvbiBpbml0aWFsaXphdGlvbiBzbyBpdCBjYW4gdXBkYXRlIHRoZSBmb3JtIG1vZGVsIG9uIGNoYW5nZS5cbiAgICovXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5vblRvdWNoZWQgPSBmbjtcbiAgfVxufVxuIl19