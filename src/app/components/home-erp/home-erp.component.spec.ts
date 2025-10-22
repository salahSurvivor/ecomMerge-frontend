import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeErpComponent } from './home-erp.component';

describe('HomeErpComponent', () => {
  let component: HomeErpComponent;
  let fixture: ComponentFixture<HomeErpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeErpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeErpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
