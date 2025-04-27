import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathViewerComponent } from './path-viewer.component';

describe('PathViewerComponent', () => {
  let component: PathViewerComponent;
  let fixture: ComponentFixture<PathViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PathViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PathViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
