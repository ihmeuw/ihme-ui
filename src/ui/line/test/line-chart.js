import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { dataGenerator } from '../../../test-utils';
import maxBy from 'lodash/maxby';
import minBy from 'lodash/minby';
import map from 'lodash/map';

chai.use(chaiEnzyme());

import { LineChart, Line } from '../src';

describe('<LineChart />', () => {
  const keyField = 'year_id';
  const valueField = 'value';

  const data = dataGenerator({
    keyField,
    valueField,
    length: 10,
    dataQuality: 'best',
    useDates: true
  });

  const lineData = [{ location: 'USA', values: data }, { location: 'Canada', values: data }];

  let component;

  const range = [minBy(data, valueField)[valueField], maxBy(data, valueField)[valueField]];
  const domain = [minBy(data, keyField)[keyField], maxBy(data, keyField)[keyField]];

  before(() => {
    component = (
      <LineChart
        data={{
          xDomain: domain,
          xScaleType: 'ordinal',
          yDomain: range,
          yScaleType: 'linear',
          values: lineData,
          keyField: 'location',
          valueField: 'values'
        }}
        width={800}
        height={600}
      >
        {
          map(lineData, (dataset) => {
            return (
              <Line
                key={dataset.location}
                data={dataset.values}
                dataAccessors={{ x: keyField, y: valueField }}
              />
            );
          })
        }
      </LineChart>
    );
  });

  it('should do something', () => {
    const wrapper = shallow(component);
    expect(wrapper.find('svg')).to.have.length(1);
    // expect(wrapper.contains('path')).to.be.true;
    console.log(wrapper.html());
  });
});
