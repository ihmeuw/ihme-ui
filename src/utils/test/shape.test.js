import { expect } from 'chai';
import { symbolSquare, symbolCircle } from 'd3';

import { getShape, shapeTypes } from '../shape';

describe('getShapeTypes()', () => {
  it('provides a list of shape names', () => {
    const types = shapeTypes();

    expect(types).to.not.be.empty;
    expect(types).to.contain('circle');
    expect(types).to.contain('line');
  });
});

describe('getShape()', () => {
  it('returns specified type of shape', () => {
    expect(getShape('square')).to.be.equal(symbolSquare);
  });

  it('provides a default of `circle`', () => {
    expect(getShape()).to.be.equal(symbolCircle);
  });
});

