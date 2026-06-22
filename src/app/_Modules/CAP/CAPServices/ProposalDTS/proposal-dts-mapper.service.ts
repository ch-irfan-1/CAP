import { Injectable } from '@angular/core';
import { StateManagment } from '@NFS_Core/RowStateManagement/FormStateManagement';
import { IMPOS_APLT_DCMTInfo, IProposalDTSEntity, IPRPL_DOCTInfo, IPRPL_DTSInfo, IPRPL_DTS_DOCTInfo, IPRPL_DTS_HEDRInfo } from '@NFS_Entity/ProposalDTS-Entity/IProposalDTSEntity.model.index';
import { ProposalDTSEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalDTS/ProposalDTSEntityForm.service';
import { FormBuilder, FormGroup } from 'src/Library';

@Injectable({
  providedIn: 'root'
})
export class ProposalDTSMapperService {

  constructor(private _formBuilder: FormBuilder, private _ProposalDTSEntityFormService: ProposalDTSEntityFormService, private _FormState: StateManagment) { }

  public ProposalDTSEntityMapper(ProposalDTS: FormGroup<IProposalDTSEntity>, data: IProposalDTSEntity) {

    ProposalDTS.controls.RowState.setValue(data.RowState);

    this.PROPOSALDTSHEADERMapper(ProposalDTS.controls.PROPOSALDTSHEADER, data.PROPOSALDTSHEADER);

    ProposalDTS.controls.PROPOSALDOCUMENTS.clear();
    data.PROPOSALDOCUMENTS.forEach((item, index) => {
      ProposalDTS.controls.PROPOSALDOCUMENTS.push((this.PROPOSALDOCUMENTSMapper(this._ProposalDTSEntityFormService.ProposalDocumentsInfoForm(), data.PROPOSALDOCUMENTS[index])));
    });

    if(data.PROPOSALDTS!=null)
      this.PROPOSALDTSMapper(ProposalDTS.controls.PROPOSALDTS, data.PROPOSALDTS);

    ProposalDTS.controls.PROPOSALDTSDOCUMENTS.clear();
    data.PROPOSALDTSDOCUMENTS.forEach((item, index) => {
      ProposalDTS.controls.PROPOSALDTSDOCUMENTS.push((this.PROPOSALDTSDOCUMENTSMapper(this._ProposalDTSEntityFormService.ProposalDTSDocumentsInfoForm(), data.PROPOSALDTSDOCUMENTS[index])));
    });

    ProposalDTS.controls.MPOSDOCUMENTS.clear();
    data.MPOSDOCUMENTS.forEach((item, index) => {
      ProposalDTS.controls.MPOSDOCUMENTS.push((this.MPOSDOCUMENTSMapper(this._ProposalDTSEntityFormService.MPOSDocumentsInfoForm(), data.MPOSDOCUMENTS[index])));
    });

  }

  public PROPOSALDTSHEADERMapper(PROPOSALDTSHEADER: FormGroup<IPRPL_DTS_HEDRInfo>, data: IPRPL_DTS_HEDRInfo): FormGroup<IPRPL_DTS_HEDRInfo> {
    PROPOSALDTSHEADER.controls.RowState.setValue(data.RowState);
    PROPOSALDTSHEADER.patchValue(data);
    return PROPOSALDTSHEADER;
  }
  /*public ProposalSetRowState(PROPOSALDTSHEADER: FormGroup<IPRPL_DTS_HEDRInfo>, data: IProposalDTSEntity) {
    if(PROPOSALDTSHEADER.controls.RowState.value!==DataRowState.Added){
      this._FormState.ResetFormState(PROPOSALDTSHEADER,DataRowState.Removed);
    }
    else{
      PROPOSALDTSHEADER=this._ProposalDTSEntityFormService.ProposalDTSHEDRInfoForm();
    }
  }*/

  public PROPOSALDOCUMENTSMapper(PROPOSALDOCUMENTS: FormGroup<IPRPL_DOCTInfo>, data: IPRPL_DOCTInfo): FormGroup<IPRPL_DOCTInfo> {
    PROPOSALDOCUMENTS.controls.RowState.setValue(data.RowState);
    PROPOSALDOCUMENTS.patchValue(data);
    return PROPOSALDOCUMENTS;
  }

  public PROPOSALDTSMapper(PROPOSALDTS: FormGroup<IPRPL_DTSInfo>, data: IPRPL_DTSInfo): FormGroup<IPRPL_DTSInfo> {
    PROPOSALDTS.controls.RowState.setValue(data.RowState);
    PROPOSALDTS.patchValue(data);
    return PROPOSALDTS;
  }
  /*public PROPOSALDTSMapperSetRowState(PROPOSALDTS: FormGroup<IPRPL_DTSInfo>, data: IProposalDTSEntity) {
    if(PROPOSALDTS.controls.RowState.value!==DataRowState.Added){
      this._FormState.ResetFormState(PROPOSALDTS,DataRowState.Removed);
    }
    else{
      PROPOSALDTS=this._ProposalDTSEntityFormService.ProposalDTSInfoForm();
    }
  }*/

  public PROPOSALDTSDOCUMENTSMapper(PROPOSALDTSDOCUMENTS: FormGroup<IPRPL_DTS_DOCTInfo>, data: IPRPL_DTS_DOCTInfo): FormGroup<IPRPL_DTS_DOCTInfo> {
    PROPOSALDTSDOCUMENTS.controls.RowState.setValue(data.RowState);
    PROPOSALDTSDOCUMENTS.patchValue(data);
    return PROPOSALDTSDOCUMENTS;
  }

  public MPOSDOCUMENTSMapper(MPOSDOCUMENTS: FormGroup<IMPOS_APLT_DCMTInfo>, data: IMPOS_APLT_DCMTInfo): FormGroup<IMPOS_APLT_DCMTInfo> {
    MPOSDOCUMENTS.controls.RowState.setValue(data.RowState);
    MPOSDOCUMENTS.patchValue(data);
    return MPOSDOCUMENTS;
  }

  /*setStateRemoved(ProposalDTS: FormGroup<IProposalDTSEntity>, data: IProposalDTSEntity) {
    this.PROPOSALDOCUMENTSSetRowState(ProposalDTS.controls.PROPOSALDOCUMENTS, data);
     this.PROPOSALDTSDOCUMENTSSetRowState(ProposalDTS.controls.PROPOSALDTSDOCUMENTS, data);
     this.MPOSDOCUMENTSSetRowState(ProposalDTS.controls.MPOSDOCUMENTS, data);
  }

  public PROPOSALDOCUMENTSSetRowState(PROPOSALDOCUMENTS: FormArray<IPRPL_DOCTInfo>, data: IProposalDTSEntity) {
    PROPOSALDOCUMENTS.controls.forEach((item, index) => {
      if (item.controls.RowState.value !== DataRowState.Added) {
        this._FormState.ResetFormState(item, DataRowState.Removed);
      }
      else {
        PROPOSALDOCUMENTS.removeAt(index);
      }
    });
  }

  public PROPOSALDTSDOCUMENTSSetRowState(PROPOSALDTSDOCUMENTS: FormArray<IPRPL_DTS_DOCTInfo>, data: IProposalDTSEntity) {
    PROPOSALDTSDOCUMENTS.controls.forEach((item, index) => {
      if (item.controls.RowState.value !== DataRowState.Added) {
        this._FormState.ResetFormState(item, DataRowState.Removed);
      }
      else {
        PROPOSALDTSDOCUMENTS.removeAt(index);
      }
    });
  }

  public MPOSDOCUMENTSSetRowState(MPOSDOCUMENTS: FormArray<IMPOS_APLT_DCMTInfo>, data: IProposalDTSEntity) {
    MPOSDOCUMENTS.controls.forEach((item, index) => {
      if (item.controls.RowState.value !== DataRowState.Added) {
        this._FormState.ResetFormState(item, DataRowState.Removed);
      }
      else {
        MPOSDOCUMENTS.removeAt(index);
      }
    });
  }*/

}
