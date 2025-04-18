import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../service/admin.service';
import { Admin, PaginationResponse, AdminFilterParams } from '../../../interfaces/admin.interface';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-view-admins',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './view-admins.component.html',
  styleUrl: './view-admins.component.css'
})
export class ViewAdminsComponent implements OnInit {
  displayedColumns: string[] = ['fullName', 'emailId', 'country', 'isActive', 'createdDate'];
  dataSource: Admin[] = [];
  isLoading = false;
  totalRecords = 0;
  pageSize = 10;
  currentPage = 0;
  offsetToken: string | undefined;

  // Filter options
  filterParams: AdminFilterParams = {
    limit: this.pageSize
  };

  // Filter dropdown options
  dateRangeTypes = [
    { value: 'created', viewValue: 'Created Date' },
    { value: 'lastLogin', viewValue: 'Last Login' }
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadAdmins();
  }

  loadAdmins() {
    this.isLoading = true;
    this.adminService.getAllAdmins(this.filterParams).subscribe({
      next: (response) => {
        this.dataSource = response.data;
        this.offsetToken = response.offsetToken;
        this.totalRecords = response.recordCount;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading admins:', error);
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.filterParams.offsetToken = this.offsetToken;
    this.loadAdmins();
  }

  applyFilters() {
    this.currentPage = 0;
    this.offsetToken = undefined;
    this.filterParams.offsetToken = undefined;
    this.loadAdmins();
  }

  clearFilters() {
    this.filterParams = {
      limit: this.pageSize
    };
    this.currentPage = 0;
    this.offsetToken = undefined;
    this.loadAdmins();
  }

  toggleAdminStatus(adminId: string, isActive: boolean) {
    this.adminService.toggleAdminStatus(adminId, isActive).subscribe({
      next: () => {
        this.loadAdmins();
      },
      error: (error) => {
        console.error('Error toggling admin status:', error);
      }
    });
  }
}
