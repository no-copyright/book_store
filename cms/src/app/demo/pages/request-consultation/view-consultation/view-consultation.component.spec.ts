import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewConsultationComponent } from './view-consultation.component';

describe('ViewConsultationComponent', () => {
  let component: ViewConsultationComponent;
  let fixture: ComponentFixture<ViewConsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewConsultationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
