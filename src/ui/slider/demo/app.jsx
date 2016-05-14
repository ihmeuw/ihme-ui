import React from 'react';
import { render } from 'react-dom';
import d3Random from 'd3-random';
import { percentOfRange, numFromPercent } from '../../../utils/';

import Slider from '../';
import Button from '../../button';

function getValueOrPlaceholder(el) {
  return +(el.value || el.placeholder);
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 200,
      minValue: 2001,
      maxValue: 2025,
      rangeSliderValues: {
        min: 2001,
        max: 2005
      },
      singleValue: 2015
    };

    this.randomGenerator = (range) => {
      return Math.floor(d3Random.randomUniform(...range)());
    };

    this.nextExtent = [this.randomGenerator([1900, 2016]), this.randomGenerator([1900, 2016])] ;
    this.nextWidth = this.randomGenerator([150, 300]);

    this.onChange = this.onChange.bind(this);
    this.onSingleValueChange = this.onSingleValueChange.bind(this);
    this.setNewMinMax = this.setNewMinMax.bind(this);
    this.setNewWidth = this.setNewWidth.bind(this);
  }

  setNewMinMax() {
    const minExtent = getValueOrPlaceholder(document.getElementById('newMinExtent'));
    const maxExtent = getValueOrPlaceholder(document.getElementById('newMaxExtent'));
    const newStep = getValueOrPlaceholder(document.getElementById('newStep'));

    const newExtent = [minExtent, maxExtent].sort((a, b) => { return a - b; });
    const oldExtent = [this.state.minValue, this.state.maxValue];

    const valueSetter = (value) => {
      return Math.floor(numFromPercent(percentOfRange(value, oldExtent), newExtent));
    };

    this.setState({
      minValue: Math.min(...newExtent),
      maxValue: Math.max(...newExtent),
      step: newStep,
      rangeSliderValues: {
        min: valueSetter(this.state.rangeSliderValues.min),
        max: valueSetter(this.state.rangeSliderValues.max)
      },
      singleValue: valueSetter(this.state.singleValue)
    });

    this.nextExtent = [this.randomGenerator([1900, 2016]), this.randomGenerator([1900, 2016])] ;
  }

  setNewWidth() {
    const newWidth = getValueOrPlaceholder(document.getElementById('newWidth'));

    this.setState({
      width: newWidth
    });
    this.nextWidth = this.randomGenerator([150, 300]);
  }

  onChange(value, key) {
    console.log(key, value);
    this.setState({ rangeSliderValues: value });
  }

  onSingleValueChange(value, key) {
    this.setState({ singleValue: value[key] });
  }

  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
        <aside>
          <h5>Modify sliders</h5>
          <div>
            <Button
              text="Set new min/max"
              theme="light"
              clickHandler={this.setNewMinMax}
            />
          </div>
          <div>
            <input id="newMinExtent" type="text" placeholder={ `${Math.min(...this.nextExtent)}` }/>
            <br/>
            <input id="newMaxExtent" type="text" placeholder={ `${Math.max(...this.nextExtent)}` }/>
            <br/>
            <input id="newStep" type="text" placeholder="1"/>
          </div>
          <div>
            <Button
              text="Set new width"
              theme="light"
              clickHandler={this.setNewWidth}
            />
          </div>
          <div>
            <input id="newWidth" type="text" placeholder={ `${this.nextWidth}` }/>
          </div>
        </aside>
        <section>
          <h3>Range slider</h3>
          <pre><code>
    <Slider
      width={ 200 }
      height={ 24 }
      minValue={ 2001 }
      maxValue={ 2025 }
      onChange={ function(value, key) {...} }
      value={{
        min: 2001, (initially)
        max: 2005 (initially)
      }}
      fill
    />
          </code></pre>
          <Slider
            width={ this.state.width }
            height={ 24 }
            minValue={ this.state.minValue }
            maxValue={ this.state.maxValue }
            onChange={ this.onChange }
            value={ this.state.rangeSliderValues }
            step={ this.state.step }
            fill
          />
        </section>
        <section>
          <h3>Single-value slider</h3>
          <pre><code>
    <Slider
      width={ 200 }
      height={ 24 }
      minValue={ 2001 }
      maxValue={ 2025 }
      onChange={ function(value, key) {...} }
      value={ 2015 (initially) }
      fill
    />
          </code></pre>
          <Slider
            width={ this.state.width }
            height={ 24 }
            minValue={ this.state.minValue }
            maxValue={ this.state.maxValue }
            onChange={ this.onSingleValueChange }
            value={ this.state.singleValue }
            step={ this.state.step }
            fill
          />
        </section>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
