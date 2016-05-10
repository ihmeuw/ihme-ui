import React from 'react';
import { render } from 'react-dom';

import Slider from '../';

function onChange(key, value) {
  console.log(key, value);
}

function labelFunc(label) {
  return `Year: ${label}`
}

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Slider
        width={ 200 }
        height={ 24 }
        minValue={ 2001 }
        maxValue={ 2025 }
        onChange={ onChange }
        value={ { min: 2001, max: 2005 } }
        labelFunc={ labelFunc }
      />
    );
  }
}

render(<App />, document.getElementById('app'));
