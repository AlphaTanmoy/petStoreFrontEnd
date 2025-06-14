import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged, takeUntil, filter } from 'rxjs/operators';
import { fromEvent, Subject, Subscription } from 'rxjs';

import { CustomerService } from '../../../service/customer.service';
import { Customer } from '../../../interfaces/customer.interface';
import { PaginationResponse } from '../../../interfaces/paginationResponse.interface';

@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  styleUrls: ['./view-customer.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSnackBarModule
  ]
})
export class ViewCustomerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tableContainer') private tableContainer!: ElementRef;

  customers: Customer[] = [];
  loading = false;
  hasMore = true;
  totalRecords = 0;
  loadedRecords = 0;
  offsetToken: string | null = null;

  // Filter options
  tireOptions = ['TIRE0', 'TIRE1', 'TIRE2', 'TIRE3', 'TIRE4'];
  statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  filterForm: FormGroup;

  // Status filter properties
  statusDropdownOpen = false;
  statusSearchText = '';
  filteredStatusOptions: { value: string; label: string }[] = [];

  private destroy$ = new Subject<void>();
  private readonly SCROLL_THRESHOLD = 100;
  private readonly SCROLL_DEBOUNCE = 200;
  private lastScrollTime = 0;

  private snackBar = inject(MatSnackBar);
  private scrollSubscription?: Subscription;

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      tireCodes: [''],
      selectedTires: [[]],
      status: ['all'],
      isPrimeMember: [false]
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.filteredStatusOptions = [...this.statusOptions];
    
    // Watch for tire code changes
    this.filterForm.get('tireCodes')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (value && !this.filterForm.get('selectedTires')?.value.includes(value)) {
          const currentTires = [...this.filterForm.get('selectedTires')?.value, value];
          this.filterForm.get('selectedTires')?.setValue(currentTires, { emitEvent: false });
          this.filterForm.get('tireCodes')?.setValue('', { emitEvent: false });
        }
      });

    // Watch for search changes with debounce
    this.filterForm.get('search')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => this.applyFilters());
      
    // Initialize status as array if it's not 'all'
    const currentStatus = this.filterForm.get('status')?.value;
    if (currentStatus && currentStatus !== 'all' && !Array.isArray(currentStatus)) {
      this.filterForm.get('status')?.setValue([currentStatus]);
    }
  }

  ngAfterViewInit(): void {
    this.setupScrollListener();
    this.loadCustomers(true);
  }

  ngOnDestroy(): void {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupScrollListener(): void {
    if (!this.tableContainer?.nativeElement) return;
    
    // Unsubscribe from previous subscription if it exists
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }

    const container = this.tableContainer.nativeElement;
    this.scrollSubscription = fromEvent(container, 'scroll')
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(100)
      )
      .subscribe(() => this.handleScroll(container));
  }

  private handleScroll(container: HTMLElement): void {
    const now = Date.now();
    if (now - this.lastScrollTime < this.SCROLL_DEBOUNCE || this.loading || !this.hasMore) {
      return;
    }
    this.lastScrollTime = now;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollPosition = scrollTop + clientHeight;
    const distanceFromBottom = scrollHeight - scrollPosition;

    if (distanceFromBottom <= this.SCROLL_THRESHOLD) {
      this.loadMore();
    }
  }

  loadCustomers(reset = false): void {
    if (this.loading) return;

    this.loading = true;
    if (reset) {
      this.customers = [];
      this.offsetToken = null;
      this.hasMore = true;
    }

    const filters = this.filterForm.value;
    const params = {
      searchTerm: filters.search || undefined,
      isPrimeMember: filters.isPrimeMember || undefined,
      tireCodes: filters.selectedTires?.length ? filters.selectedTires : undefined,
      status: filters.status === 'all' ? undefined : filters.status,
      offsetToken: this.offsetToken || undefined
    };

    this.customerService.getCustomers(params).subscribe({
      next: (response: PaginationResponse<Customer>) => {
        const newCustomers = response.data || [];
        this.customers = reset ? newCustomers : [...this.customers, ...newCustomers];
        this.hasMore = !!response.offsetToken;
        this.offsetToken = response.offsetToken || null;
        this.totalRecords = response.recordCount || newCustomers.length;
        this.loadedRecords = this.customers.length;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private loadMore(): void {
    if (this.loading || !this.hasMore) return;
    this.loadCustomers(false);
  }

  applyFilters(): void {
    this.loadCustomers(true);
  }

  resetFilters(): void {
    this.filterForm.reset({
      search: '',
      tireCodes: '',
      selectedTires: [],
      status: 'all',
      isPrimeMember: false
    });
    this.statusSearchText = '';
    this.filteredStatusOptions = [...this.statusOptions];
    this.loadCustomers(true);
  }
  
  // Status filter methods
  toggleStatusDropdown(): void {
    this.statusDropdownOpen = !this.statusDropdownOpen;
    if (this.statusDropdownOpen) {
      this.filterStatusOptions();
    }
  }

  filterStatusOptions(): void {
    if (!this.statusSearchText) {
      this.filteredStatusOptions = [...this.statusOptions];
    } else {
      const searchText = this.statusSearchText.toLowerCase();
      this.filteredStatusOptions = this.statusOptions.filter(option => 
        option.label.toLowerCase().includes(searchText)
      );
    }
  }

  isStatusSelected(statusValue: string): boolean {
    const selectedStatuses = this.filterForm.get('status')?.value;
    if (selectedStatuses === 'all') return false;
    return Array.isArray(selectedStatuses) 
      ? selectedStatuses.includes(statusValue)
      : selectedStatuses === statusValue;
  }

  toggleStatusSelection(statusValue: string): void {
    let currentStatus = this.filterForm.get('status')?.value;
    
    if (statusValue === 'all') {
      this.filterForm.get('status')?.setValue('all');
      return;
    }

    if (currentStatus === 'all') {
      currentStatus = [];
    } else if (!Array.isArray(currentStatus)) {
      currentStatus = currentStatus ? [currentStatus] : [];
    }

    const index = currentStatus.indexOf(statusValue);
    if (index === -1) {
      currentStatus.push(statusValue);
    } else {
      currentStatus.splice(index, 1);
    }

    // If no status selected, default to 'all'
    this.filterForm.get('status')?.setValue(currentStatus.length ? currentStatus : 'all');
  }


  getStatusDisplayText(): string {
    const selected = this.filterForm.get('status')?.value;
    if (selected === 'all' || (Array.isArray(selected) && !selected.length)) {
      return 'All Statuses';
    }
    
    if (Array.isArray(selected)) {
      return selected.length === 1 
        ? this.getStatusLabel(selected[0])
        : `${selected.length} selected`;
    }
    
    return this.getStatusLabel(selected);
  }

  getStatusLabel(statusValue: string): string {
    const status = this.statusOptions.find(s => s.value === statusValue);
    return status ? status.label : statusValue;
  }

  getSelectedStatuses(): string[] {
    const selected = this.filterForm.get('status')?.value;
    if (selected === 'all') return [];
    return Array.isArray(selected) ? selected : [selected];
  }

  removeStatus(statusValue: string): void {
    this.toggleStatusSelection(statusValue);
  }
  
  private initializeForm(): void {
    // Form initialization logic if needed
  }

  removeTire(tire: string): void {
    const currentTires = this.filterForm.get('selectedTires')?.value as string[];
    const updatedTires = currentTires.filter(t => t !== tire);
    this.filterForm.get('selectedTires')?.setValue(updatedTires);
    this.applyFilters();
  }

  viewDetails(customer: Customer): void {
    // Implement view details logic
    console.log('View customer:', customer);
  }

  editCustomer(customer: Customer): void {
    // Implement edit logic
    console.log('Edit customer:', customer);
  }

  deleteCustomer(customer: Customer): void {
    if (confirm(`Are you sure you want to delete ${customer.fullName}?`)) {
      this.customerService.deleteCustomer(customer.id).subscribe({
        next: () => {
          this.customers = this.customers.filter(c => c.id !== customer.id);
          this.totalRecords--;
          this.loadedRecords--;
          this.snackBar.open('Customer deleted successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          console.error('Error deleting customer:', error);
          this.snackBar.open(`Error deleting customer: ${error.message || 'Unknown error'}`, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  trackByCustomerId(index: number, customer: Customer): string {
    return customer.id;
  }
}