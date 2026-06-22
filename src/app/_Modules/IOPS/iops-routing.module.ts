import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreventUnsavedChangesGuard } from '@NFS_Core/_guards/prevent-unsaved-changes.guard';

import { IOPSMainComponent } from './Components/iopsmain/iopsmain.component';
import { ApplicationTypeComponent } from './Components/application-type/application-type.component';


const routes: Routes = [
  {
    path: 'createLead',
    component: IOPSMainComponent,
    canDeactivate: [PreventUnsavedChangesGuard],
  },
  { path: 'applicantType', component: ApplicationTypeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IOPSRoutingModule { }