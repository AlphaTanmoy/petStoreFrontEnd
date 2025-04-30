import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PaginatedRecordsService } from './paginated-records.service';
import { PaginationResponse, FilterOption } from '../../interfaces/paginationResponse.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paginated-records',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app-paginated-records.component.html',
  styleUrls: ['./app-paginated-records.component.css'],
})
export class AppPaginatedRecordsComponent implements OnInit {
  records: any[] = [];
  offsetToken: string = '';
  recordCount: number = 0;
  filtersForm: FormGroup;
  isLoading = false;
  multiSelectOpen = false;
  multiSelectFocused = false;

  constructor(
    private fb: FormBuilder,
    private recordsService: PaginatedRecordsService
  ) {
    this.filtersForm = this.fb.group({
      singleSelect: [''],
      multiSelect: [[]],
      textArea: [''],
      checkbox: [false],
    });
  }

  ngOnInit() {
    this.loadRecords();
  }

  getFilters(): FilterOption[] {
    const formValues = this.filtersForm.value;
    return [
      { field: 'singleSelect', value: formValues.singleSelect },
      { field: 'multiSelect', value: formValues.multiSelect },
      { field: 'textArea', value: formValues.textArea },
      { field: 'checkbox', value: formValues.checkbox },
    ];
  }

  loadRecords(reset = false) {
    if (reset) this.offsetToken = '';

    const filters = this.getFilters();
    this.isLoading = true;

    this.recordsService.getRecords(this.offsetToken, filters).subscribe({
      next: (res: PaginationResponse<any>) => {
        this.offsetToken = res.offsetToken;
        this.recordCount = res.recordCount;
        this.records = reset ? res.data : [...this.records, ...res.data];
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  applyFilters() {
    this.loadRecords(true);
  }

  loadMore() {
    this.loadRecords();
  }

  toggleMultiSelect() {
    this.multiSelectOpen = !this.multiSelectOpen;
    this.multiSelectFocused = this.multiSelectOpen;
  }

  toggleMultiSelectItem(item: string) {
    const currentValue = this.filtersForm.get('multiSelect')?.value || [];
    if (currentValue.includes(item)) {
      this.filtersForm.get('multiSelect')?.setValue(currentValue.filter((val: string) => val !== item));
    } else {
      this.filtersForm.get('multiSelect')?.setValue([...currentValue, item]);
    }
  }

  removeMultiSelectItem(item: string) {
    const currentValue = this.filtersForm.get('multiSelect')?.value || [];
    this.filtersForm.get('multiSelect')?.setValue(currentValue.filter((val: string) => val !== item));
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.multi-select-wrapper')) {
      this.multiSelectOpen = false;
      this.multiSelectFocused = false;
    }
  }
}
