import { Component, HostListener, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, throttleTime, filter } from 'rxjs/operators';

import { CustomerService } from '../../../service/customer.service';
import { Customer } from '../../../interfaces/customer.interface';
import { PaginationResponse } from '../../../interfaces/paginationResponse.interface';

@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  styleUrls: ['./view-customer.component.css']
})
export class ViewCustomerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('customerTableContainer', { static: false }) customerTableContainer!: ElementRef;

  // Data properties
  customers: Customer[] = [];
  totalRecords = 0;
  loadedRecords = 0;
  hasMore = true;
  isLoading = false;
  isInitialLoad = true;
  errorLoading = false;
  offsetToken: string | null = null;
  
  // UI state
  activeActionMenu: string | null = null;
  
  // Filter options
  tireOptions = ['TIRE0', 'TIRE1', 'TIRE2', 'TIRE3', 'TIRE4'];
  statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  // Form
  filterForm: FormGroup;
  
  // Private properties
  private readonly LOAD_MORE_DEBOUNCE = 100;
  private readonly SCROLL_THRESHOLD = 300; // pixels from bottom
  private destroy$ = new Subject<void>();
  private scrollSubject = new Subject<void>();
  private isInitialized = false;
  private lastScrollPosition = 0;
  private isScrolling = false;
  
  // Constants
  pageSize = 20;

  constructor(private customerService: CustomerService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      search: [''],
      tireCodes: [''],
      selectedTires: this.fb.control([]), // For multi-select
      status: ['all'],
      isPrimeMember: [false],
    });

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
      
    // Watch for form changes to trigger search
    this.filterForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.loadCustomers(true);
      });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    if (this.isInitialized) return;

    // Set a fixed height for the scroll container
    if (this.customerTableContainer) {
      this.adjustContainerHeight();
    }

    // Set up scroll listener
    this.setupScrollListener();

    // Initial data load
    this.loadCustomers(true);

    this.isInitialized = true;
  }

  private initializeForm(): void {
    this.filterForm = this.fb.group({
      search: [''],
      tireCodes: [''],
      selectedTires: this.fb.control([]), // For multi-select
      status: ['all'],
      isPrimeMember: [false],
    });
  }

  private setupSearch(): void {
    this.scrollSubject.pipe(
      takeUntil(this.destroy$),
      debounceTime(this.LOAD_MORE_DEBOUNCE),
      distinctUntilChanged()
    ).subscribe(() => this.checkScrollAndLoad());
  }

  private adjustContainerHeight(): void {
    if (!this.customerTableContainer?.nativeElement) return;
    
    const container = this.customerTableContainer.nativeElement;
    const viewportHeight = window.innerHeight;
    const containerTop = container.getBoundingClientRect().top;
    container.style.height = `${Math.max(viewportHeight - containerTop - 20, 400)}px`;
  }

  private setupScrollListener(): void {
    this.destroy$.next();
    if (!this.customerTableContainer?.nativeElement) return;

    const container = this.customerTableContainer.nativeElement;
    const checkScroll = () => this.handleScroll(container);

    // Initial checks
    setTimeout(() => {
      checkScroll();
      setTimeout(checkScroll, 300);
    }, 300);

    // Scroll events
    fromEvent(container, 'scroll')
      .pipe(
        takeUntil(this.destroy$),
        throttleTime(200),
        filter(() => !this.isLoading && this.hasMore)
      )
      .subscribe(checkScroll);

    // Window resize
    fromEvent(window, 'resize')
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(100)
      )
      .subscribe(() => {
        this.adjustContainerHeight();
        checkScroll();
      });
  }

  private handleScroll(container: HTMLElement): void {
    if (this.isLoading || !this.hasMore) return;

    const scrollPosition = container.scrollTop + container.clientHeight;
    const scrollHeight = container.scrollHeight;
    const threshold = 100;

    if (scrollHeight - scrollPosition <= threshold) {
      this.loadMore();
    }
  }

  loadCustomers(initialLoad: boolean = true): void {
    console.log('loadCustomers called, initialLoad:', initialLoad);
    
    if (this.isLoading) {
      console.log('Loading already in progress, skipping');
      return;
    }

    this.isLoading = true;
    console.log('Loading started, setting isLoading to true');
    
    if (initialLoad) {
      console.log('Initial load, resetting customers array and offsetToken');
      this.customers = [];
      this.offsetToken = null;
    }

    const filters = this.filterForm.value;
    console.log('Current filters:', filters);
    
    const filterParams = {
      searchTerm: filters.search || undefined,
      isPrimeMember: filters.isPrimeMember || undefined,
      tireCodes: filters.selectedTires?.length ? filters.selectedTires : undefined,
      status: filters.status === 'all' ? undefined : filters.status,
      offsetToken: this.offsetToken || undefined,
    };
    
    console.log('Sending request with params:', filterParams);
    
    this.customerService.getCustomers(filterParams).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: any) => {
        console.log('API Response:', response);
        
        // Update to handle the actual API response structure
        const newCustomers = response.data || [];
        this.customers = initialLoad 
          ? newCustomers 
          : [...this.customers, ...newCustomers];
          
        this.hasMore = !!response.offsetToken; // If there's an offsetToken, there might be more data
        this.offsetToken = response.offsetToken || null;
        this.totalRecords = response.recordCount || newCustomers.length;
        this.loadedRecords = this.customers.length;
        
        console.log('Updated component state:', {
          customers: this.customers,
          hasMore: this.hasMore,
          offsetToken: this.offsetToken,
          totalRecords: this.totalRecords,
          loadedRecords: this.loadedRecords
        });
      },
      error: (error: any) => {
        console.error('Error loading customers:', error);
        this.isLoading = false;
        this.errorLoading = true;
      },
      complete: () => {
        this.isLoading = false;
        this.isInitialLoad = false;
      }
    });
  }

  private loadMore(): void {
    if (this.isLoading || !this.hasMore) {
      return;
    }
    this.loadCustomers(false);
  }

  private checkScrollAndLoad(): void {
    if (this.shouldLoadMore()) {
      this.loadMore();
    }
  }

  private shouldLoadMore(): boolean {
    if (this.isLoading || !this.hasMore) {
      return false;
    }

    try {
      const scrollContainer = this.customerTableContainer?.nativeElement;
      if (!scrollContainer) {
        return false;
      }

      const scrollPosition = Math.ceil(scrollContainer.scrollTop + scrollContainer.clientHeight);
      const threshold = Math.ceil(scrollContainer.scrollHeight - 100);
      
      return scrollPosition >= threshold;
    } catch (error) {
      console.error('Error checking scroll position:', error);
      return false;
    }
  }

  // UI Helper Methods
  removeTire(tire: string): void {
    const currentTires = this.filterForm.get('selectedTires')?.value as string[];
    const updatedTires = currentTires.filter(t => t !== tire);
    this.filterForm.get('selectedTires')?.setValue(updatedTires);
    this.loadCustomers(true);
  }

  onFilter(): void {
    this.loadCustomers(true);
  }

  onReset(): void {
    this.filterForm.reset({
      search: '',
      tireCodes: '',
      selectedTires: [],
      status: 'all',
      isPrimeMember: false
    });
    this.loadCustomers(true);
  }

  // Toggle action menu
  toggleActionMenu(customerId: string): void {
    this.activeActionMenu = this.activeActionMenu === customerId ? null : customerId;
  }

  // Close action menu when clicking outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.action-menu')) {
      this.activeActionMenu = null;
    }
  }

  // TrackBy function for ngFor
  trackByCustomerId(index: number, customer: Customer): string {
    return customer.id;
  }

  // View customer details
  viewDetails(customer: Customer): void {
    console.log('View details:', customer);
    // Implement view details logic
  }

  // Edit customer
  editCustomer(customer: Customer): void {
    console.log('Edit customer:', customer);
    // Implement edit logic
  }

  // Delete customer
  deleteCustomer(customer: Customer): void {
    if (confirm(`Are you sure you want to delete ${customer.fullName}?`)) {
      this.customerService.deleteCustomer(customer.id).subscribe({
        next: () => {
          this.customers = this.customers.filter(c => c.id !== customer.id);
          this.totalRecords--;
          this.loadedRecords--;
        },
        error: (error: any) => {
          console.error('Error deleting customer:', error);
          // You might want to show a toast/notification to the user here
        }
      });
    }
  }
}
