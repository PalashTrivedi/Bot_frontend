import { TestBed } from '@angular/core/testing';

import { QueryParamProjectInterceptor } from './query-param-project.interceptor';

describe('QueryParamProjectInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      QueryParamProjectInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: QueryParamProjectInterceptor = TestBed.inject(QueryParamProjectInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
