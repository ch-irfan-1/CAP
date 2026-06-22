import { IAttachedPeriodConfigEntity } from "./IAttachedPeriodConfigEntity";
import { IAttachedRentalConfigEntity } from "./IAttachedRentalConfigEntity";

export interface IAttachedTemplateEntity{
    AttachedRentalConfigEntity: IAttachedRentalConfigEntity;
    AttachedPeriodicConfigurationEntity: IAttachedPeriodConfigEntity
}