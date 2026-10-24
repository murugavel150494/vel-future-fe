import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  private router = inject(Router);
  private http = inject(HttpClient);
  
  // Backend running on port 3001
  private apiBaseUrl = 'http://localhost:3001/api/auth';

  username = signal<string>('');
  password = signal<string>('');
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  updateUsername(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.username.set(input.value);
  }

  updatePassword(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.password.set(input.value);
  }

  onLogin(event: Event): void {
    event.preventDefault();

    if (!this.username().trim() || !this.password().trim()) {
      this.errorMessage.set('Please provide username and password.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.http.post<any>(`${this.apiBaseUrl}/login`, { 
      username: this.username(), 
      password: this.password() 
    }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          localStorage.setItem('authToken', res.token);
          localStorage.setItem('currentUser', JSON.stringify(res.user));
          
          // 🔒 CRITICAL: replaceUrl: true prevents back-button navigation to login
          this.router.navigate(['/home'], { replaceUrl: true });
        } else {
          this.errorMessage.set(res.message || 'Authentication failed.');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Backend Login Error:', err);
        this.errorMessage.set(err?.error?.message || 'Connection refused. Ensure backend is running on port 3001.');
      }
    });
  }
}