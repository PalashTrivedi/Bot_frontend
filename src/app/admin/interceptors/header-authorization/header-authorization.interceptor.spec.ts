import { TestBed } from '@angular/core/testing';

import { HeaderAuthorizationInterceptor } from './header-authorization.interceptor';

describe('HeaderAuthorizationInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HeaderAuthorizationInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: HeaderAuthorizationInterceptor = TestBed.inject(HeaderAuthorizationInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
