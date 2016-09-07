// react
import React, { PropTypes } from 'react';
import { render } from 'react-dom';

// component
import ChoroplethLegend from '../';
import Button from '../../button';

// utils
import { scaleLinear } from 'd3-scale';
import { maxBy, minBy, range } from 'lodash';
import { dataGenerator } from '../../../test-utils';
import { colorSteps } from '../../../utils';
import { generateColorDomain, isWithinRange, numFromPercent } from '../../../utils/domain';

const valueField = 'value';
const keyField = 'loc_id';

class App extends React.Component {
  constructor(props) {
    super(props);

    const { data, domain } = this.getNewData();

    this.state = {
      data,
      domain,
      rangeExtent: domain,
      extentPct: [0, 1],
      x1: 0,
      x2: 100,
      colorDomain: domain,
      colorScale: this.baseColorScale(domain, true)
    };

    this.brushMove = this.brushMove.bind(this);
    this.setScale = this.setScale.bind(this);
    this.setNewData = this.setNewData.bind(this);
  }

  getNewData() {
    const data = dataGenerator({
      primaryKeys: [{ name: keyField, values: range(0, 100) }],
      valueKeys: [{ name: valueField, range: [0, 100] }],
      length: 1,
      dataQuality: 'best'
    });

    const domain = [minBy(data, 'value').value, maxBy(data, 'value').value];

    return {
      data,
      domain
    };
  }

  setNewData() {
    const { data, domain } = this.getNewData();
    const { extentPct } = this.state;
    const rangeExtent = extentPct.map((pct) => {
      return numFromPercent(pct, domain);
    });

    this.setState({
      data,
      domain,
      rangeExtent,
      colorScale: this.baseColorScale(rangeExtent)
    });
  }

  setScale() {
    const [x1Pct, x2Pct] = this.state.extentPct;
    this.setState({
      x1: x1Pct * 100,
      x2: x2Pct * 100,
      colorDomain: this.state.rangeExtent,
      colorScale: this.baseColorScale(this.state.rangeExtent, true)
    });
  }

  baseColorScale(rangeExtent, generateNewBaseScale) {
    const createBaseScale = (colorDomain = this.state.colorDomain) => {
      return scaleLinear()
        .domain(generateColorDomain(colorSteps, colorDomain))
        .range(colorSteps)
        .clamp(true);
    };
    const baseScale = generateNewBaseScale ? createBaseScale(rangeExtent) : createBaseScale();

    return (value) => {
      if (!isWithinRange(value, rangeExtent)) return '#ccc';
      return baseScale(value);
    };
  }

  brushMove(positionInPercent) {
    const positionInDataSpace = positionInPercent.map((pct) => {
      return numFromPercent(pct, this.state.domain);
    });

    this.setState({
      rangeExtent: positionInDataSpace,
      extentPct: positionInPercent,
      colorScale: this.baseColorScale(positionInDataSpace)
    });
  }

  render() {
    const { data, domain, rangeExtent, colorScale, x1, x2 } = this.state;
    return (
      <div id="demo-container">
{/* <pre><code>
    <ChoroplethLegend
      margins={{
        top: 50,
        right: 200,
        bottom: 50,
        left: 200
      }}
      width={this.props.width}
      colorSteps={colorSteps}
      colorScale={colorScale}
      domain={domain}
      rangeExtent={rangeExtent}
      x1={x1}
      x2={x2}
      onSliderMove={this.brushMove}
      data={data}
      keyField={keyField}
      valueField={valueField}
      zoom={1}
      unit="Deaths per 100,000"
    />

</code></pre> */}
        <ChoroplethLegend
          margins={{
            top: 50,
            right: 200,
            bottom: 50,
            left: 200
          }}
          width={this.props.width}
          colorSteps={colorSteps}
          colorScale={colorScale}
          domain={domain}
          rangeExtent={rangeExtent}
          x1={x1}
          x2={x2}
          onSliderMove={this.brushMove}
          data={data}
          keyField={keyField}
          valueField={valueField}
          zoom={1}
          unit="Deaths per 100,000"
        />
        <Button
          text="Set color scale"
          onClick={this.setScale}
        />
        <span style={{ marginBottom: '5px' }} />
        <Button
          text="Generate new data"
          onClick={this.setNewData}
        />
      </div>
    );
  }
}

App.propTypes = {
  width: PropTypes.number
};

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
      requestAnimationFrame(() => {
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
