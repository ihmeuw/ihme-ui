import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { dataGenerator } from '../../../test-utils';
import maxBy from 'lodash/maxby';
import minBy from 'lodash/minby';
import map from 'lodash/map';
import uniqBy from 'lodash/uniqBy';

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

  let componentWithLines;

  const yDomain = [minBy(data, valueField)[valueField], maxBy(data, valueField)[valueField]];
  const xDomain = map(uniqBy(data, keyField), (obj) => (obj[keyField]));

  before(() => {
    componentWithLines = (
      <LineChart
        data={{
          xDomain,
          xScaleType: 'point',
          yDomain,
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

  it('should render an svg', () => {
    const wrapper = shallow(componentWithLines);
    expect(wrapper.find('svg')).to.have.length(1);
  });

  it('should render two paths', () => {
    const wrapper = shallow(componentWithLines);
    expect(wrapper.find('svg').children('Line')).to.have.length(2);
  });
});
