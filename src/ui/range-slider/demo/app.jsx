// react
import React from 'react';
import { render } from 'react-dom';

// component
import RangeSlider from '../src';

// utils
import { maxBy, minBy } from 'lodash';
import { scaleLinear } from 'd3-scale';
import { dataGenerator, colorSteps } from '../../../test-utils';
import { generateColorDomain } from '../../../utils/domain';

const valueField = 'value';
const keyField = 'loc_id';

const data = dataGenerator({
  keyField,
  valueField,
  length: 100,
  dataQuality: 'best'
});

const domain = [minBy(data, 'value').value, maxBy(data, 'value').value];

class App extends React.Component {
  render() {
    return (
      <RangeSlider
        width={this.props.width}
        colorSteps={colorSteps}
        colorScale={scaleLinear().domain(generateColorDomain(colorSteps, domain)).range(colorSteps)}
        domain={domain}
        rangeExtent={domain}
        data={data}
        keyField={keyField}
        valueField={valueField}
        unit="Deaths per 100,000"
      />
    );
  }
}

const container = document.getElementById('app');
const renderApp = () => {
  render(<App width={container.getBoundingClientRect().width} />, container);
};

renderApp();

/* throttler stolen from Mozilla (https://developer.mozilla.org/en-US/docs/Web/Events/resize) */
(() => {
  const throttle = (type, name) => {
    let running = false;
    const func = () => {
      if (running) { return; }
      running = true;
      requestAnimationFrame(function() {
        window.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };
    window.addEventListener(type, func);
  };

  /* init - you can init any event */
  throttle('resize', 'optimizedResize');
})();

window.addEventListener('optimizedResize', renderApp);
