import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService, Standings } from '../data.service';

@Component({
  selector: 'app-standings',
  imports: [FormsModule, CommonModule],
  templateUrl: './standings.component.html',
  styleUrl: './standings.component.css'
})
export class StandingsComponent implements OnInit {
  standings: Standings[] = [];
  selectedSeason: number = 2024;
  sortedStandings: any[] = []
  sortBy: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc'; 

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.loadStandings();
  }

  loadStandings() {
    this.dataService.getStandings(this.selectedSeason).subscribe({
      next: (data) => { 
        this.standings = data; 
        this.sortedStandings = [...this.standings];
      },
      error: (error) => {
        console.error('Error fetching standings:', error); 
      }
    });
  }

  sortData() {
    this.sortedStandings.sort((a, b) => {
      if (((a[this.sortBy] as unknown as number) - (b[this.sortBy] as unknown as number)) < ((b[this.sortBy] as unknown as number) - (a[this.sortBy] as unknown as number))) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (((a[this.sortBy] as unknown as number) - (b[this.sortBy] as unknown as number)) > ((b[this.sortBy] as unknown as number) - (a[this.sortBy] as unknown as number))) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
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
}