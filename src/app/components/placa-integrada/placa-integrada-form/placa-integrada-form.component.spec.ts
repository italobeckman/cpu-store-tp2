import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacaIntegradaFormComponent } from './placa-integrada-form.component';

describe('PlacaIntegradaFormComponent', () => {
  let component: PlacaIntegradaFormComponent;
  let fixture: ComponentFixture<PlacaIntegradaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlacaIntegradaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlacaIntegradaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
