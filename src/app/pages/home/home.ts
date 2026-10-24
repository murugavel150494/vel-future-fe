import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface ChannelFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  status: 'active' | 'coming_soon';
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [], // <-- Removed unused RouterLink import
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  private router = inject(Router);

  // Angular 22 Reactive Signals
  userChannelName = signal<string>('Tamil Sports Channel');
  
  features = signal<ChannelFeature[]>([
    {
      id: 'cricket',
      title: '🏏 Cricket News Pipeline',
      description: 'Automated dynamic video generator, dynamic Tamil voiceovers, high-CTR thumbnail prompts, and YouTube SEO metadata.',
      icon: '🏏',
      route: '/cricket',
      status: 'active'
    },
    {
      id: 'top10',
      title: '🔥 Top 10 Countdown',
      description: 'Generate viral countdown videos and automated ranking content for YouTube shorts and full-length videos.',
      icon: '🔥',
      route: '/top10',
      status: 'active'
    }
  ]);

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}