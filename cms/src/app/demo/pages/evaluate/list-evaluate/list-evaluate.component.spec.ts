import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEvaluateComponent } from './list-evaluate.component';

describe('ListEvaluateComponent', () => {
  let component: ListEvaluateComponent;
  let fixture: ComponentFixture<ListEvaluateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListEvaluateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListEvaluateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
