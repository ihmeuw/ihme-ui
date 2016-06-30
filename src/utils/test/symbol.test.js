import { expect } from 'chai';
import d3Shape from 'd3-shape';

import { getSymbol, getSymbolTypes } from '../symbol';

describe('getSymbolTypes()', () => {
  it('provides a list of symbol names', () => {
    const symbolTypes = getSymbolTypes();

    expect(symbolTypes).to.not.be.empty;
    expect(symbolTypes).to.contain('circle');
    expect(symbolTypes).to.contain('line');
  });
});

describe('getSymbol()', () => {
  it('returns specified type of symbol', () => {
    expect(getSymbol('square')).to.be.equal(d3Shape.symbolSquare);
  });

  it('provides a default of `circle`', () => {
    expect(getSymbol()).to.be.equal(d3Shape.symbolCircle);
  });
});

