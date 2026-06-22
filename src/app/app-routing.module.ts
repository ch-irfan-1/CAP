import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@NFS_Core/NFSServices/Authentication/auth.guard';
import { CreateLeadGuard } from '@NFS_Core/_guards/create-lead.guard';
import { LoginGuard } from '@NFS_Core/_guards/login.guard';
import { ProposalUnsavedChangesGuard } from '@NFS_Core/_guards/ProposalUnsavedChangesGuard.guard';
import { ApplicantDropdownResolver } from '@NFS_Core/_resolvers/applicant-dropdown.resolver';
import { DropdownResolver } from '@NFS_Core/_resolvers/dropdown.resolver';
import { ProposalQueueDropdownResolver } from '@NFS_Core/_resolvers/proposal-workqueue-dropdown.resolver';
import { LoginMainComponent } from '@NFS_Modules/login/login-main/login-main.component';
import { ErrorsComponent } from './errors/errors.component';



const routes: Routes = [
  { path: "login", component: LoginMainComponent, canActivate: [LoginGuard] },
  { path: 'welcome', loadChildren: () => import('./_Modules/welcome/welcome.module').then(m => m.WelcomeModule), canActivate: [AuthGuard], data: { claimType: 'canAccessDashboard' } },
  { path: "IOPS", loadChildren: () => import('@NFS_Modules/IOPS/iops.module').then(m => m.IOPSModule), canActivate: [AuthGuard, CreateLeadGuard], data: { claimType: 'canCreateLead' }, resolve: { collection: DropdownResolver } },
  { path: '', pathMatch: 'full', redirectTo: 'welcome' },
  { path: '*', component: LoginMainComponent, pathMatch: 'full' },
  { path: 'errors', component: ErrorsComponent, pathMatch: 'full' },
  { path: 'WorkQueue', loadChildren: () => import('./_Modules/work-queue/work-queue.module').then(m => m.WorkQueueModule), canActivate: [AuthGuard], data: { claimType: 'canAccessLeadWorkqueue' } },
  { path: 'Proposal', loadChildren: () => import('@NFS_Modules/CAP/Proposal/proposal.module').then(m => m.ProposalModule), canActivate: [AuthGuard], canDeactivate: [ProposalUnsavedChangesGuard], data: { claimType: 'canCreateApplication' }, resolve: { CapCollection: ApplicantDropdownResolver } },
  { path: 'ProposalQueue', loadChildren: () => import('@NFS_Modules/CAP/proposal-queue/proposal-queue.module').then(m => m.ProposalQueueModule), canActivate: [AuthGuard], data: { claimType: 'canAccessApplicationWorkqueue' }, resolve: { QueueCollection: ProposalQueueDropdownResolver } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
