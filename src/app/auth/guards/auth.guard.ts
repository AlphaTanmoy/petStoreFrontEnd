import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { USER_ROLE } from '../../constants/Enums';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRoles = route.data['roles'] as USER_ROLE[];

    // If not authenticated
    if (!this.authService.isAuthenticated()) {
      this.authService.clearSession(); // clear any old junk
      window.location.href = '/login'; // hard redirect to login (one-time)
      return false;
    }

    // Role check
    const userRole = this.authService.getStoredUserRole() as USER_ROLE;
    if (requiredRoles?.length && (!userRole || !requiredRoles.includes(userRole))) {
      this.router.navigate(['/un-authorized']);
      return false;
    }

    return true;
  }

}
