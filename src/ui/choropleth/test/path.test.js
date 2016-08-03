/* eslint-disable no-unused-expressions */
import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import d3 from 'd3';
import { getGeoJSON } from '../../../test-utils';

import Path from '../src/path';

chai.use(chaiEnzyme());

describe('Choropleth <Path />', () => {
  const pathGenerator = d3.geo.path();
  const feature = getGeoJSON('states', 'feature').features[0];
  const eventHandler = sinon.spy();

  afterEach(() => {
    eventHandler.reset();
  });

  describe('events', () => {
    it(`calls onClick, mouseDown, mouseMove, mouseOut, and mouseOver 
    with event, locationId, and the React element`, () => {
      const wrapper = shallow(
        <Path
          pathGenerator={pathGenerator}
          feature={feature}
          locationId={6}
          onClick={eventHandler}
          onMouseDown={eventHandler}
          onMouseMove={eventHandler}
          onMouseOut={eventHandler}
          onMouseOver={eventHandler}
        />
      );

      const event = {
        preventDefault() {}
      };

      const inst = wrapper.instance();
      ['click', 'mouseDown', 'mouseMove', 'mouseOut', 'mouseOver'].forEach((evtName) => {
        eventHandler.reset();
        wrapper.simulate(evtName, event);
        expect(eventHandler.calledOnce).to.be.true;
        expect(eventHandler.calledWith(event, 6, inst)).to.be.true;
      });
    });

    it('does not call eventHandler if being dragged', () => {
      const wrapper = shallow(
        <Path
          pathGenerator={pathGenerator}
          feature={feature}
          locationId={6}
          onClick={eventHandler}
        />
      );

      const event = {
        preventDefault() {}
      };

      wrapper.simulate('mouseMove', event);
      wrapper.simulate('click', event);
      expect(eventHandler.called).to.be.false;

      wrapper.simulate('mouseDown', event);
      wrapper.simulate('click', event);
      expect(eventHandler.called).to.be.true;
    });
  });

  describe('styling', () => {
    it('sets strokeWidth to 2px when selected (default), 1px when unselected (default)', () => {
      const wrapper = shallow(
        <Path
          pathGenerator={pathGenerator}
          feature={feature}
          locationId={6}
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
          locationId={6}
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
          locationId={6}
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
          locationId={6}
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
