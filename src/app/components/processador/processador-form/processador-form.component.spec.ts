import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessadorFormComponent } from './processador-form.component';

describe('ProcessadorFormComponent', () => {
  let component: ProcessadorFormComponent;
  let fixture: ComponentFixture<ProcessadorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessadorFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessadorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
