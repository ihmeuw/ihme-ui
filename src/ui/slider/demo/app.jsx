import React from 'react';
import { render } from 'react-dom';

import Slider from '../';

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

    this.onChange = this.onChange.bind(this);
    this.onSingleValueChange = this.onSingleValueChange.bind(this);
  }

  onChange(value, key) {
    console.log(key, value);
    this.setState({ rangeSliderValues: value });
  }

  onSingleValueChange(value, key) {
    this.setState({ singleValue: value });
  }

  render() {
    return (
      <div>
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
