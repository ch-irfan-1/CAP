import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NfsControlsModule } from '@NFS_Core/NFSControls/nfs-controls.module';
import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './Components/welcome/welcome.component';
import { NgChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [WelcomeComponent],
  imports: [
    CommonModule,
    NfsControlsModule,
    WelcomeRoutingModule,
    NgChartsModule 
  ]
})
export class WelcomeModule { }
