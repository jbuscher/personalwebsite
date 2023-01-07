
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
    date: "01/07/2022",
    title: "Chaos Game",
    iconPath: "assets/chaos/logo2.png",
    route: { path: 'chaos' },
    tags:[TAGS.MATH, TAGS.PROGRAMMING]
  },
    {
      date: "09/24/2022",
      title: "Meta Post",
      iconPath: "assets/meta.png",
      route: { path: 'meta'},
      tags: [TAGS.PROGRAMMING]
    },
    {
      date: "09/24/2022",
      title: "Last Two Minutes",
      iconPath: "assets/l2m.jpeg",
      route: { path: 'l2m'},
      tags:[TAGS.NBA, TAGS.DATA_VIZ]
    },
      {
        date: "09/24/2022",
        title: "The Three Body Problem",
        iconPath: "assets/3body.png",
        route:   { path: 'threeBody' },
        tags:[TAGS.SCIENCE, TAGS.PROGRAMMING]
      },
  ]
