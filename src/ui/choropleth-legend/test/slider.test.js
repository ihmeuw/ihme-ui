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
        domain={domain}
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
          domain={domain}
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
      wrapper.find(SliderHandle).get(1).onHandleMove({ dx: 300 });
      expect(onSliderMove.callCount).to.equal(0);
    });

    it('snaps to bounds of slider within tolerance', () => {
      wrapper.find(SliderHandle).get(0).onHandleMove({ dx: -248 });
      expect(onSliderMove.lastCall.args[0]).to.deep.equal([0, 0.75]);

      wrapper.find(SliderHandle).get(1).onHandleMove({ dx: 248 });
      expect(onSliderMove.lastCall.args[0]).to.deep.equal([0.25, 1]);
    });
  });
});
