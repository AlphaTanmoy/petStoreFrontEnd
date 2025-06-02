import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener, ViewEncapsulation } from '@angular/core';
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

  @ViewChild('tableContainer') private tableContainer!: ElementRef;
  @ViewChild('accessDropdown', { static: false }) private accessDropdownElement!: ElementRef;
  @ViewChild('menuTypeDropdown', { static: false }) private menuTypeDropdownElement!: ElementRef;
  
  private subscriptions = new Subscription();
  private scrollListener: () => void;
  private isScrolling = false;
  private clickListener: (event: MouseEvent) => void;

  constructor(
    private navbarService: NavbarService,
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private elementRef: ElementRef
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      access: [[]],
      isSubMenu: [''],
      showGuest: [false],
      showInActive: [false]
    });
    
    this.scrollListener = () => this.handleScroll();
    
    // Initialize click listener for handling clicks outside dropdowns
    this.clickListener = (event: MouseEvent) => this.handleClickOutside(event);
  }

  ngOnInit(): void {
    this.loadAccessOptions();
    this.loadItems(true);
    
    const searchSub = this.filterForm.get('search')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      this.applyFilters();
    });
    
    if (searchSub) {
      this.subscriptions.add(searchSub);
    }
    
    // Add click listener when component initializes
    document.addEventListener('click', this.clickListener);
  }

  ngAfterViewInit() {
    // Use setTimeout to ensure the view is fully rendered
    setTimeout(() => {
      if (this.tableContainer?.nativeElement) {
        console.log('Attaching scroll listener to table container');
        
        // Remove any existing listener to prevent duplicates
        this.tableContainer.nativeElement.removeEventListener('scroll', this.scrollListener);
        
        // Add the scroll listener
        this.tableContainer.nativeElement.addEventListener('scroll', this.scrollListener);
        
        console.log('Scroll listener attached, checking if more items are needed...');
        
        // Initial check to see if we need to load more items
        this.checkIfMoreItemsNeeded();
      } else {
        console.error('Table container not found for scroll listener');
      }
    }, 100); // Small delay to ensure the view is fully rendered
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
    this.subscriptions.unsubscribe();
    if (this.tableContainer) {
      this.tableContainer.nativeElement.removeEventListener('scroll', this.scrollListener);
    }
    // Remove click listener when component is destroyed
    document.removeEventListener('click', this.clickListener);
  }

  // Check if we need to load more items to fill the viewport
  private checkIfMoreItemsNeeded(): void {
    if (this.loading || !this.hasMore || !this.tableContainer?.nativeElement) {
      return;
    }

    const element = this.tableContainer.nativeElement;
    // If the content height is less than the container height, load more
    if (element.scrollHeight <= element.clientHeight) {
      this.loadMoreItems();
    }
  }

  private handleScroll(): void {
    // Don't trigger if already loading, no more items, or container not ready
    if (this.loading || !this.hasMore || !this.tableContainer?.nativeElement) {
      return;
    }
    
    const element = this.tableContainer.nativeElement;
    const threshold = 300; // pixels from bottom to trigger load
    const scrollPosition = element.scrollTop + element.clientHeight;
    const scrollHeight = element.scrollHeight;
  
    // Check if we've scrolled near the bottom (within threshold)
    const shouldLoadMore = scrollPosition >= scrollHeight - threshold;
    
    if (shouldLoadMore && !this.isScrolling) {
      console.log('Scrolled near bottom, loading more items...');
      this.isScrolling = true;
      this.loadMoreItems().finally(() => {
        this.isScrolling = false;
      });
    }
  }

  private async loadMoreItems(): Promise<void> {
    // Prevent multiple simultaneous loads or if no more items
    if (this.loading || !this.hasMore) {
      return;
    }
    
    try {
      console.log('Loading more items with offsetToken:', this.offsetToken);
      await this.loadItems(false);
      
      // After loading, check if we need to load more to fill the viewport
      if (this.tableContainer?.nativeElement && this.hasMore) {
        const container = this.tableContainer.nativeElement;
        const isViewportFilled = container.scrollHeight > container.clientHeight;
        
        // If the content is not filling the viewport and we have more items, load more
        if (!isViewportFilled) {
          console.log('Viewport not filled, loading more items...');
          await this.loadMoreItems();
        }
      }
    } catch (error) {
      console.error('Error loading more items:', error);
    }
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

  // Load items from the API with pagination
  loadItems(reset = false): Promise<void> {
    return new Promise((resolve, reject) => {
      // Prevent multiple simultaneous requests
      if (this.loading) {
        console.log('Already loading, skipping duplicate request');
        resolve();
        return;
      }
      
      this.loading = true;
      const formValue = this.filterForm.value;
      
      // Reset items and pagination if this is a fresh load
      if (reset) {
        console.log('Resetting items and pagination');
        this.items = [];
        this.offsetToken = ''; // Reset to empty string for new search
        this.hasMore = true;
      } else if (!this.hasMore) {
        // If we've already loaded everything, don't make another request
        console.log('No more items to load');
        this.loading = false;
        resolve();
        return;
      }
      
      console.log('Loading items with offsetToken:', this.offsetToken);
      
      // Build the request parameters
      const listOfRolesCanAccess = formValue.access || [];
      const showSubMenusOnly = formValue.isSubMenu === 'true';
      const applyParentSubMenuFilter = formValue.isSubMenu === 'false';
      
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
        offsetToken: this.offsetToken || '',  // Always pass the current offsetToken
        queryString: formValue.search || '%',
        listOfRolesCanAccess: mappedRoles.length ? mappedRoles : undefined,
        showSubMenusOnly,
        isVisibleToGuest: formValue.showGuest || false,
        showInActive: formValue.showInActive || false,
        applyParentSubMenuFilter
      };
      
      console.log('API Request Params:', JSON.stringify(params, null, 2));
      
      // Make the API call
      this.navbarService.getNavbarList(params).subscribe({
        next: (response: PaginationResponse<MenuItem>) => {
          console.log('API Response:', response);
          
          // Update items - append if not resetting, replace if resetting
          this.items = reset ? response.data : [...this.items, ...response.data];
          
          // Update pagination state
          this.offsetToken = response.offsetToken || '';
          this.hasMore = response.data.length === DEFAULT_PAGE_SIZE;
          
          console.log('Updated state - hasMore:', this.hasMore, 'offsetToken:', this.offsetToken);
          
          // After updating items, check if we need to load more to fill the viewport
          setTimeout(() => this.checkIfMoreItemsNeeded(), 0);
          
          resolve();
        },
        error: (error) => {
          console.error('Error loading navbar items:', error);
          this.loading = false;
          reject(error);
        },
        complete: () => {
          this.loading = false;
          
          // Check again after loading is complete to handle any UI updates
          setTimeout(() => this.checkIfMoreItemsNeeded(), 100);
        }
      });
    });
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