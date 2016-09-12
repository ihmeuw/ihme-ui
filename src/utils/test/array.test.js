/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import {
  hasCrappyValues,
  linspace,
} from '../index';

describe('array helpers', () => {
  it('should return false if array is empty or has NaN, undefined, or null values', () => {
    const spec = [
      { arr: [1, undefined], expectation: true },
      { arr: [undefined, undefined], expectation: true },
      { arr: [], expectation: true },
      { arr: [3, NaN], expectation: true },
      { arr: [1, 2], expectation: false },
      { arr: [0, 1], expectation: false },
    ];

    spec.forEach((testCase) => {
      expect(hasCrappyValues(testCase.arr)).to.equal(testCase.expectation);
    });
  });

  describe('linspace', () => {
    it(`turns [min, max] domain into multi-step domain
    that matches cardinality of colors array`, () => {
      expect(linspace([0, 100], 5)).to.be.an('array')
        .of.length(5)
        .and.to.deep.equal([0, 25, 50, 75, 100]);
    });

    it('is capable of starting at a number other than 0', () => {
      expect(linspace([0.05, 0.5], 11)).to.be.an('array')
        .of.length(11)
        .and.to.deep.equal([
          0.05,
          0.095,
          0.14,
          0.185,
          0.23,
          0.275,
          0.32,
          0.365,
          0.41,
          0.455,
          0.5,
        ]);
    });

    it('is exactly bounded by domain', () => {
      const domain = linspace([1, 5], 15);
      expect(domain[0]).to.equal(1);
      expect(domain[14]).to.equal(5);
    });

    it('returns [min, max] as color domain when min === max', () => {
      expect(linspace([0, 0], 5)).to.be.an('array')
        .of.length(2)
        .and.to.deep.equal([0, 0]);
    });
  });
});
