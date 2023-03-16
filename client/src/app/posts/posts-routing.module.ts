import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { L2mComponent } from './l2m-post/l2m.component';
import { MetaPostComponent } from './meta-post/meta-post.component';
import { PostsComponent } from './posts.component';
import { ChaosPostComponent } from './chaos-post/chaos-post.component';
import { ThreeBodyPostComponent } from './three-body-post/three-body-post.component';
import { HelloMlPostComponent } from './hello-ml-post/hello-ml-post.component';


const routes: Routes = [
  { path: 'posts', component: PostsComponent },
  { path: 'posts/meta', component: MetaPostComponent },
  { path: 'posts/l2m', component: L2mComponent },
  { path: 'posts/chaos', component: ChaosPostComponent },
  { path: 'posts/threeBody', component: ThreeBodyPostComponent },
  { path: 'posts/helloMl', component: HelloMlPostComponent }];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostsRoutingModule { }
