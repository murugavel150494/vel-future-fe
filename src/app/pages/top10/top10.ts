import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Top10Item {
  rank: number;
  title: string;
  description: string;
}

export interface Top10ApiResponse {
  success: boolean;
  message: string;
  videoPath?: string;
  items?: Top10Item[];
}

@Component({
  selector: 'app-top10',
  standalone: true,
  imports: [],
  templateUrl: './top10.html',
  styleUrls: ['./top10.css']
})
export class Top10 {
  private http = inject(HttpClient);
  private apiBaseUrl = 'http://localhost:3001/api/top10';

  // Angular 22 Reactive Signals
  topicInput = signal<string>('');
  isLoading = signal<boolean>(false);
  response = signal<Top10ApiResponse | null>(null);
  errorMessage = signal<string | null>(null);

  updateTopic(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.topicInput.set(input.value);
  }

  onGenerateTop10(): void {
    if (!this.topicInput().trim()) {
      this.errorMessage.set('Please enter a topic for the Top 10 video.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.response.set(null);

    this.http.post<Top10ApiResponse>(`${this.apiBaseUrl}/create-video`, { topic: this.topicInput() }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          this.response.set(res);
        } else {
          this.errorMessage.set('Failed to generate Top 10 video.');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('API Error:', err);
        this.errorMessage.set(err?.error?.error || err?.message || 'An error occurred while generating the Top 10 video.');
      }
    });
  }
}