import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseLiteComponemntComponent } from './base-lite-componemnt.component';

describe('BaseLiteComponemntComponent', () => {
  let component: BaseLiteComponemntComponent;
  let fixture: ComponentFixture<BaseLiteComponemntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseLiteComponemntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseLiteComponemntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
