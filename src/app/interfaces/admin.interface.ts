export interface Admin {
    id: string;
    fullName: string;
    emailId: string;
    country: string;
    isActive: boolean;
    createdDate: string;
}

export interface PaginationResponse<T> {
    data: T[];
    offsetToken: string;
    recordCount: number;
    filterUsed: FilterOption[];
}

export interface FilterOption {
    field: string;
    value: any;
}

export interface AdminFilterParams {
    userName?: string;
    showInActive?: boolean;
    fromDate?: string;
    toDate?: string;
    dateRangeType?: string;
    limit?: number;
    offsetToken?: string;
}