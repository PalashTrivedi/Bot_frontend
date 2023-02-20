import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationsWebComponent } from './integrations-web.component';

describe('IntegrationsWebComponent', () => {
  let component: IntegrationsWebComponent;
  let fixture: ComponentFixture<IntegrationsWebComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntegrationsWebComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationsWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
