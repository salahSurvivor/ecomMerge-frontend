import { TestBed } from '@angular/core/testing';

import { IsDeliveryManGuard } from './is-delivery-man.guard';

describe('IsDeliveryManGuard', () => {
  let guard: IsDeliveryManGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsDeliveryManGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
