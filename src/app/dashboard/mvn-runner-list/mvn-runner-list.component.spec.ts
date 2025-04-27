import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MvnRunnerListComponent } from './mvn-runner-list.component';

describe('MvnRunnerListComponent', () => {
  let component: MvnRunnerListComponent;
  let fixture: ComponentFixture<MvnRunnerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MvnRunnerListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MvnRunnerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
