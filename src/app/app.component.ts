import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SideNavbarComponent } from './layout/side-navbar/side-navbar.component';
import { LoaderComponent } from './components/loader/loader.component';
import { LoaderService } from './service/loader/loader.service';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from './service/auth/Auth.Service';
import { FooterComponent } from './layout/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    SideNavbarComponent,
    LoaderComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'petStoreFrontEnd';
  useSideNavbar = true;
  isLoggedIn = false;
  isLoading$: Observable<boolean>;
  isSidebarCollapsed = false;

  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private authService: AuthService
  ) {
    this.isLoading$ = this.loaderService.isLoading$;
    
    // Subscribe to router events to show/hide loader
    this.router.events
      .pipe(
        filter(event => 
          event instanceof NavigationStart ||
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        )
      )
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          this.loaderService.show();
        } else {
          this.loaderService.hide();
        }
      });
  }

  ngOnInit(): void {
    this.authService.loginStatus$.subscribe((status: boolean) => {
      this.isLoggedIn = status;
      this.useSideNavbar = status;
    });

    // Example: Show loader when component initializes
    this.loaderService.show();
    
    // Hide loader after delay
    setTimeout(() => {
      this.loaderService.hide();
    }, 500);
  }

  onSidebarCollapsed(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
}
