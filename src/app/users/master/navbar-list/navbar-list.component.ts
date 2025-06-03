import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, Renderer2, ViewEncapsulation, ChangeDetectorRef, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// Material Modules
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Services and Interfaces
import { NavbarService } from '../../../service/navbar.service';
import { MenuItem } from '../../../interfaces/menu.interface';
import { PaginationResponse } from '../../../interfaces/paginationResponse.interface';

// Components
import { ConfirmDialogBoxComponent } from '../../../components/confirm-dialog-box/confirm-dialog-box.component';

// Constants
import { USER_ROLE } from '../../../constants/Enums';
import { AUTH_TOKEN, DEFAULT_PAGE_SIZE } from '../../../constants/KeywordsAndConstrants';

// RxJS
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-navbar-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    RouterModule,
    MatTableModule, 
    MatPaginatorModule, 
    MatSortModule, 
    MatTooltipModule, 
    MatButtonModule, 
    MatIconModule,
    MatDialogModule,
    MatSlideToggleModule
  ],
  templateUrl: './navbar-list.component.html',
  styleUrls: ['./navbar-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarListComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  offsetToken: string | null = null;
  loading = false;
  hasMore = true;
  filterForm: FormGroup;
  accessDropdownOpen = false;
  menuTypeDropdownOpen = false;
  accessSearchText = '';
  filteredAccessOptions: { value: string; label: string }[] = [];
  selectedAccessLabels: string[] = [];
  
  menuTypeOptions = [
    { value: '', label: 'All Menus' },
    { value: 'true', label: 'Sub Menus Only' },
    { value: 'false', label: 'Parent Menus Only' }
  ];
  
  accessOptions = [
    { value: 'canMasterAccess', label: 'Master' },
    { value: 'canAdminAccess', label: 'Admin' },
    { value: 'canUserAccess', label: 'User' },
    { value: 'canDoctorAccess', label: 'Doctor' },
    { value: 'canSellerAccess', label: 'Seller' },
    { value: 'canRiderAccess', label: 'Rider' },
    { value: 'customerCareAccess', label: 'Customer Care' },
    { value: 'isVisibleToGuest', label: 'Guest' }
  ];
  
  private readonly accessRoleMap: { [key: string]: string } = {
    canMasterAccess: USER_ROLE.ROLE_MASTER,
    canAdminAccess: USER_ROLE.ROLE_ADMIN,
    canUserAccess: USER_ROLE.ROLE_CUSTOMER,
    canDoctorAccess: USER_ROLE.ROLE_DOCTOR,
    canSellerAccess: USER_ROLE.ROLE_SELLER,
    canRiderAccess: USER_ROLE.ROLE_RAIDER,
    customerCareAccess: USER_ROLE.ROLE_CUSTOMER_CARE,
    isVisibleToGuest: USER_ROLE.GUEST
  };
  
  columns = [
    { id: 'icon', label: 'Icon', sticky: false },
    { id: 'menuName', label: 'Menu Name', sticky: false },
    { id: 'menuLink', label: 'Menu Link', sticky: false },
    { id: 'redirection', label: 'Redirection', sticky: false },
    { id: 'isSubMenu', label: 'Sub Menu', sticky: false },
  ];

  accessRoleColumns: { id: string; label: string; sticky: boolean }[] = [
    { id: 'canMasterAccess', label: 'Master', sticky: false },
    { id: 'canAdminAccess', label: 'Admin', sticky: false },
    { id: 'canUserAccess', label: 'User', sticky: false },
    { id: 'canDoctorAccess', label: 'Doctor', sticky: false },
    { id: 'canSellerAccess', label: 'Seller', sticky: false },
    { id: 'canRiderAccess', label: 'Rider', sticky: false },
    { id: 'customerCareAccess', label: 'Customer Care', sticky: false },
    { id: 'isVisibleToGuest', label: 'Guest', sticky: false }
  ];
  
  actionsColumn = { id: 'actions', label: 'Actions', sticky: true };

  isDevMode = isDevMode();
  
  @ViewChild('tableContainer') private tableContainer!: ElementRef
  @ViewChild('accessDropdown', { static: false }) private accessDropdownElement!: ElementRef
  @ViewChild('menuTypeDropdown', { static: false }) private menuTypeDropdownElement!: ElementRef
  private subscriptions = new Subscription()
  private scrollDebounceTimer: any
  private readonly SCROLL_DEBOUNCE_TIME = 200
  private readonly SCROLL_THRESHOLD = 100
  private clickListener: (() => void) | null = null
  private scrollListener: (() => void) | null = null
  private isScrolling = false // Track if we're currently loading more items
  private lastScrollTime = 0
  private readonly SCROLL_DEBOUNCE = 200 // ms

  constructor(
    private navbarService: NavbarService,
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      access: [[]],
      isSubMenu: [''],
      showGuest: [false],
      showInActive: [false]
    });
    
    const searchSub = this.filterForm.get('search')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    )?.subscribe(() => {
      this.applyFilters();
    });
    
    if (searchSub) {
      this.subscriptions.add(searchSub);
    }
  }

  ngOnInit(): void {
    this.loadAccessOptions();
    this.loadItems(true);
  }

  ngAfterViewInit() {
    // Add click listener for dropdowns
    this.clickListener = this.renderer.listen('document', 'click', (event: MouseEvent) => this.handleClickOutside(event));
    
    // Initial load
    this.loadItems(true);
    
    // Setup scroll listener after view is initialized
    // Use setTimeout to ensure the view is fully rendered
    setTimeout(() => {
      this.setupScrollListener();
    }, 0);
  }
  
  private setupScrollListener(): void {
    // Clean up any existing listener
    if (this.scrollListener) {
      this.scrollListener();
      this.scrollListener = null;
    }
    
    // Get the scroll container
    const container = this.elementRef.nativeElement.querySelector('#navbarTableContainer');
    if (container) {
      // Add the scroll event listener
      this.scrollListener = this.renderer.listen(container, 'scroll', (event: Event) => this.handleScroll(event));
      
      // Manually trigger a scroll event to check initial position
      const scrollEvent = new Event('scroll');
      container.dispatchEvent(scrollEvent);
    }
  }

  // Handle clicks outside dropdowns to close them
  private handleClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    
    // Check if click is outside access dropdown
    const isClickInsideAccessDropdown = this.accessDropdownElement?.nativeElement?.contains(target);
    const isClickInsideMenuTypeDropdown = this.menuTypeDropdownElement?.nativeElement?.contains(target);
    
    if (!isClickInsideAccessDropdown && this.accessDropdownOpen) {
      this.accessDropdownOpen = false;
    }
    
    if (!isClickInsideMenuTypeDropdown && this.menuTypeDropdownOpen) {
      this.menuTypeDropdownOpen = false;
    }
  }

  ngOnDestroy() {
    // Clean up event listeners
    if (this.clickListener) {
      this.clickListener();
    }
    
    if (this.scrollListener) {
      this.scrollListener();
    }
    
    // Clear any pending debounce timer
    if (this.scrollDebounceTimer) {
      clearTimeout(this.scrollDebounceTimer);
    }
    
    // Unsubscribe from all subscriptions
    this.subscriptions.unsubscribe();
  }

  private checkIfMoreItemsNeeded(): void {
    // This method is kept for backward compatibility
    // but we'll handle everything in handleScroll now
  }

  // Handle scroll events to load more items when near the bottom

  handleScroll(event: Event): void {
    if (this.loading || !this.hasMore) {
      return;
    }

    const container = event.target as HTMLElement;
    if (!container) {
      if (isDevMode()) {
        console.warn('Scroll container not found');
      }
      return;
    }

    const now = Date.now();
    
    // Debounce scroll events
    if (now - this.lastScrollTime < this.SCROLL_DEBOUNCE) {
      return;
    }
    this.lastScrollTime = now;
    
    const { scrollTop, scrollHeight, clientHeight } = container;
    
    // Calculate if we're near the bottom (within threshold)
    const scrollPosition = scrollTop + clientHeight;
    const distanceFromBottom = scrollHeight - scrollPosition;
    const isNearBottom = distanceFromBottom <= this.SCROLL_THRESHOLD;
    
    if (isDevMode()) {
      console.log('Scroll check:', {
        scrollTop,
        scrollHeight,
        clientHeight,
        scrollPosition,
        distanceFromBottom,
        threshold: this.SCROLL_THRESHOLD,
        isNearBottom,
        loading: this.loading,
        hasMore: this.hasMore,
        itemsCount: this.items.length,
        offsetToken: this.offsetToken
      });
    }
    
    if (isNearBottom && !this.isScrolling) {
      if (isDevMode()) {
        console.log('Scrolled near bottom, loading more items...');
      }
      this.loadMoreItems();
    }
  }
  
  // Load more items when scrolling near the bottom
  private async loadMoreItems(): Promise<void> {
    // Double check conditions before proceeding
    if (this.loading || !this.hasMore || this.isScrolling) {
      if (isDevMode()) {
        console.log('Skipping loadMore - already loading, no more items, or already scrolling');
      }
      return;
    }
    
    try {
      this.isScrolling = true;
      
      if (isDevMode()) {
        console.log('Loading more items...');
      }
      
      // Load the next page of items
      await this.loadItems(false);
      
      if (isDevMode()) {
        console.log('Finished loading more items');
      }
    } catch (error) {
      console.error('Error loading more items:', error);
      // Ensure we reset the loading state on error
      this.loading = false;
      this.isScrolling = false;
      this.cdr.detectChanges();
    }
  }
  
  // Load items from the API with pagination
  loadItems(reset = false): Promise<void> {
    return new Promise((resolve, reject) => {
      // Prevent multiple simultaneous requests
      if (this.loading) {
        if (isDevMode()) {
          console.log('Already loading, skipping duplicate request');
        }
        resolve();
        return;
      }
      
      this.loading = true;
      const formValue = this.filterForm.value;
      
      // Reset items and pagination if this is a fresh load
      if (reset) {
        if (isDevMode()) {
          console.log('Resetting items and pagination');
        }
        this.items = [];
        this.offsetToken = ''; // Reset to empty string for new search
        this.hasMore = true;
      } else if (!this.hasMore) {
        // If we've already loaded everything, don't make another request
        if (isDevMode()) {
          console.log('No more items to load');
        }
        this.loading = false;
        resolve();
        return;
      }
      
      if (isDevMode()) {
        console.log('Current items before load:', this.items.length);
        console.log('Loading items with offsetToken:', this.offsetToken);
      }
      
      // Build the request parameters
      const listOfRolesCanAccess = formValue.access || [];
      const isSubMenuSelected = formValue.isSubMenu;
      
      // Set filter flags based on menu type selection
      const showSubMenusOnly = isSubMenuSelected === 'true';
      const applyParentSubMenuFilter = isSubMenuSelected !== '';
      
      // Map access roles to match backend expectations
      const mappedRoles = listOfRolesCanAccess
        .filter((role: string) => role !== 'isVisibleToGuest')
        .map((role: string) => this.accessRoleMap[role])
        .filter(Boolean);
      
      // Include guest role if selected
      if (formValue.showGuest) {
        mappedRoles.push(USER_ROLE.GUEST);
      }
      
      // Prepare the request parameters
      const params: any = {
        limit: DEFAULT_PAGE_SIZE,
        offsetToken: this.offsetToken || '',
        queryString: formValue.search || '%',
        listOfRolesCanAccess: mappedRoles.length ? mappedRoles : undefined,
        showSubMenusOnly,
        isVisibleToGuest: formValue.showGuest || false,
        showInActive: formValue.showInActive || false,
        applyParentSubMenuFilter
      };
      
      if (isDevMode()) {
        console.log('API Request Params:', JSON.stringify(params, null, 2));
        console.log('Making API call to getNavbarList...');
      }
      
      // Make the API call
      this.navbarService.getNavbarList(params).subscribe({
        next: (response: PaginationResponse<MenuItem>) => {
          if (!response || !Array.isArray(response.data)) {
            console.error('Invalid response format - missing data array:', response);
            this.items = [];
            this.hasMore = false;
            this.loading = false;
            resolve();
            return;
          }
          
          // Update items - append if not resetting, replace if resetting
          const newItems = response.data || [];
          
          if (isDevMode()) {
            console.log('API Response received:', {
              dataLength: newItems.length,
              hasOffsetToken: !!(response?.offsetToken),
              reset: reset
            });
            console.log(`Adding ${newItems.length} new items`);
          }
          
          this.items = reset ? [...newItems] : [...this.items, ...newItems];
          
          // Update pagination state
          this.offsetToken = response.offsetToken || '';
          this.hasMore = newItems.length === DEFAULT_PAGE_SIZE;
          
          if (isDevMode()) {
            console.log('Updated state:', {
              totalItems: this.items.length,
              hasMore: this.hasMore,
              offsetToken: this.offsetToken
            });
          }
          
          this.loading = false;
          this.isScrolling = false;
          this.cdr.detectChanges();
          resolve();
        },
        error: (error) => {
          console.error('Error loading navbar items:', error);
          this.loading = false;
          this.isScrolling = false;
          this.cdr.detectChanges();
          reject(error);
        }
      });
    });
  }

  // Safely get boolean property value from menu item
  getPropertyValue(item: MenuItem, property: string): boolean {
    // Explicitly check for known boolean properties
    const booleanProperties = [
      'canMasterAccess', 'canAdminAccess', 'canUserAccess', 'canDoctorAccess',
      'canSellerAccess', 'canRiderAccess', 'customerCareAccess', 'isVisibleToGuest'
    ];
    
    if (booleanProperties.includes(property)) {
      return !!(item as any)[property];
    }
    return false;
  }

  // Toggle access option in the filter
  toggleAccessOption(role: string, event: Event): void {
    event.stopPropagation(); // Prevent dropdown from closing
    
    const accessControl = this.filterForm.get('access');
    if (!accessControl) return;
    
    const currentRoles = accessControl.value || [];
    const index = currentRoles.indexOf(role);
    
    if (index === -1) {
      currentRoles.push(role);
    } else {
      currentRoles.splice(index, 1);
    }
    
    accessControl.setValue([...currentRoles]);
    accessControl.markAsDirty();
    this.updateSelectedAccessLabels();
  }

  // Get the showInActive form control with proper typing
  getShowInactiveControl(): FormControl {
    return this.filterForm.get('showInActive') as FormControl;
  }

  // Update the selected access labels for display
  private updateSelectedAccessLabels(): void {
    const selected = this.filterForm.get('access')?.value || [];
    this.selectedAccessLabels = this.accessOptions
      .filter(option => selected.includes(option.value))
      .map(option => option.label);
  }

  // Toggle access dropdown
  toggleAccessDropdown(): void {
    this.accessDropdownOpen = !this.accessDropdownOpen;
    if (this.accessDropdownOpen) {
      this.filterAccessOptions();
    }
  }

  // Close access dropdown
  closeAccessDropdown(): void {
    this.accessDropdownOpen = false;
    this.accessSearchText = '';
    this.filterAccessOptions();
  }

  // Toggle Menu Type dropdown
  toggleMenuTypeDropdown(): void {
    this.menuTypeDropdownOpen = !this.menuTypeDropdownOpen;
    if (this.accessDropdownOpen) {
      this.accessDropdownOpen = false;
    }
  }

  // Get the display label for the selected menu type
  getMenuTypeLabel(): string {
    const selectedValue = this.filterForm.get('isSubMenu')?.value;
    const selectedOption = this.menuTypeOptions.find(opt => opt.value === selectedValue);
    return selectedOption ? selectedOption.label : 'Select Menu Type';
  }

  // Handle menu type selection
  selectMenuType(value: string): void {
    this.filterForm.get('isSubMenu')?.setValue(value);
    this.menuTypeDropdownOpen = false;
  }

  // Filter access options based on search text
  filterAccessOptions(): void {
    if (!this.accessSearchText) {
      this.filteredAccessOptions = [...this.accessOptions];
    } else {
      const searchText = this.accessSearchText.toLowerCase();
      this.filteredAccessOptions = this.accessOptions.filter(option => 
        option.label.toLowerCase().includes(searchText)
      );
    }
  }

  // Handle search input changes
  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.accessSearchText = input.value;
    this.filterAccessOptions();
  }

  // Clear all selected access roles
  clearAccessSelection(event: Event): void {
    event.stopPropagation();
    this.filterForm.get('access')?.setValue([]);
    this.selectedAccessLabels = [];
    this.filterAccessOptions();
  }

  // Handle filter changes
  onFilter(): void {
    this.applyFilters();
  }

  // Apply filters and reload data
  applyFilters(): void {
    this.loadItems(true);
  }

  // Reset all filters
  resetFilters(loadItems = true): void {
    this.filterForm.reset({
      search: '',
      access: [],
      isSubMenu: '',
      showGuest: false,
      showInActive: false
    });
    
    this.accessSearchText = '';
    this.selectedAccessLabels = [];
    this.filterAccessOptions();
    
    if (loadItems) {
      this.loadItems(true);
    }
  }

  // Load access options
  loadAccessOptions(): void {
    this.filteredAccessOptions = [...this.accessOptions];
  }

  // View item details
  viewItem(id: string): void {
    this.router.navigate(['/navbar', id]);
  }
  
  // Edit item
  editItem(id: string): void {
    this.router.navigate(['/navbar', id, 'edit']);
  }
  
  // Delete item
  deleteItem(item: MenuItem): void {
    const dialogRef = this.dialog.open(ConfirmDialogBoxComponent, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete ${item.menuName}?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });
    
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.navbarService.deleteNavbarItem(item.id).subscribe({
          next: () => {
            // Remove the item from the list
            const index = this.items.findIndex(i => i.id === item.id);
            if (index > -1) {
              this.items.splice(index, 1);
              this.items = [...this.items]; // Trigger change detection
            }
          },
          error: (error: any) => {
            console.error('Error deleting navbar item:', error);
          }
        });
      }
    });
  }
}