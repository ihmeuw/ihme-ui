import { expect } from 'chai';

import {
  getDimension,
  getSnapTargetFunc,
} from '../src/util';

describe('slider.utils', () => {
  describe('getSnapTargetFunc', () => {
    it('returns argument if snapTarget argument type is function', () => {
      const snapTarget = { x: 0, y: 0 };
      const snapGridArgs = { range: Infinity, offset: { x: 0, y: 0 } };
      // const expected = { x: 1, y: 1, range: Infinity, offset: { x: 0, y: 0 } };
      expect(getSnapTargetFunc(snapTarget, snapGridArgs)).to.be.a('function');
    });
    it('returns argument if snapTarget argument type is function', () => {
      const snapTarget = () => {};
      expect(getSnapTargetFunc(snapTarget)).to.equal(snapTarget);
    });
    it('returns null if snapTarget argument type is not understood', () => {
      const snapTarget = undefined;
      expect(getSnapTargetFunc(snapTarget)).to.equal(null);
    });
  });

  describe('getDimension', () => {
    it('appends `px` to non-string values', () => {
      expect(getDimension(0)).to.equal('0px');
    });
    it('returns argument for string values', () => {
      expect(getDimension('100%')).to.equal('100%');
    });
  });
});
