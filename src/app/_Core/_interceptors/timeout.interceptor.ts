import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
    constructor(private appConfig: AppConfigService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let _channelTimeout: number = 30000;

        try {
            _channelTimeout = this.appConfig.ChannelTimeout;
        }
        catch {
        }

        return next.handle(req).pipe(timeout(_channelTimeout));
    }
}