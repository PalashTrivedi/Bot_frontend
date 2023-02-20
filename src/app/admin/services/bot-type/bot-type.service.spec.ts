import { TestBed } from '@angular/core/testing';

import { BotTypeService } from './bot-type.service';

describe('BotTypeService', () => {
  let service: BotTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BotTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
