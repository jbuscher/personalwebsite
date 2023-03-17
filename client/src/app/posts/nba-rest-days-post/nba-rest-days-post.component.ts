import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NBA_REST_DAYS, POSTS } from 'src/app/constants/constants';
import { NbaService } from 'src/app/services/nba.service';
import { PostListing } from 'src/app/types/types';
import { BlogPost } from '../blogpost';
import * as d3 from 'd3';
import { ScaleOrdinal } from 'd3';


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
  allRestData: any[];
  currentPlayerData: any

  constructor(router: Router,
    private nbaService: NbaService) {
    super();
    this.router = router
    this.post = POSTS.find(p => p.title == NBA_REST_DAYS)!;
    this.filteredPlayers = []
    this.players = []
    this.allRestData = []
    this.currentPlayerData = {
      name:"",
      ptsRest:[0,0,0,0],
      gpRest:[0,0,0,0],
      ptsSeason:0,
    }

    nbaService.getPlayers().subscribe(d => {
      this.players = d.players
      this.filteredPlayers = this.players
    });
    nbaService.getAllRestData().subscribe(d => {
      this.allRestData = d.restData
      this.draw()
    })
   }

  ngOnInit(): void {
  }

  isRed(ptsToCheck: number) {
    return ptsToCheck < this.currentPlayerData.ptsSeason;
  }

  onPlayerClick(player: any) {
    this.isSearchFocus = false;
    this.isLoading = true;
    this.nbaService.getRestData(player.id).subscribe(d => {
      this.isLoading = false
      this.currentPlayerData.name = player.name
      this.currentPlayerData.ptsSeason = d.OverallPlayerDashboard.PTS
      this.currentPlayerData.ptsRest[0] = d.DaysRestPlayerDashboard["0"].PTS
      this.currentPlayerData.ptsRest[1] = d.DaysRestPlayerDashboard["1"].PTS
      this.currentPlayerData.ptsRest[2] = d.DaysRestPlayerDashboard["2"].PTS
      this.currentPlayerData.gpRest[0] = d.DaysRestPlayerDashboard["0"].GP
      this.currentPlayerData.gpRest[1] = d.DaysRestPlayerDashboard["1"].GP
      this.currentPlayerData.gpRest[2] = d.DaysRestPlayerDashboard["2"].GP

      let ptsTotal = 0;
      let gameTotal = 0;
      for (const [key, value] of Object.entries(d.DaysRestPlayerDashboard)) {
        if (key == "0" || key == "1" || key == "2") {
          continue;
        }
        ptsTotal += (value as any).PTS * (value as any).GP
        gameTotal += (value as any).GP
      }
      this.currentPlayerData.ptsRest[3] = ptsTotal / gameTotal
      this.currentPlayerData.gpRest[3] = gameTotal
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
       (d:any) => d.name.toLowerCase().includes(value)
    )
 }

 updateCurrentPlayer(d: any) {
  this.currentPlayerData.ptsRest = d.ptsRest
  this.currentPlayerData.ptsSeason = d.ptsSeason
  this.currentPlayerData.gpRest = d.gpRest
  console.log(d, this.players)
  this.currentPlayerData.name = this.players.find(p => ''+p.id == ''+d.id).name
 }

 draw() {
  let svg = d3.select("#chart"),
      margin = {top: 20, right: 20, bottom: 50, left: 50},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      lineDistance = 25;
    svg.selectAll("*").remove()

  // add scales
  let x = d3.scaleLinear().rangeRound([0, width]);

  // add chart
  let chart = svg.append("g")
      .attr("transform", "translate("+margin.left+","+margin.top+")");

  let data = this.allRestData
  x.domain([-10, 10])


  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  var lineGroup0 = chart.append("g")
      .attr("id", "lineGroup")
      .attr("transform", "translate(0,"+(height-lineDistance)+")");
  var lineGroup1 = chart.append("g")
      .attr("id", "lineGroup")
      .attr("transform", "translate(0,"+(height-lineDistance*2)+")");
  var lineGroup2 = chart.append("g")
      .attr("id", "lineGroup")
      .attr("transform", "translate(0,"+(height-lineDistance*3)+")");
  var lineGroup3 = chart.append("g")
      .attr("id", "lineGroup")
      .attr("transform", "translate(0,"+(height-lineDistance*4)+")");

  let that = this
    lineGroup0.selectAll(".line-marker")
        .data(data.filter(d => d.gpRest[0] > 5))
        .enter().append("rect")
        .attr("class", "line-marker")
        .attr("x", function(d) { return x(d.ptsRest[0] - d.ptsSeason); })
        .attr("y", -10)
        .attr("width", 2)
        .attr("height", 15)
        .attr("stroke-width", "4px")
        .attr("fill", "steelblue")
        .on('mouseover', function(e, d) {
          that.updateCurrentPlayer(d)
        })
        .style("cursor", "pointer");

    lineGroup1.selectAll(".line-marker")
      .data(data.filter(d => d.gpRest[1] > 5))
        .enter().append("rect")
        .attr("class", "line-marker")
        .attr("x", function(d) { return x(d.ptsRest[1] - d.ptsSeason); })
        .attr("y", -10)
        .attr("width", 2)
        .attr("height", 15)
        .attr("stroke-width", "4px")
        .attr("fill", "green")
        .on('mouseover', function(e, d) {
          that.updateCurrentPlayer(d)
        })
        .style("cursor", "pointer");
    
    lineGroup2.selectAll(".line-marker")
        .data(data.filter(d => d.gpRest[2] > 5))
          .enter().append("rect")
          .attr("class", "line-marker")
          .attr("x", function(d) { return x(d.ptsRest[2] - d.ptsSeason); })
          .attr("y", -10)
          .attr("width", 2)
          .attr("height", 15)
          .attr("stroke-width", "4px")
          .attr("fill", "orange")
          .on('mouseover', function(e, d) {
            that.updateCurrentPlayer(d)
          })
          .style("cursor", "pointer");
  
   lineGroup3.selectAll(".line-marker")
          .data(data.filter(d => d.gpRest[3] > 5))
            .enter().append("rect")
            .attr("class", "line-marker")
            .attr("x", function(d) { return x(d.ptsRest[3] - d.ptsSeason); })
            .attr("y", -10)
            .attr("width", 2)
            .attr("height", 15)
            .attr("stroke-width", "4px")
            .attr("fill", "purple")
            .on('mouseover', function(e, d) {
              that.updateCurrentPlayer(d)
            })
            .style("cursor", "pointer");
 }
}
