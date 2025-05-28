import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, map, switchMap } from 'rxjs/operators';
import { MenuItem } from '../interfaces/menu.interface';
import { GetAPIEndpoint } from '../constants/endpoints';
import { MICROSERVICE_NAME } from '../constants/Enums';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
    private baseUrl = GetAPIEndpoint(MICROSERVICE_NAME.CORE, 'navbar');
    private svgUploadUrl =GetAPIEndpoint(MICROSERVICE_NAME.S3, 's3/uploadSvgImage');

    constructor(private http: HttpClient) {}

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