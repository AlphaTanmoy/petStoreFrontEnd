import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MenuItem } from '../interfaces/menu.interface';
import { AuthService } from './Auth.Service';
import { GetAPIEndpoint } from '../constants/endpoints';
import { MICROSERVICE_NAME } from '../constants/Enums';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = GetAPIEndpoint(MICROSERVICE_NAME.CORE, 'navbar/get');

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(this.apiUrl).pipe(
      tap(items => console.log('MenuService: Raw menu items:', items)),
      map(menuItems => this.filterMenuItemsByRole(menuItems)),
      tap(filteredItems => console.log('MenuService: Filtered menu items:', filteredItems)),
      catchError(error => {
        console.error('MenuService: Error fetching menu items:', error);
        return of([]);
      })
    );
  }

  private filterMenuItemsByRole(menuItems: MenuItem[]): MenuItem[] {
    const userRole = this.authService.getStoredUserRole();
    const isLoggedIn = this.authService.isUserLoggedIn();

    console.log('MenuService: Filtering menu items - User Role:', userRole, 'Is Logged In:', isLoggedIn);

    return menuItems.filter(item => {
      // For guest users, only show items that are explicitly marked as available while logged out
      if (!isLoggedIn) {
        const guestAccess = item.isAvailableWhileLoggedOut === true;
        return guestAccess;
      }

      // For logged-in users, check role-based access
      let hasAccess = this.checkAccess(item, userRole, isLoggedIn);

      // If the item has submenus, filter them
      if (item.listOfSubMenu && item.listOfSubMenu.length > 0) {
        const filteredSubMenu = this.filterMenuItemsByRole(item.listOfSubMenu);
        item.listOfSubMenu = filteredSubMenu;
        // Keep parent if it has visible submenu items
        hasAccess = hasAccess || filteredSubMenu.length > 0;
      }

      return hasAccess;
    });
  }

  private checkAccess(item: MenuItem, userRole: string, isLoggedIn: boolean): boolean {
    // If not logged in, only show items marked as available while logged out
    if (!isLoggedIn) {
      return item.isAvailableWhileLoggedOut === true;
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
        hasAccess = item.canRiderAccess;
        break;
      case 'ROLE_CUSTOMER_CARE':
        hasAccess = item.canUserAccess;
        break;
      default:
        hasAccess = false;
    }

    return hasAccess;
  }
}
