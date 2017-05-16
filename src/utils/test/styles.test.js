/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { spy } from 'sinon';

import { combineStyles } from '../style';

describe('style utilities', () => {
  describe('combineStyles', () => {
    it('takes a list of inline-style objects and combines them into one', () => {
      const style = [
        { backgroundColor: 'red' },
        { fontSize: 'large' },
        { display: 'inline-block' },
      ];

      expect(combineStyles(style)).to.deep.equal({
        backgroundColor: 'red',
        fontSize: 'large',
        display: 'inline-block',
      });
    });

    it('takes a list of functions and returns their result in a single object', () => {
      const datum = {
        foo: 26,
      };

      const style = [
        spy(() => ({ backgroundColor: 'red' })),
        spy(() => ({ fontSize: 'large' })),
        spy(() => ({ display: 'inline-block' })),
      ];

      expect(combineStyles(style, datum)).to.deep.equal({
        backgroundColor: 'red',
        fontSize: 'large',
        display: 'inline-block',
      });

      style.forEach(styleFunc => {
        expect(styleFunc.called).to.be.true;
        expect(styleFunc.calledWithExactly(datum)).to.be.true;
      });
    });

    it('takes a mix of functions and objects', () => {
      const style = [
        { backgroundColor: 'red' },
        spy(() => ({ fontSize: 'large' })),
        { display: 'inline-block' },
      ];

      expect(combineStyles(style)).to.deep.equal({
        backgroundColor: 'red',
        fontSize: 'large',
        display: 'inline-block',
      });
    });

    it('accepts a single style object or function', () => {
      const styleObj = {
        backgroundColor: 'red',
      };

      const styleFunc = () => ({ backgroundColor: 'red' });

      [styleObj, styleFunc].every(style =>
        expect(combineStyles(style)).to.deep.equal({
          backgroundColor: 'red',
        })
      );
    });
  });
});
