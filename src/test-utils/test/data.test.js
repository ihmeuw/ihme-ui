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
      .and.to.have.deep.property('[0]')
      .that.is.an('object')
      .with.keys('foo', 'lamp', 'year', 'id');
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

  it('generates an array with objects such that lb < mean < ub', () => {
    const config = {
      primaryKeys: [{ name: 'foo', values: ['bar'] }],
      valueKeys: [
        { name: 'mean', range: [100, 200] },
        { name: 'ub', range: [110, 210] },
        { name: 'lb', range: [90, 190] }
      ],
      length: 200
    };

    const data = dataGenerator(config);
    for (let i = 0; i < data.length; i++) {
      expect(data[i].mean).to.be.within(data[i].lb, data[i].ub);
    }
  });

  it('generates data with increasing mean values', () => {
    const config = {
      primaryKeys: [{ name: 'foo', values: ['bar'] }],
      valueKeys: [
        { name: 'mean', range: [100, 200] }
      ],
      length: 200
    };

    const data = dataGenerator(config);
    for (let i = 0; i < data.length - 1; i++) {
      expect(data[i + 1].mean).to.be.above(data[i].mean);
    }
  });

  it('generates data with decreasing mean values', () => {
    const config = {
      primaryKeys: [{ name: 'foo', values: ['bar'] }],
      valueKeys: [
        { name: 'mean', range: [300, 100] }
      ],
      length: 200
    };

    const data = dataGenerator(config);
    for (let i = 0; i < data.length - 1; i++) {
      expect(data[i + 1].mean).to.be.below(data[i].mean);
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
        expect([data[i].AAA, data[i].BBB, data[i].CCC, data[i].year])
        .to.not.eql([data[j].AAA, data[j].BBB, data[j].CCC, data[j].year]);
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
    expect(dataGenerator(config))
      .to.have.deep.property('[0]')
      .that.is.an('object')
      .with.property('unicorns', 'rainbows');
  });
});
