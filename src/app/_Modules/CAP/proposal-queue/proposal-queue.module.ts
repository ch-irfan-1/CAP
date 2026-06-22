import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgsFormsModule  } from 'src/Library';
import { NfsControlsModule } from '@NFS_Core/NFSControls/nfs-controls.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from '@NFS_Core/_interceptors/loading.interceptor';
import { ProposalQueueRoutingModule } from './proposal-queue-routing.module';
import { ProposalQueueComponent } from './proposal-queue.component';
import { MatBadgeModule } from '@angular/material/badge';
import { DeclineRequestComponent } from './declineRequest/declineRequest.component';
import { PointScoreComponent } from './pointScore/pointScore.component';
import { FieldVisitComponent } from './fieldVisit/fieldVisit.component';
import { DocumentTrackingComponent } from './document-tracking/document-tracking.component';
import { UploadDocumentComponent } from './document-tracking/upload-document/upload-document.component';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ChangeRequestComponent } from './changeRequest/changeRequest.component';
import { WithdrawRequestComponent } from './withdraw-request/withdraw-request.component';
import { EApprovalComponent } from './e-approval/eapproval.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { ViewDocument } from './document-tracking/view-document/view-document.component';
import { PrintStationery } from './print/print.component';
import { MposSurveyComponent } from './mpos-survey/mpos-survey.component';
import { CancelRequestComponent } from './cancelRequest/cancelRequest.component';
import { ForwardRequestComponent } from './forward-request/forward-request.component';
import { AddCommentComponent } from './document-tracking/add-comment/add-comment.component';
import { CaRecommendationComponent } from './carecommendation/caRecommendation.component';
import { MVOSurveySearchComponent } from './mvo-survey-search/mvo-survey-search.component';


@NgModule({
  declarations: [ProposalQueueComponent,DeclineRequestComponent,ChangeRequestComponent,  FieldVisitComponent, PointScoreComponent,PrintStationery, DocumentTrackingComponent, UploadDocumentComponent,ViewDocument, WithdrawRequestComponent, AddCommentComponent,
    EApprovalComponent, MposSurveyComponent,CancelRequestComponent, ForwardRequestComponent, CaRecommendationComponent, MVOSurveySearchComponent],

  imports: [
    CommonModule,
    ProposalQueueRoutingModule,
    NfsControlsModule,
    NgsFormsModule ,
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatRadioModule,
    MatTableModule,
    MatDialogModule,
    MatTooltipModule,
    MatBadgeModule,
    MatPaginatorModule,
    MatDatepickerModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    NgxImageCompressService
  ],
})
export class ProposalQueueModule { }
