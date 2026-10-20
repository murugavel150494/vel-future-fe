import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private router = inject(Router);
  private authService = inject(AuthService);

  private readonly ALLOWED_USERNAME = 'admin';
  private readonly ALLOWED_PASSWORD = 'password123';

  username = '';
  password = '';
  isLoading = false;
  errorMessage: string | null = null;

  onLogin(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    setTimeout(() => {
      this.isLoading = false;

      if (
        this.username.trim() === this.ALLOWED_USERNAME &&
        this.password === this.ALLOWED_PASSWORD
      ) {
        this.authService.login();
        this.router.navigate(['/home']);
      } else {
        this.errorMessage = 'Invalid username or password. Please try again.';
      }
    }, 600);
  }
}