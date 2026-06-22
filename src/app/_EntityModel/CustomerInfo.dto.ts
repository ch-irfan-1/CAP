export class CustomerInfo{
    FirstName: string ="";
    MiddleName?: string;
    LastName?: string;
    Address: Array<CustomerAddress> = [];
    rowstate: string = "unchanged"

}

export class CustomerAddress{
    Address: string = "";
    city:  string | null = null
    province?: string | null;
    phone?: Array<PhoneInfo>;
    rowstate: string = "unchanged"
}

export class PhoneInfo{
    phoneNumber: string= "";
    phoneType: string = "";
    extension?: string
    rowstate: string = "unchanged"
}


export class ContractInfo{
    contractnumber: string = "";
    OptionalDetails?: string;
}