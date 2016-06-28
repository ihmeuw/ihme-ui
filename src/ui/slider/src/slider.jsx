import React, { PropTypes } from 'react';
import classNames from 'classnames';
import d3Scale from 'd3-scale';
import { bindAll, identity, map, zipObject } from 'lodash';
import { CommonPropTypes, PureComponent, ensureWithinRange } from '../../../utils';

import Track from './track';
import Fill from './fill';
import Handle from './handle';
import ResponsiveContainer from '../../responsive-container';
import { getFloatPrecision, valueWithPrecision, stateFromPropUpdates, updateFunc } from './util';
import style from './style.css';

/**
 * Evaluate value and return a compatible object with keys 'min' and 'max'.
 * @param value
 * @returns {Object}
 */
function getMinMaxValues(value) {
  if (typeof value === 'number') {
    return { min: value };
  } else if (Array.isArray(value)) {
    return zipObject(['min', 'max'], value);
  }
  return value;
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

export default class Slider extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      render: false,
      values: getMinMaxValues(props.value),
      scale: d3Scale.scaleLinear()
        .clamp(true)
        .domain([props.minValue, props.maxValue]),
      snapTarget: {},
    };

    this.handleCount = Object.keys(this.state.values).length;

    bindAll(this, [
      'onHandleMove',
      'onHandleKeyDown',
      'onTrackClick',
      'trackRef',
    ]);
  }

  componentDidMount() {
    this.receiveTrackWidth(this.props);
  }

  componentWillReceiveProps(newProps) {
    const state = {};

    // If the extents or width changes, the scale and snapTarget must be recalculated.
    if ((this.props.minValue !== newProps.minValue) ||
        (this.props.maxValue !== newProps.maxValue) ||
        (this.props.step !== newProps.step)) {
      this.state.scale.domain([newProps.minValue, newProps.maxValue]);
      this.receiveTrackWidth(newProps);
    }

    this.setState(stateFromPropUpdates(Slider.propUpdates, this.props, newProps, state));
  }

  componentDidUpdate(prevProps) {
    if (this.props.width !== prevProps.width) {
      this.receiveTrackWidth(this.props);
    }
  }

  onHandleMove(key, offset) {
    return (event) => {
      if (!event.dx) return;

      const { pageX, dx } = event;
      const { scale, values } = this.state;

      const nextPos = scale(values[key]) + dx;
      if (!(ensureWithinRange(pageX, [nextPos - (offset * 2), nextPos]) === pageX)) return;

      const value = valueWithPrecision(scale.invert(nextPos), this.precision);

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
      snapTarget: { x: this._track.width / ((props.maxValue - props.minValue) / props.step) },
    });
  }

  trackRef(ref) {
    this._track = ref;
  }

  renderFill() {
    if (!this.state.render || !this.props.fill) return null;

    const { values, scale } = this.state;
    const { fillStyle, fillClassName } = this.props;

    return map(values, (value, key) => {
      const direction = key === 'min' ? 'left' : 'right';
      const position = scale(value);
      return (
        <Fill
          key={`fill:${key}`}
          className={fillClassName}
          style={fillStyle}
          direction={direction}
          width={position}
        />
      );
    });
  }

  renderHandles() {
    if (!this.state.render) return null;

    const { values, scale, snapTarget } = this.state;
    const { labelFunc } = this.props;

    return (
      <div className={style['handle-track']}>
        <div className={style['flag-base']}></div>
        {map(values, (value, key) => {
          const direction = key === 'min' ? 'left' : 'right';
          const position = scale(value);
          return (
            <ResponsiveContainer
              key={`handle:${key}`}
            >
              <Handle
                className={classNames({ [style.connected]: values.min === values.max })}
                onMove={this.onHandleMove}
                onKeyDown={this.onHandleKeyDown}
                name={key}
                direction={direction}
                position={position}
                label={value}
                labelFunc={labelFunc}
                snapTarget={snapTarget}
              />
            </ResponsiveContainer>
          );
        })}
      </div>
    );
  }

  render() {
    const { fontSize, width, wrapperStyle, wrapperClassName, ticks } = this.props;
    const { snapTarget } = this.state;

    const styles = {
      fontSize: `${fontSize}`,
      width: `${width}px`,
      ...wrapperStyle,
    };

    return (
      <div
        className={classNames(style.slider, wrapperClassName)}
        style={styles}
      >
        {this.renderHandles()}
        <Track
          ref={this.trackRef}
          onClick={this.onTrackClick}
          snapTarget={snapTarget}
          ticks={ticks}
          ticksClassName={this.props.ticksClassName}
          ticksStyle={this.props.ticksStyle}
        >
          {this.renderFill()}
        </Track>
      </div>
    );
  }
}

Slider.propTypes = {
  fontSize: PropTypes.string,

  /* width and height of Slider component. */
  width: PropTypes.number,

  /* extents of slider values. */
  minValue: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,

  /* step between slider values. */
  step: PropTypes.number,

  /* class name styles applied to outermost wrapper */
  wrapperClassName: CommonPropTypes.className,
  wrapperStyle: PropTypes.object,

  /*
   * Initial selected value.
   * If number, a single slider handle will be rendered.
   * If object with keys 'min' and 'max', two slider handles will be rendered.
   */
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.array,
    PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
    }),
  ]).isRequired,

  /*
   * function applied to the selected value prior to rendering.
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

  /* include fill in the track to indicate value. */
  fill: PropTypes.bool,
  fillClassName: CommonPropTypes.className,
  fillStyle: PropTypes.object,

  /* show ticks in track */
  ticks: PropTypes.bool,
  ticksClassName: CommonPropTypes.className,
  ticksStyle: PropTypes.object,

  /*
   * callback function when value is changed.
   * Params:
   *   value - object with keys ['min'] and 'max'
   *   key - key of most recent value change.
   */
  onChange: PropTypes.func.isRequired,
};

Slider.defaultProps = {
  width: 200,
  step: 1,
  labelFunc: identity,
};

Slider.propUpdates = {
  value: updateFunc((nextProp) => {
    return { values: getMinMaxValues(nextProp) };
  }),
};
