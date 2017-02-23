import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import SliderHandle from '../src/slider-handle';

chai.use(chaiEnzyme());

describe('ChoroplethLegend <SliderHandle />', () => {
  const onSliderMove = sinon.spy(extent => extent);

  afterEach(() => {
    onSliderMove.reset();
  });

  it('translates the left handle by 5 pixels', () => {
    const wrapper = shallow(
      <SliderHandle
        position={5}
        onSliderMove={onSliderMove}
      />
    );
    expect(wrapper.find('rect')).to.have.attr('transform', 'translate(-5, -2.5)');
  });

  it('does not translate the right handle', () => {
    const wrapper = shallow(
      <SliderHandle
        position={5}
        onSliderMove={onSliderMove}
        which="x2"
      />
    );
    expect(wrapper.find('rect')).to.have.attr('transform', 'translate(0, -2.5)');
  });
});
