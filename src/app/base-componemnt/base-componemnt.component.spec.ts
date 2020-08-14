import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseComponemntComponent } from './base-componemnt.component';

describe('BaseComponemntComponent', () => {
  let component: BaseComponemntComponent;
  let fixture: ComponentFixture<BaseComponemntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseComponemntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseComponemntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
