import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MenuItem } from '../interfaces/menu.interface';
import { GetAPIEndpoint } from '../constants/endpoints';
import { MICROSERVICE_NAME } from '../constants/Enums';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
    private baseUrl = GetAPIEndpoint(MICROSERVICE_NAME.CORE, 'navbar');

    constructor(private http: HttpClient) {}

    // Add a new navbar item
    addNavbarItem(menuData: any, svgFile: File | null, authToken: string | null): Observable<MenuItem> {
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

        return this.http.post<MenuItem>(`${this.baseUrl}/add`, formData, { headers }).pipe(
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