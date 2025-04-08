import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../service/auth/Auth.Service';
import { USER_ROLE } from '../../constants/Enums';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRoles = route.data['roles'] as USER_ROLE[];
    
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    if (requiredRoles && requiredRoles.length > 0) {
      const userRole = this.authService.getUserRole() as USER_ROLE;
      if (!userRole || !requiredRoles.includes(userRole)) {
        this.router.navigate(['/un-authorized']);
        return false;
      }
    }

    return true;
  }
} 