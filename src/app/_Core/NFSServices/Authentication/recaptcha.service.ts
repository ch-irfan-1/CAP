import { Injectable } from '@angular/core';
import { CommunicationBaseService } from '../Communication/communication-base.service';
import { AuthenticationService } from './authentication.service';
import { SERVICE_URL } from '../_helper/api-url';

@Injectable({
    providedIn: 'root'
})
export class ReCaptchaService {

    constructor(
        private _ApiComm: CommunicationBaseService,
        private authService : AuthenticationService
    ) { }

    public validateToken(token : string) {

        let request : any = {
            token: token,
        };

        this._ApiComm.APIRequest(SERVICE_URL.recaptchaUrl, request).subscribe((response: any) => {
            //this.authService.captchaVerified = response
        });
        
    }
}

