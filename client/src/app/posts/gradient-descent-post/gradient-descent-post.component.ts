import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GRADIENT, POSTS } from 'src/app/constants/constants';
import { PostListing } from 'src/app/types/types';
import { BlogPost } from '../blogpost';

@Component({
  selector: 'app-gradient-descent-post',
  templateUrl: './gradient-descent-post.component.html',
  styleUrls: ['./gradient-descent-post.component.css', '../posts.component.css']
})
export class GradientDescentPostComponent extends BlogPost implements OnInit {
  post: PostListing;
  router: Router;
  constructor(router: Router) {
    super();
    this.router = router
    this.post = POSTS.find(p => p.title == GRADIENT)!;
   }

  ngOnInit(): void {
  }

}
