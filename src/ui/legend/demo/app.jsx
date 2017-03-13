/* eslint no-alert:0 */
import React from 'react';
import { render } from 'react-dom';
import { bindAll } from 'lodash';

import Legend from '../';
import Button from '../../button';

const items = [
  {
    label: '95% UI for GBD non-shock estimates',
    shapeColor: 'rgba(255, 120, 240, 0.2)',
    shapeType: 'square'
  },
  {
    label: '95% UI for GBD estimates with shocks',
    shapeColor: 'rgba(200, 200, 10, 0.3)',
    shapeType: 'square'
  },
  {
    label: 'Stage 1 estimates',
    shapeColor: '#00FF00',
    shapeType: 'line'
  },
  {
    label: 'Stage 2 estimates',
    shapeColor: '#0000FF',
    shapeType: 'line'
  },
  {
    label: 'GBD estimates without shocks',
    shapeColor: 'red',
    shapeType: 'line'
  },
  {
    label: 'UN Pop',
    shapeColor: 'grey',
    shapeType: 'cross'
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
{/* <pre><code>
  const items = [
    {
      label: '95% UI for GBD non-shock estimates',
      shapeColor: 'rgba(255, 120, 240, 0.2)',
      shapeType: 'square'
    },
    {
      label: '95% UI for GBD estimates with shocks',
      shapeColor: 'rgba(200, 200, 10, 0.3)',
      shapeType: 'square'
    },
    {
      label: 'Stage 1 estimates',
      shapeColor: '#00FF00',
      shapeType: 'line'
    },
    {
      label: 'Stage 2 estimates',
      shapeColor: '#0000FF',
      shapeType: 'line'
    },
    {
      label: 'GBD estimates without shocks',
      shapeColor: 'red',
      shapeType: 'line'
    },
    {
      label: 'UN Pop',
      shapeColor: 'grey',
      shapeType: 'cross'
    },
  ];

    <Legend
      items={items}
      labelKey="label"
      shapeColorKey="shapeColor"
      shapeTypeKey={(item) => item.shapeType}
      title="Estimate types"
      renderClear
      onClear={(event, item) => {}}
      onClick={(event, item) => {}}
    />
</code></pre> */}
          <Legend
            items={items}
            labelKey="label"
            shapeColorKey="shapeColor"
            shapeTypeKey={(item) => item.shapeType}
            title="Estimate types"
            renderClear
            onClear={this.filterItem}
            onClick={this.alertClick}
          />
          <Button
            text="Reset"
            onClick={this.reset}
          />
        </section>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
