import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChaosComponent } from './chaos.component';

const routes: Routes = [{ path: '', component: ChaosComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChaosRoutingModule { }
