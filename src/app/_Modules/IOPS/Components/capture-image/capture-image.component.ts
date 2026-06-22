import { Component, Inject, Input, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { QuotationService } from '@NFS_Core/NFSServices/Quotation/quotation.service';
import * as QUOTENTITY from '@NFS_Entity/Quot-Entity/Quot.model.index';
import { IQUOT_DOCTInfo } from '@NFS_Entity/Quot-Entity/Quot.model.index';
import { QuotEntityFormService } from '@NFS_Modules/IOPS/IOPSServices/QuotEntityForm.service';
import { FormGroup } from 'src/Library';
import { DOC_ORIENTATION, NgxImageCompressService } from 'ngx-image-compress';
import { ToastrService } from 'ngx-toastr';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-capture-image',
    templateUrl: './capture-image.component.html',
    styleUrls: ['./capture-image.component.sass'],
    standalone: false
})
export class CaptureImageComponent implements OnDestroy {
  @Input() QUOTEntity: FormGroup<QUOTENTITY.IQuotEntity> = this._QuotForm.QuotEntityForm();
  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId!: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];
  // latest snapshot
  public webcamImage!: WebcamImage | null
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  leadNumber: string = '';
  private documentTypeSelectedDesc: string;
  private documentTypeSelectedCode: string;
  private orientation!: DOC_ORIENTATION;
  private obj = {} as IQUOT_DOCTInfo;
  private ArrayOfBytes!: string;
  private imgResultAfterCompress!: string;
  private subscription$ = new Subject();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private imageCompress: NgxImageCompressService, private _QuotationService: QuotationService,
    public _QuotForm: QuotEntityFormService, public thisDialog: MatDialogRef<CaptureImageComponent>, private _AppConfig: AppConfigService, private toastr: ToastrService) {

    this.documentTypeSelectedCode = this.data.data1[0];
    this.documentTypeSelectedDesc = this.data.data1[1];
    this.leadNumber = this.data.data1[3];

  }

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.thisDialog.close();
    this.toastr.clear();
    this.toastr.error(error.message);
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    //console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    //console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  async uploadImageFromCamera() {

    var imageType = this.webcamImage?.imageAsDataUrl.substring(11, this.webcamImage.imageAsDataUrl.indexOf(';'));
    if (!this.webcamImage) {
      this.toastr.clear();
      this.toastr.warning("Please Capture Image before proceeding.")
      return
    }
    this.obj.QUOTATIONID = this.data.quotEnt.QUOT.QUOTATIONID;
    this.obj.DOCUMENTCDE = this.documentTypeSelectedCode;
    this.obj.DOCUMENTNAME = this.GenerateFileName(imageType); //this.documentTypeSelectedDesc.replace(/(?:\.(?![^.]+$)|[^\w.])+/g, "-") + '.' + imageType;
    this.obj.Applicantnme = this.data.quotEnt.QUOTAPPLICANT[0].QUOTAPLT.CUSTOMERNME;
    if (imageType)
      this.obj.IMAGETYPE = imageType;
    if (this.webcamImage)
      this.obj.ARRAYOFBYTES = this.webcamImage?.imageAsDataUrl;
    this.obj.ARRAYOFBYTES = this.obj.ARRAYOFBYTES.replace('data:image\/' + imageType + ';base64,', "")
    this.obj.Leadnbr = this.data.quotEnt.QUOT.QUOTATIONNBR;
    this.obj.Role = '00003';
    this.obj.DOCUMENTTYPDSC = this.documentTypeSelectedDesc;

    if (this.webcamImage)
      await this.compressFile(this.webcamImage.imageAsDataUrl, this.orientation, this.obj).then();
    this.ArrayOfBytes = this.ArrayOfBytes.replace('data:image\/' + imageType + ';base64,', "")
    this.addDataToCollection(this.obj);

  }

  compressFile(image: any, orientation: DOC_ORIENTATION, obj: IQUOT_DOCTInfo): Promise<any> {
    var imageQuality = this._AppConfig.FileUploadConfig.ImageQuality; // 30
    var imageRatio = this._AppConfig.FileUploadConfig.ImageRatio; // 70
    return this.imageCompress.compressFile(image, orientation, imageRatio, imageQuality).then(
      result => {
        this.imgResultAfterCompress = result;
        this.ArrayOfBytes = this.imgResultAfterCompress;
        this.obj.ARRAYOFBYTES = this.ArrayOfBytes.replace('data:image\/' + this.obj.IMAGETYPE + ';base64,', "");
      });
  }

  addDataToCollection(obj: IQUOT_DOCTInfo) {

    this._QuotationService.UploadDocument(obj).pipe(takeUntil(this.subscription$)).subscribe((response) => {

      if (response.MESSAGE == 'Success') {
        this.toastr.clear();
        this.toastr.success("Uploaded Successfully")
      }
      if (response)
        this.thisDialog.close();
    });

  }

  imageAgain() {
    this.webcamImage = null;
  }

  GenerateFileName(fileExtention: any): string {
    return (this.documentTypeSelectedDesc.trim() + "-"
      + String(Math.floor((Math.random() * 99) + 1)).padStart(2, '0') + "-"
      + this.data.quotEnt.QUOT.QUOTATIONNBR.trim() + "."
      + fileExtention)
      .replace(/(?:\.(?![^.]+$)|[^\w.])+/g, "-");
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
}