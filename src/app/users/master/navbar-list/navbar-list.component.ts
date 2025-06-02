import { Component, OnInit, ViewChild, ElementRef, HostListener, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarService } from '../../../service/navbar.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MenuItem } from '../../../interfaces/menu.interface';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PaginationResponse } from '../../../interfaces/paginationResponse.interface';
import { USER_ROLE } from '../../../constants/Enums';
import { AUTH_TOKEN, DEFAULT_PAGE_SIZE } from '../../../constants/KeywordsAndConstrants';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmDialogBoxComponent } from '../../../components/confirm-dialog-box/confirm-dialog-box.component';

@Component({
  selector: 'app-navbar-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './navbar-list.component.html',
  styleUrls: ['./navbar-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarListComponent implements OnInit {
  // Multi-select dropdown state
  accessDropdownOpen = false;
  accessSearchText = '';
  filteredAccessOptions: { value: string; label: string }[] = [];
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
  selectedAccessLabels: string[] = [];
  
  // Track previous isSubMenu value to detect changes
  private previousIsSubMenu: string | null = null;

  ngOnInit() {
    this.filteredAccessOptions = [...this.accessOptions];
    this.accessDropdownOpen = false; // Don't show dropdown by default
    document.addEventListener('click', this.handleDocumentClick, true);
    this.loadItems();
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleDocumentClick, true);
  }

  toggleAccessDropdown() {
    this.accessDropdownOpen = !this.accessDropdownOpen;
    if (this.accessDropdownOpen) {
      this.filterAccessOptions();
    }
  }

  closeAccessDropdown() {
    this.accessDropdownOpen = false;
    this.accessSearchText = '';
    this.filterAccessOptions();
  }

  // Toggle access option selection
  toggleAccessOption(value: string) {
    const currentAccess = [...this.filterForm.value.access];
    const index = currentAccess.indexOf(value);
    
    if (index === -1) {
      currentAccess.push(value);
    } else {
      currentAccess.splice(index, 1);
    }
    
    this.filterForm.patchValue({ access: currentAccess });
  }

  // Filter access options based on search text
  filterAccessOptions() {
    if (!this.accessSearchText) {
      this.filteredAccessOptions = [...this.accessOptions];
    } else {
      const searchText = this.accessSearchText.toLowerCase();
      this.filteredAccessOptions = this.accessOptions.filter(option =>
        option.label.toLowerCase().includes(searchText)
      );
    }
  }

  // Get comma-separated list of selected access labels
  getSelectedAccessLabels(): string {
    const selected = this.filterForm.value.access || [];
    return this.accessOptions
      .filter(option => selected.includes(option.value))
      .map(option => option.label)
      .join(', ');
  }

  updateSelectedAccessLabels() {
    const selected = this.filterForm?.value?.access || [];
    this.selectedAccessLabels = this.accessOptions
      .filter(opt => selected.includes(opt.value))
      .map(opt => opt.label);
  }

  // Handle outside click to close dropdown
  handleDocumentClick = (event: Event) => {
    const dropdown = document.querySelector('.multi-select-dropdown');
    if (dropdown && !dropdown.contains(event.target as Node)) {
      this.closeAccessDropdown();
    }
  }

  // View item details
  viewItem(id: string): void {
    this.router.navigate(['/navbar', 'details', id]);
  }

  // Edit item
  editItem(id: string): void {
    this.router.navigate(['/navbar', 'edit', id]);
  }

  // Delete item with confirmation
  deleteItem(item: MenuItem): void {
    const dialogRef = this.dialog.open(ConfirmDialogBoxComponent, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete "${item.menuName}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.loading = true;
        this.navbarService.deleteNavbarItemById(item.id).subscribe({
          next: () => {
            // Remove the item from the list
            this.items = this.items.filter(i => i.id !== item.id);
            // Reset pagination since we've modified the list
            this.offsetToken = null;
            this.hasMore = true;
            // Show success message or reload the list
            this.loadItems();
          },
          error: (error) => {
            console.error('Error deleting item:', error);
            // You might want to show a user-friendly error message here
          },
          complete: () => {
            this.loading = false;
          }
        });
      }
    });
  }
  
  // Handle isSubMenu change
  onIsSubMenuChange() {
    // No need to handle applyParentSubMenuFilter anymore
  }
  items: MenuItem[] = [];
  offsetToken: string | null = null;
  loading = false;
  hasMore = true;
  filterForm: FormGroup;

  constructor(
    private navbarService: NavbarService,
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      access: [[]], // multi-select for listOfRolesCanAccess
      isSubMenu: [''], // dropdown for showSubMenusOnly
      showGuest: [false], // checkbox for isVisibleToGuest
      showInActive: [false] // checkbox for showInActive
    });
  }


  loadItems(reset = false) {
    if (this.loading || (!this.hasMore && !reset)) return;
    this.loading = true;
    
    if (reset) {
      this.offsetToken = null;
      this.items = [];
      this.hasMore = true;
    }
    
    const formValue = this.filterForm.value;
    const listOfRolesCanAccess = formValue.access?.length 
      ? formValue.access.map((role: string) => this.accessRoleMap[role]).filter(Boolean).join(',')
      : undefined;

    const params: any = {
      limit: DEFAULT_PAGE_SIZE,
      offsetToken: this.offsetToken || '',
      queryString: formValue.search || '%',
      listOfRolesCanAccess,
      showSubMenusOnly: formValue.isSubMenu === 'true',
      isVisibleToGuest: formValue.showGuest || false,
      showInActive: formValue.showInActive || false,
      applyParentSubMenuFilter: false // Explicitly set to false as we're handling it in the UI
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
  
  // Apply filters and reset pagination
  applyFilters() {
    this.loadItems(true);
  }
  
  // Reset all filters
  resetFilters() {
    this.filterForm.reset({
      search: '',
      access: [],
      isSubMenu: '',
      showGuest: false,
      showInActive: false
    });
    this.loadItems(true);
  }
  
  // Handle filter changes
  onFilter() {
    this.applyFilters();
  }

  onEdit(item: MenuItem): void {
    window.open(`/edit-navbar/${item.id}`, '_blank');
  }

  onView(item: MenuItem): void {
    window.open(`/view-navbar/${item.id}`, '_blank');
  }

  onDelete(item: MenuItem): void {
    const dialogRef = this.dialog.open(ConfirmDialogBoxComponent, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete '${item.menuName}'?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && item.id) {
        this.navbarService.deleteNavbarItem(item.id).subscribe(() => {
          this.items = this.items.filter((i: MenuItem) => i.id !== item.id);
        });
      }
    });
  }
}

