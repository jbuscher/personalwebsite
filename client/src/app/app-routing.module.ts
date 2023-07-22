import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { MlComponent } from './ml/ml.component';
import { ProjectsComponent } from './projects/projects.component';
import { GolfComponent } from './golf/golf.component';

const routes: Routes = [
  { path: 'chaos', loadChildren: () => import('./chaos/chaos.module').then(m => m.ChaosModule) },
  { path: 'planets', loadChildren: () => import('./planets/planets.module').then(m => m.PlanetsModule) },
  { path: 'projects', component: ProjectsComponent },
  { path: 'about', component: ContactComponent },
  { path: 'ml', component: MlComponent },
  { path: 'golf', component: GolfComponent },
  { path: 'posts', loadChildren: () => import('./posts/posts.module').then(m => m.PostsModule) },
  { path: '', redirectTo:"/posts", pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
