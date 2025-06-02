import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarService } from '../../../service/navbar.service';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../../interfaces/menu.interface';
import { PaginationResponse } from '../../../interfaces/paginationResponse.interface';
import { USER_ROLE } from '../../../constants/Enums';

@Component({
  selector: 'app-navbar-list',
  templateUrl: './navbar-list.component.html',
  styleUrls: ['./navbar-list.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class NavbarListComponent implements OnInit {
  accessDropdownOpen = false;
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
    this.updateSelectedAccessLabels();
    document.addEventListener('click', this.handleDocumentClick, true);
    this.loadItems();
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleDocumentClick, true);
  }

  toggleAccessDropdown() {
    this.accessDropdownOpen = !this.accessDropdownOpen;
  }

  closeAccessDropdown() {
    this.accessDropdownOpen = false;
  }

  onAccessCheckboxChange(value: string, event: any) {
    const access: string[] = this.filterForm.value.access || [];
    if (event.target.checked) {
      if (!access.includes(value)) {
        access.push(value);
      }
    } else {
      const idx = access.indexOf(value);
      if (idx > -1) {
        access.splice(idx, 1);
      }
    }
    this.filterForm.patchValue({ access });
    this.updateSelectedAccessLabels();
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
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      access: [[]], // multi-select for listOfRolesCanAccess
      isSubMenu: [''], // dropdown for showSubMenusOnly
      showGuest: [false], // checkbox for isVisibleToGuest
      showInActive: [false] // checkbox for showInActive
    });
  }


  loadItems(reset: boolean = false) {
    if (this.loading || (!this.hasMore && !reset)) return;
    this.loading = true;
    if (reset) {
      this.offsetToken = null;
      this.items = [];
      this.hasMore = true;
    }
    
    const formValue = this.filterForm.value;
    
    // Map access roles to USER_ROLE values
    const listOfRolesCanAccess = (formValue.access || [])
      .map((access: string) => this.accessRoleMap[access])
      .filter((role: string | undefined): role is string => !!role);
    
    const params: any = {
      limit: 20,
      offsetToken: this.offsetToken || '',
      search: formValue.search || '',
      listOfRolesCanAccess,
      showSubMenusOnly: formValue.isSubMenu === 'true',
      isVisibleToGuest: formValue.showGuest || false,
      showInActive: formValue.showInActive || false
    };

    // Remove empty or falsy values
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined || 
          (Array.isArray(params[key]) && params[key].length === 0)) {
        delete params[key];
      }
    });

    this.navbarService.getNavbarList(params).subscribe({
      next: (res: PaginationResponse<MenuItem>) => {
        this.items = reset ? res.data : [...this.items, ...res.data];
        this.offsetToken = res.offsetToken || '';
        this.hasMore = !!res.offsetToken;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading navbar items:', err);
        this.loading = false;
      }
    });
  }

  // Apply filters and reload items
  applyFilters() {
    this.loadItems(true);
  }

  // Reset all filters to default values
  resetFilters() {
    this.filterForm.reset({
      search: '',
      access: [],
      isSubMenu: '',
      showGuest: false,
      showInActive: false,
      applyParentSubMenuFilter: false
    });
    this.updateSelectedAccessLabels();
    this.loadItems(true);
  }

  // Legacy filter method for backward compatibility
  onFilter() {
    this.applyFilters();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100 && this.hasMore && !this.loading) {
      this.loadItems();
    }
  }

  onEdit(item: MenuItem) {
    window.open(`/edit-navbar/${item.id}`, '_blank');
  }

  onView(item: MenuItem) {
    window.open(`/view-navbar/${item.id}`, '_blank');
  }

  onDelete(item: MenuItem) {
    if (confirm(`Are you sure you want to delete '${item.menuName}'?`)) {
      if (item.id) {
        this.navbarService.deleteNavbarItem(item.id).subscribe(() => {
          this.items = this.items.filter(i => i.id !== item.id);
        });
      }
    }
  }
}

