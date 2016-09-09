import { expect } from 'chai';
import { symbolSquare, symbolCircle } from 'd3';

import { getSymbol, symbolTypes } from '../symbol';

describe('getSymbolTypes()', () => {
  it('provides a list of symbol names', () => {
    const types = symbolTypes();

    expect(types).to.not.be.empty;
    expect(types).to.contain('circle');
    expect(types).to.contain('line');
  });
});

describe('getSymbol()', () => {
  it('returns specified type of symbol', () => {
    expect(getSymbol('square')).to.be.equal(symbolSquare);
  });

  it('provides a default of `circle`', () => {
    expect(getSymbol()).to.be.equal(symbolCircle);
  });
});

