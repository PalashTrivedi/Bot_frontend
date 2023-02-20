import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NlpPreviewComponent } from './nlp-preview.component';

describe('NlpPreviewComponent', () => {
  let component: NlpPreviewComponent;
  let fixture: ComponentFixture<NlpPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NlpPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NlpPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
