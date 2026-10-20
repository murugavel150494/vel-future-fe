import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top10',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top10.html',
  styleUrl: './top10.css'
})
export class Top10 {
  private http = inject(HttpClient);
  private router = inject(Router);

  loadingVideo = false;
  loadingThumbnail = false;
  responseMessage: any = null;
  errorMessage: string | null = null;
  private backendUrl = 'http://localhost:3000/api/top10';

  goHome(): void {
    this.router.navigate(['/home']);
  }

  triggerAction(endpoint: string, actionName: string): void {
    if (endpoint === 'create-top10-video') this.loadingVideo = true;
    else this.loadingThumbnail = true;

    this.responseMessage = null;
    this.errorMessage = null;

    this.http.post<any>(`${this.backendUrl}/${endpoint}`, { timestamp: new Date().toISOString() }).subscribe({
      next: (res) => {
        this.loadingVideo = false;
        this.loadingThumbnail = false;
        this.responseMessage = { action: actionName, result: res };
      },
      error: (err) => {
        this.loadingVideo = false;
        this.loadingThumbnail = false;
        this.errorMessage = `Failed to execute ${actionName}: ${err.message}`;
      }
    });
  }
}