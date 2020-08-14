import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicSurveyFormsComponent } from './dynamic-survey-forms.component';

describe('DynamicSurveyFormsComponent', () => {
  let component: DynamicSurveyFormsComponent;
  let fixture: ComponentFixture<DynamicSurveyFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicSurveyFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicSurveyFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
