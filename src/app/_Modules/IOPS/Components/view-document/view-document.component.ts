import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { inject } from '@angular/core/testing';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { IQUOT_DOCTInfo } from '@NFS_Entity/Quot-Entity/Quot.model.index';

@Component({
    selector: 'app-view-document',
    templateUrl: './view-document.component.html',
    styleUrls: ['./view-document.component.sass'],
    standalone: false
})
export class ViewDocumentComponent implements OnInit {
  imageSource: any | undefined;
  constructor(public dialogRef: MatDialogRef<ViewDocumentComponent>, @Inject(MAT_DIALOG_DATA) public data: IQUOT_DOCTInfo,
    public sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    //console.log("Image Source" ,"data:image\/"+this.data.DOCUMENTTYPE+";base64,\/" + this.data.ArrayOfBytes)
    this.data.ARRAYOFBYTES = "data:image\/" + this.data.DOCUMENTCDE + ";base64," + this.data.ARRAYOFBYTES;
    this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.ARRAYOFBYTES);
  }

}
