import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostListing } from '../types/types';
import {POSTS} from '../constants/constants'

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  posts: PostListing[];

  constructor(private router: Router) { 
    this.posts = POSTS;
  }

  ngOnInit(): void {}

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

  onTagClick(tag: String) {
    let query = "tag:"+tag;
    (document.querySelector(".search") as HTMLInputElement).value = query;
    this.filterPosts(query);
  }

  getTagClass(tag: String): String {
    return "tag-" + tag.toLowerCase();
  }

}
