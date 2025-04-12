import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessadorListComponent } from './processador-list.component';

describe('ProcessadorListComponent', () => {
  let component: ProcessadorListComponent;
  let fixture: ComponentFixture<ProcessadorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessadorListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessadorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
