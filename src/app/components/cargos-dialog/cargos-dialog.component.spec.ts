import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargosDialogComponent } from './cargos-dialog.component';

describe('CargosDialogComponent', () => {
  let component: CargosDialogComponent;
  let fixture: ComponentFixture<CargosDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargosDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
