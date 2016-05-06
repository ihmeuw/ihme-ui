import React, { PropTypes } from 'react';
import d3Scale from 'd3-scale';
import interact from 'interact.js';
import { assignIn } from 'lodash';

import Track from './track';
import Handle from './handle';

import style from './style.css';

const propTypes = {
  height: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  width: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
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

function getDimension(dim) {
  if (typeof dim === 'string') {
    return dim;
  }
  return `${dim}px`;
}

function calcPercentageFromValue(value, minValue, maxValue) {
  return (value - minValue) / (maxValue - minValue);
}

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

    this.scale1 = d3Scale.scaleLinear()
      .clamp(true)
      .domain([this.props.minValue, this.props.maxValue]);

    this.scale = d3Scale.scaleLinear()
      .clamp(true)
      .range([this.props.minValue, this.props.maxValue]);

    this.onHandleMove = this.onHandleMove.bind(this);
    this.onHandleEnd = this.onHandleEnd.bind(this);
    this.renderHandle = this.renderHandle.bind(this);
    this.setWidthFromRef = this.setWidthFromRef.bind(this);
    this.bindInteract = this.bindInteract.bind(this);
  }

  onHandleEnd(event) {
    const key = event.target.getAttribute('handleId');

    this.props.onChange(key, this.state.values[key]);
  }

  onHandleMove(offset) {
    return (event) => {
      const key = event.target.getAttribute('handleId');
      const value = this.scale(event.snap.x + offset);

      if (this.state.values[key] !== value) {
        const values = { ...this.state.values, [key]: value };

        if (values.min === undefined || values.min <= values.max) {
          this.setState({ values });
        }
      }
    };
  }

  setWidthFromRef(ref) {
    const { clientRect: { width } } = ref;

    this.width = width;
    this.scale.domain([0, width]);
  }

  bindInteract(ref) {
    const { minValue, maxValue } = this.props;
    const { offset } = ref;

    ref.refs.handle.setAttribute('handleId', ref.props.name);

    interact(ref.refs.handle)
      .origin('parent')
      .draggable({
        max: Infinity,
        snap: {
          targets: [
            interact.createSnapGrid({
              x: this.width / (maxValue - minValue),
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
    const { minValue, maxValue } = this.props;
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
          percentage={ calcPercentageFromValue(values[key], minValue, maxValue) }
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
        style={ { height: getDimension(height), width: getDimension(width) } }
      >
        <Track ref={ this.setWidthFromRef } />
        { this.renderHandle() }
      </div>
    );
  }
}

Slider.propTypes = propTypes;

Slider.defaultProps = defaultProps;
