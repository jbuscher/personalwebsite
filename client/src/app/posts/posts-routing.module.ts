import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { L2mComponent } from './l2m-post/l2m.component';
import { MetaPostComponent } from './meta-post/meta-post.component';
import { PostsComponent } from './posts.component';
import { ChaosPostComponent } from './chaos-post/chaos-post.component';
import { ThreeBodyPostComponent } from './three-body-post/three-body-post.component';


const routes: Routes = [
  { path: '', component: PostsComponent },
  { path: 'meta', component: MetaPostComponent },
  { path: 'l2m', component: L2mComponent },
  { path: 'chaos', component: ChaosPostComponent },
  { path: 'threeBody', component: ThreeBodyPostComponent }];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostsRoutingModule { }
