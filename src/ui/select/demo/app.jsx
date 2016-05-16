import React from 'react';
import { render } from 'react-dom';
import { bindAll } from 'lodash';
import d3Random from 'd3-random';

import { MultiSelect, SingleSelect } from '../';
import { default as cities } from './cities';
import style from './app.css';

const randomizer = d3Random.randomUniform(0, 4);

const hierarchicalCities = cities.map((city) => {
  const level = Math.floor(randomizer());
  return {
    level: level,
    bold: !level || null,
    ...city
  };
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      multiSelectValues: [],
      singleSelectValue: null
    };

    bindAll(this, [
      'onMultiSelectChange',
      'onSingleSelectChange'
    ]);
  }

  onMultiSelectChange(selections) {
    this.setState({
      multiSelectValues: selections
    });
  }

  onSingleSelectChange(selection) {
    this.setState({
      singleSelectValue: selection
    });
  }

  render() {
    const { multiSelectValues, singleSelectValue } = this.state;

    return (
      <div className={style.container}>
        <section>
          <h3>Multi-select</h3>
          <pre><code>
     <MultiSelect
       labelKey="name"
       valueKey="name"
       name="city"
       onChange={ function (selections <Array>) {...} }
       options={ [{name: 'Albany'}, ...] }
       value={[]}
     />
          </code></pre>
          <MultiSelect
            labelKey="name"
            valueKey="name"
            name="city"
            onChange={this.onMultiSelectChange}
            options={cities}
            value={multiSelectValues}
          />
        </section>
        <section>
          <h3>Single-select</h3>
          <pre><code>
     <SingleSelect
       autofocus
       clearable
       labelKey="name"
       valueKey="name"
       name="city"
       onChange={ function (selections <Object>) {...} }
       options={ [{name: 'Albany'}, ...] }
       value={[]}
     />
          </code></pre>
          <div style={{ flex: '1 1 auto', maxWidth: '300px', minWidth: '200px' }}>
            <SingleSelect
              labelKey="name"
              valueKey="name"
              name="city"
              onChange={this.onSingleSelectChange}
              options={cities}
              value={singleSelectValue}
            />
          </div>
        </section>
        <section>
          <h3>Hierarchical select</h3>
          <pre><code>
     <SingleSelect
       hierarchical
       labelKey="name"
       valueKey="name"
       name="city"
       onChange={ function (selections <Object>) {...} }
       options={ [{ name: 'Albany', level: 1, bold: true }, ...] }
       value={[]}
     />
          </code></pre>
          <div style={{ flex: '1 1 auto', maxWidth: '300px', minWidth: '200px' }}>
            <SingleSelect
              hierarchical
              labelKey="name"
              valueKey="name"
              name="city"
              onChange={this.onSingleSelectChange}
              options={hierarchicalCities}
              value={singleSelectValue}
            />
          </div>
        </section>
      </div>
    );
  }
};

render(<App />, document.getElementById('app'));
