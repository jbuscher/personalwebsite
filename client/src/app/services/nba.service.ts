import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { L2mRow } from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class NbaService {
    private l2mUrl = '/api/lasttwo';
    private teamsUrl = '/api/teams';
    private playersUrl = '/api/players'
    private restDataUrl = 'api/restData'

    constructor(
        private http: HttpClient) { }

  getL2m(): Observable<L2mRow[]> {
    return this.http.get<L2mRow[]>(this.l2mUrl);
  }

  getTeams(): Observable<any> {
    return this.http.get<any>(this.teamsUrl);
  }

  getPlayers(season: String|null = null): Observable<any> {
    if (!season) {
      season = "2022-23"
    }
    return this.http.get<any>(this.playersUrl+ "?season="+season);
  }

  getRestData(playerId:number) {
    let season = "2022-23"
    return this.http.get<any>(this.restDataUrl + "?playerId=" + playerId + "&season=" + season);
  }
}