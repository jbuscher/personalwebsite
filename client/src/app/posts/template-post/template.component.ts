import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { POSTS } from 'src/app/constants/constants';
import { PostListing } from 'src/app/types/types';
import { BlogPost } from '../blogpost';

@Component({
  selector: 'app-template-post',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplatePostComponent extends BlogPost implements OnInit {
  post: PostListing;
  router: Router;
  constructor(router: Router) {
    super();
    this.router = router
    this.post = POSTS.find(p => p.title == "TODO - Post Name")!;
   }

  ngOnInit(): void {
  }

}
