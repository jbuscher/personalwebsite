import { Router } from "@angular/router";

export class BlogPost {
    constructor() {}

    onTagClick(tag: String, router: Router) {
        let query = `tag:${tag}`;
        router.navigateByUrl(`/posts?q=${query}`)
    }
    
    getTagClass(tag: String): String {
        return "tag-" + tag.toLowerCase();
    }
}