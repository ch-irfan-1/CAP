import {
  Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation
} from '@angular/core';
import Cropper from 'cropperjs';

export interface ImageCropperSetting {
  width: number;
  height: number;
}

export interface ImageCropperResult {
  imageData: Cropper.ImageData;
  cropData: Cropper.CropBoxData;
  blob?: Blob;
  dataUrl?: string;
}

@Component({
    selector: 'app-nfs-image-viewer',
    templateUrl: './nfs-image-viewer.component.html',
    styleUrls: ['./nfs-image-viewer.component.css'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class NfsImageViewerComponent implements OnInit, OnDestroy {

  @ViewChild('image') image!: ElementRef;

  @Input() imageUrl: any;
  @Input() loadImageErrorText!: string;
  @Input() cropperOptions: any = {};
  // @Input() imageHeight: any;
  // @Input() imageWidth: any;

  @Output() export = new EventEmitter<ImageCropperResult>();
  @Output() ready = new EventEmitter();

  public isLoading: boolean = true;
  public cropper!: Cropper;
  public imageElement!: HTMLImageElement;
  public loadError: any;

  constructor() { }

  ngOnInit() { }

  public rotate(isAntiClockwise: boolean = false) {
    var contData = this.cropper.getContainerData();
    this.cropper.setCropBoxData({
      width: 2, height: 2, top: (contData.height / 2) - 1, left: (contData.width / 2) - 1
    });
    if (isAntiClockwise) {
      this.cropper.rotate(-90);
    } else {
      this.cropper.rotate(90);
    }
    var canvData = this.cropper.getCanvasData();
    var newWidth = canvData.width * (contData.height / canvData.height);
    if (newWidth >= contData.width) {
      var newHeight = canvData.height * (contData.width / canvData.width);
      var newCanvData = {
        height: newHeight,
        width: contData.width,
        top: (contData.height - newHeight) / 2,
        left: 0
      };
    } else {
      var newCanvData = {
        height: contData.height,
        width: newWidth,
        top: 0,
        left: (contData.width - newWidth) / 2
      };
    }
    this.cropper.setCanvasData(newCanvData);
    this.cropper.setCropBoxData(newCanvData);
  }

  /**
   * Image loaded
   * @param ev
   */
  imageLoaded(ev: Event) {
    //
    // Unset load error state
    this.loadError = false;

    //
    // Setup image element
    const image = ev.target as HTMLImageElement;
    this.imageElement = image;

    //
    // Add crossOrigin?
    if (this.cropperOptions.checkCrossOrigin) image.crossOrigin = 'anonymous';

    //
    // Image on ready event
    image.addEventListener('ready', () => {
      //
      // Emit ready
      this.ready.emit(true);

      //
      // Unset loading state
      this.isLoading = false;
    });

    //
    // Set crop options
    // extend default with custom config
    this.cropperOptions = Object.assign(
      {
        viewMode: 1,
        dragMode: 'move',
        restore: true,
        checkCrossOrigin: true,
        checkOrientation: true,
        guides: false,
        highlight: false,
        modal: true,
        moveable: true,
        rotatable: true,
        responsive: true,
        scalable: true,
        autoCrop: false,
        center: true,
        background: false,
        zoomable: true,
        zoomOnWheel: true,
        zoomOnTouch: true,
        cropBoxMovable: true,
        cropBoxResizable: false,
        toggleDragModeOnDblclick: false,
      },
      this.cropperOptions
    );

    //
    // Set cropperjs
    if (this.cropper) {
      this.cropper.destroy();
      //this.cropper = undefined;
    }
    this.cropper = new Cropper(image, this.cropperOptions);
  }

  /**
   * Image load error
   * @param event
   */
  imageLoadError(event: any) {
    //
    // Set load error state
    this.loadError = true;

    //
    // Unset loading state
    this.isLoading = false;
  }

  /**
   * Export canvas
   * @param base64
   */
  exportCanvas(base64?: any) {
    //
    // Get and set image, crop and canvas data
    const imageData = this.cropper.getImageData();
    const cropData = this.cropper.getCropBoxData();
    const canvas = this.cropper.getCroppedCanvas();
    const data = { imageData, cropData };

    //
    // Create promise to resolve canvas data
    const promise = new Promise((resolve) => {
      //
      // Validate base64
      if (base64) {
        //
        // Resolve promise with dataUrl
        return resolve({
          dataUrl: canvas.toDataURL('image/png'),
        });
      }
      canvas.toBlob((blob) => resolve({ blob }));
    });

    //
    // Emit export data when promise is ready
    promise.then((res) => {
      this.export.emit(Object.assign(data, res));
    });
  }

  ngOnDestroy(): void {
    if (this.cropper) {
      this.cropper.destroy();
    }
    this.image?.nativeElement?.remove();
  }

}
