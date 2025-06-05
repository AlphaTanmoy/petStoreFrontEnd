import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from './components/loader/loader.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SideNavbarComponent } from './layout/side-navbar/side-navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { AuthService } from './core/services/auth.service';
import { LoaderService } from './core/services/loader.service';
import { Observable } from 'rxjs';
import { NotificationService } from './core/services/notification.service';
import { NotificationStackComponent } from './core/components/notification-stack';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoaderComponent,
    NavbarComponent,
    SideNavbarComponent,
    FooterComponent,
    NotificationStackComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'petStoreFrontEnd';
  useSideNavbar = false;
  isSidebarCollapsed = false;
  isLoading$: Observable<boolean>;
  isLoggedIn = false; 
  userProfileImage = 'assets/images/default-profile.png'; 

  constructor(
    public authService: AuthService,
    private loaderService: LoaderService,
    public notificationService: NotificationService
  ) {
    this.isLoading$ = this.loaderService.isLoading$;
    this.isLoggedIn = this.authService.isUserLoggedIn();
    // For now, using default profile image since we don't have getUserProfileImage method
  }

  ngOnInit(): void {
    // Check if user is logged in to determine which navbar to show
    this.useSideNavbar = this.authService.isUserLoggedIn();
    this.isLoggedIn = this.authService.isUserLoggedIn(); 
    this.isLoggedIn = this.authService.isUserLoggedIn(); // Update isLoggedIn

    // Subscribe to auth changes to update navbar type and login status
    this.authService.loginStatus$.subscribe(status => {
      this.useSideNavbar = status;
      this.isLoggedIn = status; // Update isLoggedIn when auth status changes
    });
  }

  onSidebarCollapsed(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
  }
}
