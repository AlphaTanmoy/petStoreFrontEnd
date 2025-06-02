import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarService } from '../../../service/navbar.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar-control',
  templateUrl: './navbar-control.component.html',
  styleUrls: ['./navbar-control.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class NavbarControlComponent {
  navbarForm: FormGroup;
  selectedFile: File | null = null;
  svgPreviewUrl: string | null = null;
  responseMessage = '';
  isSuccess = false;
  isEditMode = false;
  currentItemId: string | null = null;
  submitted = false;

  parentMenus: { firstParameter: string; secondParameter: string }[] = [];

  fields = [
    { name: 'canMasterAccess', label: 'Master Access' },
    { name: 'canAdminAccess', label: 'Admin Access' },
    { name: 'canUserAccess', label: 'User Access' },
    { name: 'canDoctorAccess', label: 'Doctor Access' },
    { name: 'canSellerAccess', label: 'Seller Access' },
    { name: 'canRiderAccess', label: 'Rider Access' },
    { name: 'chatUsersAccess', label: 'Chat Users Access' },
    { name: 'isVisibleToGuest', label: 'Visible to Guest' },
    { name: 'isAvailableWhileLoggedOut', label: 'Available When Logged Out' },
  ];

  constructor(
    private fb: FormBuilder,
    private navbarService: NavbarService,
    private authService: AuthService
  ) {
    this.navbarForm = this.fb.group({
      menuName: ['', Validators.required],
      doHaveRedirectionLink: [false],
      menuLink: [''],
      isASubMenu: [false],
      parentId: [null],
      // Access control fields
      canMasterAccess: [true], // Default to true as per DTO
      canAdminAccess: [false],
      canUserAccess: [false],
      canDoctorAccess: [false],
      canSellerAccess: [false],
      canRiderAccess: [false],
      chatUsersAccess: [false],
      isVisibleToGuest: [false],
      isAvailableWhileLoggedOut: [false]
    });

    // Ensure logo (selectedFile) is checked on submit
    // This will be handled in onSubmit()


    // Watch for changes in isASubMenu to show/hide parentId field
    this.navbarForm.get('isASubMenu')?.valueChanges.subscribe(value => {
      if (value) {
        this.navbarForm.get('parentId')?.setValidators([Validators.required]);
      } else {
        this.navbarForm.get('parentId')?.clearValidators();
        this.navbarForm.get('parentId')?.setValue(null);
      }
      this.navbarForm.get('parentId')?.updateValueAndValidity();
    });

    // Watch for changes in doHaveRedirectionLink to show/hide and require menuLink
    this.navbarForm.get('doHaveRedirectionLink')?.valueChanges.subscribe(value => {
      if (value) {
        this.navbarForm.get('menuLink')?.setValidators([Validators.required]);
      } else {
        this.navbarForm.get('menuLink')?.clearValidators();
        this.navbarForm.get('menuLink')?.setValue('');
      }
      this.navbarForm.get('menuLink')?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    const authToken = this.authService.getToken();
    if (authToken) {
      this.navbarService.getParentMenus(authToken).subscribe({
        next: (data) => {
          this.parentMenus = data;
        },
        error: (err) => {
          console.error('Failed to fetch parent menus', err);
        }
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.svgPreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.svgPreviewUrl = null;
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.navbarForm.invalid) {
      this.responseMessage = 'Please fill in all required fields.';
      this.isSuccess = false;
      return;
    }
    if (!this.selectedFile) {
      this.responseMessage = 'Please select a logo SVG file.';
      this.isSuccess = false;
      return;
    }

    const authToken = this.authService.getToken();
    if (!authToken) {
      this.handleError('', new Error('Authentication token is missing'));
      return;
    }

    const formValue = this.navbarForm.value;
    const menuData = {
      menuName: formValue.menuName,
      doHaveRedirectionLink: formValue.doHaveRedirectionLink,
      menuLink: formValue.menuLink || null,
      isASubMenu: formValue.isASubMenu,
      parentId: formValue.parentId,
      canMasterAccess: formValue.canMasterAccess,
      canAdminAccess: formValue.canAdminAccess,
      canUserAccess: formValue.canUserAccess,
      canDoctorAccess: formValue.canDoctorAccess,
      canSellerAccess: formValue.canSellerAccess,
      canRiderAccess: formValue.canRiderAccess,
      chatUsersAccess: formValue.chatUsersAccess,
      isVisibleToGuest: formValue.isVisibleToGuest,
      isAvailableWhileLoggedOut: formValue.isAvailableWhileLoggedOut
    };

    this.responseMessage = 'Uploading SVG file and adding menu...';
    this.isSuccess = false;

    this.navbarService.addNavbarItem(menuData, this.selectedFile, authToken).subscribe({
      next: () => this.handleSuccess('Navbar item added successfully!'),
      error: (err) => this.handleError('Error adding navbar item: ', err)
    });
  }

  handleSuccess(message: string) {
    this.responseMessage = message;
    this.isSuccess = true;
    this.resetForm();
    // Reload the page after a short delay to show success message
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }

  handleError(prefix: string, error: any) {
    let msg = prefix;
    if (error && error.error) {
      msg += typeof error.error === 'string' ? error.error : JSON.stringify(error.error);
    } else if (error && error.message) {
      msg += error.message;
    } else {
      msg += JSON.stringify(error);
    }
    this.responseMessage = msg;
    this.isSuccess = false;
    console.error('Navbar error:', error);
  }

  resetForm() {
    this.navbarForm.reset({
      doHaveRedirectionLink: false,
      isASubMenu: false,
      parentId: null,
      canAdminAccess: false,
      canUserAccess: false,
      canDoctorAccess: false,
      canSellerAccess: false,
      canRiderAccess: false,
      chatUsersAccess: false,
      isVisibleToGuest: false,
      isAvailableWhileLoggedOut: false
    });
    this.selectedFile = null;
    this.svgPreviewUrl = null;
    this.isEditMode = false;
    this.currentItemId = null;
    this.submitted = false;
  }

  removeSelectedFile() {
    this.selectedFile = null;
    this.svgPreviewUrl = null;
  }
}