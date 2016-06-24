import { expect } from 'chai';

import {
  getDimension,
  getFloatPrecision,
  getSnapTargetFunc,
  valueWithPrecision,
} from '../src/util';

describe('getFloatPrecision', () => {
  it('finds the number of decimal places in a float', () => {
    expect(getFloatPrecision(1)).to.equal(0);
    expect(getFloatPrecision(1.0)).to.equal(0); // this is ok
    expect(getFloatPrecision(0.1)).to.equal(1);
    expect(getFloatPrecision(0.01)).to.equal(2);
    expect(getFloatPrecision(0.001)).to.equal(3);
  });
});

describe('valueWithPrecision', () => {
  it('returns a number rounded to specified precision', () => {
    expect(valueWithPrecision(0.123456789, 0)).to.equal(0);
    expect(valueWithPrecision(0.123456789, 1)).to.equal(0.1);
    expect(valueWithPrecision(0.123456789, 2)).to.equal(0.12);
    expect(valueWithPrecision(0.123456789, 3)).to.equal(0.123);
    expect(valueWithPrecision(0.123456789, 4)).to.equal(0.1235);
  });
});

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
