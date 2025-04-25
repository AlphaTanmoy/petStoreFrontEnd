import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JwtNotificationsComponent } from './jwt-notifications.component';

describe('JwtNotificationsComponent', () => {
  let component: JwtNotificationsComponent;
  let fixture: ComponentFixture<JwtNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JwtNotificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JwtNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
