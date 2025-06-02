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
  // Component state
  items: MenuItem[] = [];
  offsetToken: string | null = null;
  loading = false;
  hasMore = true;
  filterForm: FormGroup;
  accessDropdownOpen = false;
  accessSearchText = '';
  filteredAccessOptions: { value: string; label: string }[] = [];
  selectedAccessLabels: string[] = [];
  
  // Track previous isSubMenu value to detect changes
  private previousIsSubMenu: string | null = null;
  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;
  private clickListener: (event: MouseEvent) => void;
  private subscriptions = new Subscription();

  // Map of form field names to USER_ROLE values
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
  
  // Define table columns
  columns = [
    { id: 'icon', label: 'Icon', sticky: false },
    { id: 'menuName', label: 'Menu Name', sticky: false },
    { id: 'menuLink', label: 'Menu Link', sticky: false },
    { id: 'redirection', label: 'Redirection', sticky: false },
    { id: 'isSubMenu', label: 'Sub Menu', sticky: false },
  ];

  // Access role columns (will be added dynamically)
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

  // Actions column
  
  // Get the showInActive form control with proper typing
  getShowInactiveControl() {
    return this.filterForm.get('showInActive') as FormControl;
  }

  // Utility method to safely access boolean properties
  getPropertyValue(item: MenuItem, property: string): boolean {
    // Explicitly check for known boolean properties
    const booleanProperties = [
      'canMasterAccess', 'canAdminAccess', 'canUserAccess', 'canDoctorAccess',
      'canSellerAccess', 'canRiderAccess', 'customerCareAccess', 'isVisibleToGuest'
    ];
    
    if (booleanProperties.includes(property)) {
      return !!item[property as keyof MenuItem];
    }
    return false;
  }
  actionsColumn = { id: 'actions', label: 'Actions', sticky: true };

  // Access options for the dropdown
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
    
    // Initialize with empty filter values
    this.resetFilters(false);
    
    // Handle clicks outside dropdown
    this.clickListener = (event: MouseEvent) => {
      if (this.dropdownContainer && !this.dropdownContainer.nativeElement.contains(event.target) && this.accessDropdownOpen) {
        this.closeAccessDropdown();
      }
    };
  }

  // Get all columns including dynamic ones
  get allColumns() {
    return [...this.columns, ...this.accessRoleColumns, this.actionsColumn];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadAccessOptions();
    this.loadItems();
    
    // Subscribe to search field changes with debounce
    const searchSub = this.filterForm.get('search')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      if (this.filterForm.get('search')?.dirty) {
        this.applyFilters();
      }
    });
    
    if (searchSub) {
      this.subscriptions.add(searchSub);
    }
    
    // Add click listener for outside clicks
    document.addEventListener('click', this.clickListener);
  }
  
  ngOnDestroy() {
    // Clean up subscriptions and event listeners
    this.subscriptions.unsubscribe();
    document.removeEventListener('click', this.clickListener);
  }

  // Toggle access dropdown
  toggleAccessDropdown() {
    this.accessDropdownOpen = !this.accessDropdownOpen;
    if (this.accessDropdownOpen) {
      this.filterAccessOptions();
    }
  }

  // Close access dropdown
  closeAccessDropdown() {
    this.accessDropdownOpen = false;
    this.accessSearchText = '';
    this.filterAccessOptions();
  }

  // Toggle access role selection
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

  // Update the selected access labels display
  updateSelectedAccessLabels(): void {
    const accessControl = this.filterForm.get('access');
    if (!accessControl) return;
    
    const selectedRoles = accessControl.value || [];
    this.selectedAccessLabels = selectedRoles.map((role: string) => {
      const option = this.accessOptions.find(opt => opt.value === role);
      return option ? option.label : role;
    });
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
    const accessControl = this.filterForm.get('access');
    if (accessControl) {
      accessControl.setValue([]);
      accessControl.markAsDirty();
      this.updateSelectedAccessLabels();
    }
  }

  // Handle filter changes
  onFilter(): void {
    this.applyFilters();
  }

  // Get selected access labels as string
  getSelectedAccessLabels(): string {
    return this.selectedAccessLabels.join(', ');
  }

  // Initialize the filter form
  initializeForm(): void {
    this.filterForm = this.fb.group({
      search: [''],
      access: [[]],
      isSubMenu: [''],
      showGuest: [false],
      showInActive: [false]
    });
  }

  // Load access options
  loadAccessOptions(): void {
    // In a real app, you might load these from an API
    this.filteredAccessOptions = [...this.accessOptions];
  }

  // Load items from the API
  loadItems(reset = false): void {
    if (this.loading || (!this.hasMore && !reset)) return;
    this.loading = true;
    
    if (reset) {
      this.offsetToken = null;
      this.items = [];
      this.hasMore = true;
    }
    
    const formValue = this.filterForm.value;
    
    // Handle access roles - map UI roles to backend roles
    let listOfRolesCanAccess: string[] = [];
    if (formValue.access?.length) {
      listOfRolesCanAccess = formValue.access
        .filter((role: string) => role !== 'isVisibleToGuest') // Exclude guest from access roles
        .map((role: string) => this.accessRoleMap[role])
        .filter(Boolean);
    }

    // Handle menu type filtering
    const isSubMenu = formValue.isSubMenu;
    const applyParentSubMenuFilter = isSubMenu !== ''; // true if any menu type is selected
    const showSubMenusOnly = isSubMenu === 'true'; // true if 'Sub Menus Only' is selected

    // If guest access is selected, add it to the roles
    if (formValue.showGuest) {
      listOfRolesCanAccess.push(USER_ROLE.GUEST);
    }

    const params: any = {
      limit: DEFAULT_PAGE_SIZE,
      offsetToken: this.offsetToken || '',
      queryString: formValue.search || '%',
      listOfRolesCanAccess: listOfRolesCanAccess.length ? listOfRolesCanAccess : undefined,
      showSubMenusOnly,
      isVisibleToGuest: formValue.showGuest || false,
      showInActive: formValue.showInActive || false,
      applyParentSubMenuFilter
    };

    this.navbarService.getNavbarList(params).subscribe({
      next: (response: PaginationResponse<MenuItem>) => {
        try {
          this.items = reset ? response.data : [...this.items, ...response.data];
          this.offsetToken = response.offsetToken || '';
          this.hasMore = !!response.offsetToken;
        } catch (error) {
          console.error('Error processing response:', error);
          this.items = [];
          this.hasMore = false;
        }
      },
      error: (error) => {
        console.error('Error loading items:', error);
        this.items = [];
        this.hasMore = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  
  // Apply filters to the data
  applyFilters(): void {
    if (this.loading) return;
    this.filterForm.markAsPristine();
    this.loadItems(true);
    this.closeAccessDropdown();
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
    
    this.selectedAccessLabels = [];
    this.accessSearchText = '';
    this.filterAccessOptions();
    
    if (loadItems) {
      this.loadItems(true);
    }
  }

  // Load more items for infinite scroll
  loadMore(): void {
    if (this.loading || !this.hasMore) return;
    this.loadItems();
  }

  // Handle edit action
  editItem(id: string): void {
    if (!id) return;
    window.open(`/edit-navbar/${id}`, '_blank');
  }

  // Handle view action
  viewItem(id: string): void {
    if (!id) return;
    window.open(`/view-navbar/${id}`, '_blank');
  }

  // Handle delete action
  deleteItem(item: MenuItem): void {
    if (!item?.id) return;
    
    const dialogRef = this.dialog.open(ConfirmDialogBoxComponent, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete '${item.menuName || 'this item'}'?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.navbarService.deleteNavbarItem(item.id).subscribe({
          next: () => {
            this.items = this.items.filter((i: MenuItem) => i.id !== item.id);
          },
          error: (error) => {
            console.error('Error deleting item:', error);
          }
        });
      }
    });
  }
}
