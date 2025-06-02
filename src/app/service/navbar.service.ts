import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, map, switchMap } from 'rxjs/operators';
import { MenuItem } from '../interfaces/menu.interface';
import { GetAPIEndpoint } from '../constants/endpoints';
import { MICROSERVICE_NAME } from '../constants/Enums';

import { PaginationResponse } from '../interfaces/paginationResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
    private baseUrl = GetAPIEndpoint(MICROSERVICE_NAME.CORE, 'navbar');
    private navbarGetUrl = GetAPIEndpoint(MICROSERVICE_NAME.CORE, 'navbar/get');
    private svgUploadUrl =GetAPIEndpoint(MICROSERVICE_NAME.S3, 's3/uploadSvgImage');

    constructor(private http: HttpClient) {}

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
      
      const headers = new HttpHeaders({ 'Alpha': this.getAuthHeader() });
      return this.http.get<PaginationResponse<MenuItem>>(this.navbarGetUrl, { headers, params });
    }

    // Delete a navbar item by ID
    deleteNavbarItem(id: string): Observable<any> {
      const headers = new HttpHeaders({ 'Alpha': this.getAuthHeader() });
      return this.http.delete(`${this.baseUrl}/delete/${id}`, { headers });
    }

    // Helper to get auth token (replace with actual implementation as needed)
    private getAuthHeader(): string {
      // TODO: Replace with actual token retrieval logic if needed
      return 'Alpha eyJhbGciOiJIUzM4NCJ9.eyJlbWFpbCI6IjZ3M1lrdzdybnRkRGRzVlI0OFJ6QzFlMk9NY2dhdHN3S1lRQXNFOGVDLzlFY1NpbnV0T2FsWVVKbmJDU0dMOWEwUHFpdHl6WWpkWks0cGdnTmtsZDB3PT0iLCJpZCI6IjI3MDMzYmQ4LTExNjktNDU5MS05MmJiLWYwNGY4M2ZkODUwMCIsInJvbGUiOiJST0xFX01BU1RFUiIsInRpcmUiOiJUSVJFMCIsInR3b0ZhY3RvciI6dHJ1ZSwiaXNUd29GYWN0b3JWZXJpZmllZCI6dHJ1ZSwiY3JlYXRlZEF0IjoiMjAyNS0wNS0zMFQwMTo1ODowNy41MTE3MzYzMDArMDU6MzBbQXNpYS9DYWxjdXR0YV0iLCJleHBBdCI6IjIwMjUtMDUtMzBUMDI6MDM6MDcuNTExNzM2MzAwKzA1OjMwW0FzaWEvQ2FsY3V0dGFdIn0.yvQdGFTx87eiQ3n5_3BtSzUxb16mBE_rGM0iDklVIqGfXRAe3fthk6jB3TjlCD9m';
    }

    // Fetch parent menu options
    getParentMenus(authToken: string): Observable<{ firstParameter: string; secondParameter: string }[]> {
        const headers = new HttpHeaders({ 'Alpha': `Alpha ${authToken}` });
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
        const headers = new HttpHeaders({ 'Alpha': `Alpha ${authToken}` });
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
                    'Alpha': `Alpha ${authToken}`,
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
            'Alpha': `Alpha ${authToken}`
        });

        return this.http.put<MenuItem>(`${this.baseUrl}/update/${id}`, formData, { headers }).pipe(
            tap(_ => console.log(`Updated navbar item with id=${id}`)),
            catchError(this.handleError<MenuItem>('updateNavbarItem'))
        );
    }

    // Handle HTTP errors
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(`${operation} failed: ${error.message}`);
            return of(result as T);
        };
    }
}