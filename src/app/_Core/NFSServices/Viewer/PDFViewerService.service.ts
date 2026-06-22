import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class PDFViewerService {

    constructor() { }

    GeneratePDFDocument(_base64String: string) {
        const byteArray = new Uint8Array(atob(_base64String).split('').map(char => char.charCodeAt(0)));
        let file = new Blob([byteArray], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL, "OVP Stationery", "popup");
    }
}
