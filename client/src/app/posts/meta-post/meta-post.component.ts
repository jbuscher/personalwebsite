import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { POSTS } from 'src/app/constants/constants';
import { PostListing } from 'src/app/types/types';
import { BlogPost } from '../blogpost';

@Component({
  selector: 'app-meta-post',
  templateUrl: './meta-post.component.html',
  styleUrls: ['./meta-post.component.css', '../posts.component.css']
})
export class MetaPostComponent extends BlogPost implements OnInit {
  post: PostListing;
  router: Router;
  constructor(router: Router) {
    super();
    this.router = router
    this.post = POSTS.find(p => p.title == "Meta Post")!;
   }

  ngOnInit(): void {
  }

}
