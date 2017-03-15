import React from 'react';
import { render } from 'react-dom';
import { randomUniform } from 'd3';
import bindAll from 'lodash/bindAll';

import Slider from '../';
import Button from '../../button';

function getValueOrPlaceholder(el) {
  return el.value || el.placeholder;
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.items = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

    this.state = {
      disabled: false,
      fontSize: '9pt',
      width: 200,
      range: {
        low: 2001,
        high: 2025,
        steps: 25,
        precision: 5,
      },
      rangeValue: {
        low: undefined,
        high: undefined,
      },
      singleValue: 2015,
      singleFillStyle: {
        backgroundColor: '#ccc',
        transition: 'width 0.3s ease-out',
      },
      singleHandleStyle: {
        transition: 'all 0.3s ease-out',
      },
      listValue: this.items[0],
      fillStyle: {
        backgroundColor: this.items[0],
      },
    };

    this.randomGenerator = (range) => {
      return Math.floor(randomUniform(...range)());
    };

    this.nextExtent = [this.randomGenerator([1900, 2016]), this.randomGenerator([1900, 2016])];
    this.nextWidth = this.randomGenerator([150, 300]);
    this.nextFontSize = `${this.randomGenerator([6, 24])}pt`;

    bindAll(this, [
      'toggleDisable',
      'onChange',
      'onEnd',
      'onSingleValueChange',
      'onListValueChange',
      'setNewMinMax',
      'setNewWidth',
      'setNewFontSize',
      'listLabelFunc',
    ]);
  }

  toggleDisable() {
    this.setState({ disabled: !this.state.disabled });
  }

  onChange(event, value) {
    console.log('drag', value);
    this.setState({ rangeValue: value });
  }

  onEnd(event, value) {
    console.log('dragEnd', value);
    this.setState({ rangeValue: value });
  }

  onSingleValueChange(event, value) {
    console.log(value);
    this.setState({ singleValue: value });
  }

  onListValueChange(event, value) {
    console.log(value);
    this.setState({
      listValue: value,
      fillStyle: {
        backgroundColor: value.low,
      },
    });
  }

  setNewMinMax() {
    const minExtent = +getValueOrPlaceholder(document.getElementById('newMinExtent'));
    const maxExtent = +getValueOrPlaceholder(document.getElementById('newMaxExtent'));
    const precision = +getValueOrPlaceholder(document.getElementById('newPrecision'));

    const newExtent = [minExtent, maxExtent].sort((a, b) => { return a - b; });

    const newSteps = +document.getElementById('newSteps').value ||
                       (newExtent[1] - newExtent[0] + 1);

    this.setState({
      range: {
        precision,
        low: Math.min(...newExtent),
        high: Math.max(...newExtent),
        steps: newSteps,
      },
      rangeValue: {
        low: Math.min(...newExtent),
        high: Math.max(...newExtent),
      },
      singleValue: Math.min(...newExtent),
    });

    this.nextExtent = [this.randomGenerator([1900, 2016]), this.randomGenerator([1900, 2016])];
  }

  setNewWidth() {
    const newWidth = +getValueOrPlaceholder(document.getElementById('newWidth'));

    this.setState({
      width: newWidth,
    });
    this.nextWidth = this.randomGenerator([150, 300]);
  }

  setNewFontSize() {
    const newFontSize = getValueOrPlaceholder(document.getElementById('newFontSize'));

    this.setState({
      fontSize: newFontSize,
    });
    this.nextFontSize = `${this.randomGenerator([6, 24])}pt`;
  }

  listLabelFunc(value) {
    return this.items[value];
  }

  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
        <aside>
          <h5>Modify sliders</h5>
          <div>
            <Button
              text={`${this.state.disabled ? 'Enable' : 'Disable'} sliders`}
              onClick={this.toggleDisable}
            />
          </div>
          <div>
            <Button
              text="Set new min/max"
              onClick={this.setNewMinMax}
            />
          </div>
          <div>
            <input id="newMinExtent" type="text" placeholder={`${Math.min(...this.nextExtent)}`} />
            <br />
            <input id="newMaxExtent" type="text" placeholder={`${Math.max(...this.nextExtent)}`} />
            <br />
            <input
              id="newSteps" type="text"
              placeholder={`${Math.abs(this.nextExtent[1] - this.nextExtent[0]) + 1}`}
            />
            <br />
            <input id="newPrecision" type="text" placeholder={`${this.state.range.precision}`} />
          </div>
          <div>
            <Button
              text="Set new width"
              onClick={this.setNewWidth}
            />
          </div>
          <div>
            <input id="newWidth" type="text" placeholder={`${this.nextWidth}`} />
          </div>
          <div>
            <Button
              text="Set new font size"
              onClick={this.setNewFontSize}
            />
          </div>
          <div>
            <input id="newFontSize" type="text" placeholder={`${this.nextFontSize}`} />
          </div>
        </aside>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <section>
            <h3>Range slider</h3>
{/* <pre><code>
    <Slider
      width={200}
      range={{ low: 2001, high: 2005 }}
      onChange={function (value, key) {...}}
      value={{
        low: 2001,  // (initially)
        high: 2025, // (initially)
      }}
      fill
      ticks
    />
</code></pre> */}
            <Slider
              disabled={this.state.disabled}
              fontSize={this.state.fontSize}
              width={this.state.width}
              range={this.state.range}
              onDrag={this.onChange}
              onDragEnd={this.onEnd}
              onKey={this.onChange}
              onKeyEnd={this.onEnd}
              onTrackClick={this.onEnd}
              value={this.state.rangeValue}
              fill
              ticks
            />
          </section>
          <section>
            <h3>Single-value slider</h3>
{/* <pre><code>
    <Slider
      width={200}
      range={{ low: 2001, high: 2005 }}
      onChange={function (value, key) {...}}
      value={2015} // (initially)
      fill
      fillStyle={{
        backgroundColor: '#ccc',
        transition: 'width 0.3s ease-out',
      }}
      handleStyle={{
        transition: 'all 0.3s ease-out',
      }}
    />
</code></pre> */}
            <Slider
              disabled={this.state.disabled}
              fontSize={this.state.fontSize}
              width={this.state.width}
              range={this.state.range}
              onDrag={this.onSingleValueChange}
              onKey={this.onSingleValueChange}
              onTrackClick={this.onSingleValueChange}
              value={this.state.singleValue}
              fill
              fillStyle={this.state.singleFillStyle}
              handleStyle={this.state.singleHandleStyle}
            />
          </section>
          <section>
            <h3>Slider with list</h3>
{/* <pre><code>
    items = ['red', 'orange', 'yellow', ...];
    <Slider
      width={200}
      range={items}
      onChange={function (value, key) {...}}
      value={this.state.value}
      labelFunc={function (value) {...}}
      fill
      fillStyle={this.state.fillStyle}
    />
</code></pre> */}
            <Slider
              disabled={this.state.disabled}
              fontSize={this.state.fontSize}
              width={this.state.width}
              range={this.items}
              onDrag={this.onListValueChange}
              onKey={this.onListValueChange}
              onTrackClick={this.onListValueChange}
              value={this.state.listValue}
              fill
              fillStyle={this.state.fillStyle}
            />
          </section>
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
