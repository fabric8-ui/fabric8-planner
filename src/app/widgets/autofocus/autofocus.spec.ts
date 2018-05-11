import { TestBed, async } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AutofocusDirective } from './autofocus.modulte';

@Component({
  selector: 'my-test-component',
  template: ''
})
class TestComponent {}

fdescribe('Unit Tests :: autofocus directive', () => {
  let fixture, des;
  console.log('###-1');
  beforeEach(() => {
    console.log('###-2');
    TestBed.configureTestingModule({
      declarations: [ TestComponent ]
    });
    console.log('###-2.1');
    fixture = TestBed.createComponent(TestComponent);
    // console.log('###-3');
    // fixture.detectChanges(); // initial binding
    // console.log('###-4');
    // // all elements with an attached HighlightDirective
    // des = fixture.debugElement.queryAll(By.directive(AutofocusDirective));
    // console.log('###-5');
  });

  it('the component should be identified by the directive', () => {
    expect(des).not.toBeNull();
  });

});

