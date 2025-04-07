export interface Seller {
  id: string;
  fullName: string;
  email: string;
  storeName: string;
  storeDescription?: string;
  phoneNumber: string;
  address: string;
  country: string;
  isActive: boolean;
  registrationDate: string;
  rating?: number;
  totalProducts?: number;
  totalSales?: number;
}

export interface SellerResponse {
  data: Seller[];
  offsetToken: string | null;
  total: number;
}

export interface SellerFilterParams {
  limit?: number;
  offsetToken?: string | null;
  userName?: string;
  showInActive?: boolean;
  dateRangeType?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
