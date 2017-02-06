import React from 'react';
import { render } from 'react-dom';
import { bindAll } from 'lodash';
import { randomUniform } from 'd3';

import { Select } from '../';
import { default as cities } from './cities';
import style from './app.css';

const randomizer = randomUniform(0, 4);

const hierarchicalCities = cities.map((city) => {
  const level = Math.floor(randomizer());
  return {
    level,
    bold: !level || null,
    ...city,
  };
});

function randomlyDisableOptions(option) {
  const isEven = Math.floor(randomizer()) % 2 === 0;
  if (isEven) return { color: '#eee' };
  return {};
}

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
     <Select
       labelKey="name"
       multi
       onChange={ function (selections <Array>) {...} }
       options={ [{name: 'Albany'}, ...] }
       value={[]}
       valueKey="name"
     />

</code></pre> */}
          <Select
            labelKey="name"
            multi
            onChange={this.onMultiSelectChange}
            options={cities}
            value={multiSelectValues}
            valueKey="name"
          />
        </section>
        <section>
          <h3>Hierarchical multi-select</h3>
{/* <pre><code>
     <Select
       hierarchical
       labelKey="name"
       multi
       onChange={ function (selections <Array>) {...} }
       options={ [{ name: 'Albany', level: 1, bold: true }, ...] }
       value={[]}
       valueKey="name"
     />

</code></pre> */}
          <Select
            hierarchical
            labelKey="name"
            multi
            onChange={this.onMultiSelectChange}
            options={hierarchicalCities}
            value={multiSelectValues}
            valueKey="name"
          />
        </section>
        <section>
          <h3>Single-select</h3>
{/* <pre><code>
     <Select
       labelKey="name"
       onChange={ function (selections <Object>) {...} }
       options={ [{name: 'Albany'}, ...] }
       value={null}
       valueKey="name"
     />

</code></pre> */}
          <Select
            labelKey="name"
            onChange={this.onSingleSelectChange}
            options={cities}
            value={singleSelectValue}
            valueKey="name"
          />
        </section>
        <section>
          <h3>Hierarchical single-select</h3>
{/* <pre><code>
     <Select
       hierarchical
       labelKey="name"
       onChange={ function (selections <Object>) {...} }
       options={ [{ name: 'Albany', level: 1, bold: true }, ...] }
       value={null}
       valueKey="name"
     />

</code></pre> */}
          <Select
            hierarchical
            labelKey="name"
            onChange={this.onSingleSelectChange}
            options={hierarchicalCities}
            value={singleSelectValue}
            valueKey="name"
          />
        </section>

        <section>
          <h3>Option styling</h3>
{/* <pre><code>
       <Select
         hierarchical
         labelKey="name"
         onChange={ function (selections <Object>) {...} }
         options={ [{ name: 'Albany', level: 1, bold: true }, ...] }
         optionStyle={function(option) {...}}
         value={null}
         valueKey="name"
       />

</code></pre> */}
          <Select
            hierarchical
            labelKey="name"
            onChange={this.onSingleSelectChange}
            options={hierarchicalCities}
            optionStyle={randomlyDisableOptions}
            value={singleSelectValue}
            valueKey="name"
          />
        </section>
        <section>
          <h3>Multi-select flip up</h3>
{/* <pre><code>
       <Select
         labelKey="name"
         menuUpward
         multi
         onChange={ function (selections <Array>) {...} }
         options={ [{name: 'Albany'}, ...] }
         placeholder="select cities"
         value={[]}
         valueKey="name"
       />

 </code></pre> */}
          <Select
            labelKey="name"
            menuUpward
            multi
            onChange={this.onMultiSelectChange}
            options={cities}
            placeholder="select cities"
            value={multiSelectValues}
            valueKey="name"
          />
        </section>
        <section>
          <h3>Single-select flip up</h3>
{/* <pre><code>
       <Select
         labelKey="name"
         menuUpward
         onChange={ function (selections <Object>) {...} }
         options={ [{name: 'Albany'}, ...] }
         placeholder="select city"
         value={null}
         valueKey="name"
       />

</code></pre> */}
          <Select
            labelKey="name"
            menuUpward
            onChange={this.onSingleSelectChange}
            options={cities}
            placeholder="select city"
            value={singleSelectValue}
            valueKey="name"
          />
        </section>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
