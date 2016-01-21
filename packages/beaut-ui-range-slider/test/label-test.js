import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Label from '../src/components/label';

describe('<Label />', () => {
  it('should render an SVG text node', () => {
    const wrapper = shallow(<Label anchor="start" xPosition={5} value={25} />);
    const renderedHTML = wrapper.find('text').render();
    expect(renderedHTML.find('.range-slider-label')).to.have.length(1);
  });
});
