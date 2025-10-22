import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingPagesComponent } from './landing-pages.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('LandingPagesComponent', () => {
  let component: LandingPagesComponent;
  let fixture: ComponentFixture<LandingPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandingPagesComponent],
      imports: [HttpClientTestingModule, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
