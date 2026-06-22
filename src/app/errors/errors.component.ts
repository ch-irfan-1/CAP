import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-errors',
    templateUrl: './errors.component.html',
    styleUrls: ['./errors.component.css'],
    standalone: false
})
export class ErrorsComponent implements OnInit {
  error: any;
  code: any;
  message: any;
  requestData!: string;
  responseData!: any;
  btnCopyResponse: string = 'Copy';
  btnCopyRequest: string = 'Copy';

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.error = navigation?.extras?.state?.error;
    this.code = navigation?.extras?.state?.StatusCode;
    this.message = navigation?.extras?.state?.StatusText;
    this.requestData = navigation?.extras?.state?.requestData;
    this.responseData = this.error;
  }

  ngOnInit(): void {
  }

  goBack(){
    window.history.back();
  }
  copyToClipboard(param: string) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      if (param == 'response') {
        if (this.error.StackTrace) {
          e.clipboardData?.setData('text/plain', (this.error.StackTrace));
        }
        else {
          e.clipboardData?.setData('text/plain', (this.error));
        }
        this.btnCopyResponse = 'Copied';
        this.btnCopyRequest = 'Copy'
      }
      if (param == 'request') {
        e.clipboardData?.setData('text/plain', (this.requestData));
        this.btnCopyRequest = 'Copied'
        this.btnCopyResponse = 'Copy';
      }
      e.preventDefault();
    });
    document.execCommand('copy');
  }

  downloadFile(param: string) {
    if (param == 'response') {
      if (this.responseData.StackTrace)
        this.writeContents(this.responseData.StackTrace, 'Response' + '.txt', 'text/plain');
      else
        this.writeContents(this.responseData, 'Response' + '.txt', 'text/plain');
    }
    else if (param == 'request') {
      this.writeContents(this.requestData, 'Request' + '.txt', 'text/plain');
    }
  }

  writeContents(content: any, fileName: any, contentType: any) {
    var a = document.createElement('a');
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

}
