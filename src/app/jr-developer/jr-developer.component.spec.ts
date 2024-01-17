import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JrDeveloperComponent } from './jr-developer.component';

describe('JrDeveloperComponent', () => {
  let component: JrDeveloperComponent;
  let fixture: ComponentFixture<JrDeveloperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JrDeveloperComponent]
    });
    fixture = TestBed.createComponent(JrDeveloperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
