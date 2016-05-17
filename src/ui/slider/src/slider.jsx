import React, { PropTypes } from 'react';
import classNames from 'classnames';
import d3Scale from 'd3-scale';
import { bindAll, identity, map, zipObject } from 'lodash';

import Track from './track';
import Fill from './fill';
import Handle from './handle';

import style from './style.css';

const propTypes = {
  /** Height and width of Slider component. */
  height: PropTypes.number,
  width: PropTypes.number,

  /** Extents of slider values. */
  minValue: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,

  /** Step between slider values. */
  step: PropTypes.number,

  /**
   * Initial selected value.
   * If number, a single slider handle will be rendered.
   * If object with keys 'min' and 'max', two slider handles will be rendered.
   */
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.array,
    PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number
    })
  ]).isRequired,

  /**
   * Function applied to the selected value prior to rendering.
   * Params:
   *   value - selected value
   *
   * Returns:
   *   'string'
   *
   * Default:
   *   _.identity
   */
  labelFunc: PropTypes.func,

  /** Include fill in the track to indicate value. */
  fill: PropTypes.bool,

  /** Style for the fill color. */
  fillColor: PropTypes.string,

  /**
   * Callback function when value is changed.
   * Params:
   *   value - object with keys ['min'] and 'max'
   *   key - key of most recent value change.
   */
  onChange: PropTypes.func.isRequired
};

const defaultProps = {
  height: 24,
  width: 200,
  step: 1,
  labelFunc: identity,
  fill: false,
  fillColor: '#ccc'
};

/**
 * Evaluate value and return a compatible object with keys 'min' and 'max'.
 * @param value
 * @returns {Object}
 */
function getValues(value) {
  if (typeof value === 'number') {
    return { min: value };
  } else if (Array.isArray(value)) {
    return zipObject(['min', 'max'], value);
  }
  return value;
}

/**
 * Determine the floating point precision of a number.
 * @param value
 * @returns {number}
 */
function getFloatPrecision(value) {
  return value > 0 && value < 1 ? (1 - Math.ceil(Math.log(value) / Math.log(10))) : 0;
}

/**
 * Return a number to a specified precision as a workaround for floating point funkiness.
 * @param value
 * @param precision
 * @returns {number}
 */
function valueWithPrecision(value, precision) {
  return +value.toFixed(precision);
}

/**
 * Return value more similar to the input value. If one handle, only return number value.
 * @param value
 * @param handleCount
 * @returns {*}
 */
function valueByHandleCount(value, handleCount) {
  if (handleCount === 1) {
    return value.min;
  }
  return value;
}

export default class Slider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      render: false,
      values: getValues(props.value),
      scale: d3Scale.scaleLinear()
        .clamp(true)
        .domain([props.minValue, props.maxValue]),
      snapTarget: {}
    };

    this.handleCount = Object.keys(this.state.values).length;

    bindAll(this, [
      'onHandleMove',
      'onHandleKeyDown',
      'onTrackClick',
      'renderHandle',
      'renderFill',
      'trackRef'
    ]);
  }

  componentDidMount() {
    this.receiveTrackWidth(this.props);
  }

  componentWillReceiveProps(newProps) {
    // If the extents or width changes, the scale and snapTarget must be recalculated.
    if ((this.props.minValue !== newProps.minValue) ||
        (this.props.maxValue !== newProps.maxValue) ||
        (this.props.step !== newProps.step)) {
      this.state.scale.domain([newProps.minValue, newProps.maxValue]);
      this.receiveTrackWidth(newProps);
    }

    this.setState({ values: getValues(newProps.value) });
  }

  componentDidUpdate(prevProps) {
    if (this.props.width !== prevProps.width) {
      this.receiveTrackWidth(this.props);
    }
  }

  onHandleMove(key, offset) {
    return (event) => {
      const value = valueWithPrecision(this.state.scale.invert(event.pageX + offset),
                                       this.precision);

      this.updateValueFromEvent(value, key);
    };
  }

  onHandleKeyDown(key) {
    return (event) => {
      let step;
      switch (event.keyCode) {
        case 37:
          step = -this.props.step;
          break;
        case 39:
          step = this.props.step;
          break;
        default:
          return;
      }

      event.stopPropagation();
      event.preventDefault();

      const value = valueWithPrecision(this.state.values[key] + step, this.precision);

      this.updateValueFromEvent(value, key);
    };
  }

  onTrackClick(event) {
    const { values } = this.state;

    const value = valueWithPrecision(this.state.scale.invert(event.snap.x), this.precision);

    /* Determine which handle is closer. 'min' == true, 'max' == false */
    const comp = values.max === undefined ||
      (Math.abs(values.min - value) < Math.abs(values.max - value) || values.min > value);

    const key = comp ? 'min' : 'max';

    this.updateValueFromEvent(value, key);
  }

  updateValueFromEvent(value, key) {
    if (value !== this.state.values[key] &&
        value >= this.props.minValue &&
        value <= this.props.maxValue) {
      const values = { ...this.state.values, [key]: value };

      if (values.max === undefined || values.min <= values.max) {
        this.props.onChange(valueByHandleCount({ ...values }, this.handleCount), key);
      }
    }
  }

  receiveTrackWidth(props) {
    this.precision = getFloatPrecision(props.step);
    this.setState({
      render: true,
      scale: this.state.scale.range([0, this._track.width]),
      snapTarget: { x: this._track.width / ((props.maxValue - props.minValue) / props.step) }
    });
  }

  trackRef(ref) {
    this._track = ref;
  }

  renderHandle() {
    const { values } = this.state;

    return map(values, (value, key) => {
      const direction = key === 'min' ? 'left' : 'right';

      return (
        <Handle
          key={ key }
          name={ key }
          direction={ direction }
          position={ this.state.scale(value) }
          onMove={ this.onHandleMove }
          onKeyDown={ this.onHandleKeyDown }
          label={ value }
          labelFunc={ this.props.labelFunc }
          snapTarget={ this.state.snapTarget }
          className={ classNames({ [style.connected]: values.min === values.max }) }
        />
      );
    });
  }

  renderFill() {
    const { values, scale } = this.state;

    return map(values, (value, key) => {
      const direction = key === 'min' ? 'left' : 'right';

      return (
        <Fill
          key={ key }
          direction={ direction }
          width={ scale(value) }
          fillStyle={ { backgroundColor: this.props.fillColor } }
        />
      );
    });
  }

  render() {
    const { height, width } = this.props;
    const { render } = this.state;

    return (
      <div
        className={ style.slider }
        style={ { height: `${height}px`, width: `${width}px` } }
      >
        <Track
          onClick={ this.onTrackClick }
          snapTarget={ this.state.snapTarget }
          ref={ this.trackRef }
        >
          { render && this.props.fill && this.renderFill() }
          { render && this.renderHandle() }
        </Track>
      </div>
    );
  }
}

Slider.propTypes = propTypes;

Slider.defaultProps = defaultProps;
