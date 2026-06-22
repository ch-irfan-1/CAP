import { Injectable } from '@angular/core';
import { MandatoryControlsEnum } from '@NFS_Enums/MandatoryControlsEnum';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { ToastrService } from 'ngx-toastr';
import { AppConfigService } from '../ApplicationConfig/app-config.service';
import * as PROPOSALENTITY from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { ApplicantRoleCode } from '@NFS_Enums/ApplicantRoleCode.enum';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  public ErrorMessages: any = new Map<string, string>();

  

  constructor(private _appConfig: AppConfigService, private toastr: ToastrService) { }

  showMesssage(msgCode: string, type: MessageType = MessageType.Success) {
    let msg = '';
    if (this._appConfig.Messages)
      if ((typeof this._appConfig.Messages == "object") && (this._appConfig.Messages !== null))
        msg = this._appConfig.Messages[msgCode];
    if (msg) {
      switch (type) {
        case MessageType.Success: {
          this.toastr.success(this._appConfig.Messages[msgCode]?.Message);
          break;
        }
        case MessageType.Error: {
          this.toastr.error(this._appConfig.Messages[msgCode]?.Message);
          break;
        }
        case MessageType.Info: {
          this.toastr.info(this._appConfig.Messages[msgCode]?.Message);
          break;
        }
        case MessageType.Warning: {
          this.toastr.warning(this._appConfig.Messages[msgCode]?.Message);
          break;
        }
        default: {
          this.toastr.error("Message code not found");
          console.log(msgCode);
          break;
        }
      }
    }
    else {
      this.toastr.error("Message code not found");
      console.log(msgCode);
    }

  }


  showNewMesssage(msgCode: any, roleCode : string, type: MessageType = MessageType.Success) {
    let msg = '';
    
    if (this._appConfig.Messages)
      if ((typeof this._appConfig.Messages == "object") && (this._appConfig.Messages !== null))
        // msgCode.forEach(m => {

        if(this._appConfig.Messages[msgCode[0]]){
        msg = this._appConfig.Messages[msgCode[0]].Message as string;
        msg = msg.replace("{0}", roleCode );
        }
        else{
          msg = this._appConfig.Messages[msgCode].Message as string;
          msg = msg.replace("{0}", roleCode );
        }
        // });
    
    if (msg) {
      switch (type) {
        case MessageType.Success: {
          this.toastr.success(msg);
          break;
        }
        case MessageType.Error: {
          this.toastr.error(msg);
          break;
        }
        case MessageType.Info: {
          this.toastr.info(msg);
          break;
        }
        case MessageType.Warning: {
          this.toastr.warning(msg);
          break;
        }
        default: {
          this.toastr.error("Message code not found");
          console.log(msg);
          break;
        }
      }
    }
  
    else {
      this.toastr.error("Message code not found");
      console.log(msgCode[0]);
    }

  }

  showCustomMesssage(message: string, type: MessageType = MessageType.Success) {
    switch (type) {
      case MessageType.Success: {
        this.toastr.success(message);
        break;
      }
      case MessageType.Error: {
        this.toastr.error(message);
        break;
      }
      case MessageType.Info: {
        this.toastr.info(message);
        break;
      }
      case MessageType.Warning: {
        this.toastr.warning(message);
        break;
      }
      default: {
        this.toastr.error("Message code not found");
        break;
      }
    }
  }

  GetMessage(massage: string): string {
    let msg = '';
    if (this._appConfig.Messages)
      if ((typeof this._appConfig.Messages == "object") && (this._appConfig.Messages !== null))
        msg = this._appConfig.Messages[massage]?.Message;
    return msg;
  }

  CreateControlCustomMessage(message: string, component: string) {
    return message + MandatoryControlsEnum.GetStringValue(component);
  }

  ClearValidatorMessages(keyValue: string = '') {
    if (keyValue === '') {
      this.ErrorMessages.clear();
    }
    else if (this.ErrorMessages.size > 0) {
      this.ErrorMessages.forEach((error: string | undefined, key: string) => {
        if (key?.includes(keyValue)) {
          this.ErrorMessages.delete(key);
        }
      })
    }
  }
}
