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
  let fixture;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ TestComponent, AutofocusDirective ]
    });
  });

  it('the component should be identified by the directive', async() => {
    TestBed.overrideComponent(TestComponent, {
      set: {
        template: '<input afinput [autofocus]="true" />'
      }
    });
    const fixture = TestBed.createComponent(TestComponent);
    const directiveEl = fixture.debugElement.query(By.directive(AutofocusDirective));
    expect(directiveEl).not.toBeNull();

    spyOn(directiveEl.nativeElement, 'focus');

    setTimeout(() => {
      expect(directiveEl.nativeElement.focus).toHaveBeenCalled();
    }, 200);
  });

});

