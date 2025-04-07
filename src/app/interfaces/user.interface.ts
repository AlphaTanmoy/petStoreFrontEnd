export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  country: string;
  isActive: boolean;
  registrationDate: string;
  lastLoginDate?: string;
  preferredPets?: string[];
  totalOrders?: number;
}

export interface UserResponse {
  data: User[];
  offsetToken: string | null;
  total: number;
}

export interface UserFilterParams {
  limit?: number;
  offsetToken?: string | null;
  userName?: string;
  showInActive?: boolean;
  dateRangeType?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
