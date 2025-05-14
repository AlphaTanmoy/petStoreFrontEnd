import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

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

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.navbarForm = this.fb.group({
      menuName: ['', Validators.required],
      doHaveRedirectionLink: [false],
      menuLink: [''],
      isASubMenu: [false],
      parentId: [''],
      canAdminAccess: [false],
      canUserAccess: [false],
      canDoctorAccess: [false],
      canSellerAccess: [false],
      canRiderAccess: [false],
      chatUsersAccess: [false],
      isVisibleToGuest: [false],
      isAvailableWhileLoggedOut: [false]
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

    const formData = new FormData();
    formData.append('navbar', JSON.stringify(this.navbarForm.value));
    
    if (this.selectedFile) {
      formData.append('svgFile', this.selectedFile);
    }

    const headers = new HttpHeaders({
      'Authorization': 'Bearer your-auth-token-here'
    });

    this.http.post('/your-api-endpoint/add', formData, { headers })
      .subscribe({
        next: (res) => {
          this.responseMessage = 'Navbar added successfully!';
          this.isSuccess = true;
          this.resetForm();
        },
        error: (err) => {
          this.responseMessage = 'Error adding navbar: ' + (err.error?.message || err.message);
          this.isSuccess = false;
        }
      });
  }

  resetForm() {
    this.navbarForm.reset({
      doHaveRedirectionLink: false,
      isASubMenu: false,
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
  }
}