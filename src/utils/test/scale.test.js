import chai from 'chai';
import d3Scale from 'd3-scale';

const expect = chai.expect;

import { getScale, getScaleTypes, domainToRange, rangeToDomain } from '../scale';

describe('getScaleTypes()', () => {
  it('provides a list of scale names', () => {
    const scaleTypes = getScaleTypes();

    expect(scaleTypes).to.not.be.empty;
    expect(scaleTypes).to.contain('linear');
  });
});

describe('getScale()', () => {
  it('returns specified type of scale', () => {
    const scale = getScale('ordinal');

    expect(scale).to.be.equal(d3Scale.scaleOrdinal);
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
