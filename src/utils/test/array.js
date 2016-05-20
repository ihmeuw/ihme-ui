/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import {
  hasCrappyValues
} from '../index';

describe('array helpers', () => {
  it('should return false if array is empty or has NaN, undefined, or null values', () => {
    const spec = [
      { arr: [1, undefined], expectation: true },
      { arr: [undefined, undefined], expectation: true },
      { arr: [], expectation: true },
      { arr: [3, NaN], expectation: true },
      { arr: [1, 2], expectation: false },
      { arr: [0, 1], expectation: false }
    ];

    spec.forEach((testCase) => {
      expect(hasCrappyValues(testCase.arr)).to.equal(testCase.expectation);
    });
  });
});
