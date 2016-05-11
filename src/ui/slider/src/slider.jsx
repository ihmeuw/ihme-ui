import React, { PropTypes } from 'react';
import d3Scale from 'd3-scale';
import { bindAll, identity, map } from 'lodash';

import Track from './track';
import Handle from './handle';

import style from './style.css';

const propTypes = {
  /** Height and width of Slider component */
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
  labelFunc: identity
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
      values: getValues(props.value),
      scale: d3Scale.scaleLinear()
        .clamp(true)
        .domain([props.minValue, props.maxValue])
        .range([0, props.width]),
      snapTarget: { x: props.width / (props.maxValue - props.minValue) }
    };

    bindAll(this, [
      'onHandleMove',
      'onTrackClick',
      'renderHandle'
    ]);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      values: getValues(newProps.value),
      scale: this.state.scale
        .domain([newProps.minValue, newProps.maxValue])
        .range([0, newProps.width]),
      snapTarget: { x: newProps.width / (newProps.maxValue - newProps.minValue) }
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

  renderHandle() {
    const { values } = this.state;

    return map(values, (value, key) => {
      let direction = 'middle';
      if (key === 'max' && 'min' in values) {
        direction = 'right';
      } else if (key === 'min') {
        direction = 'left';
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
        />
      );
    });
  }

  render() {
    const { height, width } = this.props;

    return (
      <div
        className={ style.slider }
        style={ { height: `${height}px`, width: `${width}px` } }
      >
        <Track
          onClick={ this.onTrackClick }
          snapTarget={ this.state.snapTarget }
        />
        { this.renderHandle() }
      </div>
    );
  }
}

Slider.propTypes = propTypes;

Slider.defaultProps = defaultProps;
