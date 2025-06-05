import { Component, HostListener, OnDestroy, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CustomerService } from '../../../service/customer.service';
import { Customer, CustomerFilter } from '../../../interfaces/customer.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaginationResponse } from '../../../interfaces/paginationResponse.interface';
import { Subject, fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, throttleTime, filter } from 'rxjs/operators';
@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  imports:[CommonModule, ReactiveFormsModule, FormsModule],
  styleUrls: ['./view-customer.component.css']
})
export class ViewCustomerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('customerTableContainer', { static: true }) customerTableContainer!: ElementRef;
  
  customers: Customer[] = [];
  private readonly LOAD_MORE_DEBOUNCE = 100;
  private destroy$ = new Subject<void>();
  private isScrolling = false;
  offsetToken: string | null = null;
  isLoading = false;
  isInitialLoad = true;
  errorLoading = false;
  hasMore = true;
  totalRecords = 0;
  loadedRecords = 0;
  
  // Filter options
  tireOptions = ['TIRE0', 'TIRE1', 'TIRE2', 'TIRE3', 'TIRE4'];
  statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  // Form
  filterForm: FormGroup;
  
  // Scroll handling
  private scrollSubject = new Subject<void>();
  private readonly SCROLL_THRESHOLD = 300; // pixels from bottom

  constructor(private customerService: CustomerService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      search: [''],
      tireCodes: [[]],
      status: ['all'],
      isPrimeMember: [false],
    });
    
    this.scrollSubject.pipe(
      takeUntil(this.destroy$),
      debounceTime(this.LOAD_MORE_DEBOUNCE),
      distinctUntilChanged()
    ).subscribe(() => this.checkScrollAndLoad());
  }

  ngOnInit(): void {
    this.setupScrollListener();
    this.loadCustomers(true);
  }

  ngAfterViewInit(): void {
    // Set a fixed height for the scroll container
    if (this.customerTableContainer) {
      const container = this.customerTableContainer.nativeElement;
      const viewportHeight = window.innerHeight;
      const containerTop = container.getBoundingClientRect().top;
      const containerHeight = viewportHeight - containerTop - 20; // 20px padding from bottom
      
      container.style.height = `${Math.max(containerHeight, 400)}px`; // Min height 400px
      
      console.log('Container height set to:', container.style.height);
      this.loadCustomers(true);
    }
    
    // Set up scroll listener after a short delay to ensure DOM is ready
    setTimeout(() => this.setupScrollListener(), 300);
  }
  
  private setupScrollListener(): void {
    // Clean up any existing listeners
    this.destroy$.next();
    
    if (!this.customerTableContainer) {
      console.error('Scroll container not found');
      return;
    }
    
    const container = this.customerTableContainer.nativeElement;
    
    const checkScroll = () => {
      if (this.isLoading || !this.hasMore) {
        return;
      }
      
      const scrollPosition = container.scrollTop + container.clientHeight;
      const threshold = container.scrollHeight - 100; // 100px from bottom
      
      console.log('Scroll check:', {
        scrollTop: container.scrollTop,
        clientHeight: container.clientHeight,
        scrollHeight: container.scrollHeight,
        scrollPosition,
        threshold,
        diff: scrollPosition - threshold,
        shouldLoad: scrollPosition >= threshold,
        isLoading: this.isLoading,
        hasMore: this.hasMore
      });
      
      if (scrollPosition >= threshold) {
        console.log('Loading more data...');
        this.loadMore();
      }
    };
    
    // Initial check after a short delay to ensure container is rendered
    setTimeout(() => {
      checkScroll();
      
      // Force a recheck after data loads
      setTimeout(checkScroll, 300);
    }, 300);
    
    // Listen to scroll events
    fromEvent(container, 'scroll')
      .pipe(
        takeUntil(this.destroy$),
        throttleTime(200),
        filter(() => !this.isLoading && this.hasMore)
      )
      .subscribe(() => checkScroll());
      
    // Also check on window resize
    fromEvent(window, 'resize')
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(100)
      )
      .subscribe(() => {
        // Recalculate container height on resize
        const viewportHeight = window.innerHeight;
        const containerTop = container.getBoundingClientRect().top;
        container.style.height = `${Math.max(viewportHeight - containerTop - 20, 400)}px`;
        checkScroll();
      });
  }
  
  private checkAndLoadMore(): void {
    if (this.shouldLoadMore() && !this.isLoading && this.hasMore) {
      console.log('Loading more data...');
      this.loadCustomers(false);
    }
  }

  private shouldLoadMore(): boolean {
    if (this.isLoading) {
      console.log('Not loading more - already loading');
      return false;
    }
    
    if (!this.hasMore) {
      console.log('Not loading more - no more data');
      return false;
    }
    
    try {
      const scrollContainer = this.customerTableContainer?.nativeElement;
      if (!scrollContainer) {
        console.log('No scroll container found');
        return false;
      }
      
      // Check if we're at the bottom (with a small threshold)
      const scrollPosition = Math.ceil(scrollContainer.scrollTop + scrollContainer.clientHeight);
      const threshold = Math.ceil(scrollContainer.scrollHeight - 100); // 100px from bottom
      
      const shouldLoad = scrollPosition >= threshold;
      
      console.log('Scroll check -', {
        scrollTop: scrollContainer.scrollTop,
        clientHeight: scrollContainer.clientHeight,
        scrollHeight: scrollContainer.scrollHeight,
        scrollPosition,
        threshold,
        diff: scrollPosition - threshold,
        shouldLoad,
        isLoading: this.isLoading,
        hasMore: this.hasMore
      });
      
      return shouldLoad;
    } catch (error) {
      console.error('Error checking scroll position:', error);
      return false;
    }
  }

  loadCustomers(reset: boolean = false): void {
    if (this.isLoading) {
      console.log('Skipping load - already loading');
      return;
    }
    
    if (!reset && !this.hasMore) {
      console.log('Skipping load - no more data to load');
      return;
    }
    
    console.log('Loading customers - reset:', reset, 'offsetToken:', this.offsetToken);
    
    this.isLoading = true;
    this.errorLoading = false;
    
    if (reset) {
      this.offsetToken = null;
      this.customers = [];
      this.hasMore = true;
      this.loadedRecords = 0;
    }
    
    const formValue = this.filterForm.value;
    const filter: CustomerFilter = {
      searchTerm: formValue.search || undefined,
      isPrimeMember: formValue.isPrimeMember || undefined,
      tireCodes: formValue.tireCodes?.length ? formValue.tireCodes : undefined,
      offsetToken: this.offsetToken || undefined
    };
    
    console.log('Loading customers with filter:', filter);
    
    this.customerService.getCustomers(filter).subscribe({
      next: (response) => {
        if (this.destroy$.closed) return;
        
        console.log('Received customer data:', response);
        
        const newCustomers = response.data || [];
        this.customers = reset ? newCustomers : [...this.customers, ...newCustomers];
        this.offsetToken = response.offsetToken || null;
        this.totalRecords = response.recordCount || 0;
        this.loadedRecords = this.customers.length;
        this.hasMore = this.loadedRecords < this.totalRecords && !!response.offsetToken;
        
        console.log('Updated state:', {
          loaded: this.loadedRecords,
          total: this.totalRecords,
          hasMore: this.hasMore,
          offsetToken: this.offsetToken
        });
        
        this.isLoading = false;
        this.isInitialLoad = false;
      },
      error: (error) => {
        if (!this.destroy$.closed) {
          console.error('Error loading customers:', error);
          this.isLoading = false;
          this.errorLoading = true;
        }
      }
    });
  }

  loadMore(): void {
    if (!this.isLoading && this.hasMore) {
      console.log('Loading more customers with offsetToken:', this.offsetToken);
      this.loadCustomers(false); // Pass false to append to existing results
    } else {
      console.log('Skipping loadMore - isLoading:', this.isLoading, 'hasMore:', this.hasMore);
    }
  }
  
  private checkScrollAndLoad(): void {
    if (this.isLoading || !this.hasMore) {
      console.log('Not loading more - isLoading:', this.isLoading, 'hasMore:', this.hasMore);
      return;
    }
    
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - this.SCROLL_THRESHOLD;
    
    console.log('Scroll check - Position:', scrollPosition, 'Threshold:', threshold, 'Diff:', scrollPosition - threshold);
    
    if (scrollPosition >= threshold) {
      console.log('Loading more data...');
      this.loadMore();
    }
  }

  // Clean up when component is destroyed
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFilter(): void {
    this.isInitialLoad = true;
    this.loadCustomers(true);
  }

  onReset(): void {
    this.filterForm.reset({
      search: '',
      tireCodes: [],
      status: 'all',
      isPrimeMember: false
    });
    this.isInitialLoad = true;
    this.loadCustomers(true);
  }
  
  trackByCustomerId(index: number, customer: Customer): string {
    return customer.id;
  }
}
