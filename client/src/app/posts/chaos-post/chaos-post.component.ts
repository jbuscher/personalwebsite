import { Component, OnInit } from '@angular/core';
import { POSTS } from 'src/app/constants/constants';
import { PostListing } from 'src/app/types/types';

@Component({
  selector: 'app-chaos-post',
  templateUrl: './chaos-post.component.html',
  styleUrls: ['./chaos-post.component.css', '../posts.component.css']
})
export class ChaosPostComponent implements OnInit {

  post: PostListing;
  constructor() {
    this.post = POSTS.find(p => p.title == "Chaos Game")!;
   }

  ngOnInit(): void {
  }

}
