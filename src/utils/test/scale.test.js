import chai from 'chai';
import d3Scale from 'd3-scale';

const expect = chai.expect;

import {
  clampedLinearScale,
  domainToRange,
  getScale,
  getScaleTypes,
  rangeToDomain,
} from '../scale';

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
      expect(getScale('ordinal')).to.be.equal(d3Scale.scaleOrdinal);
    });

    it('provides a default of `linear`', () => {
      expect(getScale()).to.be.equal(d3Scale.scaleLinear);
    });
  });

  describe('domainToRange()', () => {
    it('inverts two points on the domain', () => {
      const scale = d3Scale.scaleLinear().range([0, 100]);

      expect(domainToRange(scale, scale.domain())).to.deep.equal([0, 100]);
      expect(domainToRange(scale, [0.1, 0.9])).to.deep.equal([10, 90]);
    });
  });

  describe('rangeToDomain()', () => {
    it('inverts two points on the range', () => {
      const scale = d3Scale.scaleLinear().range([0, 100]);

      expect(rangeToDomain(scale, scale.range())).to.deep.equal([0, 1]);
      expect(rangeToDomain(scale, [10, 90])).to.deep.equal([0.1, 0.9]);
    });
  });

  describe('clampedLinearScale', () => {
    it('sets the domain of the scale', () => {
      const scale = clampedLinearScale();
      const cachedDomain = scale.domain();
      scale.domain([100, 200]);
      const newDomain = scale.domain();
      expect(newDomain).to.not.deep.equal(cachedDomain);
      expect(newDomain).to.deep.equal([100, 200]);
    });

    it('sets the range of the scale', () => {
      const scale = clampedLinearScale();
      const cachedRange = scale.range();
      scale.range([100, 200]);
      const newRange = scale.range();
      expect(newRange).to.not.deep.equal(cachedRange);
      expect(newRange).to.deep.equal([100, 200]);
    });

    it('is fundamentally a linear scale', () => {
      const scale = clampedLinearScale().domain([0, 1]).range([0, 1]);
      expect(scale(0)).to.equal(0);
      expect(scale(1)).to.equal(1);
      expect(scale(0.5)).to.equal(0.5);
    });

    it('returns a copy of the scale', () => {
      const scale = clampedLinearScale().domain([0, 100]).range([0, 1000]);
      expect(scale).to.equal(scale);
      expect(scale(50)).to.equal(500);
      const copy = scale.copy();
      expect(copy).to.not.equal(scale);
      expect(copy(50)).to.equal(500);
    });

    it('is clamped, and returns a specified value for anything outside of its clamps', () => {
      const scale = clampedLinearScale('foo')
        .domain([0, 1])
        .range([0, 1])
        .clamps([0.25, 0.75]);
      expect(scale(0.3)).to.equal(0.3);
      expect(scale(0.1)).to.equal('foo');
    });
  });
});
