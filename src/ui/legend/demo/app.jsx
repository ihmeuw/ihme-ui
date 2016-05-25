/* eslint no-alert:0 */
import React from 'react';
import { render } from 'react-dom';
import { bindAll } from 'lodash';

import Legend from '../';
import Button from '../../button';

const items = [
  {
    label: '95% UI for GBD non-shock estimates',
    symbolColor: 'rgba(255, 120, 240, 0.2)',
    symbolType: 'square'
  },
  {
    label: '95% UI for GBD estimates with shocks',
    symbolColor: 'rgba(200, 200, 10, 0.3)',
    symbolType: 'square'
  },
  {
    label: 'Stage 1 estimates',
    symbolColor: '#00FF00',
    symbolType: 'line'
  },
  {
    label: 'Stage 2 estimates',
    symbolColor: '#0000FF',
    symbolType: 'line'
  },
  {
    label: 'GBD estimates without shocks',
    symbolColor: 'red',
    symbolType: 'line'
  },
  {
    label: 'UN Pop',
    symbolColor: 'grey',
    symbolType: 'cross'
  },
];

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items
    };

    bindAll(this, [
      'reset',
      'filterItem',
      'alertClick'
    ]);
  }

  reset() {
    this.setState({
      items
    })
  }

  filterItem(e, item) {
    this.setState({
      items: this.state.items.filter(itemObj => itemObj !== item)
    });
  }

  alertClick(e, item) {
    alert(`You clicked "${item.label}."`);
  }

  render() {
    const { items } = this.state;
    return (
      <div>
        <section>
          <h3>Legend</h3>
          <pre><code>
const items = [
  {
    label: '95% UI for GBD non-shock estimates',
    symbolColor: 'rgba(255, 120, 240, 0.2)',
    symbolType: 'square'
  },
  {
    label: '95% UI for GBD estimates with shocks',
    symbolColor: 'rgba(200, 200, 10, 0.3)',
    symbolType: 'square'
  },
  {
    label: 'Stage 1 estimates',
    symbolColor: '#00FF00',
    symbolType: 'line'
  },
  {
    label: 'Stage 2 estimates',
    symbolColor: '#0000FF',
    symbolType: 'line'
  },
  {
    label: 'GBD estimates without shocks',
    symbolColor: 'red',
    symbolType: 'line'
  },
  {
    label: 'UN Pop',
    symbolColor: 'grey',
    symbolType: 'cross'
  },
];

  <Legend
    items={items}
    labelKey="label"
    symbolColorKey="symbolColor"
    symbolTypeKey={(item) => item.symbolType}
    title="Estimate types"
    renderClear
    onClear={(event, item) => {}}
    onClick={(event, item) => {}}
  />
          </code></pre>
          <Legend
            items={items}
            labelKey="label"
            symbolColorKey="symbolColor"
            symbolTypeKey={(item) => item.symbolType}
            title="Estimate types"
            renderClear
            onClear={this.filterItem}
            onClick={this.alertClick}
          />
          <Button
            text="Reset"
            clickHandler={this.reset}
          />
        </section>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
