import { expect } from 'chai';
import { isNull } from 'lodash';

import { dataGenerator } from '../dataBeta';

describe('data', () => {
  it('generates an array of 20 objects', () => {
    expect(dataGenerator()).to.be.an('array')
      .with.length(20)
      .and.to.have.deep.property('[0]')
      .that.is.an('object')
  });
});
