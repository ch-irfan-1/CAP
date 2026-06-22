import { INFSDropDownData } from "@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface";

export class MasterDataCollection  {
  public ApplicantTypeSetup: INFSDropDownData[] = [];
  public ApplicantIdTypesSetup: INFSDropDownData[] = [];
  public AddressStatusesSetup: INFSDropDownData[] = [];
  public ResidenceTypeSetup: INFSDropDownData[] = [];
  public LocationTypeSetup: INFSDropDownData[] = [];
  public HousingOwnerShipTypeSetup: INFSDropDownData[] = [];
  public AllProvinceData: INFSDropDownData[] = [];
  public AllKotaByProvince: Array<INFSDropDownData[]> = [];
  public AllKecamatanByKota: Array<INFSDropDownData[]> = [];
  public AllKelurahanByKeca: Array<INFSDropDownData[]> = [];
  public AddressTypeSetup: INFSDropDownData[] = [];
  public AllDefaultAddresses: Array<INFSDropDownData[]> = [];
  public AllBranches: INFSDropDownData[] = [];
  public AllDealerByBranch: INFSDropDownData[] = [];
  public AllFpGroups: INFSDropDownData[] = [];
  public AllFpCampigns: INFSDropDownData[] = [];
  public AllPhoneTypes: INFSDropDownData[] = [];
  public RejectionReasonSetup: INFSDropDownData[] = [];
  public AllEmergencyContactRelationTypes: INFSDropDownData[] = [];
  public DocumentTypes: INFSDropDownData[] = [];
}