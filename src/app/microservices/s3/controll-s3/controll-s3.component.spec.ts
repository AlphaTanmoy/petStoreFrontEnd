import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllS3Component } from './controll-s3.component';

describe('ControllS3Component', () => {
  let component: ControllS3Component;
  let fixture: ComponentFixture<ControllS3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControllS3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControllS3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
