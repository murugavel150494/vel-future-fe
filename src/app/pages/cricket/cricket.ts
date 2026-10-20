import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cricket',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cricket.html',
  styleUrl: './cricket.css'
})
export class Cricket implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  loadingVideo = false;
  loadingThumbnail = false;
  loadingSeo = false;
  responseMessage: any = null;
  errorMessage: string | null = null;
  
  todayFormatted = '';
  // private backendUrl = 'http://localhost:3001/api/cricket';
  private backendUrl = 'https://vel-future.onrender.com/api/cricket';

  ngOnInit(): void {
    // Generate today's date in DD-MM-YYYY format (e.g., 20-10-2026)
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    this.todayFormatted = `${dd}-${mm}-${yyyy}`;
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  triggerAction(endpoint: string, actionName: string): void {
    const payload = { 
      timestamp: new Date().toISOString(), 
      dateTag: this.todayFormatted 
    };

    if (endpoint === 'create-video') {
      this.loadingVideo = true;
      this.responseMessage = null;
      this.errorMessage = null;

      this.http.post(`${this.backendUrl}/${endpoint}`, payload, { responseType: 'blob' }).subscribe({
        next: (blob: Blob) => {
          this.loadingVideo = false; // Reset loading state instantly on success

          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `cricket-news-${this.todayFormatted}.mp4`;
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(downloadUrl);

          this.responseMessage = { 
            action: actionName, 
            result: `Video rendered and downloaded successfully for date: ${this.todayFormatted}` 
          };
        },
        error: (err) => {
          this.loadingVideo = false; // Reset loading state on error as well
          this.errorMessage = `Failed to execute ${actionName}. Please check server logs.`;
        }
      });
    } else {
      if (endpoint === 'create-thumbnail') this.loadingThumbnail = true;
      if (endpoint === 'create-seo') this.loadingSeo = true;

      this.responseMessage = null;
      this.errorMessage = null;

      this.http.post<any>(`${this.backendUrl}/${endpoint}`, payload).subscribe({
        next: (res) => {
          this.loadingThumbnail = false;
          this.loadingSeo = false;
          this.responseMessage = { action: actionName, result: res };
        },
        error: (err) => {
          this.loadingThumbnail = false;
          this.loadingSeo = false;
          this.errorMessage = `Failed to execute ${actionName}: ${err.message}`;
        }
      });
    }
  }
}