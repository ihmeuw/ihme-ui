import React, { PropTypes } from 'react';
import d3Scale from 'd3-scale';
import { assignIn, bindAll, identity } from 'lodash';

import Track from './track';
import Handle from './handle';

import style from './style.css';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  minValue: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number
    })
  ]).isRequired,
  labelFunc: PropTypes.func,
  onChange: PropTypes.func.isRequired
};

const defaultProps = {
  height: 24,
  width: 200,
  labelFunc: identity
};

export default class Slider extends React.Component {
  constructor(props) {
    super(props);

    const values = {};
    if (typeof props.value === 'number') {
      assignIn(values, { max: props.value });
    } else {
      assignIn(values, props.value);
    }

    this.state = {
      values
    };

    this.scale = d3Scale.scaleLinear()
      .clamp(true)
      .domain([this.props.minValue, this.props.maxValue])
      .range([0, this.props.width]);

    bindAll(this, [
      'onHandleMove',
      'onHandleEnd',
      'renderHandle'
    ]);
  }

  onHandleEnd(key) {
    return () => {
      this.props.onChange(key, this.state.values[key]);
    };
  }

  onHandleMove(key, offset) {
    return (event) => {
      const value = this.scale.invert(event.pageX + offset);

      if (this.state.values[key] !== value) {
        const values = { ...this.state.values, [key]: value };

        if (values.min === undefined || values.min <= values.max) {
          this.setState({ values });
        }
      }
    };
  }

  renderHandle() {
    const { width, maxValue, minValue } = this.props;
    const { values } = this.state;

    const keys = Object.keys(this.state.values);

    return keys.map((key) => {
      let direction;
      if (keys.length === 1) {
        direction = 'middle';
      } else if (key === 'min') {
        direction = 'left';
      } else if (key === 'max') {
        direction = 'right';
      }

      return (
        <Handle
          key={ key }
          name={ key }
          direction={ direction }
          position={ this.scale(values[key]) }
          onMove={ this.onHandleMove }
          onEnd={ this.onHandleEnd }
          label={ values[key] }
          labelFunc={ this.props.labelFunc }
          snapTarget={ { x: width / (maxValue - minValue) } }
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
        <Track />
        { this.renderHandle() }
      </div>
    );
  }
}

Slider.propTypes = propTypes;

Slider.defaultProps = defaultProps;
