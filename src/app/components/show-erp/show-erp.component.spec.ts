import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowErpComponent } from './show-erp.component';

describe('ShowErpComponent', () => {
  let component: ShowErpComponent;
  let fixture: ComponentFixture<ShowErpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowErpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowErpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
