
import { PostListing } from "../types/types";

export const TAGS = {
    NBA: "NBA",
    MATH: "MATH",
    PROGRAMMING: "PROGRAMMING",
    DATA_VIZ: "DATA_VIZ",
    SCIENCE: "SCIENCE"
}

export const HELLO_ML = "Hello ML"
export const CHAOS = "Chaos Game"
export const L2M = "Last Two Minutes (TODO)"
export const THREE_BODY = "The Three Body Problem (TODO)"
  
export const POSTS: PostListing[] = [
  {
    date: "2023-02-08",
    title: HELLO_ML,
    iconPath: "assets/descent/mldigit.png",
    route: { path: 'helloMl'},
    tags: [TAGS.MATH, TAGS.PROGRAMMING]
  },
  {
    date: "2023-01-07",
    title: CHAOS,
    iconPath: "assets/chaos/logo2.png",
    route: { path: 'chaos' },
    tags:[TAGS.MATH, TAGS.PROGRAMMING]
  },
  {
    date: "2022-09-24",
    title: L2M,
    iconPath: "assets/l2m.jpeg",
    route: { path: 'l2m'},
    tags:[TAGS.NBA, TAGS.DATA_VIZ]
  },
  {
    date: "2022-09-24",
    title: THREE_BODY,
    iconPath: "assets/3body.png",
    route:   { path: 'threeBody' },
    tags:[TAGS.SCIENCE, TAGS.PROGRAMMING]
  },
]
