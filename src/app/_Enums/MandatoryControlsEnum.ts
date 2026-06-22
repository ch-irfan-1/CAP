
export namespace MandatoryControlsEnum {
    export function GetStringValue(key: any): string {
        let strVal = '';

        switch (key) {
            case 'GeneralHeader': {
                strVal = ' at proposal header';
                break;
            }
            case 'IndividualBorrower': {
                strVal = ' for borrower at applicant';
                break;
            }
            case 'CompanyBorrower': {
                strVal = ' for borrower at applicant';
                break;
            }
            case 'IndividualBorrower-Bank': {
                strVal = ' for borrower at bank';
                break;
            }
            case 'CompanyBorrower-Bank': {
                strVal = ' for borrower at bank';
                break;
            }
            case 'IndividualBorrower-Employment': {
                strVal = ' for borrower at employment';
                break;
            }
            case 'IndividualBorrower-Address': {
                strVal = ' for borrower at address';
                break;
            }
            case 'CompanyBorrower-Address': {
                strVal = ' for borrower at address';
                break;
            }
            case 'CompanyBorrower-Representative': {
                strVal = ' for borrower at representative';
                break;
            }
            case 'IndividualBorrower-FamilyMember': {
                strVal = ' for borrower at family member';
                break;
            }
            case 'IndividualBorrower-Reference': {
                strVal = ' for borrower at reference';
                break;
            }
            case 'CompanyBorrower-Reference': {
                strVal = ' for borrower at reference';
                break;
            }
            case 'CompanyBorrower-Business': {
                strVal = ' for borrower at business';
                break;
            }
            case 'AssetTypeDetail': {
                strVal = ' at asset details';
                break;
            }
            case 'ProposalFinancialDetail': {
                strVal = ' at financial details';
                break;
            }
            case 'IndividualBorrower-Spouse': {
                strVal = ' for borrower spouse details';
                break;
            }
            case 'CoBorrowerIndividual-Spouse': {
                strVal = ' for co-borrower spouse details';
                break;
            }
            case 'GuarantorIndividual-Spouse': {
                strVal = ' for guarantor spouse details';
                break;
            }
            case 'Assets': {
                strVal = ' at asset details';
                break;
            }
            default: {
                strVal = '';
                break;
            }
        }

        return strVal;
    }
}
