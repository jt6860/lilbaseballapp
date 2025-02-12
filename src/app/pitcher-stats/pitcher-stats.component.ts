import { Component, OnInit } from '@angular/core';
import { DataService, PitcherStats } from '../data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pitcher-stats',
  imports: [FormsModule, CommonModule],
  templateUrl: './pitcher-stats.component.html',
  styleUrl: './pitcher-stats.component.css'
})
export class PitcherStatsComponent implements OnInit {
  pitcherStats: PitcherStats[] = [];
  selectedSeason: number = 2024;
  sortedPitchers: any[] = []
  sortBy: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc'; 

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.loadPitcherStats();
  }

  loadPitcherStats() {
    this.dataService.getPitcherStats(this.selectedSeason).subscribe({
      next: (data) => { 
        this.pitcherStats = data; 
        this.sortedPitchers = [...this.pitcherStats];
      },
      error: (error) => {
        console.error('Error fetching pitcher stats:', error); 
      }
    });
  }

  sortData() {
    this.sortedPitchers.sort((a, b) => {
      if (a[this.sortBy] < b[this.sortBy]) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (a[this.sortBy] > b[this.sortBy]) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  sort(column: string) {
    this.sortBy = column;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortData();
  }

  isStatExceptional(stat: number, threshold: number) {
    return stat >= threshold;
  }

  inningsPitchedPerGame (inningsPitched: number, gamesPlayed: number): number {
    return inningsPitched / gamesPlayed
  }
}