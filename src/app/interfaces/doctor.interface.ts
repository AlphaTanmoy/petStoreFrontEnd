export interface Doctor {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  specialization: string;
  yearsOfExperience: number;
  qualifications: string[];
  address: string;
  country: string;
  isActive: boolean;
  registrationDate: string;
  availabilityHours?: {
    start: string;
    end: string;
  };
  rating?: number;
  totalConsultations?: number;
}

export interface DoctorResponse {
  data: Doctor[];
  offsetToken: string | null;
  total: number;
}

export interface DoctorFilterParams {
  limit?: number;
  offsetToken?: string | null;
  userName?: string;
  showInActive?: boolean;
  dateRangeType?: string;
  specialization?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
