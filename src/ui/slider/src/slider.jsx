import React, { PropTypes } from 'react';
import d3Scale from 'd3-scale';
import interact from 'interact.js';
import { assignIn, bindAll } from 'lodash';

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
  onChange: PropTypes.func.isRequired
};

const defaultProps = {
  height: 24,
  width: 200
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
      .domain([this.props.minValue, this.props.maxValue]);

    bindAll(this, [
      'onHandleMove',
      'onHandleEnd',
      'renderHandle',
      'bindInteract'
    ]);
  }

  onHandleEnd(event) {
    const key = event.target.getAttribute('handleId');

    this.props.onChange(key, this.state.values[key]);
  }

  onHandleMove(offset) {
    return (event) => {
      const key = event.target.getAttribute('handleId');
      const value = this.scale.invert((event.pageX + offset) / this.props.width);

      if (this.state.values[key] !== value) {
        const values = { ...this.state.values, [key]: value };

        if (values.min === undefined || values.min <= values.max) {
          this.setState({ values });
        }
      }
    };
  }

  bindInteract(ref) {
    const { width, minValue, maxValue } = this.props;
    const { offset } = ref;

    ref.refs.handle.setAttribute('handleId', ref.props.name);

    interact(ref.refs.handle)
      .origin('parent')
      .draggable({
        max: Infinity,
        snap: {
          targets: [
            interact.createSnapGrid({
              x: width / (maxValue - minValue),
              offset: { x: offset },
              range: Infinity
            })
          ]
        }
      })
      .styleCursor(false)
      .on('dragmove', this.onHandleMove(-offset))
      .on('dragend', this.onHandleEnd);
  }

  renderHandle() {
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
          direction={ direction }
          percentage={ this.scale(values[key]) }
          onMove={ this.onHandleMove }
          name={ key }
          text={ values[key] }
          ref={ this.bindInteract }
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
