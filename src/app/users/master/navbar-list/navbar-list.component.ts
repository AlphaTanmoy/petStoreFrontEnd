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
    if (this.tableContainer) {
      this.tableContainer.nativeElement.addEventListener('scroll', this.scrollListener);
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
    this.subscriptions.unsubscribe();
    if (this.tableContainer) {
      this.tableContainer.nativeElement.removeEventListener('scroll', this.scrollListener);
    }
    // Remove click listener when component is destroyed
    document.removeEventListener('click', this.clickListener);
  }

  private handleScroll(): void {
    if (this.loading || !this.hasMore || this.isScrolling) return;

    const element = this.tableContainer?.nativeElement;
    if (!element) return;

    // Check if we're near the bottom (within 100px)
    const threshold = 100;
    const position = element.scrollTop + element.clientHeight;
    const height = element.scrollHeight;

    if (position > height - threshold) {
      this.isScrolling = true;
      this.loadMoreItems();
    }
  }

  private loadMoreItems(): Promise<void> {
    return new Promise((resolve) => {
      if (this.loading || !this.hasMore) {
        resolve();
        return;
      }
      
      this.loading = true;
      
      // Use setTimeout to allow UI to update
      setTimeout(() => {
        this.loadItems(false).finally(() => {
          this.isScrolling = false;
          resolve();
        });
      }, 100);
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

  // Load items from the API with pagination
  loadItems(reset = false): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.loading) {
        resolve();
        return;
      }
      
      this.loading = true;
      const formValue = this.filterForm.value;
      
      // Reset items and pagination if this is a fresh load
      if (reset) {
        this.items = [];
        this.offsetToken = null;
        this.hasMore = true;
      }
      
      // If we've already loaded everything, don't make another request
      if (!reset && !this.hasMore) {
        this.loading = false;
        resolve();
        return;
      }
      
      // Build the request parameters
      const listOfRolesCanAccess = formValue.access || [];
      const showSubMenusOnly = formValue.isSubMenu === 'true';
      const applyParentSubMenuFilter = formValue.isSubMenu === 'false';
      
      // Map access roles
      const mappedRoles = listOfRolesCanAccess
        .filter((role: string) => role !== 'isVisibleToGuest')
        .map((role: string) => this.accessRoleMap[role])
        .filter(Boolean);
      
      // Include guest role if selected
      if (formValue.showGuest) {
        mappedRoles.push(USER_ROLE.GUEST);
      }
      
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
      
      // Call the API
      this.navbarService.getNavbarList(params).subscribe({
        next: (response: PaginationResponse<MenuItem>) => {
          // Append new items to the existing ones
          this.items = reset ? response.data : [...this.items, ...response.data];
          
          // Update pagination state
          this.offsetToken = response.offsetToken || '';
          this.hasMore = !!this.offsetToken && response.data.length === DEFAULT_PAGE_SIZE;
          
          // If we got a full page of results, there might be more
          if (response.data.length === DEFAULT_PAGE_SIZE) {
            this.hasMore = true;
          }
          
          // Check if we need to load more to fill the viewport
          setTimeout(() => {
            if (this.hasMore && this.tableContainer?.nativeElement) {
              const container = this.tableContainer.nativeElement;
              if (container.scrollHeight <= container.clientHeight) {
                this.loadMoreItems().finally(resolve);
                return;
              }
            }
            resolve();
          }, 100);
        },
        error: (error: any) => {
          console.error('Error loading navbar items:', error);
          this.loading = false;
          reject(error);
        },
        complete: () => {
          this.loading = false;
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