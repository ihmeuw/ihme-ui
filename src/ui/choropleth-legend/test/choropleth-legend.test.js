import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';

import { dataGenerator, colorSteps } from '../../../test-utils';
import { maxBy, minBy, noop } from 'lodash';

import ChoroplethLegend from '../';

chai.use(chaiEnzyme());

describe('<ChoroplethLegend />', () => {
  const valueField = 'value';
  const keyField = 'loc_id';
  const data = dataGenerator({
    primaryKeys: [{ name: keyField, values: [keyField] }],
    valueKeys: [{ name: valueField, range: [100, 200], uncertainty: true }],
    length: 10
  });

  const domain = [minBy(data, 'value').value, maxBy(data, 'value').value];
  const margins = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20
  };

  const legend = (
    <ChoroplethLegend
      width={600}
      margins={margins}
      colorSteps={colorSteps}
      colorScale={noop}
      data={data}
      domain={domain}
      rangeExtent={domain}
      keyField={keyField}
      valueField={valueField}
    />
  );

  it('composes a density plot, linear gradient, slider, axis and label', () => {
    const wrapper = shallow(legend);
    ['Scatter', 'LinearGradient', 'Slider', 'XAxis'].forEach(component => {
      expect(wrapper.find(component)).to.be.present();
    });
  });
});
