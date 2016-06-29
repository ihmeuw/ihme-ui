import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount, shallow } from 'enzyme';
import d3Scale from 'd3-scale';
import { format } from 'd3-format';

import Axis, { XAxis, YAxis } from '../';

chai.use(chaiEnzyme());

const dummyScale = d3Scale.scaleLinear();

describe('<Axis />', () => {
  it('renders a <g> that wraps axis', () => {
    const wrapper = shallow(
      <Axis
        scale={dummyScale}
        orientation="bottom"
      />);
    expect(wrapper).to.have.tagName('g');
  });

  it('renders ticks', () => {
    const wrapper = shallow(
      <Axis
        scale={dummyScale}
        orientation="bottom"
      />);
    expect(wrapper)
      .to.have.descendants('.tick');

    expect(wrapper.find('.tick').first())
      .to.have.tagName('g');
  });

  it('modifies the output of d3-axis based on configuration', () => {
    const wrapper = shallow(
      <Axis
        scale={dummyScale.range([0, 800])}
        orientation="bottom"
        ticks={6}
        tickArguments={[6, '.2f']}
        tickPadding={6}
        tickSize={9}
        tickSizeInner={9}
        tickSizeOuter={12}
        tickFormat={format('.2f')}
        tickValues={[1, 2, 3, 4, 5, 6]}
      />
    );
    expect(wrapper.find('.tick')).to.have.length(6);
    expect(wrapper.find('.tick').first().find('line')).to.have.attr('y2', '9');
    expect(wrapper.find('.tick').first().find('text')).to.have.attr('y', '15');
    expect(wrapper.find('.tick').first().find('text')).to.have.text('1.00');
    expect(wrapper.find('.tick').last().find('text')).to.have.text('6.00');
  });

  it('applies style to the g element', () => {
    const wrapper = shallow(
      <Axis
        scale={dummyScale}
        orientation="bottom"
        style={{ stroke: 'red' }}
      />
    );
    expect(wrapper.children().first()).to.have.attr('style', 'stroke:red;');
  });

  it('renders a label when specified', () => {
    const props = {
      translate: { x: 0, y: 0 },
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
    };
    const wrapper = shallow(
      <Axis
        scale={dummyScale}
        orientation="bottom"
        label="Label"
        {...props}
      />
    );
    chai.expect(wrapper.children().find('text').last()).to.have.text('Label');
  });

  it('calculates translate from width and height', () => {
    const wrapper = mount(
      <Axis
        scale={dummyScale}
        orientation="bottom"
        width={100}
        height={100}
      />
    );

    expect(wrapper.state('translate')).to.be.deep.equal({ x: 0, y: 100 });
  });

  describe('updates state based on new props', () => {
    it('applies new scale', () => {
      const wrapper = mount(
        <Axis
          scale={dummyScale}
          orientation="bottom"
        />
      );

      const newScale = d3Scale.scaleLinear();
      wrapper.setProps({ scale: newScale });
      expect(wrapper.state('scale')).to.be.equal(newScale);
    });

    it('calculates new translate from width and height', () => {
      const wrapper = mount(
        <Axis
          scale={dummyScale}
          orientation="bottom"
        />
      );

      wrapper.setProps({ width: 100, height: 100 });
      expect(wrapper.state('translate')).to.be.deep.equal({ x: 0, y: 100 });
    });

    it('uses translate when given as a prop', () => {
      const wrapper = mount(
        <Axis
          scales={{ y: dummyScale }}
          orientation="bottom"
          translate={{ x: 20, y: 20 }}
        />
      );
      expect(wrapper.state('translate')).to.be.deep.equal({ x: 20, y: 20 });
      wrapper.setProps({ translate: { x: 40, y: 40 } });
      expect(wrapper.state('translate')).to.be.deep.equal({ x: 40, y: 40 });
    });
  });
});

describe('<XAxis />', () => {
  it('contains an <Axis />', () => {
    const wrapper = mount(
      <XAxis
        scale={dummyScale}
      />
    );
    expect(wrapper).to.have.prop('orientation', 'bottom');
  });

  it('passes the x scale to <Axis />', () => {
    const wrapper = mount(
      <XAxis
        scales={{ x: dummyScale }}
      />
    );
    expect(wrapper).to.have.state('scale', dummyScale);
  });

  it('updates state scale based on new props', () => {
    const wrapper = mount(
      <XAxis
        scales={{ x: dummyScale }}
      />
    );
    const newScale = d3Scale.scaleLinear();
    wrapper.setProps({ scales: { x: newScale } });
    expect(wrapper.state('scale')).to.be.equal(newScale);
  });
});

describe('<YAxis />', () => {
  it('contains an <Axis />', () => {
    const wrapper = mount(
      <YAxis
        scale={dummyScale}
      />
    );
    expect(wrapper).to.have.prop('orientation', 'left');
  });

  it('passes the y scale to <Axis />', () => {
    const wrapper = mount(
      <YAxis
        scales={{ y: dummyScale }}
      />
    );
    expect(wrapper).to.have.state('scale', dummyScale);
  });

  it('updates state scale based on new props', () => {
    const wrapper = mount(
      <YAxis
        scales={{ y: dummyScale }}
      />
    );
    const newScale = d3Scale.scaleLinear();
    wrapper.setProps({ scales: { y: newScale } });
    expect(wrapper.state('scale')).to.be.equal(newScale);
  });
});
