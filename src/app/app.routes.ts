import { UnAuthorizeComponent } from './components/un-authorize/un-authorize.component';
import { HomeComponent } from './components/home/home.component';
import { Routes } from '@angular/router';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { LoginSelectionComponent } from './auth/login-selection/login-selection.component';
import { DoctorLoginComponent } from './auth/login/doctor-login/doctor-login.component';
import { SellerLoginComponent } from './auth/login/seller-login/seller-login.component';
import { CustomerLoginComponent } from './auth/login/customer-login/customer-login.component';
import { MasterLoginComponent } from './auth/login/master-login/master-login.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { USER_ROLE } from './constants/Enums';
import { MyProfileComponent } from './auth/my-profile/my-profile.component';
import { ProfileControlForAdminComponent } from './users/admin/profile-control-for-admin/profile-control-for-admin.component';
import { MasterDashboardComponent } from './users/master/master-dashboard/master-dashboard.component';
import { ProfileControlForDoctorsComponent } from './users/doctor/profile-control-for-doctors/profile-control-for-doctors.component';
import { ViewAdminsComponent } from './users/admin/view-admins/view-admins.component';
import { ViewDoctorsComponent } from './users/doctor/view-doctors/view-doctors.component';
import { ProfileControlForSellerComponent } from './users/seller/profile-control-for-seller/profile-control-for-seller.component';
import { ViewSellerComponent } from './users/seller/view-seller/view-seller.component';
import { ProfileControlForUserComponent } from './users/user/profile-control-for-user/profile-control-for-user.component';
import { UserListComponent } from './users/user/user-list/user-list.component';
import { AdminDashboardComponent } from './users/admin/admin-dashboard/admin-dashboard.component';
import { DoctorDashboardComponent } from './users/doctor/doctor-dashboard/doctor-dashboard.component';
import { RegisterDoctorComponent } from './users/doctor/register-doctor/register-doctor.component';
import { LivenessActionsComponent } from './microservices/livensess/liveness-actions/liveness-actions.component';
import { LivenessProfileViewComponent } from './microservices/livensess/liveness-profile-view/liveness-profile-view.component';
import { ViewLivenessComponent } from './microservices/livensess/view-liveness/view-liveness.component';
import { SellerDashboardComponent } from './users/seller/seller-dashboard/seller-dashboard.component';
import { RegisterSellerComponent } from './users/seller/register-seller/register-seller.component';
import { UserDashboardComponent } from './users/user/user-dashboard/user-dashboard.component';
import { RegisterUserComponent } from './auth/register-user/register-user.component';
import { SanctionActionsComponent } from './microservices/sanctions/sanction-actions/sanction-actions.component';
import { SanctionProfileViewComponent } from './microservices/sanctions/sanction-profile-view/sanction-profile-view.component';
import { ViewSanctionComponent } from './microservices/sanctions/view-sanction/view-sanction.component';
import { ControllS3Component } from './microservices/s3/controll-s3/controll-s3.component';
import { ViewS3Component } from './microservices/s3/view-s3/view-s3.component';
import { AdminLoginComponent } from './auth/login/admin-login/admin-login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  //page components routes
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'home', component: HomeComponent },

  //error routes
  { path: 'un-authorized', component: UnAuthorizeComponent },

  // Login routes
  {
    path: 'login',
    children: [
      { path: '', component: LoginSelectionComponent },
      { path: 'customer-login', component: CustomerLoginComponent },
      { path: 'admin-login', component: AdminLoginComponent },
      { path: 'doctor-login', component: DoctorLoginComponent },
      { path: 'seller-login', component: SellerLoginComponent },
      { path: 'master-login', component: MasterLoginComponent }
    ]
  },

  // Master routes (protected)
  {
    path: '',
    canActivate: [AuthGuard],
    data: { roles: [USER_ROLE.ROLE_MASTER] },
    children: [
      { path: 'dashboard', component: MasterDashboardComponent },
      { path: 'admin-profile-control', component: ProfileControlForAdminComponent },
      { path: 'view-admins', component: ViewAdminsComponent },
      { path: 'doctor-profile-control', component: ProfileControlForDoctorsComponent },
      { path: 'view-doctors', component: ViewDoctorsComponent },
      { path: 'seller-profile-control', component: ProfileControlForSellerComponent },
      { path: 'view-seller', component: ViewSellerComponent },
      { path: 'user-profile-control', component: ProfileControlForUserComponent },
      { path: 'view-users', component: UserListComponent }
    ]
  },

  // Admin routes (protected)
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { roles: [USER_ROLE.ROLE_ADMIN] },
    children: [
      { path: 'dashboard', component: AdminDashboardComponent }
    ]
  },

  // Doctor routes (protected)
  {
    path: 'doctor',
    canActivate: [AuthGuard],
    data: { roles: [USER_ROLE.ROLE_DOCTOR] },
    children: [
      { path: 'dashboard', component: DoctorDashboardComponent },
      { path: 'register', component: RegisterDoctorComponent }
    ]
  },

  // Liveness routes (protected)
  {
    path: 'liveness',
    canActivate: [AuthGuard],
    data: { roles: [USER_ROLE.ROLE_MASTER, USER_ROLE.ROLE_ADMIN] },
    children: [
      { path: 'actions', component: LivenessActionsComponent },
      { path: 'profile-view', component: LivenessProfileViewComponent },
      { path: 'view', component: ViewLivenessComponent }
    ]
  },

  // Seller routes (protected)
  {
    path: 'seller',
    canActivate: [AuthGuard],
    data: { roles: [USER_ROLE.ROLE_SELLER] },
    children: [
      { path: 'dashboard', component: SellerDashboardComponent },
      { path: 'register', component: RegisterSellerComponent }
    ]
  },

  // Customer routes (protected)
  {
    path: 'customer',
    canActivate: [AuthGuard],
    data: { roles: [USER_ROLE.ROLE_CUSTOMER] },
    children: [
      { path: 'dashboard', component: UserDashboardComponent },
      { path: 'register', component: RegisterUserComponent }
    ]
  },

  // Sanction routes (protected)
  {
    path: 'sanction',
    canActivate: [AuthGuard],
    data: { roles: [USER_ROLE.ROLE_MASTER, USER_ROLE.ROLE_ADMIN] },
    children: [
      { path: 'actions', component: SanctionActionsComponent },
      { path: 'profile-view', component: SanctionProfileViewComponent },
      { path: 'view', component: ViewSanctionComponent }
    ]
  },

  // S3 routes (protected)
  {
    path: 's3',
    canActivate: [AuthGuard],
    data: { roles: [USER_ROLE.ROLE_MASTER, USER_ROLE.ROLE_ADMIN] },
    children: [
      { path: 'control-panel', component: ControllS3Component },
      { path: 'view', component: ViewS3Component }
    ]
  },

  // My Profile route (protected)
  {
    path: 'my-profile',
    component: MyProfileComponent,
    canActivate: [AuthGuard],
    data: { roles: Object.values(USER_ROLE).filter(role => role !== USER_ROLE.GUEST) }
  },

  // Catch-all route must be at the end
  { path: '**', component: ErrorPageComponent }
];
