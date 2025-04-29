import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login-selection',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login-selection.component.html',
  styleUrls: ['./login-selection.component.css']
})
export class LoginSelectionComponent implements OnInit {
  isLoggedIn = false;

  // Mode: 'login', 'register', or null (initial state)
  mode: 'login' | 'register' | null = null;

  // Login/Register bubble options
  options: any = {
    login: [
      { icon: 'person', label: 'Customer', link: '/login/customer-login' },
      { icon: 'admin_panel_settings', label: 'Admin', link: '/login/admin-login' },
      { icon: 'supervisor_account', label: 'Master', link: '/login/master-login' },
      { icon: 'store', label: 'Seller', link: '/login/seller-login' },
      { icon: 'medical_services', label: 'Doctor', link: '/login/doctor-login' }
    ],
    register: [
      { icon: 'person_add', label: 'Customer', link: '/register/customer' },
      { icon: 'storefront', label: 'Seller', link: '/register/seller' },
      { icon: 'medical_services', label: 'Doctor', link: '/register/doctor' }
    ]
  };

  ngOnInit() {
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  reset(): void {
    this.mode = null;
  }

  getBubbleAnimation(index: number) {
    const animations = ['float1', 'float2', 'float3'];
    const animationName = animations[index % animations.length];
    const delay = `${(index % 3) * 0.5}s`; // 0s, 0.5s, 1s etc.

    return {
      animation: `${animationName} 3s ease-in-out infinite`,
      animationDelay: delay
    };
  }



}
