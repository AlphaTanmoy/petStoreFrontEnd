import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../interfaces/customer.interface';
import { PaginationResponse, FilterOption } from '../interfaces/paginationResponse.interface';
import { GetAPIEndpoint } from '../constants/endpoints';
import { MICROSERVICE_NAME } from '../constants/Enums';

interface CustomerFilter {
  searchTerm?: string;
  isPrimeMember?: boolean;
  tireCodes?: string[];
  offsetToken?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = GetAPIEndpoint(MICROSERVICE_NAME.USER, '/customer');

  constructor(private http: HttpClient) {}

  getCustomers(filter: CustomerFilter = {}): Observable<PaginationResponse<Customer>> {
    let params = new HttpParams();

    // Add filter parameters if they exist
    if (filter.searchTerm) {
      params = params.set('searchTerm', filter.searchTerm);
    }
    
    if (filter.isPrimeMember !== undefined) {
      params = params.set('isPrimeMember', filter.isPrimeMember.toString());
    }

    if (filter.tireCodes && filter.tireCodes.length > 0) {
      filter.tireCodes.forEach((code: string) => {
        params = params.append('tireCode', code);
      });
    }

    if (filter.offsetToken) {
      params = params.set('offsetToken', filter.offsetToken);
    }

    return this.http.get<PaginationResponse<Customer>>(`${this.apiUrl}/getAll`, { params });
  }

  // Add more methods as needed for CRUD operations
}
