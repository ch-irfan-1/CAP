import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { FormatterService } from '@NFS_Core/NFSServices/Formatter/formatter.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { IEGLE_SCREInfo, IQuotApplicantAddressEntity, IQuotApplicantEntity, IQuotEntity, IQUOTInfo, IQUOT_ADDL_INFOInfo, IQUOT_APLTInfo, IQUOT_APLT_ADDSInfo, IQUOT_APLT_ADDS_DETLInfo, IQUOT_APLT_ID_DETLInfo, IQUOT_APLT_PHNE_FAXInfo, IQUOT_DOCTInfo } from '@NFS_Entity/Quot-Entity/Quot.model.index';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { FormArray, FormBuilder, FormControl, FormGroup } from 'src/Library';
import { QuotEntityFormService } from './QuotEntityForm.service';

@Injectable({
  providedIn: 'root'
})
export class ExistingBpMapperService {

  constructor(private _formBuilder: FormBuilder, private _QuotEntityFormService: QuotEntityFormService, private _masterDataService: MasterDataService,
    private _formatter: FormatterService) { }

  public QuotEntityMapper(Quot: FormGroup<IQuotEntity>, response: IQuotEntity, formMode: FormMode = FormMode.NEW, _newRowState: DataRowState = DataRowState.None) {
    Quot.controls.QUOT.patchValue(response.QUOT);// this._formBuilder.group<IQUOTInfo>(response.QUOT),

    // Forcefully set the dependent dropdowns for general information
    if (formMode == FormMode.EDIT) {
      Quot.controls.QUOTADDLINFO.controls.RowState.setValue(DataRowState.Updated);
      Quot.controls.QUOT.controls.RowState.setValue(DataRowState.Updated);
    }
    else if (formMode == FormMode.NEW) {
      Quot.controls.QUOTADDLINFO.controls.RowState.setValue(DataRowState.Added);
      Quot.controls.QUOT.controls.RowState.setValue(DataRowState.Added);
    }

    Quot.controls.QUOT.controls.BPBRANCHID.setValue(response.QUOT.BPBRANCHID);
    Quot.controls.QUOT.controls.BPINTRODUCERID.setValue(response.QUOT.BPINTRODUCERID);
    Quot.controls.QUOT.controls.FPGROUPID.setValue(response.QUOT.FPGROUPID);
    Quot.controls.QUOT.controls.FINANCIALPRODUCTID.setValue(response.QUOT.FINANCIALPRODUCTID);

    Quot.controls.QUOT.controls.DEALERNAME.setValue(response.QUOT.DEALERNAME);
    Quot.controls.QUOT.controls.FPGROUPNAME.setValue(response.QUOT.FPGROUPNAME);
    Quot.controls.QUOT.controls.FPCAMPAIGNNAME.setValue(response.QUOT.FPCAMPAIGNNAME);
    Quot.controls.QUOT.controls.FINANCETYP.setValue(response.QUOT.FINANCETYP);
    Quot.controls.QUOT.controls.MCOMDEALER.setValue(response.QUOT.MCOMDEALER);
    Quot.controls.QUOT.controls.ISMCOMCAMPAIGN.setValue(response.QUOT.ISMCOMCAMPAIGN);
    /************************************************************/

    //Quot.controls.QUOTADDLINFO = this.QuotAdditionalInfoMapper(Quot.controls.QUOTADDLINFO, response.QUOTADDLINFO) as FormGroup<IQUOT_ADDL_INFOInfo>,
    //Quot.controls.QUOTADDLINFO.patchValue(response.QUOTADDLINFO);
    Quot.controls.QUOTADDLINFO.controls.ASSETCONDITION.setValue(response.QUOTADDLINFO.ASSETCONDITION);
    //Quot.controls.QUOTDOCT = this._formBuilder.array<IQUOT_DOCTInfo>([]);
    Quot.controls.QUOTDOCT = this.QuotDOCTInfoMapper(Quot.controls.QUOTDOCT, response.QUOTDOCT, formMode) as FormArray<IQUOT_DOCTInfo> //this._formBuilder.array<IQUOT_DOCTInfo>([]),
    this.setRowStateRemoved(Quot.controls.QUOTAPPLICANT);
    Quot.controls.QUOTAPPLICANT = this.QuotApplicantMapper(Quot.controls.QUOTAPPLICANT, response.QUOTAPPLICANT, formMode);
    Quot.controls.EGLESCRE = this.QuotEagleScoreInfoMapper(Quot.controls.EGLESCRE, response.EGLESCRE) as FormArray<IEGLE_SCREInfo>
    //this.ResetState(Quot, response);      
  }

  public QuotDOCTInfoMapper(doc: FormArray<IQUOT_DOCTInfo>, data: Array<IQUOT_DOCTInfo>, formMode: FormMode): FormArray<IQUOT_DOCTInfo> {
    for (var i = 0; i < data.length; i++) {
      doc.push(this._formBuilder.group<IQUOT_DOCTInfo>(data[i]));
      doc.controls[i].controls.RowState.setValue(DataRowState.Removed);
    }

    for (var i = 0; i < data.length; i++) {
      doc.push(this._formBuilder.group<IQUOT_DOCTInfo>(data[i]));
      doc.controls[i].controls.RowState.setValue(DataRowState.Added);
    }
    return doc;
  }

  public QuotApplicantMapper(QuotApplicant: FormArray<IQuotApplicantEntity>, data: Array<IQuotApplicantEntity>, formMode: FormMode): FormArray<IQuotApplicantEntity> {

    // for (var i = 0; i < data.length; i++) {
    //   QuotApplicant.controls[i].controls.RowState.setValue(DataRowState.Removed)
    // }

    for (var i = 0; i < data.length; i++) {
      QuotApplicant.push(this.QuotApplicant(this._QuotEntityFormService.QuotApplicantForm(), data[i], formMode));
    }
    for (var i = 0; i < data.length; i++) {
      //QuotApplicant.controls[i].controls.RowState.setValue(DataRowState.None)
    }
    return QuotApplicant;
  }

  public QuotApplicant(Applicant: FormGroup<IQuotApplicantEntity>, data: IQuotApplicantEntity, formMode: FormMode): FormGroup<IQuotApplicantEntity> {
    data.QUOTAPLT.ROLECDE = "00003";
    Applicant.controls.QUOTAPLT.patchValue(data.QUOTAPLT);

    Applicant.controls.RowState.setValue(DataRowState.Added);

    //Applicant.controls.QUOTAPLTIDDETL.clear();
    for (var i = 0; i < data.QUOTAPLTIDDETL.length; i++) {
      data.QUOTAPLTIDDETL[i].TYPE = this._masterDataService.ApplicantIdTypesSetup?.find(t => t.code === data.QUOTAPLTIDDETL[i].IDTYPECDE)?.TextValue || '';
      if (data.QUOTAPLTIDDETL[i].IDTYPECDE == '00001' || data.QUOTAPLTIDDETL[i].IDTYPECDE == '00003') {
        data.QUOTAPLTIDDETL[i].ISROWDISABLED = true;
      }
      data.QUOTAPLTIDDETL[i].RowState = DataRowState.Added;
      Applicant.controls.QUOTAPLTIDDETL.push(this._formBuilder.group<IQUOT_APLT_ID_DETLInfo>(data.QUOTAPLTIDDETL[i]));
    }

    Applicant.setControl('QUOTAPLTIDDETL', Applicant.controls.QUOTAPLTIDDETL);

    if (data.QUOTAPLTSPUSDETL)
      data.QUOTAPLTSPUSDETL.RowState = DataRowState.Added;
    Applicant.controls.QUOTAPLTSPUSDETL.patchValue(data.QUOTAPLTSPUSDETL);

    let arrayAddress = this._formBuilder.array<IQuotApplicantAddressEntity>([]);

    for (var i = 0; i < data.QUOTAPPLICANTADDRESS.length; i++) {
      arrayAddress.push(this._QuotEntityFormService.QuotApplicantAddressForm());
      // if (formMode == FormMode.NEW) {
      data.QUOTAPPLICANTADDRESS[i].QUOTAPLTADDS.ADDRESSID = i;
      // }

      data.QUOTAPPLICANTADDRESS[i].QUOTAPLTADDS.RowState = DataRowState.Added;
      arrayAddress.controls[i].controls.QUOTAPLTADDS.patchValue(data.QUOTAPPLICANTADDRESS[i].QUOTAPLTADDS);

      let arrayPhone = this._formBuilder.array<IQUOT_APLT_PHNE_FAXInfo>([]);
      for (var j = 0; j < data.QUOTAPPLICANTADDRESS[i].QUOTAPLTPHNEFAX.length; j++) {
        data.QUOTAPPLICANTADDRESS[i].QUOTAPLTPHNEFAX[j].TYPE = this._masterDataService.AllPhoneTypes?.find(t => t.code === data.QUOTAPPLICANTADDRESS[i].QUOTAPLTPHNEFAX[j].PHONETYPECDE)?.TextValue || '';

        // if (formMode == FormMode.NEW) {
        data.QUOTAPPLICANTADDRESS[i].QUOTAPLTPHNEFAX[j].ADDRESSID = i;
        // }
        data.QUOTAPPLICANTADDRESS[i].QUOTAPLTPHNEFAX[j].RowState = DataRowState.Added;
        arrayPhone.push(this._formBuilder.group<IQUOT_APLT_PHNE_FAXInfo>(data.QUOTAPPLICANTADDRESS[i].QUOTAPLTPHNEFAX[j]));
      }
      let arrayAddressDetail = this._formBuilder.array<IQUOT_APLT_ADDS_DETLInfo>([]);
      for (var j = 0; j < data.QUOTAPPLICANTADDRESS[i].QUOTAPLTADDSDETL.length; j++) {
        // if (formMode == FormMode.NEW) {
        data.QUOTAPPLICANTADDRESS[i].QUOTAPLTADDSDETL[j].ADDRESSID = i;
        // }
        data.QUOTAPPLICANTADDRESS[i].QUOTAPLTADDSDETL[j].RowState = DataRowState.Added;
        arrayAddressDetail.push(this._formBuilder.group<IQUOT_APLT_ADDS_DETLInfo>(data.QUOTAPPLICANTADDRESS[i].QUOTAPLTADDSDETL[j]));
      }
      arrayAddress.controls[i].setControl('QUOTAPLTADDSDETL', arrayAddressDetail);
      arrayAddress.controls[i].setControl('QUOTAPLTPHNEFAX', arrayPhone);
    }

    Applicant.setControl('QUOTAPPLICANTADDRESS', arrayAddress);

    return Applicant;
  }

  public QuotEagleScoreInfoMapper(ESAddlInfo: FormArray<IEGLE_SCREInfo>, data: Array<IEGLE_SCREInfo>): FormArray<IEGLE_SCREInfo> {

    for (var i = 0; i < ESAddlInfo.controls?.length; i++) {
      ESAddlInfo.controls[i].controls.RowState.setValue(DataRowState.Removed);
    }

    for (var i = 0; i < data?.length; i++) {
      ESAddlInfo.push(this._formBuilder.group<IEGLE_SCREInfo>(data[i]));
    }
    return ESAddlInfo;
  }

  public setRowStateRemoved(QuotApplicant: FormArray<IQuotApplicantEntity>) {
    for (let i = 0; i < QuotApplicant.controls.length; i++) {
      QuotApplicant.controls[i].controls.RowState.setValue(DataRowState.Removed);
      QuotApplicant.controls[i].controls.QUOTAPLT.controls.RowState.setValue(DataRowState.Removed);
      QuotApplicant.controls[i].controls.QUOTAPLTSPUSDETL.controls.RowState.setValue(DataRowState.Removed);

      for (let j = 0; j < QuotApplicant.controls[i].controls.QUOTAPLTIDDETL.controls.length; j++) {
        QuotApplicant.controls[i].controls.QUOTAPLTIDDETL.controls[i].controls.RowState.setValue(DataRowState.Removed);
      }

      for (let j = 0; j < QuotApplicant.controls[i].controls.QUOTAPPLICANTADDRESS.controls.length; j++) {
        QuotApplicant.controls[i].controls.QUOTAPPLICANTADDRESS.controls[i].controls.RowState.setValue(DataRowState.Removed);
        QuotApplicant.controls[i].controls.QUOTAPPLICANTADDRESS.controls[i].controls.QUOTAPLTADDS.controls.RowState.setValue(DataRowState.Removed);


        for (let k = 0; k < QuotApplicant.controls[i].controls.QUOTAPPLICANTADDRESS.controls[j].controls.QUOTAPLTADDSDETL.controls.length; k++) {
          QuotApplicant.controls[i].controls.QUOTAPPLICANTADDRESS.controls[j].controls.QUOTAPLTADDSDETL.controls[k].controls.RowState.setValue(DataRowState.Removed);
        }

        for (let k = 0; k < QuotApplicant.controls[i].controls.QUOTAPPLICANTADDRESS.controls[j].controls.QUOTAPLTPHNEFAX.controls.length; k++) {
          QuotApplicant.controls[i].controls.QUOTAPPLICANTADDRESS.controls[j].controls.QUOTAPLTPHNEFAX.controls[k].controls.RowState.setValue(DataRowState.Removed);
        }
      }

    }

  }

}
