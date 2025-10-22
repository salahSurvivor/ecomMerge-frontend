import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLossesComponent } from './add-losses.component';

describe('AddLossesComponent', () => {
  let component: AddLossesComponent;
  let fixture: ComponentFixture<AddLossesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLossesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLossesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
