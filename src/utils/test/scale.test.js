import chai from 'chai';
import { scaleOrdinal, scaleLinear, scaleLog } from 'd3';

const expect = chai.expect;

import {
  clampedScale,
  domainToRange,
  getScale,
  getScaleTypes,
  rangeToDomain,
} from '../scale';

import {
  percentOfRange,
} from '../domain';

describe('scale utilities', () => {
  describe('getScaleTypes()', () => {
    it('provides a list of scale names', () => {
      const scaleTypes = getScaleTypes();

      expect(scaleTypes).to.not.be.empty;
      expect(scaleTypes).to.contain('linear');
    });
  });

  describe('getScale()', () => {
    it('returns specified type of scale', () => {
      expect(getScale('ordinal')).to.be.equal(scaleOrdinal);
    });

    it('provides a default of `linear`', () => {
      expect(getScale()).to.be.equal(scaleLinear);
    });
  });

  describe('domainToRange()', () => {
    it('inverts two points on the domain', () => {
      const scale = scaleLinear().range([0, 100]);

      expect(domainToRange(scale, scale.domain())).to.deep.equal([0, 100]);
      expect(domainToRange(scale, [0.1, 0.9])).to.deep.equal([10, 90]);
    });
  });

  describe('rangeToDomain()', () => {
    it('inverts two points on the range', () => {
      const scale = scaleLinear().range([0, 100]);

      expect(rangeToDomain(scale, scale.range())).to.deep.equal([0, 1]);
      expect(rangeToDomain(scale, [10, 90])).to.deep.equal([0.1, 0.9]);
    });
  });

  describe('clampedScale', () => {
    it('sets the base scale', () => {
      const scale = clampedScale()
        .base(scaleLinear())
        .domain([0, 1])
        .range([0, 1]);
      expect(scale(0)).to.equal(0);
      expect(scale(1)).to.equal(1);
      expect(scale(0.5)).to.equal(0.5);
    });

    it('can update its base scale', () => {
      const initialScale = clampedScale()
        .base(scaleLinear())
        .domain([1, 10])
        .range([0, 1]);
      expect(initialScale(5.5)).to.equal(0.5);

      const logScale = scaleLog().base(Math.E);
      const updatedScale = initialScale
        .base(logScale);
      expect(updatedScale(1)).to.equal(0);
      expect(updatedScale(10)).to.equal(1);
      // arbitrarily round to 8 sig figs
      expect(updatedScale(5.5).toFixed(8)).to.equal(
        percentOfRange(Math.log(5.5), [Math.log(1), Math.log(10)]).toFixed(8)
      );
    });

    it('sets the domain of the scale', () => {
      const scale = clampedScale().base(scaleLinear());
      const cachedDomain = scale.domain();
      scale.domain([100, 200]);
      const newDomain = scale.domain();
      expect(newDomain).to.not.deep.equal(cachedDomain);
      expect(newDomain).to.deep.equal([100, 200]);
    });

    it('sets the range of the scale', () => {
      const scale = clampedScale().base(scaleLinear());
      const cachedRange = scale.range();
      scale.range([100, 200]);
      const newRange = scale.range();
      expect(newRange).to.not.deep.equal(cachedRange);
      expect(newRange).to.deep.equal([100, 200]);
    });

    it('returns a copy of the scale', () => {
      const scale = clampedScale()
        .base(scaleLinear())
        .domain([0, 100])
        .range([0, 1000]);
      expect(scale).to.equal(scale);
      expect(scale(50)).to.equal(500);
      const copy = scale.copy();
      expect(copy).to.not.equal(scale);
      expect(copy(50)).to.equal(500);
    });

    it('is clamped, and returns a specified value for anything outside of its clamps', () => {
      const scale = clampedScale('foo').base(scaleLinear())
        .domain([0, 1])
        .range([0, 1])
        .clamps([0.25, 0.75]);
      expect(scale(0.3)).to.equal(0.3);
      expect(scale(0.1)).to.equal('foo');
    });

    it('can have it\'s tolerance adjusted for whether a value is within its domain', () => {
      const scale = clampedScale('foo', 0.001)
        .base(scaleLinear())
        .domain([0, 1])
        .range([0, 1])
        .clamps([0.25, 0.75]);

      expect(scale(0.3)).to.equal(0.3);
      expect(scale(0.24)).to.equal('foo');
      expect(scale(0.249)).to.equal(0.249);
      expect(scale(0.2408)).to.equal('foo');
      expect(scale(0.7)).to.equal(0.7);
      expect(scale(0.751)).to.equal(0.751);
      expect(scale(0.7509)).to.equal(0.7509);
      expect(scale(0.752)).to.equal('foo');
    });
  });
});
