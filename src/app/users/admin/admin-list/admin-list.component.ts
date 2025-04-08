import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Admin, AdminFilterParams } from '../../../interfaces/admin.interface';
import { AdminService } from '../../../service/admin.service';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminListComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  admins: Admin[] = [];
  loading = false;
  offsetToken: string | null = null;
  hasMore = true;
  filterParams: AdminFilterParams = {
    limit: 20,
    showInActive: false
  };

  private searchSubject = new Subject<string>();

  constructor(private adminService: AdminService) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.filterParams.userName = value;
      this.resetAndLoad();
    });
  }

  ngOnInit(): void {
    this.loadAdmins();
  }

  ngAfterViewInit(): void {
    this.setupInfiniteScroll();
  }

  private setupInfiniteScroll(): void {
    const element = this.scrollContainer.nativeElement;
    element.addEventListener('scroll', () => {
      if (element.scrollHeight - element.scrollTop === element.clientHeight) {
        if (this.hasMore && !this.loading) {
          this.loadMore();
        }
      }
    });
  }

  loadAdmins(): void {
    this.loading = true;
    this.adminService.getAllAdmins(this.filterParams).subscribe({
      next: (response) => {
        this.admins = response.data;
        this.offsetToken = response.offsetToken;
        this.hasMore = !!response.offsetToken;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading admins:', error);
        this.loading = false;
      }
    });
  }

  loadMore(): void {
    if (!this.offsetToken) return;

    this.loading = true;
    this.filterParams.offsetToken = this.offsetToken;

    this.adminService.getAllAdmins(this.filterParams).subscribe({
      next: (response) => {
        this.admins = [...this.admins, ...response.data];
        this.offsetToken = response.offsetToken;
        this.hasMore = !!response.offsetToken;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading more admins:', error);
        this.loading = false;
      }
    });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  onFilterChange(): void {
    this.resetAndLoad();
  }

  resetAndLoad(): void {
    this.offsetToken = null;
    this.hasMore = true;
    this.loadAdmins();
  }

  toggleAdminStatus(admin: Admin): void {
    this.adminService.toggleAdminStatus(admin.id, !admin.isActive).subscribe({
      next: () => {
        admin.isActive = !admin.isActive;
      },
      error: (error) => {
        console.error('Error toggling admin status:', error);
      }
    });
  }

  viewAdminProfile(adminId: string): void {
    // Implement navigation to admin profile page
    console.log('View admin profile:', adminId);
  }
}
