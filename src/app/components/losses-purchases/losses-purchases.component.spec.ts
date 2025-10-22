import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LossesPurchasesComponent } from './losses-purchases.component';

describe('LossesPurchasesComponent', () => {
  let component: LossesPurchasesComponent;
  let fixture: ComponentFixture<LossesPurchasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LossesPurchasesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LossesPurchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
