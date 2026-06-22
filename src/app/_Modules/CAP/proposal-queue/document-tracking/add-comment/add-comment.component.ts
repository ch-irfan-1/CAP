import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';

@Component({
    selector: 'app-add-comment',
    templateUrl: './add-comment.component.html',
    styleUrls: ['./add-comment.component.css'],
    standalone: false
})

export class AddCommentComponent{
    constructor(public dialogRef: MatDialogRef<AddCommentComponent>,private _formBuilder: UntypedFormBuilder, @Inject(MAT_DIALOG_DATA) public Param: any, ){
        this.DocumentComment.controls.DOCUMENTCOMMENT.setValue(Param.Comment);
    }
    DocumentComment: UntypedFormGroup = this._formBuilder.group({
        DOCUMENTCOMMENT: ''
    })
    cancel() {
        this.dialogRef.close(false);
    }
    okClick(){
        this.dialogRef.close({comment:this.DocumentComment.controls.DOCUMENTCOMMENT.value});
    }
}
