/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { numberFormat } from '../numbers';

describe('Number utilities', () => {
  describe('numberFormat', () => {
    it('truncates values over 1000', () => {
      expect(numberFormat(1000)).to.equal('1.000k');
      expect(numberFormat(5432)).to.equal('5.432k');
      expect(numberFormat(5432.35784)).to.equal('5.432k');
    });

    it('displays values less than or equal to 0.01 in exponential notation', () => {
      expect(numberFormat(0.01)).to.equal('1.000e-2');
      expect(numberFormat(0.005836)).to.equal('5.836e-3');
    });

    it('displays all 0.001 > values < 1000 to hundredths precision', () => {
      expect(numberFormat(1)).to.equal('1.00');
      expect(numberFormat(15)).to.equal('15.00');
      expect(numberFormat(0.239745)).to.equal('0.24');
      expect(numberFormat(28.123456)).to.equal('28.12');
    });
  });
});
