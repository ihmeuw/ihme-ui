import { expect } from 'chai';
import { dataGenerator } from '../data';

describe('data generator', () => {
  it('returns an array', () => {
    expect(dataGenerator()).to.be.an('array');
  });

  it('generates an array of 200 objects', () => {
    const config = {
      primaryKeys: [{ name: 'foo', values: ['bar'] }],
      valueKeys: [{ name: 'lamp', range: [1, 200] }],
      length: 200
    };

    expect(dataGenerator(config)).to.be.an('array')
      .with.length(200)
      .and.to.have.deep.nested.property('[0]')
      .that.is.an('object')
      .with.keys('foo', 'lamp', 'year_id', 'id');
  });

  it('generates an array of 120 objects', () => {
    const config = {
      primaryKeys: [
        { name: 'vehical', values: ['plane', 'train', 'automobile'] },
        { name: 'season', values: ['fall', 'winter'] },
        { name: 'hat', values: ['beret', 'pill box'] }
      ],
      valueKeys: [{ name: 'lamp', range: [1, 200] }],
      length: 10
    };

    expect(dataGenerator(config)).to.be.an('array')
      .with.length(120)
      .and.to.have.deep.nested.property('[0]')
      .that.is.an('object')
      .with.keys('vehical', 'season', 'hat', 'lamp', 'year_id', 'id');
  });

  it('generates an array with values in a certain range', () => {
    const config = {
      primaryKeys: [{ name: 'foo', values: ['bar'] }],
      valueKeys: [{ name: 'lamp', range: [1, 200] }],
      length: 200
    };

    const data = dataGenerator(config);
    for (let i = 0; i < data.length; i++) {
      expect(data[i].lamp).to.be.within(1, 200);
    }
  });

  it('generates an array with objects such that mean_lb < mean < mean_ub', () => {
    const config = {
      primaryKeys: [{ name: 'foo', values: ['bar'] }],
      valueKeys: [
        { name: 'mean', range: [100, 200], uncertainty: true }
      ],
      length: 200
    };

    const data = dataGenerator(config);
    for (let i = 0; i < data.length; i++) {
      expect(data[i].mean).to.be.within(data[i].mean_lb, data[i].mean_ub);
    }
  });

  it('generates unique data points', () => {
    const config = {
      primaryKeys: [
        { name: 'AAA', values: [1, 2, 3] },
        { name: 'BBB', values: [1, 2] },
        { name: 'CCC', values: [1, 2] }
      ],
      length: 2
    };

    const data = dataGenerator(config);
    for (let i = 0; i < data.length - 1; i++) {
      for (let j = i + 1; j < data.length; j++) {
        expect([data[i].AAA, data[i].BBB, data[i].CCC, data[i].year_id])
        .to.not.eql([data[j].AAA, data[j].BBB, data[j].CCC, data[j].year_id]);
      }
    }
  });

  it('passes custom props to each datum', () => {
    const config = {
      primaryKeys: [
        { name: 'AAA', values: [1, 2, 3] },
        { name: 'BBB', values: [1, 2] },
        { name: 'unicorns', values: ['rainbows'] }
      ],
      length: 2
    };
    const data = dataGenerator(config);
    for (let i = 0; i < data.length; i++) {
      expect(data[i]).to.be.an('object')
      .with.property('unicorns', 'rainbows');
    }
  });
});
