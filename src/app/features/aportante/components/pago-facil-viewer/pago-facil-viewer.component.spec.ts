import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoFacilViewerComponent } from './pago-facil-viewer.component';

describe('PagoFacilViewerComponent', () => {
  let component: PagoFacilViewerComponent;
  let fixture: ComponentFixture<PagoFacilViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoFacilViewerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PagoFacilViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
