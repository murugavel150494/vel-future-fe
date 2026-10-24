import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ThumbnailOption {
  headingText: string;
  visualPrompt: string;
}

export interface ThumbnailDetails {
  primaryOption: ThumbnailOption;
  secondaryOption: ThumbnailOption;
}

export interface SeoDetails {
  bestTitle: string;
  alternativeTitles: string[];
  description: string;
  tags: string[];
}

export interface VideoApiResponse {
  success: boolean;
  message: string;
  videoPath: string;
  seoDetails: SeoDetails;
  thumbnailDetails: ThumbnailDetails;
  timestamp: string;
}

@Component({
  selector: 'app-cricket',
  standalone: true,
  imports: [],
  templateUrl: './cricket.html',
  styleUrls: ['./cricket.css']
})
export class CricketComponent {
  private http = inject(HttpClient);
  private apiBaseUrl = 'http://localhost:3001/api/cricket';

  // Angular 22 Signals
  isLoading = signal<boolean>(false);
  response = signal<VideoApiResponse | null>(null);
  errorMessage = signal<string | null>(null);
  copiedKey = signal<string | null>(null);

  onGenerateVideo(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.response.set(null);

    this.http.post<VideoApiResponse>(`${this.apiBaseUrl}/create-video`, {}).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          this.response.set(res);
        } else {
          this.errorMessage.set('Failed to generate video pipeline.');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('API Error:', err);
        this.errorMessage.set(err?.error?.error || err?.message || 'An error occurred while calling the video generator endpoint.');
      }
    });
  }

  getVideoUrl(videoPath: string): string {
    return `${this.apiBaseUrl}/download-video/${encodeURIComponent(videoPath)}`;
  }

  copyToClipboard(text: string, key: string): void {
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      this.copiedKey.set(key);
      setTimeout(() => {
        if (this.copiedKey() === key) {
          this.copiedKey.set(null);
        }
      }, 2000);
    }).catch(err => {
      console.error('Copy failed', err);
    });
  }

  getFormattedTitles(): string {
    const titles = this.response()?.seoDetails?.alternativeTitles;
    return titles ? titles.join('\n') : '';
  }

  getFormattedTags(): string {
    const tags = this.response()?.seoDetails?.tags;
    return tags ? tags.join(', ') : '';
  }

  getFormattedThumbnailConcept(option?: ThumbnailOption): string {
    if (!option) return '';
    return `Heading: ${option.headingText}\nPrompt: ${option.visualPrompt}`;
  }
}