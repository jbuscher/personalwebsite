import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NBA_REST_DAYS, POSTS } from 'src/app/constants/constants';
import { NbaService } from 'src/app/services/nba.service';
import { PostListing } from 'src/app/types/types';
import { BlogPost } from '../blogpost';

@Component({
  selector: 'app-nba-rest-days-post',
  templateUrl: './nba-rest-days-post.component.html',
  styleUrls: ['./nba-rest-days-post.component.css', '../posts.component.css']
})
export class NbaRestDaysPostComponent extends BlogPost implements OnInit {
  post: PostListing;
  router: Router;
  isSearchFocus: boolean = false
  isLoading: boolean = false
  players: any[];
  filteredPlayers: any[]
  currentPlayerData: any

  constructor(router: Router,
    private nbaService: NbaService) {
    super();
    this.router = router
    this.post = POSTS.find(p => p.title == NBA_REST_DAYS)!;
    this.filteredPlayers = []
    this.players = []
    this.currentPlayerData = {
      name:"",
      ptsZero:0,
      ptsOne:0,
      ptsTwo:0,
      ptsThreePlus:0,
      ptsSeason:0,
    }
    nbaService.getPlayers().subscribe(d => {
      for (const [key, value] of Object.entries(d.CommonAllPlayers)) {
        this.players.push(value)
      }
      this.filteredPlayers = this.players
    });
   }

  ngOnInit(): void {
  }

  isRed(ptsToCheck: number) {
    return ptsToCheck < this.currentPlayerData.ptsSeason;
  }

  onPlayerClick(player: any) {
    this.isSearchFocus = false;
    this.isLoading = true;
    this.nbaService.getRestData(player.PERSON_ID).subscribe(d => {
      this.isLoading = false
      console.log(d)
      this.currentPlayerData.name = player.DISPLAY_FIRST_LAST
      this.currentPlayerData.ptsSeason = d.OverallPlayerDashboard.PTS 
      this.currentPlayerData.ptsZero = d.DaysRestPlayerDashboard["0"].PTS
      this.currentPlayerData.ptsOne = d.DaysRestPlayerDashboard["1"].PTS
      this.currentPlayerData.ptsTwo = d.DaysRestPlayerDashboard["2"].PTS

      let ptsTotal = 0;
      let gameTotal = 0;
      for (const [key, value] of Object.entries(d.DaysRestPlayerDashboard)) {
        if (key == "0" || key == "1" || key == "2") {
          continue;
        }
        ptsTotal += (value as any).PTS * (value as any).GP
        gameTotal += (value as any).GP
      }
      this.currentPlayerData.ptsThreePlus = ptsTotal / gameTotal
    })
  }


  round(num: number) {
    return num.toFixed(2)
  }
  focusChange(isFocus:boolean) {
    this.isSearchFocus = isFocus
  }

  filterItem($event: any){
    let value = $event.target.value.toLowerCase()
    if(!value){
        this.filteredPlayers = this.players
    } 
    this.filteredPlayers = this.players.filter(
       (d:any) => d.DISPLAY_FIRST_LAST.toLowerCase().includes(value)
    )
 }
}
