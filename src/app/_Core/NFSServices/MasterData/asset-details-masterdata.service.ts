import { Injectable } from '@angular/core';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { forkJoin, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { MasterDataService } from './master-data.service';
import { mPOSMasterDataRequest } from './MasterdataHelper/mPOSMasterDataRequest';

@Injectable({
    providedIn: 'root'
})

export class AssetDetailsMasterdataService {
    // public AssetCondition: INFSDropDownData[] = [];
    public CrditPurpose: INFSDropDownData[] = [];
    public TransmissionType: INFSDropDownData[] = [];
    public AssetModelColour: INFSDropDownData[] = [];
    public VehicleStyle: INFSDropDownData[] = [];
    public AllKotamadya: INFSDropDownData[] = [];
    public UsageArea: INFSDropDownData[] = [];
    public GoodsServicesFunds: INFSDropDownData[]=[];
    public OperatorVehicle:INFSDropDownData[]=[];
    public FinancingType:INFSDropDownData[]=[];

    public ApplicantCategoryCode: INFSDropDownData[] = [];
    public TitleCode: INFSDropDownData[] = [];
    public GenderCode: INFSDropDownData[] = [];
    public MaritalStatus: INFSDropDownData[] = [];
    public RelationshipTypeListByCompanyId: INFSDropDownData[] = [];
    public SpAgreementType: INFSDropDownData[] = [];
    public Branches: INFSDropDownData[] = [];
    public AllProvincesByCountryId: INFSDropDownData[]=[];
    public Bpkbreceivedstatus:INFSDropDownData[]=[];
    public Bpkbstatus:INFSDropDownData[]=[];
    public Owner:INFSDropDownData[]=[];
    public Bpkbownercategory:INFSDropDownData[]=[];
    public AssetModelAndFitting:INFSDropDownData[]=[];
    public Designation:INFSDropDownData[]=[];
    public RentalTypes:INFSDropDownData[]=[];
    public DepreciationPolicy:INFSDropDownData[]=[];


    request!: mPOSMasterDataRequest;

    isDataRequested = false;
    subject = new ReplaySubject<Array<Array<INFSDropDownData>>>();
    constructor(private _masterDataService: MasterDataService, private _ProposalDataService: ProposalDataService) { }

    getmasterDataForAssetDetail(): Observable<any> {
        if (!this.isDataRequested) {
            this.isDataRequested = true;

            forkJoin([
                // this._masterDataService.GetMasterData(this.getRequestObject(MasterData.AssetCondition)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.CrditPurpose)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.TransmissionType)),
                //this._masterDataService.GetMasterData(this.getRequestObject(MasterData.AssetModelColour)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.VehicleStyle)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.AllKotamadya)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.UsageArea)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.GoodsServicesFunds)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.OperatorVehicle)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.FinancingType)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.ApplicantCategoryCode)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.TitleCode)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.GenderCode)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.MaritalStatus)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.RelationshipTypeListByCompanyId)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.SpAgreementType)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.Branches)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.AllProvincesByCountryId)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.Bpkbreceivedstatus)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.Bpkbstatus)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.Owner)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.Bpkbownercategory)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.AssetModelAndFitting)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.Designation)),
                this._masterDataService.GetMasterData(this.getRequestObject(MasterData.RentalTypes)),
                
            ]).subscribe(nr => this.subject.next(nr));
        }

        return this.subject.pipe(first(), map((response) => {
            return {
                // AssetCondition: response[0],
                CrditPurpose: response[0],
                TransmissionType: response[1],
                //AssetModelColour: response[3],
                VehicleStyle: response[2],
                AllKotamadya: response[3],
                UsageArea: response[4],
                GoodsServicesFunds:response[5],
                OperatorVehicle:response[6],
                FinancingType:response[7],
                ApplicantCategoryCode:response[8],
                TitleCode: response[9],
                GenderCode: response[10],
                MaritalStatus: response[11],
                RelationshipTypeListByCompanyId: response[12],
                SpAgreementType: response[13],
                Branches: response[14],
                AllProvincesByCountryId: response[15],
                Bpkbreceivedstatus:response[16],
                Bpkbstatus:response[17],
                Owner:response[18],
                Bpkbownercategory:response[19],
                AssetModelAndFitting:response[20],
                Designation:response[21],
                RentalTypes:response[22]
            };
        }),
            catchError(error => of(error)));
    }
   
    getRequestObject(masterDataOperation: string): mPOSMasterDataRequest {
        var request = new mPOSMasterDataRequest()
        request.masterDataOperation = masterDataOperation;
        if (masterDataOperation === "getAllProvincesByCountryId") {
            request.DATAS.countryId = 10;
          }
          if (masterDataOperation === "getBranchList") {
            request.DATAS.companyId = 5;
          }
          if (masterDataOperation === "getAssetModelAndFitting") {
            request.DATAS.AssetModelId = this._ProposalDataService.PROPOSALASSET.value.ASSETMODELID;
          }
          
        return request;
    }
    InitializeAssetDetailMasterData(data:any){
        // this.AssetCondition = data?.AssetCondition?.ResultSet?.DataCollection;
        this.CrditPurpose = data?.CrditPurpose?.ResultSet?.DataCollection;
        this.TransmissionType = data?.TransmissionType?.ResultSet?.DataCollection;
        //this.AssetModelColour = data?.AssetModelColour?.ResultSet?.DataCollection;
        this.VehicleStyle = data?.VehicleStyle?.ResultSet?.DataCollection;
        this.AllKotamadya = data?.AllKotamadya?.ResultSet?.DataCollection;
        this.UsageArea = data?.UsageArea?.ResultSet?.DataCollection;
        this.GoodsServicesFunds = data?.GoodsServicesFunds?.ResultSet?.DataCollection;
        this.OperatorVehicle = data?.OperatorVehicle?.ResultSet?.DataCollection;
        this.FinancingType = data?.FinancingType?.ResultSet?.DataCollection;

        this.ApplicantCategoryCode = data?.ApplicantCategoryCode?.ResultSet?.DataCollection;
        this.TitleCode = data?.TitleCode?.ResultSet?.DataCollection;
        this.GenderCode = data?.GenderCode?.ResultSet?.DataCollection;
        this.MaritalStatus = data?.MaritalStatus?.ResultSet?.DataCollection;
        this.RelationshipTypeListByCompanyId = data?.RelationshipTypeListByCompanyId?.ResultSet?.DataCollection;
        this.SpAgreementType = data?.SpAgreementType?.ResultSet?.DataCollection;
        this.Branches = data?.Branches?.ResultSet?.DataCollection;
        this.AllProvincesByCountryId = data?.AllProvincesByCountryId?.ResultSet?.DataCollection;
        this.Bpkbreceivedstatus = data?.Bpkbreceivedstatus?.ResultSet?.DataCollection;
        this.Bpkbstatus = data?.Bpkbstatus?.ResultSet?.DataCollection;
        this.Owner = data?.Owner?.ResultSet?.DataCollection;
        this.Bpkbownercategory = data?.Bpkbownercategory?.ResultSet?.DataCollection;
        this.AssetModelAndFitting = data?.AssetModelAndFitting?.ResultSet?.DataCollection;
        this.Designation = data?.Designation?.ResultSet?.DataCollection;
        this.RentalTypes= data?.RentalTypes?.ResultSet?.DataCollection;
    }

}

