import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-nfs-dialog',
    templateUrl: './nfs-dialog.component.html',
    styleUrls: ['./nfs-dialog.component.css'],
    standalone: false
})
export class NfsDialogComponent implements OnInit {
@Input() public Information!: string;
  constructor(public dialogRef: MatDialogRef<NfsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogConfig) { }

  ngOnInit(): void {
  }

  onClick(btnPos: number): void {
    if (btnPos === 2) {
      this.dialogRef.close("cancel");
    } else if (btnPos === 1) {
      this.dialogRef.close("ok");
    }
  }

}

export interface DialogConfig {
  leftBtnTxt: "";
  rightBtnTxt: "";
  title: "";
  Description: ""
  showSingleButton: false;
}
