import { TestBed } from '@angular/core/testing';

import { ProjectSelectionGuard } from './project-selection.guard';

describe('ProjectSelectionGuard', () => {
  let guard: ProjectSelectionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ProjectSelectionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
