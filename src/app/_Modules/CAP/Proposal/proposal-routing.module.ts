import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProposalMainComponent } from './proposal-main.component';


const routes: Routes = [
  {
    path: 'createProposal',
    component: ProposalMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProposalRoutingModule { }