import { async } from '@angular/core/testing';
import { InlineInputComponent } from './inlineinput.component';

describe('Unit Test :: Inline Input Float value', () => {
  let comp = new InlineInputComponent();
  beforeEach(async(() => {
    comp.type = 'float';
  }));

  it('Should return true for input in float range', () => {
    expect(comp.validateValue(22.5)).toBe(true);
  });

  it('Should return true for input in float range', () => {
    expect(comp.validateValue(1.2)).toBe(true);
  });

  it('Should return true for input in float range', () => {
    expect(comp.validateValue(223456.334)).toBe(true);
  });

  it('Should return true for input in float range', () => {
    expect(comp.validateValue(45)).toBe(true);
  });

  it('Should return false for input outside float range', () => {
    expect(comp.validateValue(-34567812322.5)).toBe(false);
  });

  it('Should return false for input outside float range', () => {
    expect(comp.validateValue('stringtest')).toBe(false);
  });

  it('Should return false for input outside float range', () => {
    expect(comp.validateValue(11111111111111111.51)).toBe(false);
  });
});
