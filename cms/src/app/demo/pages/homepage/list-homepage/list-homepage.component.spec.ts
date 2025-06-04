import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHomepageComponent } from './list-homepage.component';

describe('ListHomepageComponent', () => {
  let component: ListHomepageComponent;
  let fixture: ComponentFixture<ListHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListHomepageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
