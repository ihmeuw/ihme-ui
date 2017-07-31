import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import { scaleLinear } from 'd3';

import Axis, { XAxis, YAxis } from '../';

chai.use(chaiEnzyme());

const dummyScale = scaleLinear();

describe('<Axis />', () => {
  describe('static methods', () => {
    describe('concatStyle', () => {
      it('reduces a styles object to a valid inline style string', () => {
        expect(Axis.concatStyle({ color: 'blue', display: 'flex' }))
          .to.equal('color: blue; display: flex;');
      });
    });
  });

  it('renders ticks', () => {
    const wrapper = mount(
      <Axis
        scale={dummyScale}
        orientation="bottom"
      />
    );

    expect(wrapper.render().find('.tick')).to.be.present();
  });

  it('renders a label when specified', () => {
    const props = {
      translate: { x: 0, y: 0 },
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
    };
    const wrapper = mount(
      <Axis
        scale={dummyScale}
        orientation="bottom"
        label="Label"
        {...props}
      />
    );
    expect(wrapper.children().find('text').last()).to.have.text('Label');
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
    expect(wrapper).to.contain(
      <Axis
        height={0}
        orientation="bottom"
        padding={{ top: 40, bottom: 40 }}
        scale={dummyScale}
        width={0}
      />
    );
  });
});

describe('<YAxis />', () => {
  it('contains an <Axis />', () => {
    const wrapper = mount(
      <YAxis
        scale={dummyScale}
      />
    );
    expect(wrapper).to.contain(
      <Axis
        height={0}
        orientation="left"
        padding={{ left: 50, right: 50 }}
        scale={dummyScale}
        width={0}
      />
    );
  });
});
