import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NBA_REST_DAYS, POSTS } from 'src/app/constants/constants';
import { NbaService } from 'src/app/services/nba.service';
import { PostListing } from 'src/app/types/types';
import { BlogPost } from '../blogpost';
import * as d3 from 'd3';


@Component({
  selector: 'app-nba-rest-days-post',
  templateUrl: './nba-rest-days-post.component.html',
  styleUrls: ['./nba-rest-days-post.component.css', '../posts.component.css'],
})
export class NbaRestDaysPostComponent extends BlogPost implements OnInit {
  post: PostListing;
  router: Router;
  isSearchFocus: boolean = false
  isLoading: boolean = false
  players: any[];
  filteredPlayers: any[]
  allRestData: any[];
  rawRestData: any[];
  allStatOptions: string[];
  currentPlayerData: any
  selectedStat: string = "pts"

  min: number
  max: number;
  constructor(router: Router,
    private nbaService: NbaService) {
    super();
    this.router = router
    this.post = POSTS.find(p => p.title == NBA_REST_DAYS)!;
    this.filteredPlayers = []
    this.players = []
    this.allRestData = []
    this.rawRestData = []
    this.allStatOptions = [];
    this.currentPlayerData = {
      name:"",
      ptsRest:[0,0,0,0],
      gpRest:[0,0,0,0],
      ptsSeason:0,
      totalGames:0
    }
    this.min = -10;
    this.max = 10;

    nbaService.getPlayers().subscribe(d => {
      this.players = d
      this.filteredPlayers = this.players
      nbaService.getAllRestData().subscribe(d => {
        this.rawRestData = d;
        Object.keys(d[0]).forEach(k => {
          if (k !== "id" && k !== "player_id" 
              && k !== "rest_days" && k !== "gp"
              && k !== "rest_label" && k !== "season") {
            this.allStatOptions.push(k)
          }
        });
        this.allRestData = this.players.map(p => this.collatePlayerStats(p, d))
        this.draw()
      })
    });
   }

  ngOnInit(): void {
    
  }

  onStatChange() {
    this.min = 0;
    this.max = 0;
    this.allRestData = this.players.map(p => this.collatePlayerStats(p, this.rawRestData, this.selectedStat))
    this.draw()
    this.currentPlayerData = this.allRestData.find(p => p.name === this.currentPlayerData.name)
  }

  isRed(ptsToCheck: number) {
    return ptsToCheck < this.currentPlayerData.ptsSeason;
  }

  onPlayerClick(playername: any) {
    this.isSearchFocus = false;
    this.currentPlayerData = this.allRestData.find(p => p.name === playername)
  }

  collatePlayerStats(player: any, restData:any, stat:string="pts") {
    let collatedStats = {
      name:"",
      ptsRest:[0,0,0,0],
      gpRest:[0,0,0,0],
      ptsSeason:0,
      totalGames:0,
    }
    let totalPoints = 0;
    let totalGames = 0;
    let threePlusPoints = 0; // for 3 or more days rest
    let threePlusGames = 0;

    collatedStats.name = player.playername
    restData.filter((p:any) => p.player_id === player.id).forEach((d:any) => {
      totalPoints += d[stat] * d.gp
      totalGames += d.gp

      if (d.rest_days < 3) {
        collatedStats.ptsRest[d.rest_days] = d[stat];
        collatedStats.gpRest[d.rest_days] = d.gp;
      } else {
        threePlusPoints += d[stat] * d.gp
        threePlusGames += d.gp
      }
    })
    collatedStats.ptsSeason = totalPoints / totalGames
    collatedStats.totalGames = totalGames;
    collatedStats.ptsRest[3] = threePlusPoints / threePlusGames
    collatedStats.gpRest[3] = threePlusGames;
    
    

    for (let i = 0; i < 4; i++) {
      if (collatedStats.gpRest[i] > 5 && !!(collatedStats.ptsRest[i] - collatedStats.ptsSeason)) {
        this.min = Math.min(this.min, collatedStats.ptsRest[i] - collatedStats.ptsSeason)
        this.max = Math.max(this.max, collatedStats.ptsRest[i] - collatedStats.ptsSeason)
      }
    }
    return collatedStats;
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
       (d:any) => d.playername.toLowerCase().includes(value)
    )
 }

 updateCurrentPlayer(d: any) {
  this.currentPlayerData.ptsRest = d.ptsRest
  this.currentPlayerData.ptsSeason = d.ptsSeason
  this.currentPlayerData.gpRest = d.gpRest
  this.currentPlayerData.name = this.players.find(p => ''+p.id == ''+d.id).name
 }

  draw() {
    const width = 800;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    let data= this.allRestData

    const xScale = d3.scaleLinear()
      .domain(
        [this.min*1.2, this.max*1.2])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, 3])
      .range([height - margin.bottom, margin.top]);

    const xAxis = (g:any) => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0));

    const yAxis = (g:any) => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).ticks(4).tickSizeOuter(0));

    const svg = d3.select("#chart")
      .attr("width", width)
      .attr("height", height);
    svg.selectAll('*').remove();


    svg.append("g")
      .call(xAxis);

    svg.append("g")
      .call(yAxis);

      let that = this;
    for (let player of data) {
      if (player.ptsSeason < 5) {
        continue;
      }
      for (let i = 0; i < player.ptsRest.length; i++) {
        if (player.gpRest[i] >= 5) {
          svg.append("rect")
            .attr("style", "cursor:pointer")
            .attr("fill", "steelblue")
            .on("mouseover", function(e) {
              this.style.fill="red"
              that.showTooltip(e,player.name, player.ptsRest[i] - player.ptsSeason)
            })
            .on("mouseout", function() {
              this.style.fill="steelblue"
              that.hideTooltip();
            })
            .on("click", ()=> this.onPlayerClick(player.name))
            
            .attr("x", xScale(player.ptsRest[i] - player.ptsSeason))
            .attr("y", yScale(i)-20)
            .attr("width", 2)
            .attr("height", 15)
            .append("title");
        }
      }
    }
  }

  showTooltip(e:MouseEvent, playername:any, diff:any) {
    let tooltip = document.getElementById("tooltip")!;
    tooltip.style.visibility = "visible";
    tooltip.style.position = "absolute";
    tooltip.style.top = e.pageY - 30 + "px"
    tooltip.style.left = e.pageX - 50 + "px"
    tooltip.innerHTML = playername + " " + this.round(diff)
  }

  hideTooltip() {
    let tooltip = document.getElementById("tooltip")!;
    tooltip.style.visibility = "hidden";
  }
}
