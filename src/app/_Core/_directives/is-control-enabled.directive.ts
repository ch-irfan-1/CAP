import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { ApplicationTypeService } from '@NFS_Core/NFSServices/_helper/application-type.service';

@Directive({
    selector: '[isControlEnabled]',
    standalone: false
})
export class IsControlEnabledDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private appTypeService: ApplicationTypeService
  ) {}

  @Input() set isControlEnabled(controlName: any) {
    if (this.appTypeService.isControlEnabled(controlName)) {
      // Add template to DOM
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      // Remove template from DOM
      this.viewContainer.clear();
    }
  }
}
