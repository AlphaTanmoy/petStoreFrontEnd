import { CustomerCareProfileControlComponent } from './users/customerCare/customer-care-profile-control/customer-care-profile-control.component';
import { UnAuthorizeComponent } from './components/un-authorize/un-authorize.component';
import { HomeComponent } from './components/home/home.component';
import { Routes } from '@angular/router';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { LoginSelectionComponent } from './auth/login/login-selection/login-selection.component';
import { DoctorLoginComponent } from './auth/login/doctor-login.component';
import { SellerLoginComponent } from './auth/login/seller-login.component';
import { CustomerLoginComponent } from './auth/login/customer-login.component';
import { MasterLoginComponent } from './auth/login/master-login.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { USER_ROLE } from './constants/Enums';
import { MyProfileComponent } from './auth/my-profile/my-profile.component';
import { MasterDashboardComponent } from './users/master/master-dashboard/master-dashboard.component';
import { ControllS3Component } from './microservices/s3/controll-s3/controll-s3.component';
import { ViewS3Component } from './microservices/s3/view-s3/view-s3.component';
import { AdminLoginComponent } from './auth/login/admin-login/admin-login.component';
import { AdminDashboardComponent } from './users/admin/admin-dashboard/admin-dashboard.component';
import { DoctorDashboardComponent } from './users/doctor/doctor-dashboard/doctor-dashboard.component';
import { SellerDashboardComponent } from './users/seller/seller-dashboard/seller-dashboard.component';
import { JwtDetailsComponent } from './users/master/jwt-details/jwt-details.component';
import { JwtLogsComponent } from './users/master/jwt-logs/jwt-logs.component';
import { NotificationLogComponent } from './users/master/notification-log/notification-log.component';
import { AdminDetailsComponent } from './users/admin/admin-details/admin-details.component';
import { ViewLivenessComponent } from './microservices/kyc/liveness/view-liveness/view-liveness.component';
import { SanctionDetailsComponent } from './microservices/kyc/sanction-details/sanction-details.component';
import { ViewSanctionComponent } from './microservices/kyc/view-sanction/view-sanction.component';
import { LivenessDetailsComponent } from './microservices/kyc/liveness/liveness-details/liveness-details.component';
import { CustomerDetailsComponent } from './users/customer/customer-details/customer-details.component';
import { ViewAdminsComponent } from './users/admin/view-admins/view-admins.component';
import { CustomerRegisterComponent } from './users/customer/customer-register/customer-register.component';
import { ViewCustomersComponent } from './users/customer/view-customers/view-customers.component';
import { CustomerProfileControlComponent } from './users/customer/customer-profile-control/cutomer-profile-control.component';
import { CustomerCareDashboardComponent } from './users/customerCare/customer-care-dashboard/customer-care-dashboard.component';
import { CustomerCareDetailsComponent } from './users/customerCare/customer-care-details/customer-care-details.component';
import { ViewCustomerCaresComponent } from './users/customerCare/view-customer-cares/view-customer-cares.component';
import { DoctorDetailsComponent } from './users/doctor/doctor-details/doctor-details.component';
import { ViewDoctorsComponent } from './users/doctor/view-doctors/view-doctors.component';
import { DoctorProfileControlComponent } from './users/doctor/doctor-profile-control/doctor-profile-control.component';
import { SellerDetailsComponent } from './users/seller/seller-details/seller-details.component';
import { ViewSellesComponent } from './users/seller/view-selles/view-selles.component';
import { SellerProfileControlComponent } from './users/seller/seller-profile-control/seller-profile-control.component';
import { AboutDev } from './components/about-dev/about-dev.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { MicroserviceActionComponent } from './dashboard/microservice-action/microservice-action.component';
import { MvnRunnerListComponent } from './dashboard/mvn-runner-list/mvn-runner-list.component';
import { ServerInfoComponent } from './dashboard/server-info/server-info.component';
import { AppPaginatedRecordsComponent } from './test/app-paginated-records/app-paginated-records.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  //page components routes
  { path: 'about-us', component: AboutUsComponent },
  { path: 'about-dev', component: AboutDev },
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

  {
    path: 'microservice',
    canActivate: [AuthGuard],
    data: { roles: [USER_ROLE.ROLE_MASTER,USER_ROLE.ROLE_ADMIN] },
    children: [
      { path: 'start', component: MasterDashboardComponent},
      { path: 'stop', component: MicroserviceActionComponent },
      { path: 'restart', component: MicroserviceActionComponent },
      { path: 'system-info', component: ServerInfoComponent },
      { path: 'mvnRunner/update', component: MvnRunnerListComponent },
      { path: 'mvnRunner/getAll', component: MvnRunnerListComponent },
    ]
  },



  // Master routes (protected)
  {
    path: 'master',
    canActivate: [AuthGuard],
    data: { roles: [USER_ROLE.ROLE_MASTER] },
    children: [
      { path: 'dashboard', component: MasterDashboardComponent },
      { path: 'jwt-details', component: JwtDetailsComponent },
      { path: 'jwt-logs', component: JwtLogsComponent },
      { path: 'notification-log', component: NotificationLogComponent },
    ]
  },

  // Admin routes (protected)
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { roles: [USER_ROLE.ROLE_ADMIN, USER_ROLE.ROLE_MASTER] },
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'details', component: AdminDetailsComponent },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'view-all', component: ViewAdminsComponent }
    ]
  },

  // Customer routes (protected)
  {
    path: 'customer',
    canActivate: [AuthGuard],
    data: { roles: [USER_ROLE.ROLE_CUSTOMER, USER_ROLE.ROLE_ADMIN, USER_ROLE.ROLE_MASTER] },
    children: [
      { path: 'details', component: CustomerDetailsComponent },
      { path: 'register', component: CustomerRegisterComponent },
      { path: 'view-all', component: ViewCustomersComponent },
      { path: 'profile-control', component: CustomerProfileControlComponent },
    ]
  },

  // Customer Care routes (protected)
  {
    path: 'customer-care',
    canActivate: [AuthGuard],
    data: { roles: [USER_ROLE.ROLE_ADMIN, USER_ROLE.ROLE_ADMIN, USER_ROLE.ROLE_MASTER] },
    children: [
      { path: 'dashboard', component: CustomerCareDashboardComponent },
      { path: 'details', component: CustomerCareDetailsComponent },
      { path: 'dashboard', component: CustomerCareDashboardComponent },
      { path: 'view-all', component: ViewCustomerCaresComponent },
      { path: 'profile-control', component: CustomerCareProfileControlComponent },
    ]
  },

  // Doctor routes (protected)
  {
    path: 'doctor',
    canActivate: [AuthGuard],
    data: { roles: [USER_ROLE.ROLE_DOCTOR, USER_ROLE.ROLE_ADMIN, USER_ROLE.ROLE_MASTER] },
    children: [
      { path: 'dashboard', component: DoctorDashboardComponent },
      { path: 'details', component: DoctorDetailsComponent },
      { path: 'dashboard', component: DoctorDashboardComponent },
      { path: 'view-all', component: ViewDoctorsComponent },
      { path: 'profile-control', component: DoctorProfileControlComponent },
    ]
  },

  // Seller routes (protected)
  {
    path: 'seller',
    canActivate: [AuthGuard],
    data: { roles: [USER_ROLE.ROLE_SELLER, USER_ROLE.ROLE_ADMIN, USER_ROLE.ROLE_MASTER] },
    children: [
      { path: 'dashboard', component: SellerDashboardComponent },
      { path: 'details', component: SellerDetailsComponent },
      { path: 'dashboard', component: SellerDashboardComponent },
      { path: 'view-all', component: ViewSellesComponent },
      { path: 'profile-control', component: SellerProfileControlComponent },
    ]
  },

  // kyc routes (protected)
  {
    path: 'kyc',
    canActivate: [AuthGuard],
    data: { roles: [USER_ROLE.ROLE_MASTER, USER_ROLE.ROLE_ADMIN] },
    children: [
      { path: 'view-liveness', component: ViewLivenessComponent },
      { path: 'liveness-details', component: LivenessDetailsComponent },
      { path: 'view-sanctions', component: ViewSanctionComponent },
      { path: 'sanction-details', component: SanctionDetailsComponent }
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

  {
    path: 'test', component: AppPaginatedRecordsComponent
 },

  // Catch-all route must be at the end
  { path: '**', component: ErrorPageComponent }

];
