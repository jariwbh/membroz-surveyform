import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyFormBuilderComponent } from './survey-form-builder.component';

describe('SurveyFormBuilderComponent', () => {
  let component: SurveyFormBuilderComponent;
  let fixture: ComponentFixture<SurveyFormBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyFormBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyFormBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
