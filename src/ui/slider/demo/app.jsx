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
      values: {
        min: 2001,
        max: 2005
      }
    };

    this.onChange = this.onChange.bind(this);
    this.nextState = this.nextState.bind(this);

    // setTimeout(this.nextState({ ...this.state, minValue: 1995, maxValue: 2040 }), 2000)
  }

  nextState(state) {
    return () => {
      this.setState(state);
    }
  }

  onChange(value, key) {
    console.log(key, value);
    this.setState({ values: value })
  }

  render() {
    return (
      <Slider
        width={ this.state.width }
        height={ 24 }
        minValue={ this.state.minValue }
        maxValue={ this.state.maxValue }
        onChange={ this.onChange }
        value={ this.state.values }
        fill
      />
    );
  }
}

render(<App />, document.getElementById('app'));
