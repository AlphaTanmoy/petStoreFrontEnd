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
  responseMessage = '';
  isSuccess = false;
  isEditMode = false;
  currentItemId: string | null = null;
  
  fields = [
    { name: 'canAdminAccess', label: 'Admin Access' },
    { name: 'canUserAccess', label: 'User Access' },
    { name: 'canDoctorAccess', label: 'Doctor Access' },
    { name: 'canSellerAccess', label: 'Seller Access' },
    { name: 'canRiderAccess', label: 'Rider Access' },
    { name: 'chatUsersAccess', label: 'Chat Users Access' },
    { name: 'isVisibleToGuest', label: 'Visible to Guest' },
    { name: 'isAvailableWhileLoggedOut', label: 'Available While Logged Out' }
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
      canAdminAccess: [false],
      canUserAccess: [false],
      canDoctorAccess: [false],
      canSellerAccess: [false],
      canRiderAccess: [false],
      chatUsersAccess: [false],
      isVisibleToGuest: [false],
      isAvailableWhileLoggedOut: [false]
    });

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
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (this.navbarForm.invalid) {
      this.responseMessage = 'Please fill all required fields';
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
      canAdminAccess: formValue.canAdminAccess,
      canUserAccess: formValue.canUserAccess,
      canDoctorAccess: formValue.canDoctorAccess,
      canSellerAccess: formValue.canSellerAccess,
      canRiderAccess: formValue.canRiderAccess,
      chatUsersAccess: formValue.chatUsersAccess,
      isVisibleToGuest: formValue.isVisibleToGuest,
      isAvailableWhileLoggedOut: formValue.isAvailableWhileLoggedOut
    };

    if (this.isEditMode && this.currentItemId) {
      this.navbarService.updateNavbarItem(
        this.currentItemId,
        menuData,
        this.selectedFile,
        authToken
      ).subscribe({
        next: () => this.handleSuccess('Navbar item updated successfully!'),
        error: (err) => this.handleError('Error updating navbar item: ', err)
      });
    } else {
      this.navbarService.addNavbarItem(
        menuData,
        this.selectedFile,
        authToken
      ).subscribe({
        next: () => this.handleSuccess('Navbar item added successfully!'),
        error: (err) => this.handleError('Error adding navbar item: ', err)
      });
    }
  }

  handleSuccess(message: string) {
    this.responseMessage = message;
    this.isSuccess = true;
    this.resetForm();
  }

  handleError(prefix: string, error: any) {
    this.responseMessage = prefix + (error.error?.message || error.message);
    this.isSuccess = false;
    console.error(error);
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
    this.isEditMode = false;
    this.currentItemId = null;
  }
}