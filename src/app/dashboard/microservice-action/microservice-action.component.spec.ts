import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroserviceActionComponent } from './microservice-action.component';

describe('MicroserviceActionComponent', () => {
  let component: MicroserviceActionComponent;
  let fixture: ComponentFixture<MicroserviceActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MicroserviceActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MicroserviceActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
