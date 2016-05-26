import React from 'react';
import { render } from 'react-dom';

import { maxBy, minBy, memoize, bindAll } from 'lodash';
import { scaleLinear } from 'd3-scale';
import topojson from 'topojson';

import { colorSteps, dataGenerator, getLocationIds, getTopoJSON } from '../../../test-utils';
import { generateColorDomain } from '../../../utils/domain';

import ResponsiveContainer from '../../responsive-container';
import Choropleth from '../';
import Button from '../../button';

const usaTopoJSON = getTopoJSON();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.updateData = memoize(this.updateData);

    this.state = {
      selections: [],
      showSubnational: true,
      ...this.updateData('country', usaTopoJSON)
    };

    bindAll(this, [
      'toggleSubnational',
      'selectLocation'
    ]);
  }

  updateData(layer, topology) {
    const keyField = 'id';
    const valueField = 'mean';
    const geoJSON = topojson.feature(topology, topology.objects[layer]);
    const locIds = getLocationIds(geoJSON.features);
    const data = dataGenerator({
      primaryKeys: [{ name: keyField, values: locIds }],
      valueKeys: [
        { name: valueField, range: [200, 500] }
      ],
      length: 1
    });

    const domain = [minBy(data, valueField)[valueField], maxBy(data, valueField)[valueField]];
    const colorScale = scaleLinear()
      .domain(generateColorDomain(colorSteps, domain))
      .range(colorSteps)
      .clamp(true);

    return {
      keyField,
      valueField,
      data,
      domain,
      colorScale
    };
  }

  toggleSubnational() {
    // TODO reverse logic
    const layer = this.state.showSubnational ? 'country' : 'states';
    this.setState({
      showSubnational: !this.state.showSubnational,
      ...this.updateData(layer, usaTopoJSON)
    });
  }

  selectLocation(locId) {
    const { selections } = this.state;

    let newSelections;
    if (selections.includes(locId)) {
      newSelections = selections.filter((loc) => { return loc !== locId; });
    } else {
      newSelections = [locId, ...selections];
    }

    this.setState({
      selections: newSelections
    });
  }

  render() {
    const {
      data,
      keyField,
      valueField,
      colorScale,
      selections,
      showSubnational
    } = this.state;

    return (
      <div style={{ display: 'flex', flex: '1 1 auto', justifyContent: 'center'}}>
        <div style={{ flex: '1 0 auto', maxWidth: '70%' }}>
          <ResponsiveContainer>
            <Choropleth
              layers={showSubnational ? [{ name: 'states', type: 'feature' }, { name: 'country', type: 'mesh' }] : [{ name: 'country', type: 'mesh' }]}
              topology={usaTopoJSON}
              data={data}
              keyField={keyField}
              valueField={valueField}
              colorScale={colorScale}
              selectedLocations={selections}
              onClick={this.selectLocation}
            />
          </ResponsiveContainer>
        </div>
        <Button
          text="Toggle subnational"
          clickHandler={this.toggleSubnational}
        />
      </div>
    );
  }
}

render(<App/>, document.getElementById('app'));
