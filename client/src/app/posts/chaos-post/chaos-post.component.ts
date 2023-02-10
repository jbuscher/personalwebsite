import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CHAOS, POSTS } from 'src/app/constants/constants';
import { PostListing } from 'src/app/types/types';
import { BlogPost } from '../blogpost';

@Component({
  selector: 'app-chaos-post',
  templateUrl: './chaos-post.component.html',
  styleUrls: ['./chaos-post.component.css', '../posts.component.css']
})
export class ChaosPostComponent extends BlogPost implements OnInit {

  post: PostListing;
  router: Router;
  
  constructor(router: Router) {
    super()
    this.router = router;
    this.post = POSTS.find(p => p.title == CHAOS)!;
   }

  ngOnInit(): void {
  }
}
