import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AUTH_TOKEN, AUTH_TOKEN_PREFIX } from '../constants/KeywordsAndConstrants';
import { MenuItem } from '../interfaces/menu.interface';
import { AuthService } from '../core/services/auth.service';
import { PaginationResponse } from '../interfaces/paginationResponse.interface';
import { GetAPIEndpoint } from '../constants/endpoints';
import { MICROSERVICE_NAME } from '../constants/Enums';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
    private readonly baseUrl = GetAPIEndpoint(MICROSERVICE_NAME.CORE, 'navbar');
    private readonly navbarGetUrl = GetAPIEndpoint(MICROSERVICE_NAME.CORE, 'navbar/get');
    private readonly svgUploadUrl = GetAPIEndpoint(MICROSERVICE_NAME.S3, 's3/uploadSvgImage');

    constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

    // Get paginated, filtered navbar list
    getNavbarList(paramsObj: {
      limit?: number;
      offsetToken?: string;
      queryString?: string;
      listOfRolesCanAccess?: string[];
      showSubMenusOnly?: boolean;
      isVisibleToGuest?: boolean;
      showInActive?: boolean;
      applyParentSubMenuFilter?: boolean;
      [key: string]: any;
    }): Observable<PaginationResponse<MenuItem>> {
      let params = new HttpParams();
      
      // Add pagination parameters
      if (paramsObj.limit) params = params.set('limit', paramsObj.limit.toString());
      if (paramsObj.offsetToken) params = params.set('offsetToken', paramsObj.offsetToken);
      
      // Add filter parameters
      if (paramsObj.queryString) params = params.set('queryString', paramsObj.queryString);
      if (paramsObj.showSubMenusOnly) params = params.set('showSubMenusOnly', 'true');
      if (paramsObj.isVisibleToGuest) params = params.set('isVisibleToGuest', 'true');
      if (paramsObj.showInActive) params = params.set('showInActive', 'true');
      if (paramsObj.applyParentSubMenuFilter) params = params.set('applyParentSubMenuFilter', 'true');
      
      // Add role-based access parameters
      if (paramsObj.listOfRolesCanAccess && paramsObj.listOfRolesCanAccess.length) {
        params = params.set('listOfRolesCanAccess', paramsObj.listOfRolesCanAccess.join(','));
      }
      
      const headers = new HttpHeaders({ [AUTH_TOKEN]: this.getAuthHeader() });
      return this.http.get<PaginationResponse<MenuItem>>(this.navbarGetUrl, { headers, params })
        .pipe(
          catchError((error: HttpErrorResponse) => {
            console.error('Error fetching navbar list:', error);
            return throwError(() => error);
          })
        );
    }

    // Delete a navbar item by ID
    deleteNavbarItem(id: string): Observable<any> {
      if (!id) {
        return throwError(() => new Error('ID is required'));
      }
      const headers = new HttpHeaders({ [AUTH_TOKEN]: this.getAuthHeader() });
      return this.http.delete(`${this.baseUrl}/delete/${id}`, { headers })
        .pipe(
          tap(() => console.log(`Deleted navbar item with id=${id}`)),
          catchError((error: HttpErrorResponse) => {
            console.error(`Error deleting navbar item with ID ${id}:`, error);
            return throwError(() => error);
          })
        );
    }

    // Get auth token from AuthService with proper prefix
    private getAuthHeader(): string {
      const token = this.authService.getToken();
      if (!token) {
        console.warn('No authentication token found');
        return '';
      }
      return `${AUTH_TOKEN_PREFIX}${token}`;
    }

    // Fetch parent menu options
    getParentMenus(authToken: string): Observable<{ firstParameter: string; secondParameter: string }[]> {
        const headers = new HttpHeaders({ [AUTH_TOKEN]: `${AUTH_TOKEN_PREFIX}${authToken}` });
        return this.http.get<any>(`${this.baseUrl}/getParentMenu`, { headers }).pipe(
            map(res => {
                if (res && res.status && Array.isArray(res.data)) {
                    return res.data;
                }
                throw new Error('Failed to fetch parent menus');
            })
        );
    }

    // Upload SVG and return its URL
    uploadSvgFile(svgFile: File, authToken: string): Observable<string> {
        const formData = new FormData();
        formData.append('svgFile', svgFile);
        formData.append('userRole', 'ROLE_MASTER');
        const headers = new HttpHeaders({ [AUTH_TOKEN]: `${AUTH_TOKEN_PREFIX}${authToken}` });
        return this.http.post<any>(this.svgUploadUrl, formData, { headers }).pipe(
            map(res => {
                console.log('SVG upload API response:', res);
                if (!res || res.status !== true || !res.data || typeof res.data !== 'string' || res.data.trim() === '') {
                  throw new Error('SVG upload failed: No valid URL in response.');
                }
                return res.data;
            })
        );
    }

    // Add a new navbar item (calls SVG upload first)
    addNavbarItem(menuData: any, svgFile: File | null, authToken: string | null): Observable<MenuItem> {
        if (!authToken) {
            return throwError(() => new Error('Authentication token is required'));
        }

        if (!svgFile) {
            return throwError(() => new Error('SVG file is required'));
        }
        // Step 1: Upload SVG, Step 2: Add navbar item
        return this.uploadSvgFile(svgFile, authToken).pipe(
            switchMap(svgUrl => {
                if (!svgUrl || typeof svgUrl !== 'string' || svgUrl.trim() === '') {
                  return throwError(() => new Error('SVG upload failed: No URL returned.'));
                }
                const menuPayload = {
                    ...menuData,
                    svgFileDataLink: svgUrl,
                    isAvailableWhileLoggedOut: menuData.isAvailableWhileLoggedOut ?? true
                };
                console.log('Ready to call add navbar API with:', menuPayload);
                const headers = new HttpHeaders({
                    [AUTH_TOKEN]: `${AUTH_TOKEN_PREFIX}${authToken}`,
                    'Content-Type': 'application/json'
                });
                return this.http.post<MenuItem>(`${this.baseUrl}/add`, menuPayload, { headers });
            }),
            tap((newItem: MenuItem) => console.log(`Added navbar item with id=${newItem.id}`)),
            catchError(this.handleError<MenuItem>('addNavbarItem'))
        );
    }

    // Update an existing navbar item
    updateNavbarItem(id: string, menuData: any, svgFile: File | null, authToken: string | null): Observable<MenuItem> {
        if (!authToken) {
            return throwError(() => new Error('Authentication token is required'));
        }

        const formData = new FormData();
        formData.append('navbar', new Blob([JSON.stringify(menuData)], {
            type: 'application/json'
        }));
        
        if (svgFile) {
            formData.append('svgFile', svgFile);
        }

        const headers = new HttpHeaders({
            [AUTH_TOKEN]: `${AUTH_TOKEN_PREFIX}${authToken}`
        });

        return this.http.put<MenuItem>(`${this.baseUrl}/update/${id}`, formData, { headers }).pipe(
            tap(_ => console.log(`Updated navbar item with id=${id}`)),
            catchError(this.handleError<MenuItem>('updateNavbarItem'))
        );
    }

    // Handle HTTP errors
    private handleError<T>(operation = 'operation'): (error: HttpErrorResponse) => Observable<T> {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return throwError(() => error);
    };
  }

  // Delete navbar item by ID
  deleteNavbarItemById(id: string): Observable<any> {
    const headers = new HttpHeaders({ [AUTH_TOKEN]: this.getAuthHeader() });
    return this.http.delete(`${this.baseUrl}/deleteById/${id}`, { headers }).pipe(
      tap(_ => console.log(`Deleted navbar item with id=${id}`)),
      catchError(this.handleError('deleteNavbarItemById'))
    );
  }

  // Get navbar item by ID
  getNavbarItemById(id: string): Observable<MenuItem> {
    const headers = new HttpHeaders({ [AUTH_TOKEN]: this.getAuthHeader() });
    return this.http.get<MenuItem>(`${this.baseUrl}/getById/${id}`, { headers }).pipe(
      tap(_ => console.log(`Fetched navbar item with id=${id}`)),
      catchError(this.handleError<MenuItem>('getNavbarItemById'))
    );
  }
}