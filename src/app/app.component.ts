import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from './components/loader/loader.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SideNavbarComponent } from './layout/side-navbar/side-navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { AuthService } from './service/auth/Auth.Service';
import { LoaderService } from './service/loader.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoaderComponent,
    NavbarComponent,
    SideNavbarComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'petStoreFrontEnd';
  useSideNavbar = false;
  isSidebarCollapsed = false;
  isLoading$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private loaderService: LoaderService
  ) {
    this.isLoading$ = this.loaderService.isLoading$;
  }

  ngOnInit(): void {
    // Check if user is logged in to determine which navbar to show
    this.useSideNavbar = this.authService.isUserLoggedIn();

    // Subscribe to auth changes to update navbar type
    this.authService.loginStatus$.subscribe(status => {
      this.useSideNavbar = status;
    });
  }

  onSidebarCollapsed(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
  }
}
