import { Injectable } from '@angular/core';
import { FormatterService } from '@NFS_Core/NFSServices/Formatter/formatter.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { IEGLE_SCREInfo, IQuotApplicantAddressEntity, IQuotApplicantEntity, IQuotEntity, IQUOTInfo, IQUOT_ADDL_INFOInfo, IQUOT_APLTInfo, IQUOT_APLT_ADDSInfo, IQUOT_APLT_ADDS_DETLInfo, IQUOT_APLT_ID_DETLInfo, IQUOT_APLT_PHNE_FAXInfo, IQUOT_DOCTInfo } from '@NFS_Entity/Quot-Entity/Quot.model.index';
import { IQUOT_FINLInfo } from '@NFS_Entity/Quot-Entity/QuotSubEntities/IQUOT_FINLInfo.model';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { FormArray, FormBuilder, FormGroup } from 'src/Library';
import { QuotEntityFormService } from './QuotEntityForm.service';

@Injectable({
  providedIn: 'root'
})
export class QuotEntityMapperService {
  idTypeDropdownData!: Array<INFSDropDownData>;
  constructor(private _formBuilder: FormBuilder, private _QuotEntityFormService: QuotEntityFormService, private _masterDataService: MasterDataService,
    private _formatter: FormatterService) {

  }

  public QuotEntityMapper(Quot: FormGroup<IQuotEntity>, response: IQuotEntity, formMode: FormMode = FormMode.EDIT, _newRowState: DataRowState = DataRowState.None) {
    Quot.controls.QUOT.patchValue(response.QUOT);// this._formBuilder.group<IQUOTInfo>(response.QUOT),

    // Forcefully set the dependent dropdowns for general information
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
    Quot.controls.QUOTADDLINFO.patchValue(response.QUOTADDLINFO);
    Quot.controls.QUOTADDLINFO.controls.ASSETCONDITION.setValue(response.QUOTADDLINFO.ASSETCONDITION);
    Quot.controls.QUOTDOCT = this._formBuilder.array<IQUOT_DOCTInfo>([]),
      Quot.controls.QUOTDOCT = this.QuotDOCTInfoMapper(Quot.controls.QUOTDOCT, response.QUOTDOCT) as FormArray<IQUOT_DOCTInfo> //this._formBuilder.array<IQUOT_DOCTInfo>([]),
    Quot.controls.QUOTAPPLICANT = this.QuotApplicantMapper(Quot.controls.QUOTAPPLICANT, response.QUOTAPPLICANT, formMode);
    Quot.controls.EGLESCRE = this.QuotEagleScoreInfoMapper(Quot.controls.EGLESCRE, response.EGLESCRE) as FormArray<IEGLE_SCREInfo>
    Quot.controls.QUOTFINL.patchValue(response.QUOTFINL);
    //this.ResetState(Quot, response);
  }

  public QuotInfoMapper(data: IQUOTInfo): FormGroup<IQUOTInfo> {
    return this._formBuilder.group<IQUOTInfo>(data);
  }

  public QuotAdditionalInfoMapper(QuotAddlInfo: FormGroup<IQUOT_ADDL_INFOInfo>, data: IQUOT_ADDL_INFOInfo): FormGroup<IQUOT_ADDL_INFOInfo> {
    QuotAddlInfo = this._formBuilder.group<IQUOT_ADDL_INFOInfo>(data)
    return QuotAddlInfo;
  }

  public QuotFinancialInfoMapper(QuotAddlInfo: FormGroup<IQUOT_FINLInfo>, data: IQUOT_FINLInfo): FormGroup<IQUOT_FINLInfo> {
    QuotAddlInfo = this._formBuilder.group<IQUOT_FINLInfo>(data)
    return QuotAddlInfo;
  }
  public QuotEagleScoreInfoMapper(ESAddlInfo: FormArray<IEGLE_SCREInfo>, data: Array<IEGLE_SCREInfo>): FormArray<IEGLE_SCREInfo> {
    for (var i = 0; i < data?.length; i++) {
      ESAddlInfo.push(this._formBuilder.group<IEGLE_SCREInfo>(data[i]));
    }
    return ESAddlInfo;
  }

  public QuotDOCTInfoMapper(QoctlInfo: FormArray<IQUOT_DOCTInfo>, data: Array<IQUOT_DOCTInfo>): FormArray<IQUOT_DOCTInfo> {
    for (var i = 0; i < data.length; i++) {
      QoctlInfo.push(this._formBuilder.group<IQUOT_DOCTInfo>(data[i]));
    }
    return QoctlInfo;
  }

  public QuotApplicant(Applicant: FormGroup<IQuotApplicantEntity>, data: IQuotApplicantEntity, formMode: FormMode): FormGroup<IQuotApplicantEntity> {
    Applicant.controls.QUOTAPLT.patchValue(data.QUOTAPLT);

    Applicant.controls.QUOTAPLTIDDETL.clear();
    for (var i = 0; i < data.QUOTAPLTIDDETL.length; i++) {
      data.QUOTAPLTIDDETL[i].TYPE = this._masterDataService.ApplicantIdTypesSetup?.find(t => t.code === data.QUOTAPLTIDDETL[i].IDTYPECDE)?.TextValue || '';
      if (data.QUOTAPLTIDDETL[i].IDTYPECDE == '00001' || data.QUOTAPLTIDDETL[i].IDTYPECDE == '00003') {
        data.QUOTAPLTIDDETL[i].ISROWDISABLED = true;
      }
      Applicant.controls.QUOTAPLTIDDETL.push(this._formBuilder.group<IQUOT_APLT_ID_DETLInfo>(data.QUOTAPLTIDDETL[i]));
    }

    //Applicant.setControl('QUOTAPLTIDDETL', Applicant.controls.QUOTAPLTIDDETL);

    Applicant.controls.QUOTAPLTSPUSDETL.patchValue(data.QUOTAPLTSPUSDETL);

    let arrayAddress = this._formBuilder.array<IQuotApplicantAddressEntity>([]);

    for (var i = 0; i < data.QUOTAPPLICANTADDRESS.length; i++) {
      arrayAddress.push(this._QuotEntityFormService.QuotApplicantAddressForm());
      if (formMode == FormMode.NEW) {
        data.QUOTAPPLICANTADDRESS[i].QUOTAPLTADDS.ADDRESSID = i;
      }

      arrayAddress.controls[i].controls.QUOTAPLTADDS.patchValue(data.QUOTAPPLICANTADDRESS[i].QUOTAPLTADDS);

      let arrayPhone = this._formBuilder.array<IQUOT_APLT_PHNE_FAXInfo>([]);
      for (var j = 0; j < data.QUOTAPPLICANTADDRESS[i].QUOTAPLTPHNEFAX.length; j++) {
        data.QUOTAPPLICANTADDRESS[i].QUOTAPLTPHNEFAX[j].TYPE = this._masterDataService.AllPhoneTypes?.find(t => t.code === data.QUOTAPPLICANTADDRESS[i].QUOTAPLTPHNEFAX[j].PHONETYPECDE)?.TextValue || '';

        if (formMode == FormMode.NEW) {
          data.QUOTAPPLICANTADDRESS[i].QUOTAPLTPHNEFAX[j].ADDRESSID = i;
        }
        arrayPhone.push(this._formBuilder.group<IQUOT_APLT_PHNE_FAXInfo>(data.QUOTAPPLICANTADDRESS[i].QUOTAPLTPHNEFAX[j]));
      }
      let arrayAddressDetail = this._formBuilder.array<IQUOT_APLT_ADDS_DETLInfo>([]);
      for (var j = 0; j < data.QUOTAPPLICANTADDRESS[i].QUOTAPLTADDSDETL.length; j++) {
        if (formMode == FormMode.NEW) {
          data.QUOTAPPLICANTADDRESS[i].QUOTAPLTADDSDETL[j].ADDRESSID = i;
        }
        arrayAddressDetail.push(this._formBuilder.group<IQUOT_APLT_ADDS_DETLInfo>(data.QUOTAPPLICANTADDRESS[i].QUOTAPLTADDSDETL[j]));
      }
      arrayAddress.controls[i].setControl('QUOTAPLTADDSDETL', arrayAddressDetail);
      arrayAddress.controls[i].setControl('QUOTAPLTPHNEFAX', arrayPhone);
    }

    Applicant.setControl('QUOTAPPLICANTADDRESS', arrayAddress);

    return Applicant;
  }


  public QuotApplicantInfo(ApplicantInfo: FormGroup<IQUOT_APLTInfo>, data: IQUOT_APLTInfo): FormGroup<IQUOT_APLTInfo> {
    ApplicantInfo = this._formBuilder.group<IQUOT_APLTInfo>(data);
    return ApplicantInfo;
  }

  public QuotApplicantMapper(QuotApplicant: FormArray<IQuotApplicantEntity>, data: Array<IQuotApplicantEntity>, formMode: FormMode): FormArray<IQuotApplicantEntity> {
    for (var i = 0; i < data.length; i++) {
      if (i == 0)
        this.QuotApplicant(QuotApplicant.controls[i], data[i], formMode);
      else
        QuotApplicant.push(this.QuotApplicant(this._QuotEntityFormService.QuotApplicantForm(), data[i], formMode));
    }
    for (var i = 0; i < data.length; i++) {
      //QuotApplicant.controls[i].controls.RowState.setValue(DataRowState.None)
    }
    return QuotApplicant;
  }

  public QuotApplicantPhoneInfoMapper(Phone: FormArray<IQUOT_APLT_PHNE_FAXInfo>, data: Array<IQUOT_APLT_PHNE_FAXInfo>): FormArray<IQUOT_APLT_PHNE_FAXInfo> {
    for (var i = 0; i < data.length; i++) {
      if (i == 0) {
        Phone.controls[0] = this._formBuilder.group<IQUOT_APLT_PHNE_FAXInfo>(data[0]);
        //Phone.controls[0].controls.RowState.setValue(DataRowState.None)
      }
      else {
        Phone.push(this._formBuilder.group<IQUOT_APLT_PHNE_FAXInfo>(data[i]));
        //Phone.controls[i].controls.RowState.setValue(DataRowState.None)

      }

    }

    // for(var i = 0; i< data.length; i++) {
    //   Phone.controls[i].controls.RowState.setValue(DataRowState.None)
    // }
    return Phone;
  }

  public QuotApplicantIdDetailInfoMapper(IdType: FormArray<IQUOT_APLT_ID_DETLInfo>, data: Array<IQUOT_APLT_ID_DETLInfo>): FormArray<IQUOT_APLT_ID_DETLInfo> {
    for (var i = 0; i < data.length; i++) {
      if (i == 0)
        IdType.controls[0] = this._formBuilder.group<IQUOT_APLT_ID_DETLInfo>(data[0]);
      else
        IdType.push(this._formBuilder.group<IQUOT_APLT_ID_DETLInfo>(data[i]));
    }
    return IdType;
  }
  public QuotApplicantAddressInfoMapper(AddressInfo: FormGroup<IQUOT_APLT_ADDSInfo>, data: IQUOT_APLT_ADDSInfo): FormGroup<IQUOT_APLT_ADDSInfo> {
    AddressInfo = this._formBuilder.group<IQUOT_APLT_ADDSInfo>(data)
    return AddressInfo;
  }

  public QuotApplicantAddressDetailInfoMapper(AddressDetail: FormArray<IQUOT_APLT_ADDS_DETLInfo>, data: Array<IQUOT_APLT_ADDS_DETLInfo>): FormArray<IQUOT_APLT_ADDS_DETLInfo> {
    for (var i = 0; i < data.length; i++) {
      if (i == 0)
        AddressDetail.controls[0] = this._formBuilder.group<IQUOT_APLT_ADDS_DETLInfo>(data[0]);
      AddressDetail.push(this._formBuilder.group<IQUOT_APLT_ADDS_DETLInfo>(data[i]));
    }
    return AddressDetail;
  }

  public QuotDocumentMapper(Documents: FormArray<IQUOT_DOCTInfo>, data: Array<IQUOT_DOCTInfo>): FormArray<IQUOT_DOCTInfo> {
    for (var i = 0; i < data.length; i++) {
      if (i == 0)
        Documents.controls[0] = this._formBuilder.group<IQUOT_DOCTInfo>(data[0]);
      else
        Documents.push(this._formBuilder.group<IQUOT_DOCTInfo>(data[i]));
    }
    return Documents;
  }

  public QuotApplicantAddress(Address: FormGroup<IQuotApplicantAddressEntity>, data: IQuotApplicantAddressEntity): FormGroup<IQuotApplicantAddressEntity> {
    return this._formBuilder.group<IQuotApplicantAddressEntity>({
      QUOTAPLTADDS: this.QuotApplicantAddressInfoMapper(Address.controls.QUOTAPLTADDS, data.QUOTAPLTADDS) as FormGroup<IQUOT_APLT_ADDSInfo>,
      QUOTAPLTADDSDETL: this.QuotApplicantAddressDetailInfoMapper(Address.controls.QUOTAPLTADDSDETL, data.QUOTAPLTADDSDETL),
      QUOTAPLTPHNEFAX: this.QuotApplicantPhoneInfoMapper(Address.controls.QUOTAPLTPHNEFAX, data.QUOTAPLTPHNEFAX),
      RowState: DataRowState.None,
      //isDeserializing,
      ISAUDITABLE: false,
    });
  }

  public QuotApplicantAddressMapper(Addresses: FormArray<IQuotApplicantAddressEntity>, data: Array<IQuotApplicantAddressEntity>): FormArray<IQuotApplicantAddressEntity> {
    for (var i = 0; i < data.length; i++) {
      if (i == 0) {
        this.QuotApplicantAddress(Addresses.controls[i], data[i]);
        Addresses.controls[i].controls.RowState.setValue(DataRowState.None);
        for (var j = 0; j < data[i].QUOTAPLTPHNEFAX.length; j++) {
          //Addresses.controls[i].controls.QUOTAPLTPHNEFAX.controls[j].controls.RowState.setValue(DataRowState.None);
        }
      }
      else {
        Addresses.push(this.QuotApplicantAddress(this._QuotEntityFormService.QuotApplicantAddressForm(), data[i]));
        //Addresses.controls[i].controls.RowState.setValue(DataRowState.None);
        for (var j = 0; j < data[i].QUOTAPLTPHNEFAX.length; j++) {
          //Addresses.controls[i].controls.QUOTAPLTPHNEFAX.controls[j].controls.RowState.setValue(DataRowState.None);
        }
      }
    }
    return Addresses;
  }

  public ResetState(Quot: FormGroup<IQuotEntity>, response: IQuotEntity) {
    Quot.controls.RowState.setValue(DataRowState.None);
    Quot.controls.QUOTADDLINFO.controls.RowState.setValue(DataRowState.None);
    //Quot.controls.QUOTDOCT.controls[0].controls.RowState.setValue(DataRowState.None);
    for (var i = 0; i < Quot.controls.QUOTDOCT.controls.values.length; i++) {
      Quot.controls.QUOTDOCT.controls[i].controls.RowState.setValue(DataRowState.None);
    }

    for (var i = 0; i < response.QUOTAPPLICANT.length; i++) {
      Quot.controls.QUOTAPPLICANT.controls[i].controls.RowState.setValue(DataRowState.None);
      Quot.controls.QUOTAPPLICANT.controls[i].controls.QUOTAPLT.controls.RowState.setValue(DataRowState.None);

      for (var j = 0; j < Quot.controls.QUOTAPPLICANT.controls[i].controls.QUOTAPLTIDDETL.controls.values.length; j++) {
        Quot.controls.QUOTAPPLICANT.controls[i].controls.QUOTAPLTIDDETL.controls[j].controls.RowState.setValue(DataRowState.None);
      }

      for (var j = 0; j < response.QUOTAPPLICANT[i].QUOTAPPLICANTADDRESS.length; j++) {
        Quot.controls.QUOTAPPLICANT.controls[i].controls.QUOTAPPLICANTADDRESS.controls[j].controls.RowState.setValue(DataRowState.None);

        Quot.controls.QUOTAPPLICANT.controls[i].controls.QUOTAPPLICANTADDRESS.controls[j].controls.QUOTAPLTADDS.controls.RowState.setValue(DataRowState.None);


        for (var k = 0; k < response.QUOTAPPLICANT[i].QUOTAPPLICANTADDRESS[j].QUOTAPLTADDSDETL.length; k++) {
          Quot.controls.QUOTAPPLICANT.controls[i].controls.QUOTAPPLICANTADDRESS.controls[j].controls.QUOTAPLTADDSDETL.controls[k].controls.RowState.setValue(DataRowState.None);
        }

        for (var k = 0; k < response.QUOTAPPLICANT[i].QUOTAPPLICANTADDRESS[j].QUOTAPLTPHNEFAX.length; k++) {
          Quot.controls.QUOTAPPLICANT.controls[i].controls.QUOTAPPLICANTADDRESS.controls[j].controls.QUOTAPLTPHNEFAX.controls[k].controls.RowState.setValue(DataRowState.None);
        }
      }
    }
  }

}
