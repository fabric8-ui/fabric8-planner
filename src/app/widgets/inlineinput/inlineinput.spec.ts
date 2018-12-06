import {InlineInputComponent} from './inlineinput.component'; 

describe('Service: Auth', () => { 
    let comp = new InlineInputComponent();
    beforeEach(() => {         
        comp.type = 'float';
    });

    it('Should return true for input in float range', () => {
        expect(comp.validateValue(22.5)).toBe(true);
    });

    it('Should return false for input outside float range', () => {
        expect(comp.validateValue(11111111111111111.51)).toBe(false);
    });
});