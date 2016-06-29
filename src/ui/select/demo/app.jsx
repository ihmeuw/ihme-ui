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
    level,
    bold: !level || null,
    ...city,
  };
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      multiSelectValues: [],
      singleSelectValue: null,
    };

    bindAll(this, [
      'onMultiSelectChange',
      'onSingleSelectChange',
    ]);
  }

  onMultiSelectChange(selections) {
    this.setState({
      multiSelectValues: selections,
    });
  }

  onSingleSelectChange(selection) {
    this.setState({
      singleSelectValue: selection,
    });
  }

  render() {
    const { multiSelectValues, singleSelectValue } = this.state;

    return (
      <div className={style.container}>
        <section>
          <h3>Multi-select</h3>
{/* <pre><code>
     <MultiSelect
       labelKey="name"
       valueKey="name"
       onChange={ function (selections <Array>) {...} }
       options={ [{name: 'Albany'}, ...] }
       value={[]}
     />

</code></pre> */}
          <MultiSelect
            labelKey="name"
            valueKey="name"
            onChange={this.onMultiSelectChange}
            options={cities}
            value={multiSelectValues}
          />
        </section>
        <section>
          <h3>Hierarchical multi-select</h3>
{/* <pre><code>
     <MultiSelect
       hierarchical
       labelKey="name"
       valueKey="name"
       onChange={ function (selections <Array>) {...} }
       options={ [{ name: 'Albany', level: 1, bold: true }, ...] }
       value={[]}
     />

</code></pre> */}
          <MultiSelect
            hierarchical
            labelKey="name"
            valueKey="name"
            onChange={this.onMultiSelectChange}
            options={hierarchicalCities}
            value={multiSelectValues}
          />
        </section>
        <section>
          <h3>Single-select</h3>
{/* <pre><code>
     <SingleSelect
       labelKey="name"
       valueKey="name"
       onChange={ function (selections <Object>) {...} }
       options={ [{name: 'Albany'}, ...] }
       value={null}
     />

</code></pre> */}
          <SingleSelect
            labelKey="name"
            valueKey="name"
            onChange={this.onSingleSelectChange}
            options={cities}
            value={singleSelectValue}
          />
        </section>
        <section>
          <h3>Hierarchical single-select</h3>
{/* <pre><code>
     <SingleSelect
       hierarchical
       labelKey="name"
       valueKey="name"
       onChange={ function (selections <Object>) {...} }
       options={ [{ name: 'Albany', level: 1, bold: true }, ...] }
       value={null}
     />

</code></pre> */}
          <SingleSelect
            hierarchical
            labelKey="name"
            valueKey="name"
            onChange={this.onSingleSelectChange}
            options={hierarchicalCities}
            value={singleSelectValue}
          />
        </section>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
