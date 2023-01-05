import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChaosRoutingModule } from './chaos-routing.module';
import { ChaosComponent } from './chaos.component';


@NgModule({
  declarations: [
    ChaosComponent
  ],
  imports: [
    CommonModule,
    ChaosRoutingModule
  ]
})
export class ChaosModule { }
