import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerNotificationComponent } from './server-notification.component';

describe('ServerNotificationComponent', () => {
  let component: ServerNotificationComponent;
  let fixture: ComponentFixture<ServerNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
