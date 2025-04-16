import { Component, OnInit, OnDestroy, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuService } from '../../service/menu/menu.service';
import { MenuItem } from '../../interfaces/menu.interface';
import { AuthService } from '../../service/auth/Auth.Service';
import { Subscription, combineLatest } from 'rxjs';
import { skip } from 'rxjs/operators';

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
  isMobile = false;
  expandedMenuItems: Set<string> = new Set();
  private subscriptions: Subscription[] = [];
  shouldShowSidebar = true;
  collapsed = false;

  @Output() sidebarCollapsed = new EventEmitter<boolean>();

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkMobileView();
  }

  constructor(
    private menuService: MenuService,
    private authService: AuthService
  ) {
    this.checkMobileView();
  }

  ngOnInit(): void {
    // Initial state setup
    this.isLoggedIn = this.authService.isUserLoggedIn();
    this.userRole = this.authService.getUserRole();
    this.updateSidebarVisibility();

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
        this.updateSidebarVisibility();
        this.loadMenuItems();
      })
    );
  }

  private updateSidebarVisibility(): void {
    this.shouldShowSidebar = !(this.isLoggedIn && this.userRole === 'CUSTOMER');
    if (!this.shouldShowSidebar) {
      this.isExpanded = false;
    }
  }

  private checkMobileView(): void {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;

    // If transitioning from mobile to desktop
    if (wasMobile && !this.isMobile) {
      this.isExpanded = true;
      this.collapsed = false;
    }
    // If transitioning to mobile
    else if (!wasMobile && this.isMobile) {
      this.isExpanded = false;
      this.collapsed = true;
    }
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
    this.collapsed = !this.isExpanded;
    this.sidebarCollapsed.emit(!this.isExpanded);

    // If in mobile mode and sidebar is expanded, add overflow hidden to body
    if (this.isMobile) {
      document.body.style.overflow = this.isExpanded ? 'hidden' : '';
    }
  }

  toggleMenuItem(itemId: string): void {
    console.log('Toggling menu item:', itemId);
    if (this.expandedMenuItems.has(itemId)) {
      this.expandedMenuItems.delete(itemId);
    } else {
      // Close other expanded menus
      this.expandedMenuItems.clear();
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
        // Clear expanded items when menu items change
        this.expandedMenuItems.clear();
        items.forEach(item => {
          console.log(`Menu: ${item.menuName}, Submenus:`, item.listOfSubMenu);
        });
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
