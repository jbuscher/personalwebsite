import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HELLO_ML, POSTS } from 'src/app/constants/constants';
import { PostListing } from 'src/app/types/types';
import { BlogPost } from '../blogpost';

@Component({
  selector: 'app-hello-ml-post',
  templateUrl: './hello-ml-post.component.html',
  styleUrls: ['./hello-ml-post.component.css', '../posts.component.css']
})
export class HelloMlPostComponent extends BlogPost implements OnInit {
  post: PostListing;
  router: Router;
  constructor(router: Router) {
    super();
    this.router = router
    this.post = POSTS.find(p => p.title == HELLO_ML)!;
   }

  ngOnInit(): void {
  }

}
