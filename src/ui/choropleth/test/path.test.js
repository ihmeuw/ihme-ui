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
  const onClick = sinon.spy();

  afterEach(() => {
    onClick.reset();
  });

  it('returns a path', () => {
    const wrapper = shallow(
      <Path
        pathGenerator={pathGenerator}
        feature={feature}
        locationId={6}
      />
    );

    expect(wrapper).to.have.tagName('path');
  });

  it('calls onClick with locationId', () => {
    const wrapper = shallow(
      <Path
        pathGenerator={pathGenerator}
        feature={feature}
        locationId={6}
        onClick={onClick}
      />
    );

    const event = {
      preventDefault() {}
    };

    wrapper.simulate('click', event);
    expect(onClick.calledOnce).to.be.true;
    expect(onClick.calledWith(event, 6)).to.be.true;
  });

  it('does not call onClick if being dragged', () => {
    const wrapper = shallow(
      <Path
        pathGenerator={pathGenerator}
        feature={feature}
        locationId={6}
        onClick={onClick}
      />
    );

    const event = {
      preventDefault() {}
    };

    wrapper.simulate('mouseMove', event);
    wrapper.simulate('click', event);
    expect(onClick.calledOnce).to.be.false;
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
});
