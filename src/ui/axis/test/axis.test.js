import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import { range } from 'lodash';
import { scaleLinear } from 'd3';

import Axis from '../';
import {
  filterTickValuesByWidth,
  filterTickValuesByHeight,
} from '../src/utils';

chai.use(chaiEnzyme());

const dummyScale = scaleLinear();

describe('<Axis />', () => {
  describe('utils', () => {
    const tickValues = range(0, 20);

    describe('filterTickValuesByWidth', () => {
      const tickFontSize = 12;
      const tickFontFamily = 'Verdana';

      it('returns all ticks given enough width', () => {
        expect(filterTickValuesByWidth(tickValues, { width: 4000, tickFontSize, tickFontFamily }))
          .to.be.an('array')
          .of.length(tickValues.length)
          .and.to.deep.equal(tickValues);
      });

      it('returns a filtered list of ticks given not enough width', () => {
        expect(filterTickValuesByWidth(tickValues, { width: 10, tickFontSize, tickFontFamily }))
          .to.be.an('array')
          .of.length.lessThan(tickValues.length);
      });
    });

    describe('filterTickValuesByHeight', () => {
      it('returns all ticks given enough height', () => {
        expect(filterTickValuesByHeight(tickValues, { height: 4000, tickFontSize: 12 }))
          .to.be.an('array')
          .of.length(tickValues.length)
          .and.to.deep.equal(tickValues);
      });

      it('returns a filtered list of ticks given not enough height', () => {
        expect(filterTickValuesByHeight(tickValues, { height: 10, tickFontSize: 12 }))
          .to.be.an('array')
          .of.length.lessThan(tickValues.length);
      });
    });
  });

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
