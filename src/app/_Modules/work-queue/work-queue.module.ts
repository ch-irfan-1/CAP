import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { WorkQueueRoutingModule } from './work-queue-routing.module';
import { WorkQueueComponent } from './Components/work-queue/work-queue.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { NfsControlsModule } from '@NFS_Core/NFSControls/nfs-controls.module';

import { AssignToVOComponent } from './Components/assign-to-vo/assign-to-vo.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CancelleadComponent } from '@NFS_Modules/work-queue/CancelLead/cancellead/cancellead.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgsFormsModule } from 'src/Library';

@NgModule({
  declarations: [WorkQueueComponent, AssignToVOComponent, CancelleadComponent],
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
    WorkQueueRoutingModule,
    NgsFormsModule ,
    MatRadioModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NfsControlsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatPaginatorModule
  ],
  providers: [DatePipe]
})
export class WorkQueueModule { }
