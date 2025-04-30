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
