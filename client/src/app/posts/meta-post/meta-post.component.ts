import { Component, OnInit } from '@angular/core';
import { POSTS } from 'src/app/constants/constants';
import { PostListing } from 'src/app/types/types';

@Component({
  selector: 'app-meta-post',
  templateUrl: './meta-post.component.html',
  styleUrls: ['./meta-post.component.css', '../posts.component.css']
})
export class MetaPostComponent implements OnInit {

  post: PostListing;
  constructor() {
    this.post = POSTS.find(p => p.title == "Meta Post")!;
   }

  ngOnInit(): void {
  }

}
