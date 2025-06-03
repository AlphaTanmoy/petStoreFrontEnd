export interface Customer {
  id: string;
  fullName: string;
  emailId: string;
  tireCode: string;
  userRole: string;
  isPrimeMember: boolean;
  createdDate: string;
}

export interface CustomerResponse {
  data: Customer[];
  offsetToken: string;
  recordCount: number;
  filterUsed: Array<{
    key: string;
    value: string;
    id: string;
  }>;
}
