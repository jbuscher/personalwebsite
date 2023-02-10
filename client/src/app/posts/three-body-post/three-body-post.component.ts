import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { POSTS, THREE_BODY } from 'src/app/constants/constants';
import { PostListing } from 'src/app/types/types';
import { BlogPost } from '../blogpost';

@Component({
  selector: 'app-three-body-post',
  templateUrl: './three-body-post.component.html',
  styleUrls: ['./three-body-post.component.css', '../posts.component.css']
})
export class ThreeBodyPostComponent extends BlogPost implements OnInit {
  post: PostListing;
  router: Router;
  constructor(router: Router) {
    super();
    this.router = router
    this.post = POSTS.find(p => p.title == THREE_BODY)!;
   }

  ngOnInit(): void {
  }

}
