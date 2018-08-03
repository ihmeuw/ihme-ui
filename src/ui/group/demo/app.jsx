import React from 'react';
import ReactDOM from 'react-dom';

import Group, { Option } from '../';
import CustomOptionType from './custom-option-type';

const data = [
  { name: 'males', value: 1 },
  { name: 'females', value: 2 },
  { name: 'both', value: 3 },
];

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selected: 1,
      disabled: 3,
    };

    this.setSelection = this.setSelection.bind(this);
  }

  setSelection(_, value) {
    this.setState({ selected: value });
  }

  render() {
    return (
      <div>
        <section>
          <h3>Basic example</h3>
{/* <pre><code>

  const data = [
    { name: 'males', value: 1 },
    { name: 'females', value: 2 },
    { name: 'both', value: 3 },
  ];

   <Group onClick={this.setSelection}>
    {
      data.map(datum => (
        <Option
          key={datum.value}
          text={datum.name}
          value={datum.value}
          selected={this.state.selected === datum.value}
          disabled={this.state.disabled === datum.value}
        />
      ))
    }
   </Group>

   </code></pre> */}
          <Group onClick={this.setSelection}>
            {
              data.map(datum => (
                <Option
                  key={datum.value}
                  text={datum.name}
                  value={datum.value}
                  selected={this.state.selected === datum.value}
                  disabled={this.state.disabled === datum.value}
                />
              ))
            }
          </Group>
        </section>
        <section>
          <h3>With customized 'value' prop</h3>
{/* <pre><code>

 const data = [
   { name: 'males', value: 1 },
   { name: 'females', value: 2 },
   { name: 'both', value: 3 },
 ];

 <Group
   onClick={this.setSelection}
   optionValueProp="foo"
 >
   {
     data.map(datum => (
       <Option
         key={datum.value}
         text={datum.name}
         foo={datum.value}
         selected={this.state.selected === datum.value}
         disabled={this.state.disabled === datum.value}
       />
     ))
   }
 </Group>

 </code></pre> */}
          <Group
            onClick={this.setSelection}
            optionValueProp="foo"
          >
            {
              data.map(datum => (
                <Option
                  key={datum.value}
                  text={datum.name}
                  foo={datum.value}
                  selected={this.state.selected === datum.value}
                  disabled={this.state.disabled === datum.value}
                />
              ))
            }
          </Group>
        </section>
        <section>
          <h3>With customized Option type</h3>
{/* <pre><code>

 const data = [
   { name: 'males', value: 1 },
   { name: 'females', value: 2 },
   { name: 'both', value: 3 },
 ];

 <Group onClick={this.setSelection}>
   {
     data.map(datum => (
       <Option
         key={datum.value}
         text={datum.name}
         type={CustomOption}
         value={datum.value}
         selected={this.state.selected === datum.value}
         disabled={this.state.disabled === datum.value}
       />
     ))
   }
 </Group>

 </code></pre> */}
          <Group onClick={this.setSelection}>
            {
              data.map(datum => (
                <Option
                  key={datum.value}
                  text={datum.name}
                  type={CustomOptionType}
                  value={datum.value}
                  selected={this.state.selected === datum.value}
                  disabled={this.state.disabled === datum.value}
                />
              ))
            }
          </Group>
        </section>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
