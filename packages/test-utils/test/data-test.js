import { expect } from 'chai';
import isNull from 'lodash.isnull';

import { dataGenerator } from '../src/mocks/data';

describe('data', () => {
  it('generates an array of 200 objects', () => {
    expect(dataGenerator()).to.be.an('array')
      .with.length(200)
      .and.to.have.deep.property('[0]')
      .that.is.an('object')
      .with.keys('location_id', 'value');
  });

  it('passes custom props to each datum', () => {
    expect(dataGenerator({ unicorns: 'rainbows' }))
      .to.have.deep.property('[0]')
      .that.is.an('object')
      .with.property('unicorns', 'rainbows');
  });

  it('creates data that has null values', () => {
    const data = dataGenerator({ dataQuality: 'worst' });
    const hasNullValues = data.some((datum) => {
      return isNull(datum.value);
    });

    expect(hasNullValues).to.be.true;
  });
});
