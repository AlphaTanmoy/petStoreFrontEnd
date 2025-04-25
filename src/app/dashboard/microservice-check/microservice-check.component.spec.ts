import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroserviceCheckComponent } from './microservice-check.component';

describe('MicroserviceCheckComponent', () => {
  let component: MicroserviceCheckComponent;
  let fixture: ComponentFixture<MicroserviceCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MicroserviceCheckComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MicroserviceCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
