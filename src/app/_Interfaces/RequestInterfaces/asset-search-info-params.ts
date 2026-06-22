import { StatusCode } from "@NFS_Enums/StatusCode.enum";

export class IAssetInfoParams {
    ConfigurationTemplateId: number = 0;
    AssetID: number = 0;
    AssetTypeCode: string = '';
    AssetSubTypeCode: string = '';
    AssetMakeCode: string = '';
    AssetBrandCode: string = '';
    AssetModelCode: string = '';
    AssetModuleCode:string='';
    AssetConditionCode: string = '';
    RevisionID: number = 0;
    ContractID: number = 0;
    CompanyID: number = 0;
    RegisterID: number = 0;
    AssetStatus: StatusCode = StatusCode.Draft;
    AssetModelID: number = 0;
    PAGENO: number = 1;
    PAGESIZE: number = 10;
    AssetOriginationModuleCode: string = '';
    PlateNbr:string='';
    BPKBNbr:string='';
    EngineNbr:string='';
    GoodsServiceFunds: string='';
    ProposalID: number = 0;
}
