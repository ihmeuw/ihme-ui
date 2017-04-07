/* eslint-disable no-unused-expressions */
import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { geoPath } from 'd3';
import { getGeoJSON } from '../../../test-utils';

import Path from '../src/path';

chai.use(chaiEnzyme());

describe('Choropleth <Path />', () => {
  const pathGenerator = geoPath();
  const feature = getGeoJSON('states', 'feature').features[0];
  const eventHandler = sinon.spy();

  afterEach(() => {
    eventHandler.reset();
  });

  describe('events', () => {
    it(`calls onClick, mouseMove, mouseLeave, and mouseOver 
    with event, datum, and the React element`, () => {
      const datum = { location_id: 5, mean: 7 };
      const wrapper = shallow(
        <Path
          datum={datum}
          pathGenerator={pathGenerator}
          feature={feature}
          onClick={eventHandler}
          onMouseMove={eventHandler}
          onMouseLeave={eventHandler}
          onMouseOver={eventHandler}
        />
      );

      const event = {
        preventDefault() {}
      };

      const inst = wrapper.instance();
      ['click', 'mouseMove', 'mouseLeave', 'mouseOver'].forEach((evtName) => {
        eventHandler.reset();
        wrapper.simulate(evtName, event);
        expect(eventHandler.calledOnce).to.be.true;
        expect(eventHandler.calledWith(event, datum, inst)).to.be.true;
      });
    });
  });

  describe('styling', () => {
    const focusedStyle = {
      stroke: 'blue',
    };

    it('applies focusedStyle as an object', () => {
      const wrapper = shallow(
        <Path
          pathGenerator={pathGenerator}
          focused
          focusedStyle={focusedStyle}
        />
      );

      expect(wrapper).to.have.style('stroke', 'blue');
    });

    it('applies focusedStyle as a function', () => {
      const wrapper = shallow(
        <Path
          pathGenerator={pathGenerator}
          focused
          focusedStyle={() => ({ stroke: 'red' })}
        />
      );

      expect(wrapper).to.have.style('stroke', 'red');
    });

    it('sets strokeWidth to 2px when selected (default), 1px when unselected (default)', () => {
      const wrapper = shallow(
        <Path
          pathGenerator={pathGenerator}
          feature={feature}
          selected
        />
      );

      expect(wrapper).to.have.style('stroke-width', '2px');
      wrapper.setProps({ selected: false });
      expect(wrapper).to.have.style('stroke-width', '1px');
    });

    it('accepts an object for both style and selected style', () => {
      const wrapper = shallow(
        <Path
          pathGenerator={pathGenerator}
          feature={feature}
          selectedStyle={{ strokeDasharray: '5, 5' }}
          style={{ stroke: 'red' }}
        />
      );

      expect(wrapper).to.have.style('stroke', 'red');
      expect(wrapper).to.not.have.style('stroke-dasharray');
      wrapper.setProps({ selected: true });
      expect(wrapper).to.have.style('stroke-dasharray', '5, 5');
    });

    it('accepts a function for both style and selected style', () => {
      const { id } = feature;
      const wrapper = shallow(
        <Path
          pathGenerator={pathGenerator}
          feature={feature}
          selectedStyle={(geoJSONFeature) => {
            return { strokeWidth: `${geoJSONFeature.id * 2}px` };
          }}
          style={(geoJSONFeature) => {
            return { strokeWidth: `${geoJSONFeature.id}px` };
          }}
        />
      );

      expect(wrapper).to.have.style('stroke-width', `${id}px`);
      wrapper.setProps({ selected: true });
      expect(wrapper).to.have.style('stroke-width', `${id * 2}px`);
    });
  });

  describe('classes', () => {
    it('applies className and selectedClassName when selected', () => {
      const wrapper = shallow(
        <Path
          pathGenerator={pathGenerator}
          feature={feature}
          className="foo"
          selectedClassName="bar"
        />
      );

      expect(wrapper).to.have.className('foo');
      expect(wrapper).to.not.have.className('bar');
      wrapper.setProps({ selected: true });
      expect(wrapper).to.have.className('foo');
      expect(wrapper).to.have.className('bar');
    });
  });
});
