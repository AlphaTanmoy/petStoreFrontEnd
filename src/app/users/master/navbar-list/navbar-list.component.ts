import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarService } from '../../../service/navbar.service';
import { MenuItem } from '../../../interfaces/menu.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar-list',
  templateUrl: './navbar-list.component.html',
  styleUrls: ['./navbar-list.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class NavbarListComponent implements OnInit {
  accessDropdownOpen = false;
  accessOptions = [
    { value: 'canMasterAccess', label: 'Master' },
    { value: 'canAdminAccess', label: 'Admin' },
    { value: 'canUserAccess', label: 'User' },
    { value: 'canDoctorAccess', label: 'Doctor' },
    { value: 'canSellerAccess', label: 'Seller' },
    { value: 'canRiderAccess', label: 'Rider' },
    { value: 'chatUsersAccess', label: 'Chat Users' },
    { value: 'customerCareAccess', label: 'Customer Care' },
  ];
  selectedAccessLabels: string[] = [];

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
      access: [[]], // multi-select
      isSubMenu: [''], // dropdown
      showGuest: [false] // checkbox
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
    const filters = this.filterForm.value;
    this.navbarService.getNavbarList({
      limit: 5,
      offsetToken: this.offsetToken || '',
      ...filters
    }).subscribe({
      next: (res: import('../../../interfaces/paginationResponse.interface').PaginationResponse<MenuItem>) => {
        this.items = reset ? res.data : [...this.items, ...res.data];
        this.offsetToken = res.offsetToken || '';
        this.hasMore = !!res.offsetToken;
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
      }
    });
  }

  onFilter() {
    this.loadItems(true);
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

