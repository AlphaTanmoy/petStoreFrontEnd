import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuService } from '../../service/menu/menu.service';
import { MenuItem } from '../../interfaces/menu.interface';
import { AuthService } from '../../service/auth/Auth.Service';
import { Router } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { skip } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  menuItems: MenuItem[] = [];
  isLoggedIn = false;
  userRole = '';
  username = '';
  isMobileMenuOpen = false;
  activeSubmenuId: string | null = null;
  isMobileView = window.innerWidth <= 768;
  private subscriptions: Subscription[] = [];

  @HostListener('window:resize')
  onResize() {
    const wasMobile = this.isMobileView;
    this.isMobileView = window.innerWidth <= 768;

    // Reset states when switching between mobile and desktop
    if (wasMobile !== this.isMobileView) {
      this.isMobileMenuOpen = false;
      this.activeSubmenuId = null;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    if (!clickedElement.closest('.has-submenu')) {
      this.activeSubmenuId = null;
    }
  }

  constructor(
    private menuService: MenuService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isUserLoggedIn();
    this.userRole = this.authService.getUserRole();
    this.username = this.authService.getUsername() || this.userRole;
    this.loadMenuItems();

    this.subscriptions.push(
      combineLatest([
        this.authService.loginStatus$,
        this.authService.userRole$
      ]).pipe(
        skip(1)
      ).subscribe(([status, role]) => {
        this.isLoggedIn = status;
        this.userRole = role;
        if (status) {
          this.username = this.authService.getUsername() || role;
        } else {
          this.username = '';
        }
        this.loadMenuItems();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadMenuItems(): void {
    this.menuService.getMenuItems().subscribe({
      next: (items) => {
        this.menuItems = items;
      },
      error: (error) => {
        console.error('NavbarComponent: Error loading menu items:', error);
      }
    });
  }

  hasSubmenu(item: MenuItem): boolean {
    return item.listOfSubMenu && item.listOfSubMenu.length > 0;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (!this.isMobileMenuOpen) {
      this.activeSubmenuId = null;
    }
  }

  toggleSubmenu(event: Event, itemId: string): void {
    event.preventDefault();
    event.stopPropagation();

    this.activeSubmenuId = this.activeSubmenuId === itemId ? null : itemId;
  }

  isSubmenuActive(itemId: string): boolean {
    return this.activeSubmenuId === itemId;
  }

  closeMenu(): void {
    this.isMobileMenuOpen = false;
    this.activeSubmenuId = null;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        window.location.href = '/login';
      },
      error: (error) => {
        console.error('Navbar: Logout error:', error);
        window.location.href = '/login';
      }
    });
    this.closeMenu();
  }

  logMenuItem(item: MenuItem): void {
    console.log('Menu Item:', item);
  }

  navigateToProfile(): void {
    this.router.navigate(['/my-profile']);
  }

  // New method to handle mouse hover for showing submenus
  onMenuHover(itemId: string): void {
    if (!this.isMobileView) {
      this.activeSubmenuId = itemId;
    }
  }

  onMenuLeave(): void {
    if (!this.isMobileView) {
      this.activeSubmenuId = null;
    }
  }
}

