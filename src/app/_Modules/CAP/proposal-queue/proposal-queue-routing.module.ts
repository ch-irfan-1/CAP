import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProposalQueueComponent } from './proposal-queue.component';

const routes: Routes = [
  {
    path: '',
    component: ProposalQueueComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProposalQueueRoutingModule { }
