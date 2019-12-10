import { TestBed } from '@angular/core/testing';

import { WebRequestService } from './web-req.interceptor';

describe('WebRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebRequestService = TestBed.get(WebRequestService);
    expect(service).toBeTruthy();
  });
});
