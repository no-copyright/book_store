import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHomepageComponent } from './edit-homepage.component';

describe('EditHomepageComponent', () => {
  let component: EditHomepageComponent;
  let fixture: ComponentFixture<EditHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditHomepageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
