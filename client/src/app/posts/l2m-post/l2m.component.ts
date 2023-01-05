import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { NbaService } from '../../services/nba.service';
import { L2mRow } from '../../types/types';

interface L2mCounts {
  callsCounts: number;
  errorsInFavor: number;
  possesionsInFavor: number;
}

const INITIAL_COUNTS: L2mCounts = {callsCounts: 0, errorsInFavor: 0, possesionsInFavor: 0};
const CALLS = "Calls";
const ERRRORS = "Errors in Favor";
const POSSESIONS = "Possessions in Favor"


@Component({
  selector: 'app-l2m',
  templateUrl: './l2m.component.html',
  styleUrls: ['./l2m.component.css']
})
export class L2mComponent implements OnInit {   
  teamsL2mCounts: Map<string, L2mCounts>;
  playersL2mCounts: Map<string, number>;

    constructor (private nbaService:NbaService) {
      this.teamsL2mCounts = new Map();
      this.playersL2mCounts = new Map();
      nbaService.getL2m().subscribe(d => {this.populateTeamsMap(d), this.populatePlayersMap(d)});
    }

  ngOnInit(): void {

  }

  drawTeamCounts() {
    let svg = d3.select("#team-counts");
    let min = 0;
    let max = 0;
    this.teamsL2mCounts.forEach((v, k)=> max = max > v.errorsInFavor ? max: v.errorsInFavor);
    let dataIn: blah[] = [];
  this.teamsL2mCounts.forEach((v, k) => dataIn.push({team: k, count: v.errorsInFavor}));
  dataIn = dataIn.sort( (a, b) => b.count - a.count)

    const margin = 60;
    const width = 1000 - 2 * margin;
    const height = 600 - 2 * margin;

    const chart = svg.append('g')
    .attr('transform', `translate(${margin}, ${margin})`);

    const yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 40]);

    chart.append('g')
    .call(d3.axisLeft(yScale));

    const xScale = d3.scaleBand()
    .range([0, width])
    .domain(dataIn.map(a => a.team))
    .padding(0.2)

chart.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(50)")
    .style("text-anchor", "start");;


    interface blah {
      team: string;
      count: number;
    }
  
    chart.selectAll()
    .data(dataIn)
    .enter()
    .append('rect')
    .attr('x', (d) => xScale(d.team)!)
    .attr('y', (d) => yScale(d.count))
    .attr('height', (s) => height - yScale(s.count))
    .attr('width', xScale.bandwidth())
  }

  getString(c: L2mCounts) {
    return `Calls: ${c.callsCounts}, Errors: ${c.errorsInFavor}, Possessions: ${c.possesionsInFavor}`;
  }

  populateTeamsMap(data: L2mRow[]): void {
    data.forEach(d => {
      let home = d.nbaData.game[0].Home_team;
      let away = d.nbaData.game[0].Away_team;
      if (!this.teamsL2mCounts.has(home)) {
        this.teamsL2mCounts.set(home, {...INITIAL_COUNTS})
      }      
      if(!this.teamsL2mCounts.has(away)) {
        this.teamsL2mCounts.set(away, {...INITIAL_COUNTS});
      } 

      let homeCounts = this.teamsL2mCounts.get(home);
      let awayCounts = this.teamsL2mCounts.get(away);


      // Modify by reference, no need to re-insert into map
      d.nbaData.stats.forEach (s => {
        if (s.stats_name === CALLS) {
          homeCounts!.callsCounts += s.home;
          awayCounts!.callsCounts += s.away;
        } else if (s.stats_name === ERRRORS) {
          homeCounts!.errorsInFavor += s.home;
          awayCounts!.errorsInFavor += s.away;
        } else if (s.stats_name === POSSESIONS) {
          homeCounts!.possesionsInFavor += s.home;
          awayCounts!.possesionsInFavor += s.away;
        }
      })
    });
    this.drawTeamCounts();
 }

 populatePlayersMap(data: L2mRow[]): void {
  data.forEach(d => {
    d.nbaData.l2m.forEach(r => {
      if (r.CallRatingName === "INC" || r.CallRatingName === "IC") {
        let fuckedOver = r.CallRatingName === "INC" ?  r.DP: r.CP;
        if (fuckedOver !== null && this.playersL2mCounts.has(fuckedOver)) {
          let count = this.playersL2mCounts.get(fuckedOver)! + 1;
          this.playersL2mCounts.set(fuckedOver, count)
        } else if (fuckedOver !== null){
          this.playersL2mCounts.set(fuckedOver, 1)
        }
      }
    })
  })
 }

}
