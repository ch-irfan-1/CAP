import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { IOTO_PRPL_APLT_FAMInfo, IPRPL_APLT_MAINInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/ProposalApplicantEntity.model.index';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { familyExposureComponent } from '@NFS_Modules/CAP/Proposal/Applicants/family-exposure/family-exposure.component';
import { FormGroup } from 'src/Library';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-sub-family-member',
    templateUrl: './sub-family-member.component.html',
    styleUrls: ['./sub-family-member.component.css'],
    standalone: false
})
export class SubFamilyMemberComponent implements OnInit, OnDestroy {


  max = new Date();
  @Input() ApplicantInfo!: FormGroup<IPRPL_APLT_MAINInfo>;
  @Input() FamilyMember !: FormGroup<IOTO_PRPL_APLT_FAMInfo>;
  @Input() ComponentName!: string;
  @Input() Index: number = 0;
  private subscription$ = new Subject();

  constructor(private dialog: MatDialog, private _proposaldataService: ProposalDataService, private _proposalForm: ProposalEntityFormService, public _masterDataService: MasterDataService) { }

  ngOnInit(): void {
  }

  openExposure() {
    let param = {} as IProposalInfoParm;
    param.ApplicantName = this.FamilyMember.controls.NAME.value;
    param.FamilyCardNo = this.FamilyMember.controls.FAMCRDNUM.value;
    if (this.FamilyMember.controls.DATEOFBIRTH.value == null) {
      param.DateOfBirth = new Date();
    }
    else {
      param.DateOfBirth = this.FamilyMember.controls.DATEOFBIRTH.value;
    }
    param.FamilySearchCriteria = this.FamilyMember.controls.FAMLIYSEARCHCRITERIA.value;
    param.ProposalId = this._proposaldataService.PROPOSAL.controls.PROPOSALID.value;
    param.ApplicantId = this._proposaldataService.CurrentApplicant.controls.PROPOSALAPPLICANT.controls.APPLICANTID.value;
    param.FamilyMemberID = this.FamilyMember.controls.FAMCDE.value;
    param.ApplicantName = this.FamilyMember.value.NAME;
    param.BorrowerName = this.ApplicantInfo.value.APPLICANTNME;

    const dialogRef = this.dialog.open(familyExposureComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: param
    });

    dialogRef.afterClosed().pipe(takeUntil(this.subscription$))
      .subscribe((result => {
        if (result != undefined) {
        }
      }));
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
}
