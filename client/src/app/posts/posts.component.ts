import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostListing } from '../types/types';
import {POSTS} from '../constants/constants'
import { BlogPost } from './blogpost';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent extends BlogPost implements OnInit {

  posts: PostListing[];
  query = "";
  router: Router;

  constructor(router: Router,
    private route: ActivatedRoute) { 
    super();
    this.router = router;
    this.posts = POSTS;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['q'];
      if (!this.query) {
        this.query = "";
      }
        this.onQuery(this.query);
    });
  }

  onClick($event: MouseEvent, path: string | undefined) {
    if (($event.target as HTMLElement).className.includes("post-tag")) {
      return;
    }
    this.router.navigateByUrl("posts/" + path);
  }

  onSearchChange($event: any) {
    this.filterPosts($event.target.value)
  }

  filterPosts(text: string) {
    if (text == "") {
      this.posts = POSTS;
      return;
    }
    if (text.startsWith("tag:") || text.startsWith("t:")) {
      text.split(":");
      let tagName = text.split(':')[1]
      if (!tagName) {
        this.posts = []
        return;
      }
      this.posts = POSTS.filter(p => p.tags.filter(t => t.startsWith(tagName.toUpperCase())).length != 0)
    } else {
      // raw text search
      this.posts = POSTS.filter(p => p.title.toLowerCase().includes(text.toLowerCase()));
    }
  }

  onQuery(q: string) {
    this.query = q;
    (document.querySelector(".search") as HTMLInputElement).value = this.query;
    this.filterPosts(this.query);
  }


}
