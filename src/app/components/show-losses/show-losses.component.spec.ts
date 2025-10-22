import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowLossesComponent } from './show-losses.component';

describe('ShowLossesComponent', () => {
  let component: ShowLossesComponent;
  let fixture: ComponentFixture<ShowLossesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowLossesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowLossesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
