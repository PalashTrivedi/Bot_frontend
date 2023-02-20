import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationsFacebookComponent } from './integrations-facebook.component';

describe('IntegrationsFacebookComponent', () => {
  let component: IntegrationsFacebookComponent;
  let fixture: ComponentFixture<IntegrationsFacebookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntegrationsFacebookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationsFacebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
