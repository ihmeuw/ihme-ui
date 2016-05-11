import React, { PropTypes } from 'react';
import classNames from 'classnames';
import d3Scale from 'd3-scale';
import { bindAll, identity, map } from 'lodash';

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

  /**
   * Initial selected value.
   * If number, a single slider handle will be rendered.
   * If object with keys 'min' and 'max', two slider handles will be rendered.
   */
  value: PropTypes.oneOfType([
    PropTypes.number,
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
  labelFunc: identity,
  fill: false,
  fillColor: '#ccc'
};

function getValues(value) {
  if (typeof value === 'number') {
    return { max: value };
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

    bindAll(this, [
      'onHandleMove',
      'onTrackClick',
      'renderHandle',
      'renderFill',
      'receiveTrackWidth'
    ]);
  }

  componentWillReceiveProps(newProps) {
    if ((this.props.minValue !== newProps.minValue) ||
      (this.props.maxValue !== newProps.maxValue)) {
      this.state.scale.domain([newProps.minValue, newProps.maxValue]);
    }

    this.setState({
      ...this.state,
      values: getValues(newProps.value)
    });
  }

  onHandleMove(key, offset) {
    return (event) => {
      const value = this.state.scale.invert(event.pageX + offset);

      if (this.state.values[key] !== value) {
        const values = { ...this.state.values, [key]: value };

        if (values.min === undefined || values.min <= values.max) {
          this.props.onChange({ ...values }, key);
        }
      }
    };
  }

  onTrackClick(event) {
    const { values } = this.state;

    const value = this.state.scale.invert(event.snap.x);

    /* Determine which handle is closer. 'min' == true, 'max' == false */
    const comp = values.min !== undefined &&
      (Math.abs(values.min - value) < Math.abs(values.max - value) || values.min > value);

    const key = comp ? 'min' : 'max';

    if (values[key] !== value) {
      this.props.onChange({ ...values, [key]: value }, key);
    }
  }

  receiveTrackWidth(ref) {
    const width = ref.width;

    this.setState({
      ...this.state,
      render: true,
      scale: this.state.scale
        .range([0, width]),
      snapTarget: { x: width / (this.props.maxValue - this.props.minValue) }
    });
  }

  renderHandle() {
    const { values } = this.state;

    return map(values, (value, key) => {
      let direction = 'left';
      if (key === 'max' && 'min' in values) {
        direction = 'right';
      }

      return (
        <Handle
          key={ key }
          name={ key }
          direction={ direction }
          position={ this.state.scale(value) }
          onMove={ this.onHandleMove }
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
      let direction = 'left';
      if (key === 'max' && 'min' in values) {
        direction = 'right';
      }

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
          ref={ this.receiveTrackWidth }
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
