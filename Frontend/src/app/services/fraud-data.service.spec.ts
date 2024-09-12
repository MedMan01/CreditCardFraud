import { TestBed } from '@angular/core/testing';

import { FraudDataService } from './fraud-data.service';

describe('FraudDataService', () => {
  let service: FraudDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FraudDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
