import { ChaosPostComponent } from "../posts/chaos-post/chaos-post.component";
import { L2mComponent } from "../posts/l2m-post/l2m.component";
import { MetaPostComponent } from "../posts/meta-post/meta-post.component";
import { ThreeBodyPostComponent } from "../posts/three-body-post/three-body-post.component";
import { PostListing } from "../types/types";



export const TAGS = {
    NBA: "NBA",
    MATH: "MATH",
    PROGRAMMING: "PROGRAMMING",
    DATA_VIZ: "DATA_VIZ",
    SCIENCE: "SCIENCE"
}

  
  
export const POSTS: PostListing[] = [
    {
      date: "09/24/2022",
      title: "Meta Post",
      iconPath: "assets/meta.png",
      route: { path: 'meta', component: MetaPostComponent },
      tags: [TAGS.PROGRAMMING]
    },
    {
      date: "09/24/2022",
      title: "Last Two Minutes",
      iconPath: "assets/l2m.jpeg",
      route: { path: 'l2m', component: L2mComponent },
      tags:[TAGS.NBA, TAGS.DATA_VIZ]
    },
    {
        date: "09/24/2022",
        title: "Chaos Game",
        iconPath: "assets/chaos/logo2.png",
        route: { path: 'chaos', component: ChaosPostComponent },
        tags:[TAGS.MATH, TAGS.PROGRAMMING]
      },
      {
        date: "09/24/2022",
        title: "The Three Body Problem",
        iconPath: "assets/3body.png",
        route:   { path: 'threeBody', component: ThreeBodyPostComponent },
        tags:[TAGS.SCIENCE, TAGS.PROGRAMMING]
      },
  ]
