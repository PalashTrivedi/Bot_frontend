import { TestBed } from '@angular/core/testing';

import { AiProviderService } from './ai-provider.service';

describe('AiProviderService', () => {
  let service: AiProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
