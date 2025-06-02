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
  menuTypeDropdownOpen = false;
  accessSearchText = '';
  filteredAccessOptions: { value: string; label: string }[] = [];
  selectedAccessLabels: string[] = [];
  
  // Menu Type options
  menuTypeOptions = [
    { value: '', label: 'All Menus' },
    { value: 'true', label: 'Sub Menus Only' },
    { value: 'false', label: 'Parent Menus Only' }
  ];
  
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
  
  // Track previous isSubMenu value to detect changes
  private previousIsSubMenu: string | null = null;
  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;
  private subscriptions = new Subscription();
  private clickListener: (event: MouseEvent) => void;

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
  actionsColumn = { id: 'actions', label: 'Actions', sticky: true };

  // Get the showInActive form control with proper typing
  getShowInactiveControl(): FormControl {
    return this.filterForm.get('showInActive') as FormControl;
  }

  // Toggle access option
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
    const selected = this.filterForm.get('access')?.value || [];
    this.selectedAccessLabels = this.accessOptions
      .filter((option: { value: string; label: string }) => selected.includes(option.value))
      .map((option: { value: string; label: string }) => option.label);
  }

  // Utility method to safely access boolean properties
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
    
    // Handle clicks outside dropdowns
    this.clickListener = (event: MouseEvent) => {
      if (this.dropdownContainer && !this.dropdownContainer.nativeElement.contains(event.target as Node)) {
        this.accessDropdownOpen = false;
        this.menuTypeDropdownOpen = false;
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

  // Load items from the API with pagination
  loadItems(reset = false): void {
    if (this.loading) return;
    
    this.loading = true;
    
    if (reset) {
      this.offsetToken = null;
      this.hasMore = true;
      this.items = [];
    }
    
    if (!this.hasMore) {
      this.loading = false;
      return;
    }
    
    const formValue = this.filterForm.value;
    
    // Map access roles
    let listOfRolesCanAccess: string[] = [];
    if (formValue.access?.length) {
      listOfRolesCanAccess = formValue.access
        .filter((role: string) => role !== 'isVisibleToGuest')
        .map((role: string) => this.accessRoleMap[role])
        .filter(Boolean);
    }
    
    // Handle guest access
    if (formValue.showGuest) {
      listOfRolesCanAccess.push(USER_ROLE.GUEST);
    }
    
    // Prepare API parameters
    const isSubMenu = formValue.isSubMenu;
    const applyParentSubMenuFilter = isSubMenu !== '';
    const showSubMenusOnly = isSubMenu === 'true';
    
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
    
    // Call the API
    this.navbarService.getNavbarList(params).subscribe({
      next: (response: PaginationResponse<MenuItem>) => {
        if (reset) {
          this.items = [];
        }
        
        this.items = [...this.items, ...response.data];
        this.offsetToken = response.offsetToken || '';
        this.hasMore = !!this.offsetToken;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading navbar items:', error);
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

  // View item details
  viewItem(id: string): void {
    if (!id) return;
    window.open(`/view-navbar/${id}`, '_blank');
  }

  // Edit item
  editItem(id: string): void {
    if (!id) return;
    window.open(`/edit-navbar/${id}`, '_blank');
  }

  // Handle delete action
  deleteItem(item: MenuItem): void {
    if (!item?.id) return;
    
    const dialogRef = this.dialog.open(ConfirmDialogBoxComponent, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete "${item.menuName}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.navbarService.deleteNavbarItem(item.id).subscribe({
          next: () => {
            // Remove the item from the local array
            this.items = this.items.filter(i => i.id !== item.id);
            // Show success message or handle as needed
          },
          error: (error) => {
            console.error('Error deleting navbar item:', error);
            // Show error message or handle as needed
          }
        });
      }
    });
  }
}
