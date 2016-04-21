import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import d3 from 'd3';
import { getGeoJSON, getLocationIds, baseColorScale } from '../../../test-utils';

import Layer from '../src/layer';
import Path from '../src/path';

chai.use(chaiEnzyme());

describe('Choropleth <Layer />', () => {
  // for some reason features 72 and 78 are wonky, so filter them out
  const features = getGeoJSON().features;

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

  it('creates a path for each feature', () => {
    const wrapper = shallow(
      <Layer
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
