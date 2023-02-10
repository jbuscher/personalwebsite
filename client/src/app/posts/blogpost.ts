import { Router } from "@angular/router";
import { formatDate } from '@angular/common';


export class BlogPost {
    constructor() {}

    onTagClick(tag: String, router: Router) {
        let query = `tag:${tag}`;
        router.navigateByUrl(`/posts?q=${query}`)
    }
    
    getTagClass(tag: String): String {
        return "tag-" + tag.toLowerCase();
    }

    format(date:string) {
        return formatDate(new Date(date), 'mediumDate', 'en');
      }
}