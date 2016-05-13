import React from 'react';
import { render } from 'react-dom';
import d3Random from 'd3-random';
import { percentOfRange, numFromPercent } from '../../../utils/';

import Slider from '../';
import Button from '../../button';

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

    const randomizer = d3Random.randomUniform(1900, 2016);
    this.randomMinMaxGenerator = () => {
      return [Math.floor(randomizer()), Math.floor(randomizer())];
    };

    this.onChange = this.onChange.bind(this);
    this.onSingleValueChange = this.onSingleValueChange.bind(this);
    this.setNewMinMax = this.setNewMinMax.bind(this);
  }

  setNewMinMax() {
    const oldExtent = [this.state.minValue, this.state.maxValue];
    const newExtent = this.randomMinMaxGenerator().sort((a, b) => { return a - b; });

    const valueSetter = (value) => {
      return Math.floor(numFromPercent(percentOfRange(value, oldExtent), newExtent));
    };

    this.setState({
      minValue: Math.min(...newExtent),
      maxValue: Math.max(...newExtent),
      rangeSliderValues: {
        min: valueSetter(this.state.rangeSliderValues.min),
        max: valueSetter(this.state.rangeSliderValues.max)
      },
      singleValue: valueSetter(this.state.singleValue)
    });
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
          <Button
            text="Set new min/max"
            theme="light"
            clickHandler={this.setNewMinMax}
          />
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
            fill
          />
        </section>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
