export interface Customer {
  id: string;
  fullName: string;
  emailId: string;
  tireCode: string;
  userRole: string;
  isPrimeMember: boolean;
  createdDate: string;
}

export interface CustomerFilter {
  searchTerm?: string;
  isPrimeMember?: boolean;
  tireCodes?: string[];
  offsetToken?: string | null;
}
