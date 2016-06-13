import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import d3 from 'd3';
import { getGeoJSON, getLocationIds, baseColorScale } from '../../../test-utils';

import FeatureLayer from '../src/feature-layer';
import Path from '../src/path';

chai.use(chaiEnzyme());

describe('Choropleth <FeatureLayer />', () => {
  const features = getGeoJSON('states', 'feature').features;

  // keyField references the id field on the returned geoJSON
  const keyField = 'id';

  // valueField references the key on the data built up below
  // which holds the value to map to the location
  const valueField = 'mean';

  const data = getLocationIds(features).reduce((map, locationId) => {
    /* eslint-disable no-param-reassign */
    map[locationId] = {
      [valueField]: Math.floor(Math.random() * 100)
    };

    return map;
    /* eslint-enable no-param-reassign */
  }, {});

  const pathGenerator = d3.geo.path();

  it('creates a path for each feature given a collection of features', () => {
    const wrapper = shallow(
      <FeatureLayer
        features={features}
        data={data}
        keyField={keyField}
        valueField={valueField}
        pathGenerator={pathGenerator}
        colorScale={baseColorScale()}
      />
    );

    expect(wrapper.find('g')).to.have.exactly(Object.keys(data).length).descendants(Path);
  });
});
