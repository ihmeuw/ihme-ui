import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { schemeCategory10, scaleOrdinal } from 'd3';
import noop from 'lodash/noop';
import BarChart from '../src/bar-chart';
import { Legend } from '../../..';
import { dataGenerator } from '../../../../utils';

chai.use(chaiEnzyme());

describe('<BarChart />', () => {
  const chartDimensions = {
    width: 600,
    height: 400,
  };

  // used to compute fill color
  const colorScale = scaleOrdinal(schemeCategory10);

  const title = 'Population by year';
  const titleClassName = 'title';

  // stacks
  const categoryField = 'location';
  const categories = ['Brazil', 'Russia'];
  // layers
  const subcategoryField = 'year_id';
  const subcategories = [2016, 2017, 2019];

  const valueField = 'population';

  const data = dataGenerator({
    primaryKeys: [{
      name: categoryField,
      values: categories,
    }],
    valueKeys: [{
      name: valueField,
      range: [100, 900],
      uncertainty: false,
    }],
    year: subcategories[0],
    length: subcategories.length,
  });

  // create legend item for each layer/subgroup
  const legendItems = subcategories.map((datum) => ({
    label: datum[subcategoryField],
    shapeColor: colorScale(datum[subcategoryField]),
    shapeType: 'square'
  }));

  const focus = data[0];
  const selection = [data[1], data[2]];

  const component = (
    <BarChart
      type="stacked"
      orientation="horizontal"
      title={title}
      titleClassName={titleClassName}
      axisLabels={{
        domain: 'Country',
        range: 'Population',
      }}
      displayLegend
      legendItems={legendItems}
      legendAccessors={{
        labelKey: 'label',
        shapeColorKey: 'shapeColor',
        shapeTypeKey: 'shapeType',
      }}
      categories={categories}
      subcategories={subcategories}
      data={data}
      dataAccessors={{
        category: categoryField,
        subcategory: subcategoryField,
        value: valueField,
      }}
      fill={(datum) => colorScale(datum[subcategoryField])}
      className="bars"
      style={{ strokeWeight: 2 }}
      rectClassName="bar"
      rectStyle={{ opacity: 0.9 }}
      focus={focus}
      focusedClassName="focused"
      focusedStyle={{ stroke: 'yellow' }}
      selection={selection}
      selectedClassName="selected"
      selectedStyle={{ stroke: 'red' }}
      onClick={noop}
      onMouseLeave={noop}
      onMouseMove={noop}
      onMouseOver={noop}
      {...chartDimensions}
    />
  );

  // eslint-disable-next-line max-len
  it('renders a legend when `displayLegend` is true and `legendItems` and `legendAccessors` are supplied', () => {
    const wrapper = shallow(component);
    expect(wrapper.find(Legend)).to.have.length(1);
  });

  it('renders a title using the text passed as prop `title`', () => {
    const wrapper = shallow(component);
    expect(wrapper.find(`.${titleClassName}`)).to.have.text(title);
  });
});
