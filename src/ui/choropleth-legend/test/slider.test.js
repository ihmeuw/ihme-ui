import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import d3Scale from 'd3-scale';

import Slider from '../src/slider';
import SliderHandle from '../src/slider-handle';

describe('<Slider />', () => {
  const domain = [0, 100];
  const width = 1000;
  const xScale = d3Scale.scaleLinear()
    .domain(domain)
    .range([0, width])
    .clamp(true);
  const onSliderMove = sinon.spy((extent) => {
    return extent;
  });
  const minExtent = 25;
  const maxExtent = 75;

  describe('responds to range extent', () => {
    const wrapper = shallow(
      <Slider
        xScale={xScale}
        rangeExtent={[minExtent, maxExtent]}
        width={width}
        onSliderMove={onSliderMove}
      />
    );

    it('places brush handles on the left and ridge edges of the range extent', () => {
      expect(wrapper.find(SliderHandle).first()).to.have.prop('position', xScale(minExtent));
      expect(wrapper.find(SliderHandle).last()).to.have.prop('position', xScale(maxExtent));
    });

    it('produces gray rects of appropriate width based on range extent', () => {
      expect(wrapper.find('rect').first()).to.have.attr('width', `${xScale(minExtent)}`);
      expect(wrapper.find('rect').last()).to.have.attr('width', `${width - xScale(maxExtent)}`);
    });
  });

  describe('publishes updated range extent', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(
        <Slider
          xScale={xScale}
          rangeExtent={[minExtent, maxExtent]}
          width={width}
          onSliderMove={onSliderMove}
        />
      );
      onSliderMove.reset();
    });

    afterEach(() => {
      wrapper.unmount();
    });

    it('supplied sliderMove evt is triggered by dragmove event on brush handles ', () => {
      expect(onSliderMove.callCount).to.equal(0);

      // trigger dragmove handler
      wrapper.find(SliderHandle).get(0).onHandleMove({ dx: 10 });

      expect(onSliderMove.callCount).to.equal(1);
    });

    it('does not trigger supplied sliderMove evt when handle is moved off slider', () => {
      expect(onSliderMove.callCount).to.equal(0);

      // trigger dragmove handler outside of parent el
      // dx is set to 10 because width of Brush is 1000;
      // supplied evt handler will be snapped to 0 or 1 if the percentChange in the handle,
      // is within 0.005 of 1
      // therefore abs(1 - (10 (dx) / 1000 (width))) >= 0.005 (tolerance), so
      // it is not snapped, and we can test the intended behavior to not
      // call supplied sliderMove evt when brush handle is moved outside of slider bounds
      wrapper.find(SliderHandle).get(1).onHandleMove({ dx: 10 });

      expect(onSliderMove.callCount).to.equal(0);
    });

    it('snaps to bounds of slider within tolerance', () => {
      const x1Handle = wrapper.find(SliderHandle).get(0);

      expect(wrapper.state().x1).to.equal(0);

      // 0.008 (x1) - 4 (clientX) / 1000 (width) < 0.005 === snapping
      x1Handle.setState({ x1: 0.008 });
      x1Handle.onHandleMove({ dx: -4, which: 'x1' });
      wrapper.update();
      expect(wrapper.state().x1).to.equal(0);

      // 0 (x1) + 15 (clientX) / 1000 (width) > 0.005 === no snapping
      x1Handle.onHandleMove({ dx: 15, which: 'x1' });
      wrapper.update();
      expect(wrapper.state().x1).to.not.equal(0);
    });
  });
});
