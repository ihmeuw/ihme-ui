import React from 'react';
import { render } from 'react-dom';

import { concat } from 'lodash';

import Group from '../';
import { Option } from '../';


const data = [
  { name: 'males', value: '1' },
  { name: 'females', value: '2' },
  { name: 'both', value: '3' }
];

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { selectedItems: '1', disabledItems: '3' };

    this.setSelection = this.setSelection.bind(this);
    this.isDisabled = this.isDisabled.bind(this);
  }

  setSelection({ value }) {
    this.setState({ selectedItems: value });
  }

  isDisabled(value) {
    return concat([], this.state.disabledItems).includes(value);
  }

  render() {
    return (
      <Group
        clickHandler={this.setSelection}
      >
        {
          data.map((datum, index) => {
            return (
              <Option
                key={index}
                text={datum.name}
                value={datum.value}
                selected={this.state.selectedItems === datum.value}
                disabled={this.isDisabled(datum.value)}
              />
            );
          })
        }
      </Group>
    );
  }
}

render(<App />, document.getElementById('app'));
