import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FabrocanteFormComponent } from './fabrocante-form.component';

describe('FabrocanteFormComponent', () => {
  let component: FabrocanteFormComponent;
  let fixture: ComponentFixture<FabrocanteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FabrocanteFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FabrocanteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
