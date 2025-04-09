import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MenuItem } from '../../interfaces/menu.interface';
import { AuthService } from '../auth/Auth.Service';
import { GetAPIEndpoint, ngRock_CORE } from '../../constants/endpoints';
import { MICROSERVICE_NAME } from '../../constants/Enums';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  // Use the GetAPIEndpoint function to get the correct endpoint
  //private apiUrl = GetAPIEndpoint(MICROSERVICE_NAME.CORE, 'getNavbar');
  private apiUrl = ngRock_CORE('getNavbar');

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(this.apiUrl).pipe(
      map(menuItems => this.filterMenuItemsByRole(menuItems)),
      catchError(error => of([]))
    );
  }

  private filterMenuItemsByRole(menuItems: MenuItem[]): MenuItem[] {
    const userRole = this.authService.getStoredUserRole();
    const isLoggedIn = this.authService.isUserLoggedIn();

    return menuItems.filter(item => {
      // First, check if the item itself should be visible
      let hasAccess = this.checkAccess(item, userRole, isLoggedIn);

      // If the item has submenus, filter them
      if (item.listOfSubMenu && item.listOfSubMenu.length > 0) {
        item.listOfSubMenu = this.filterMenuItemsByRole(item.listOfSubMenu);
        // Keep parent if it has visible submenu items, even if parent itself doesn't have access
        hasAccess = hasAccess || item.listOfSubMenu.length > 0;
      }

      return hasAccess;
    });
  }

  private checkAccess(item: MenuItem, userRole: string, isLoggedIn: boolean): boolean {
    if (!isLoggedIn) {
      return item.isAvailableWhileLoggedOut && item.isVisibleToGuest;
    }

    let hasAccess = false;
    switch (userRole) {
      case 'ROLE_MASTER':
        hasAccess = item.canMasterAccess;
        break;
      case 'ROLE_ADMIN':
        hasAccess = item.canAdminAccess;
        break;
      case 'ROLE_CUSTOMER':
        hasAccess = item.canUserAccess;
        break;
      case 'ROLE_DOCTOR':
        hasAccess = item.canDoctorAccess;
        break;
      case 'ROLE_SELLER':
        hasAccess = item.canSellerAccess;
        break;
      case 'ROLE_RAIDER':
        hasAccess = item.canRiderAccess;
        break;
      case 'ROLE_DELIVERY_BOY':
        hasAccess = item.canRiderAccess; // Assuming delivery boys have the same access as raiders
        break;
      case 'ROLE_CUSTOMER_CARE':
        hasAccess = item.canUserAccess; // Assuming customer care has the same access as users
        break;
      default:
        hasAccess = false;
    }

    return hasAccess;
  }
}
