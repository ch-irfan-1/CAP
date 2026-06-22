export class mPOSMasterDataRequest  {
    masterDataOperation: string = '';
    DATAS: data = {} as data;
}

export class data  {
    Name: string = '';
    countryId: number = 0;
    provinceId: number = 0;
    kotamadyasId: number = 0;
    kecamatansId: number = 0;
    businessPartnerId: number = 0;
    branchId: number = 0;
    companyId: number = 5;
    dealerId: number = 0;
    groupId: number = 0;
    applicantType: string = '';
    UserGroupCode: string = '';
    AssetModelId: number = 0 ;
    BankBpId:number=0;
    AssetTypeCode: any = null ;
    TPLEASETMODLSEQID:number=0;
    AssetSubTypeCode:any = null ;
    AssetMakeCode:any = null ;
    AssetBrandCode:any = null ;
    }