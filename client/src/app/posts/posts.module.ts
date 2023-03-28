import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetaPostComponent } from './meta-post/meta-post.component';
import { PostsRoutingModule } from './posts-routing.module';
import { L2mComponent } from './l2m-post/l2m.component';
import { ChaosPostComponent } from './chaos-post/chaos-post.component';
import { ThreeBodyPostComponent } from './three-body-post/three-body-post.component';
import { PostsComponent } from './posts.component';
import { HelloMlPostComponent } from './hello-ml-post/hello-ml-post.component'
import { NbaRestDaysPostComponent } from './nba-rest-days-post/nba-rest-days-post.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    MetaPostComponent,
    L2mComponent,
    ChaosPostComponent,
    ThreeBodyPostComponent,
    PostsComponent,
    HelloMlPostComponent,
    NbaRestDaysPostComponent
  ],
  imports: [
    CommonModule,
    PostsRoutingModule,
    FormsModule
  ]
})
export class PostsModule { }
