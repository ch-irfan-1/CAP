import { Injectable } from '@angular/core';
import { IProposalApplicantEntity, IProposalArticleEntity } from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { ProposalEntityMapperService } from '@NFS_Modules/CAP/CAPServices/proposal-entity-mapper.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { FormArray, FormBuilder, FormGroup } from 'src/Library';

@Injectable({
    providedIn: 'root'
})
export class FilterService {

    constructor(private _formBuilder: FormBuilder, private _proposalEntityMapper: ProposalEntityMapperService, private _proposalform: ProposalEntityFormService) { }

    public FilterFormArray(_array: Array<any>): FormArray<IProposalApplicantEntity> {
        let filteredArray = _array.filter(x => x.RowState != DataRowState.Removed) as Array<IProposalApplicantEntity>;
        let formArray = this._formBuilder.array<IProposalApplicantEntity>([]);
        filteredArray.forEach(item => {
            formArray.push(this._proposalEntityMapper.ProposalApplicantEntityMapper(this._proposalform.ProposalApplicantForm(), item));
        })
        return formArray;
    }

    FilterFormGroupForArticleEntity(_array: Array<any>): FormGroup<IProposalArticleEntity> {
        let filteredarticleEntity: IProposalArticleEntity;
        let articleEntityFormGroup = this._proposalform.ProposalArticleForm();
        if (_array != null || _array != undefined) {
            filteredarticleEntity = _array.find(x => x.RowState != DataRowState.Removed) as IProposalArticleEntity;
            this._proposalEntityMapper.ProposalArticleMapper(articleEntityFormGroup, filteredarticleEntity)
        }
        return articleEntityFormGroup;



    }
}
