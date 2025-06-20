import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDesejoComponent } from './lista-desejo.component';

describe('ListaDesejoComponent', () => {
  let component: ListaDesejoComponent;
  let fixture: ComponentFixture<ListaDesejoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaDesejoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaDesejoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
