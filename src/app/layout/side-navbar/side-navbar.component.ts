import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuService } from '../../service/menu/menu.service';
import { MenuItem } from '../../interfaces/menu.interface';
import { AuthService } from '../../service/auth/Auth.Service';
import { Subscription, combineLatest } from 'rxjs';
import { skip } from 'rxjs/operators';

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-side-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css']
})
export class SideNavbarComponent implements OnInit, OnDestroy {
  menuItems: MenuItem[] = [];
  isLoggedIn = false;
  userRole = '';
  isExpanded = true;
  expandedMenuItems: Set<string> = new Set();
  private subscriptions: Subscription[] = [];

  @Output() sidebarCollapsed = new EventEmitter<boolean>();

  socialLinks: SocialLink[] = [
    {
      name: 'GitHub',
      url: 'https://github.com',
      icon: 'fab fa-github'
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com',
      icon: 'fab fa-facebook'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com',
      icon: 'fab fa-instagram'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com',
      icon: 'fab fa-linkedin'
    },
    {
      name: 'LeetCode',
      url: 'https://leetcode.com',
      icon: 'fas fa-code'
    }
  ];

  constructor(
    private menuService: MenuService,
    private authService: AuthService
  ) {
    // Emit initial state
    this.sidebarCollapsed.emit(!this.isExpanded);
  }

  ngOnInit(): void {
    // Initial state setup
    this.isLoggedIn = this.authService.isUserLoggedIn();
    this.userRole = this.authService.getUserRole();
    
    // Initial menu load
    this.loadMenuItems();
    
    // Subscribe to auth changes
    this.subscriptions.push(
      combineLatest([
        this.authService.loginStatus$,
        this.authService.userRole$
      ]).pipe(
        skip(1) // Skip the first emission to avoid double loading
      ).subscribe(([status, role]) => {
        console.log('Auth status changed - Status:', status, 'Role:', role);
        this.isLoggedIn = status;
        this.userRole = role;
        this.loadMenuItems();
      })
    );
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
    this.sidebarCollapsed.emit(!this.isExpanded);
    console.log('Sidebar expanded:', this.isExpanded);
  }

  toggleMenuItem(itemId: string): void {
    console.log('Toggling menu item:', itemId);
    if (this.expandedMenuItems.has(itemId)) {
      this.expandedMenuItems.delete(itemId);
    } else {
      this.expandedMenuItems.add(itemId);
    }
  }

  isMenuItemExpanded(itemId: string): boolean {
    return this.expandedMenuItems.has(itemId);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadMenuItems(): void {
    console.log('SideNavbar: Loading menu items...');
    this.menuService.getMenuItems().subscribe({
      next: (items) => {
        console.log('SideNavbar: Received menu items:', items);
        this.menuItems = items;
      },
      error: (error) => {
        console.error('SideNavbar: Error loading menu items:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        // The service will handle the redirect
      },
      error: (error) => {
        console.error('SideNavbar: Error during logout:', error);
        window.location.href = '/login';
      }
    });
  }
}
