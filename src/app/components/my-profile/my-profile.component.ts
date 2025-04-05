import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth/Auth.Service';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  userRole: string = '';
  username: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.username = this.authService.getUsername() || this.userRole;
  }

  logout(): void {
    console.log('MyProfile logout button clicked');
    this.authService.logout().subscribe({
      next: () => {
        console.log('MyProfile: Logout successful');
        // The service will handle the redirect
      },
      error: (error) => {
        console.error('MyProfile: Logout error:', error);
        // Force redirect to login page even on error
        window.location.href = '/login';
      }
    });
  }
} 