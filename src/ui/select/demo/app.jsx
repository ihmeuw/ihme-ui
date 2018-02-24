import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { bindAll } from 'lodash';

import { Select } from '../';
import { default as cities } from './cities';
import style from './app.css';

const random = Math.random;

function* hierarchyGenerator() {
  let level = 1;
  yield level;
  while (true) {
    const q = random();
    if (level === 1) {
      if (q < 0.5) {
        level++;
      }
    } else if (level === 4) {
      if (q < 0.5) {
        level--;
      }
    } else {
      if (q < 0.25) {
        level++;
      } else if (q > 0.75) {
        level--;
      }
    }
    yield level;
  }
}

const levelG = hierarchyGenerator();

const hierarchicalCities = cities.map((city) => {
  const {value: level} = levelG.next();

  return {
    level,
    bold: level === 1,
    ...city,
  };
});

function randomlyColorOptions() {
  const colors = [
    '#26c',
    '#C13',
    '#c71',
    '#b1c',
    '#eee',
  ];

  const color = colors[Math.floor(random() * 10)];
  if (color) return { color };
  return {};
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      multiSelectValues: [],
      multiHierarchicalSelectValues: [],
      singleSelectValue: null,
    };

    bindAll(this, [
      'onMultiSelectChange',
      'onMultiHierarchicalSelectChange',
      'onSingleSelectChange',
    ]);
  }

  onMultiSelectChange(selections) {
    this.setState({
      multiSelectValues: selections,
    });
  }

  onMultiHierarchicalSelectChange(selections) {
    this.setState({
      multiHierarchicalSelectValues: selections,
    });
  }

  onSingleSelectChange(selection) {
    this.setState({
      singleSelectValue: selection,
    });
  }

  render() {
    const {
      multiSelectValues,
      multiHierarchicalSelectValues,
      singleSelectValue,
    } = this.state;

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
            clearable={false}
            hierarchical
            labelKey="name"
            multi
            onChange={this.onMultiHierarchicalSelectChange}
            options={hierarchicalCities}
            value={multiHierarchicalSelectValues}
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
            optionStyle={randomlyColorOptions}
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
