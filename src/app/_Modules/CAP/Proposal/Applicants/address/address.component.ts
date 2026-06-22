import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { AddressMasterDataService } from '@NFS_Core/NFSServices/MasterData/Address-master-data.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { StateManagment } from '@NFS_Core/RowStateManagement/FormStateManagement';
import { IAddressEntity } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IAddressEntity.model';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { FormArray, FormBuilder, FormGroup, FormControl } from 'src/Library';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
    selector: 'app-address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.css'],
    standalone: false
})
export class AddressComponent implements OnInit {
  @Input() Addresses!: FormArray<IAddressEntity>;
  @Input() ComponentName!: string;
  @ViewChild("tabRef", { static: false }) tabGroup!: MatTabGroup;

  dataRowState = DataRowState;
  selectedInd!:number;

  constructor(private _formModeService: FormModeService, public _masterDataService: MasterDataService, private _proposaldataService: ProposalDataService, public _addressMasterDataService: AddressMasterDataService, private fb: FormBuilder, private _proposalForm: ProposalEntityFormService,
    private _FormState: StateManagment, private _MsgService: MessageService) { }
  panelOpenState = false;
  getComponentName() {
    return this.ComponentName + "-Address"
  }

  ngOnInit(): void {
    this.selectedInd=0;
  }

  get isViewMode() {
    return this._formModeService.FormMode === FormMode.VIEW;
  }

  tabSelectionChange(index:any)
  {
    if(index!=undefined){
      if(this.selectedInd<0){
        this.selectedInd=0;
      }
      if(index===this.Addresses.value.filter(p=>p.RowState!=DataRowState.Removed).length && index>0){
        this.selectedInd=this.Addresses.value.filter(p=>p.RowState!=DataRowState.Removed).length-1;
      }
      else{
        this.selectedInd=index;
      }
    }
  } 
  AddAddress() {
    let address: FormGroup<IAddressEntity> = this._proposalForm.ProposalApplicantAddressForm();
    address.controls.PROPOSALAPPLICANTADDRESS.controls.NEWDATAIND.setValue(true);
    if(this.Addresses.controls.length==0){
      address.controls.PROPOSALAPPLICANTADDRESS.controls.ADDRESSID.setValue(0);
    }
    else{
      address.controls.PROPOSALAPPLICANTADDRESS.controls.ADDRESSID.setValue(this.Addresses.controls[this.Addresses.controls.length - 1].controls.PROPOSALAPPLICANTADDRESS.controls.ADDRESSID.value + 1);
    }
    address.controls.PROPOSALAPPLICANTADDRESS.controls.COUNTRYID.setValue(10);
    //address.controls.PROPOSALAPPLICANTADDRESS.controls.TEMPLATEMAINID.setValue("000ID");
    this.Addresses.push(address);

    window.setTimeout(() => {
      this.selectedInd = this.Addresses.value.filter(obj => obj.RowState !== DataRowState.Removed).length - 1;
      this.tabGroup.selectedIndex = this.selectedInd;
    });
  }

  removeAddress(object: any, addressindex : number) {
    const index: number = this.Addresses.value.indexOf(object.value);
    
    var i:number=this.Addresses.value.filter(p=>p.RowState!=DataRowState.Removed).indexOf(object.value);

    if (this.Addresses.controls[index].controls.RowState.value == DataRowState.Added) {
      this.Addresses.removeAt(index);
      this._MsgService.ClearValidatorMessages('-Address-' + (addressindex + 1));
      
    }
    else {
      this._FormState.ResetFormState(this.Addresses.controls[index], DataRowState.Removed);
      this._MsgService.ClearValidatorMessages('-Address-' + (addressindex + 1));
      
    }

    if (this.selectedInd > 0 && (this.selectedInd == i || this.selectedInd > i)) {
      window.setTimeout(() => {
        this.selectedInd = this.selectedInd - 1;
        this.tabGroup.selectedIndex = this.selectedInd;
      });
    }
  }

  MarkDefaultAddress(event: any) {
    if (this.Addresses) {
      this.Addresses.controls.filter(x => x.value.RowState != DataRowState.Removed).forEach((item, index) => {
        if (item.value.PROPOSALADDRESSTYPEDETAIL.filter(x => x.RowState != DataRowState.Removed && x.DEFAULTIND == true)
          && item.value.PROPOSALAPPLICANTPHONEFAX.filter(x => x.RowState != DataRowState.Removed && x.USEFORSMSIND == true)) {
          item.controls.PROPOSALAPPLICANTPHONEFAX.controls.map(ele => { ele.controls.USEFORSMSIND.setValue(false); });
        }
        if (item.controls.PROPOSALADDRESSTYPEDETAIL.length > 0) {
          item.controls.PROPOSALADDRESSTYPEDETAIL.controls.filter(x => x.value.RowState != DataRowState.Removed && x.value.DEFAULTIND == true).forEach((item1, index1) => {
            if (item1 != null && typeof item1 != "undefined" && item1.controls.DEFAULTIND) {
              this._MsgService.showMesssage('DuplicateDefaultAddress', MessageType.Info)
              item1.controls.DEFAULTIND.setValue(false);
              item1.markAsDirty();
            }
          });
        }
      });
    }
  }
}
