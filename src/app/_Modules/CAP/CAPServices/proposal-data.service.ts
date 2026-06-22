import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import * as PROPOSALENTITY from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { ICashFlowEntity } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/ProposalApplicantEntity.model.index';
import { IProposalRepaymentPlanEntity } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/IProposalRepaymentPlanEntity.model';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { MaritalStatus } from '@NFS_Enums/MaritalStatus.enum';
import { RoleCode } from '@NFS_Enums/RoleCode';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { FormArray, FormGroup } from 'src/Library';
import  moment from 'moment';
import { filter } from 'rxjs/operators';
import { FinancialInfoHelper } from '../_helpers/FinancialInfoHelper';
import { IPRPL_DVTN_TRCK } from '@NFS_Entity/ProposalDTS-Entity/IPRPL_DVTN_TRCK.model';


@Injectable({
  providedIn: 'root'
})
export class ProposalDataService {

  // Public Properties
  public ProposalEntity: FormGroup<PROPOSALENTITY.IProposalEntity>;
  public FinancialHelperForm: FormGroup<FinancialInfoHelper>;

  // Private Properties
  private CurrentSelectedApplicant !: FormGroup<PROPOSALENTITY.IProposalApplicantEntity>;
  private CurrentApplicantType !: string;
  private TemplateAsetModelSeqID !: number;
  private isExistingBP: boolean = false;
  constructor(private _ProposalForm: ProposalEntityFormService, private router: Router) {

    this.ProposalEntity = this._ProposalForm.ProposalEntity();
    this.FinancialHelperForm = this._ProposalForm.FinancialHelperForm();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    )
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          if (event.url != '/Proposal/createProposal') {
            this.resetServiceProperties();
          }
        }
      });
  }

  get ProposalTrukDetail(){
    return this.ASSETENTITY.controls.TRUCKDETAILS;
  }

  get ProposalCashFlowDetail() {
    return this.PROPOSALAPPLICANT.controls[0].get("PrposalcashflowDetail") as FormGroup<ICashFlowEntity>;
  }

  get PROPOSAL() {
    return this.ProposalEntity.get("PROPOSAL") as FormGroup<PROPOSALENTITY.IPRPLInfo>;
  }

  get PROPOSALAPPLICANT() {
    return this.ProposalEntity.get("PROPOSALAPPLICANT") as FormArray<PROPOSALENTITY.IProposalApplicantEntity>;
  }

  get PROPOSALUSER() {
    return this.ProposalEntity.get("PRPLIOPSUSER") as FormGroup<PROPOSALENTITY.IPRPL_IOPS_USERInfo>;
  }
  get PRPLDVTNTRCK(){
    return this.ProposalEntity.get("PRPLDVTNTRCK") as FormArray<IPRPL_DVTN_TRCK>;
  }
  get PROPOSALTEMPLATERENTALINT() {
    return this.ProposalEntity.get("PROPOSALTEMPLATERENTALINT") as FormGroup<PROPOSALENTITY.IPRPL_TPLE_RNTL_INTInfo>;
  }

  get PROPOSALADMINFEEDETAIL() {
    let a = this.ProposalEntity.get("PROPOSALARTICLE") as FormArray<PROPOSALENTITY.IProposalArticleEntity>
    return a.controls[a.controls.length - 1].controls.ASSETENTITY.controls.PROPOSALADMINFEEDETAIL;
  }

  get OTOPRPLASSTBPKBDETL() {
    let a = this.ProposalEntity.get("PROPOSALARTICLE") as FormArray<PROPOSALENTITY.IProposalArticleEntity>
    return a.controls[a.controls.length - 1].controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL;
  }

  get PROPOSALARTICLE() {
    return this.ProposalEntity.get("PROPOSALARTICLE") as FormArray<PROPOSALENTITY.IProposalArticleEntity>
  }

  get PROPOSALARTICLEFORMGROUP() {
    let a = this.ProposalEntity.get("PROPOSALARTICLE") as FormArray<PROPOSALENTITY.IProposalArticleEntity>;
    return a?.controls[a.controls.length - 1];
  }

  get PROPOSALCOMMISSIONENTITY() {
    let a = this.ProposalEntity.get("PROPOSALARTICLE") as FormArray<PROPOSALENTITY.IProposalArticleEntity>
    return a.controls[a.controls.length - 1].controls.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY;
  }

  get PROPOSALFINANCIALAGREEMENT() {
    let a = this.ProposalEntity.get("PROPOSALARTICLE") as FormArray<PROPOSALENTITY.IProposalArticleEntity>
    return a?.controls[a.controls.length - 1]?.controls?.ASSETENTITY?.controls?.PROPOSALFINANCIALAGREEMENT;
  }

  get PRPLARTICLECOMPONENTENTITYCOL() {
    let a = this.ProposalEntity.get("PROPOSALARTICLE") as FormArray<PROPOSALENTITY.IProposalArticleEntity>
    return a.controls[a.controls.length - 1].controls.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL;
  }

  get PROPOSALASSET() {
    let a = this.ProposalEntity.get("PROPOSALARTICLE") as FormArray<PROPOSALENTITY.IProposalArticleEntity>
    return a.controls[a.controls.length - 1].controls.ASSETENTITY.controls.PROPOSALASSET;
  }

  get PROPOSALVEHICLEDETAIL() {
    let a = this.ProposalEntity.get("PROPOSALARTICLE") as FormArray<PROPOSALENTITY.IProposalArticleEntity>
    return a.controls[a.controls.length - 1].controls.ASSETENTITY.controls.PROPOSALVEHICLEDETAIL;
  }

  get OTOPRPLASSTBPKBRPRSDETL() {
    let a = this.ProposalEntity.get("PROPOSALARTICLE") as FormArray<PROPOSALENTITY.IProposalArticleEntity>
    return a.controls[a.controls.length - 1].controls.ASSETENTITY.controls.OTOPRPLASSTBPKBRPRSDETL;
  }

  get OTOPRPLASSTBPKBGRTRDETL() {
    let a = this.ProposalEntity.get("PROPOSALARTICLE") as FormArray<PROPOSALENTITY.IProposalArticleEntity>
    return a.controls[a.controls.length - 1].controls.ASSETENTITY.controls.OTOPRPLASSTBPKBGRTRDETL;
  }

  get PROPOSALACCESSORY() {
    let a = this.ProposalEntity.get("PROPOSALARTICLE") as FormArray<PROPOSALENTITY.IProposalArticleEntity>
    return a.controls[a.controls.length - 1].controls.ASSETENTITY.controls.PROPOSALACCESSORY;
  }

  get ASSETENTITY() {
    let a = this.ProposalEntity.get("PROPOSALARTICLE") as FormArray<PROPOSALENTITY.IProposalArticleEntity>
    return a.controls[a.controls.length - 1].controls.ASSETENTITY;
  }

  get PRPLCMPTCNFG() {
    return this.ProposalEntity.get("PRPLCMPTCNFG") as FormArray<PROPOSALENTITY.IPRPL_CMPT_CNFGInfo>;
  }

  get PROPOSALPROVISIONFEEDETAIL() {
    let a = this.ProposalEntity.get("PROPOSALARTICLE") as FormArray<PROPOSALENTITY.IProposalArticleEntity>
    return a.controls[a.controls.length - 1].controls.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL;
  }

  get PROPOSALINSURANCEMAIN() {
    let a = this.ProposalEntity.get("PROPOSALARTICLE") as FormArray<PROPOSALENTITY.IProposalArticleEntity>
    return a.controls[a.controls.length - 1].controls.ASSETENTITY.controls.PROPOSALINSURANCEMAIN;
  }

  get PROPOSALARTICLEBASERATE() {
    let a = this.ProposalEntity.get("PROPOSALARTICLE") as FormArray<PROPOSALENTITY.IProposalArticleEntity>
    return a.controls[a.controls.length - 1].controls.ASSETENTITY.controls.PROPOSALARTICLEBASERATE;
  }

  get PROPOSALROUNDINGTEMPLATE() {
    return this.ProposalEntity.get("PROPOSALROUNDINGTEMPLATE") as FormGroup<PROPOSALENTITY.IProposalRoundingTemplateEntity>;
  }

  get PROPOSALSUBSIDYDETAIL() {
    let a = this.ProposalEntity.get("PROPOSALARTICLE") as FormArray<PROPOSALENTITY.IProposalArticleEntity>
    return a.controls[a.controls.length - 1].controls.ASSETENTITY.controls.PROPOSALSUBSIDYDETAIL;
  }

  get LASTPROPOSALREPAYMENTPLAN() {
    let a = this.ProposalEntity.get("PROPOSALARTICLE") as FormArray<PROPOSALENTITY.IProposalArticleEntity>
    let repaymentplan = a.controls[a.controls.length - 1].controls.ASSETENTITY.controls.PROPOSALREPAYMENTPLANENTITYCOL as FormArray<IProposalRepaymentPlanEntity>;
    return repaymentplan.controls[repaymentplan.controls.length - 1] as FormGroup<IProposalRepaymentPlanEntity>;
  }

  get PROPOSALREPAYMENTPLANENTITYCOL() {
    let a = this.ProposalEntity.get("PROPOSALARTICLE") as FormArray<PROPOSALENTITY.IProposalArticleEntity>
    return a.controls[a.controls.length - 1].controls.ASSETENTITY.controls.PROPOSALREPAYMENTPLANENTITYCOL as FormArray<IProposalRepaymentPlanEntity>;
  }

  get PROPOSALCHARGE() {
    return this.PROPOSALARTICLE.controls[this.PROPOSALARTICLE.controls.length - 1].controls.ASSETENTITY.controls.PROPOSALCHARGE
  }

  get PROPOSALCHART() {
    return this.ProposalEntity.get("PROPOSALCHART") as FormArray<PROPOSALENTITY.IPRPL_CHRTInfo>;
  }

  get BORROWERSPOUSEDETAILS() {
    let applicantIndex: number = this.PROPOSALAPPLICANT.controls.findIndex(ap => ap.value.PROPOSALAPPLICANTMAIN.ROLECDE === RoleCode.Borrower && ap.value.RowState !== DataRowState.Removed);
    if (this.PROPOSALAPPLICANT.controls[applicantIndex].controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.MARITALSTATUSCDE.value === MaritalStatus.Married) {
      return this.PROPOSALAPPLICANT.controls[applicantIndex].controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPSPOUSEDETAIL.controls[0];
    }
    return null;
  }

  get CURRENTBORROWER() {
    let applicantIndex: number = this.PROPOSALAPPLICANT.controls.findIndex(ap => ap.value.PROPOSALAPPLICANTMAIN.ROLECDE === RoleCode.Borrower && ap.value.RowState !== DataRowState.Removed);
    return this.PROPOSALAPPLICANT.controls[applicantIndex];
  }

  get PROPOSALAPPFAMILY() {
    return this.CURRENTBORROWER.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPFAMILY;
  }

  get PRPLINSR() {
    return this.PROPOSALINSURANCEMAIN.controls[this.PROPOSALINSURANCEMAIN.controls.length - 1]?.controls.PRPLINSR;
  }

  get STANDARDINSURANCE() {
    return this.PROPOSALINSURANCEMAIN.controls[this.PROPOSALINSURANCEMAIN.controls.length - 1]?.controls.STANDARDINSURANCE;
  }

  get INSRDPRNPLCY() {
    return this.PROPOSALINSURANCEMAIN.controls[this.PROPOSALINSURANCEMAIN.controls.length - 1]?.controls.INSRDPRNPLCY;
  }

  resetServiceProperties() {
    this.ProposalEntity = this._ProposalForm.ProposalEntity();
  }

  set SetCurrentApplicant(val: any) {
    this.CurrentSelectedApplicant = val as FormGroup<PROPOSALENTITY.IProposalApplicantEntity>;
  }

  get CurrentApplicant() {
    return this.CurrentSelectedApplicant as FormGroup<PROPOSALENTITY.IProposalApplicantEntity>;
  }

  set ApplicantType(val: string) {
    this.CurrentApplicantType = val;
  }

  get ApplicantType() {
    return this.CurrentApplicantType;
  }

  // Property to Set Template Asset Model SeqID on selection of FinancialProduct
  set TPLEASETMODLSEQID(val: number) {
    this.TemplateAsetModelSeqID = val;
  }

  get TPLEASETMODLSEQID() {
    return this.TemplateAsetModelSeqID;
  }

  getMonths(date: Date | null) {
    let monthsMoment, years, months = 0;
    let yearmonthlist = []
    if (date == null) {
      years = 0;
      months = 0;
      yearmonthlist.push(years);
      yearmonthlist.push(months)

    }
    else {
      monthsMoment = moment().diff(date, 'months');
      years = Math.floor(monthsMoment / 12);
      months = monthsMoment % 12;
      yearmonthlist.push(years);
      yearmonthlist.push(months)
    }
    return yearmonthlist;
  }

  getDuration(fromdte: Date, todte: Date) {
    var a = moment(todte);
    var b = moment(fromdte);
    let yearmonthlist = []
    var years = a.diff(b, 'year');
    b.add(years, 'years');

    var months = a.diff(b, 'months');
    b.add(months, 'months');

    yearmonthlist.push(years)
    yearmonthlist.push(months)
    return yearmonthlist;
  }

  concatenateNames(fname: string, mname: string | null = null, lname: string) {
    var fullName = "";
    if (mname != null && lname != null) {
      fullName = fname + ' ' + mname + ' ' + lname;
    }
    else if (mname == null && lname != null) {
      fullName = fname + ' ' + lname;
    }
    else if (mname != null && lname == null) {
      fullName = fname + ' ' + mname;
    }
    else {
      fullName = fname;
    }
    fullName = fullName?.trim();
    return fullName;
  }

public BirthdayNotReached(inDate1: Date, inDate2: Date, years: number, months: number, days: number) {
  let y = 0;
  let m = 0;
  let d = 0;

  inDate1 = new Date(inDate1);
  inDate2 = new Date(inDate2);

  let date1: Date = inDate1 <= inDate2 ? inDate1 : inDate2;
  let date2: Date = inDate1 <= inDate2 ? inDate2 : inDate1;

  let temp: Date;
  let yearsMonthsDaysArray = [];
  if (
    this.isLeapYear(date1.getFullYear()) &&
    !this.isLeapYear(date2.getFullYear()) &&
    date1.getMonth() == 1 &&
    date1.getDate() == 29
  ) {
    temp = new Date(date2.getFullYear(), date1.getMonth(), date1.getDate() - 1);
  } else {
    temp = new Date(date2.getFullYear(), date1.getMonth(), date1.getDate());
  }

  y = date2.getFullYear() - date1.getFullYear() - (temp > date2 ? 1 : 0);
  m = date2.getMonth() - date1.getMonth() + (12 * (temp > date2 ? 1 : 0));

  d = date2.getDate() - date1.getDate();

  if (d < 0) {
    if (
      date2.getDate() == this.daysInMonth(date2.getFullYear(), date2.getMonth()) &&
      (
        date1.getDate() >= this.daysInMonth(date2.getFullYear(), date2.getMonth()) ||
        date1.getDate() >= this.daysInMonth(date2.getFullYear(), date1.getMonth())
      )
    ) {
      d = 0;
    } else {
      if (
        this.daysInMonth(date2.getFullYear(), date2.getMonth()) ==
        this.daysInMonth(date1.getFullYear(), date1.getMonth()) &&
        date2.getMonth() != date1.getMonth()
      ) {
        let daybase =
          date2.getMonth() - 1 >= 0
            ? this.daysInMonth(date2.getFullYear(), date2.getMonth() - 1)
            : 31;
        d = daybase + d;
      } else {
        d =
          this.daysInMonth(
            date2.getFullYear(),
            date2.getMonth() == 0 ? 11 : date2.getMonth() - 1
          ) + d;
      }
    }
  }

  years = y;
  months = m;
  days = d;

  yearsMonthsDaysArray.push(years);
  yearsMonthsDaysArray.push(months);
  yearsMonthsDaysArray.push(days);

  return yearsMonthsDaysArray;
}


  public DateDiff(inDate1: Date, inDate2: Date, years: number, months: number, days: number) {
    let y = 0;
    let m = 0;
    let d = 0;
    inDate1 = new Date(inDate1);
    inDate2 = new Date(inDate2)
    let date1: Date = inDate1 <= inDate2 ? inDate1 : inDate2;
    let date2: Date = inDate1 <= inDate2 ? inDate2 : inDate1;
    let temp: Date;
    let yearsMonthsDaysArray = [];
    if (this.isLeapYear(date1.getFullYear()) && !this.isLeapYear(date2.getFullYear()) && date1.getMonth() == 2 && date1.getDay() == 29) {
      temp = new Date(date2.getFullYear(), date1.getMonth(), date1.getDay() - 1);
    }
    else {
      temp = new Date(date2.getFullYear(), date1.getMonth(), date1.getDay() - 1);
    }
    y = date2.getFullYear() - date1.getFullYear() - (temp > date2 ? 1 : 0);
    m = date2.getMonth() - date1.getMonth() + (12 * (temp > date2 ? 1 : 0));
    d = date2.getDay() - date1.getDay();
    if (d < 0) {
      if (date2.getDay() == this.daysInMonth(date2.getFullYear(), date2.getMonth()) && (date1.getDay() >= this.daysInMonth(date2.getFullYear(), date2.getMonth()) || date1.getDay() >= this.daysInMonth(date2.getFullYear(), date1.getMonth()))) {
        d = 0;
      }
      else {
        if (this.daysInMonth(date2.getFullYear(), date2.getMonth()) == this.daysInMonth(date1.getFullYear(), date1.getMonth()) && date2.getMonth() != date1.getMonth()) {
          let daybase = date2.getMonth() - 1 > 0 ? this.daysInMonth(date2.getFullYear(), date2.getMonth() - 1) : 31;
          d = daybase + 2
        }
        else {
          d = this.daysInMonth(date2.getFullYear(), date2.getMonth() == 1 ? 12 : date2.getMonth() - 1) + d;
        }
      }
    }
    years = y;
    months = m;
    days = d;
    yearsMonthsDaysArray.push(years);
    yearsMonthsDaysArray.push(months);
    yearsMonthsDaysArray.push(days);
    return yearsMonthsDaysArray;
  }

  public isLeapYear(year: number) {

    //three conditions to find out the leap year
    if ((0 == year % 4) && (0 != year % 100) || (0 == year % 400)) {
      return true;
    } else {
      return false;
    }
  }

  public daysInMonth(year: number, month: number) {
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    return daysInMonth;
  }

}
