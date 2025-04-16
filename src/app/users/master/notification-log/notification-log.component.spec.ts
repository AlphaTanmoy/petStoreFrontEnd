import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationLogComponent } from './notification-log.component';

describe('NotificationLogComponent', () => {
  let component: NotificationLogComponent;
  let fixture: ComponentFixture<NotificationLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
