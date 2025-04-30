import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProfileService, ProfileData } from '../../service/profile.service';
import { AuthService } from '../../service/Auth.Service';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  profileData: ProfileData | null = null;
  loading = true;
  error = false;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log('MyProfileComponent initialized');
    this.loadProfile();
  }

  loadProfile() {
    console.log('Loading profile...');
    this.profileService.getProfile().subscribe({
      next: (data) => {
        console.log('Profile data received:', data);
        this.profileData = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  logout() {
    this.authService.logout().subscribe();
  }
}
