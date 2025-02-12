import { Component } from '@angular/core';
import { BatterStatsComponent } from "../batter-stats/batter-stats.component";
import { PitcherStatsComponent } from "../pitcher-stats/pitcher-stats.component";
import { CommonModule } from '@angular/common';
import { StandingsComponent } from "../standings/standings.component";

@Component({
  selector: 'app-home',
  imports: [BatterStatsComponent, PitcherStatsComponent, CommonModule, StandingsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  showBattingStats = true; 
  showPitchingStats = false; 
  showStandings = false;

  pitchingChange() {
    this.showPitchingStats = true;
    this.showBattingStats = false;
    this.showStandings = false;
  }

  battingChange() {
    this.showPitchingStats = false;
    this.showBattingStats = true;
    this.showStandings = false;
  }

  standingsChange() {
    this.showPitchingStats = false;
    this.showBattingStats = false;
    this.showStandings = true;
  }
}
