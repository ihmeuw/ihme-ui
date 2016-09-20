import React from 'react';
import ReactDOM from 'react-dom';
import concat from 'lodash/concat';
import { PureComponent } from '../../../utils';

import Group, { Option } from '../';

const data = [
  { name: 'males', value: '1' },
  { name: 'females', value: '2' },
  { name: 'both', value: '3' },
];

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { selectedItems: '1', disabledItems: '3' };

    this.setSelection = this.setSelection.bind(this);
    this.isDisabled = this.isDisabled.bind(this);
  }

  setSelection(_, value) {
    this.setState({ selectedItems: value });
  }

  isDisabled(value) {
    return concat([], this.state.disabledItems).includes(value);
  }

  render() {
    return (
      <Group
        onClick={this.setSelection}
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

ReactDOM.render(<App />, document.getElementById('app'));
