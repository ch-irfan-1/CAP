import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { ApplicationTypeService } from '@NFS_Core/NFSServices/_helper/application-type.service';

@Directive({
    selector: '[IsControlVisible]',
    standalone: false
})
export class IsControlVisibleDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private appTypeService: ApplicationTypeService
  ) {}

  @Input() set IsControlVisible(controlName: any) {
    if (this.appTypeService.isControlVisible(controlName)) {
      // Add template to DOM
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      // Remove template from DOM
      this.viewContainer.clear();
    }
  }
}
