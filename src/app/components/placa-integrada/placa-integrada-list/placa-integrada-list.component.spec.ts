import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacaIntegradaListComponent } from './placa-integrada-list.component';

describe('PlacaIntegradaListComponent', () => {
  let component: PlacaIntegradaListComponent;
  let fixture: ComponentFixture<PlacaIntegradaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlacaIntegradaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlacaIntegradaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
