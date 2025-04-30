import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiAccessLog } from '../../interfaces/apiaccesslog.interface';
import { PaginationResponse, FilterOption } from '../../interfaces/paginationResponse.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-api-access-logs',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-api-access-logs.component.html',
  styleUrl: './admin-api-access-logs.component.css'
})
export class AdminApiAccessLogsComponent {
  logs: ApiAccessLog[] = [];
  offsetToken: string = '';
  filters: FilterOption[] = [];

  // Filter form controls
  statusCode: string = '';
  httpMethod: string = '';
  apiEndPoint: string = '';
  ipOnlyLocal: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchLogs();
  }

  fetchLogs(offsetToken: string = ''): void {
    let params = new HttpParams();

    if (offsetToken) {
      params = params.set('offsetToken', offsetToken);
    }

    // Append filters to params
    this.filters.forEach(filter => {
      params = params.set(filter.field, filter.value);
    });

    this.http.get<PaginationResponse<ApiAccessLog>>('/admin/apiAccessLogger/getAll', { params })
      .subscribe(response => {
        this.logs = [...this.logs, ...response.data];
        this.offsetToken = response.offsetToken;
        this.filters = response.filterUsed;
      });
  }

  loadMore(): void {
    if (this.offsetToken) {
      this.fetchLogs(this.offsetToken);
    }
  }

  applyFilters(): void {
    this.logs = [];
    this.offsetToken = '';

    this.filters = [];

    if (this.statusCode) {
      this.filters.push({ field: 'statusCode', value: this.statusCode });
    }
    if (this.httpMethod) {
      this.filters.push({ field: 'httpMethod', value: this.httpMethod });
    }
    if (this.apiEndPoint) {
      this.filters.push({ field: 'apiEndPoint', value: this.apiEndPoint });
    }
    if (this.ipOnlyLocal) {
      this.filters.push({ field: 'ipAddress', value: '127.0.0.1' });
    }

    this.fetchLogs();
  }

  resetFilters(): void {
    this.statusCode = '';
    this.httpMethod = '';
    this.apiEndPoint = '';
    this.ipOnlyLocal = false;
    this.filters = [];
    this.logs = [];
    this.offsetToken = '';
    this.fetchLogs();
  }
}
