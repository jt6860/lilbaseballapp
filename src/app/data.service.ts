import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

export interface BatterStats {
  // Define the structure of batter statistics based on pybaseball output
  name: string;
  season: number;
  team: string;
  WAR: number;
  OPS: number;
  OBP: number;
  SLG: number;
  PA: number;
  H: number;
  AVG: number;
  HR: number;
  RBI: number;
  SB: number;
}

export interface PitcherStats {
  // Define the structure of pitcher statistics based on pybaseball output
  name: string;
  season: number;
  team: string;
  WAR: number,
  IP: number,
  ERA: number,
  W: number,
  L: number,
  SV: number,
  WHIP: number,
  K_per_9: number,
  K_pct: number,
  LOB_pct: number
}

export interface Standings {
  team: string,
  season: number,
  W: number,
  L: number
}

@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private http: HttpClient) { }

  getBatterStats(season: number): Observable<BatterStats[]> {
    const apiUrl = `http://127.0.0.1:5000/api/bat_stats/${season}`; 
    return this.http.get<BatterStats[]>(apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('HTTP Error:', error);
          return throwError(() => new Error('Failed to fetch batter stats.'));
        })
      );
  }

  getPitcherStats(season: number): Observable<PitcherStats[]> {
    const apiUrl = `http://127.0.0.1:5000/api/pitch_stats/${season}`; 
    return this.http.get<PitcherStats[]>(apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('HTTP Error:', error);
          return throwError(() => new Error('Failed to fetch pitcher stats.'));
        })
      );
  }

  getStandings(season: number): Observable<Standings[]> {
    const apiUrl = `http://127.0.0.1:5000/api/standings/${season}`; 
    return this.http.get<Standings[]>(apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('HTTP Error:', error);
          return throwError(() => new Error('Failed to fetch standings.'));
        })
      );
  }
}