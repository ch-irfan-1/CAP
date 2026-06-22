import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { BPROLE } from "@NFS_Entity/BusinessPartner-Entity/BP_ROLEInfo";
import { BPROLEDETL } from "@NFS_Entity/BusinessPartner-Entity/BP_ROLE_DETLInfo";
import { BPCOMUSER } from "@NFS_Entity/Login-Entity/BP_COMYInfo";
import { BPSYSUSER } from "@NFS_Entity/Login-Entity/BP_SYS_USERInfo";
import { COMPANYSYSUSER } from "@NFS_Entity/Login-Entity/BP_SYS_USER_COMY";
import { LANGUAGECODE } from "@NFS_Entity/Login-Entity/LANG_CODEInfo";
import { PASSWORDPOLICY } from "@NFS_Entity/Login-Entity/PASW_PLCY_CODEInfo";
import { USERBUSINESSRULESWAIVER } from "@NFS_Entity/Login-Entity/USER_BSRL_WAVRInfo";
import { USERGROUPASSOCIATION } from "@NFS_Entity/Login-Entity/USER_GRUP_ASSNInfo";
import { USERREQUESTASSOCIATION } from "@NFS_Entity/Login-Entity/USER_REQT_ASSNInfo";
import { USERTEAMHIERARCHY } from "@NFS_Entity/Login-Entity/USER_TEAM_HRCYInfo";

export interface WorkflowUser extends IBaseEntity{
    BPCOMUSER: BPCOMUSER;
    BPROLEDETL: BPROLEDETL[];
    BPROLES: BPROLE[];
    BPSYSUSER: BPSYSUSER;
    COMPANYSYSUSER: COMPANYSYSUSER[];
    LANGUAGECODE: LANGUAGECODE;
    PASSWORDPOLICY: PASSWORDPOLICY;
    USERBUSINESSRULESWAIVER: USERBUSINESSRULESWAIVER;
    USERGROUPASSOCIATION: USERGROUPASSOCIATION[];
    USERREQUESTASSOCIATION: USERREQUESTASSOCIATION;
    USERTEAMHIERARCHY: USERTEAMHIERARCHY;
}