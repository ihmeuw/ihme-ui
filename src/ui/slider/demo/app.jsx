import React from 'react';
import { render } from 'react-dom';

import Slider from '../';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      values: {
        min: 2001,
        max: 2005
      }
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(value, key) {
    console.log(key, value);
    this.setState({ values: value })
  }

  render() {
    return (
      <Slider
        width={ 200 }
        height={ 24 }
        minValue={ 2001 }
        maxValue={ 2025 }
        onChange={ this.onChange }
        value={ this.state.values }
        fill
        fillColor="blue"
      />
    );
  }
}

render(<App />, document.getElementById('app'));
