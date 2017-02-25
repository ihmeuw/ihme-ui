/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { Float, numberFormat } from '../numbers';

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

  describe('Float', () => {
    describe('Float.floatToIntMultiplier', () => {
      it('calculates power of ten by which to multiply a float to get an integer', () => {
        expect(Float.floatToIntMultiplier(0.005)).to.equal(1000);
        expect(Float.floatToIntMultiplier(1)).to.equal(1);
        expect(Float.floatToIntMultiplier(0)).to.equal(1);
        expect(Float.floatToIntMultiplier(123456.123456)).to.equal(1000000);
      });
    });

    describe('Float.maxMultiplier', () => {
      it('finds the maximum float to integer multiplier in a set of numbers', () => {
        expect(Float.maxMultiplier(1, 0.5)).to.equal(10);
        expect(Float.maxMultiplier(1, 2)).to.equal(1);
        expect(Float.maxMultiplier(1.0000000000000, 0.3)).to.equal(10);
        expect(Float.maxMultiplier(0.01, 0.002, 0.0003, 0.00004)).to.equal(100000);
        expect(Float.maxMultiplier(0.1, 0.2)).to.equal(10);
      });
    });

    describe('Float.divide', () => {
      it('divides numbers without floating point errors', () => {
        expect(Float.divide(4, 2)).to.equal(2);
        expect(Float.divide(1.0, 10)).to.equal(0.1);
        expect(Float.divide(0.3, 0.1)).to.equal(3);
        expect(Float.divide(10, 0.00001)).to.equal(1000000);
        expect(Float.divide(0.000234, 0)).to.equal(Infinity);
        expect(Float.divide(0, 0.000234)).to.equal(0);
        expect(Float.divide(0.6, 0.2)).to.equal(3);
      });
    });

    describe('Float.multiply', () => {
      it('multiplies numbers without floating point errors', () => {
        expect(Float.multiply(0.1, 0.2)).to.equal(0.02);
        expect(Float.multiply(2, 2)).to.equal(4);
        expect(Float.multiply(3, 0.1)).to.equal(0.3);
        expect(Float.multiply(1000000, 0.00001)).to.equal(10);
        expect(Float.multiply(3.01, 3.01)).to.equal(9.0601);
        expect(Float.multiply(1, 2, 3.001)).to.equal(6.002);
        expect(Float.multiply(64.79, 100)).to.equal(6479);
      });
    });

    describe('Float.add', () => {
      it('adds numbers without floating point errors', () => {
        expect(Float.add(0.1, 0.2)).to.equal(0.3);
        expect(Float.add(10, 20, 30)).to.equal(60);
        expect(Float.add(1, 1.000000001)).to.equal(2.000000001);
        expect(Float.add(1, 1.000000001, 1.33333333)).to.equal(3.333333331);
      });
    });

    describe('Float.subtract', () => {
      it('subtracts numbers without floating point errors', () => {
        expect(Float.subtract(0.3, 0.2)).to.equal(0.1);
        expect(Float.subtract(64.79, 64.75)).to.equal(0.04);
      });
    });
  });
});
