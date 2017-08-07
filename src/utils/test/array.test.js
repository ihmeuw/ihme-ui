/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { range } from 'lodash';
import {
  takeSkipping,
  linspace,
} from '../index';

describe('array helpers', () => {
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

  describe('takeSkipping', () => {
    it('odd length list, odd target length', () => {
      const tests = [
        { list: [3, 5, 9], length: 3, expect: [3, 5, 9] },
        { list: [1, 2, 3, 4, 5, 6, 7], length: 5, expect: [1, 3, 5, 7] },
      ];

      tests.forEach((test) => {
        expect(takeSkipping(test.list, test.length))
          .to.be.an('array')
          .and.to.deep.equal(test.expect);
      });
    });

    it('odd length list, even target length', () => {
      const tests = [
        { list: [3, 5, 9], length: 2, expect: [3, 9] },
        { list: [1, 2, 3, 4, 5, 6, 7], length: 4, expect: [1, 3, 5, 7] },
        { list: [1, 2, 3, 4, 5, 6, 7], length: 2, expect: [1, 7] },
      ];

      tests.forEach((test) => {
        expect(takeSkipping(test.list, test.length))
          .to.be.an('array')
          .and.to.deep.equal(test.expect);
      });
    });

    it('even length list, odd target length', () => {
      const tests = [
        { list: [3, 5, 9, 11], length: 3, expect: [3, 9] },
        { list: [1, 2, 3, 4, 5, 6, 7, 8], length: 5, expect: [1, 3, 5, 7] },
      ];

      tests.forEach((test) => {
        expect(takeSkipping(test.list, test.length))
          .to.be.an('array')
          .and.to.deep.equal(test.expect);
      });
    });

    it('even length list, even target length', () => {
      const tests = [
        { list: [3, 5, 9, 11], length: 4, expect: [3, 5, 9, 11] },
        { list: range(1970, 2011), length: 10, expect: range(1970, 2011, 5) },
      ];

      tests.forEach((test) => {
        expect(takeSkipping(test.list, test.length))
          .to.be.an('array')
          .and.to.deep.equal(test.expect);
      });
    });

    it('returns list if target length is greater than list length', () => {
      expect(takeSkipping([3, 5, 7, 9], 10))
        .to.deep.equal([3, 5, 7, 9]);
    });

    it('returns first and last elements if target is 2 and list length is greater than 2', () => {
      expect(takeSkipping(range(51), 2)).to.deep.equal([0, 50]);
    });
  });
});
