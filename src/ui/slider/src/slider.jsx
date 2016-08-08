import React, { PropTypes } from 'react';
import classNames from 'classnames';
import d3Scale from 'd3-scale';
import bindAll from 'lodash/bindAll';
import identity from 'lodash/identity';
import inRange from 'lodash/inRange';
import map from 'lodash/map';
import range from 'lodash/range';
import reduce from 'lodash/reduce';
import round from 'lodash/round';
import zipObject from 'lodash/zipObject';
import { CommonPropTypes, PureComponent } from '../../../utils';
import { stateFromPropUpdates, updateFunc } from '../../../utils/props';

import Track from './track';
import Fill from './fill';
import Handle from './handle';
import ResponsiveContainer from '../../responsive-container';
import style from './style.css';

/**
 * Return object of indexes for 'low' and 'high' values
 * @param values
 * @param rangeList
 * @return {Object}
 */
function getIndexesForValues(values, rangeList) {
  return reduce(values, (acc, value, key) => {
    /* eslint-disable no-nested-ternary */
    // if value is not in the range list, assign either first or last element, depending on key
    const index = rangeList.indexOf(value);
    return {
      ...acc,
      [key]: index !== -1 ?
               index : key === 'low' ? 0 : rangeList.length - 1,
    };
    /* eslint-enable no-nested-ternary */
  }, {});
}

/**
 * Return object of values for 'low' and 'high' indexes
 * @param indexes
 * @param rangeList
 * @return {Object}
 */
function getValuesForIndexes(indexes, rangeList) {
  return reduce(indexes, (acc, value, key) => {
    return {
      ...acc,
      [key]: rangeList[value],
    };
  }, {});
}

/**
 * Evaluate value param and return a compatible object with keys 'low' and 'high'.
 * @param value
 * @returns {Object}
 */
function getLowHighValues(value) {
  if (Array.isArray(value)) {
    return zipObject(['low', 'high'], value);
  } else if (typeof value === 'object') {
    return value;
  }
  return { low: value };
}

/**
 * Return value more similar to the input value. If one handle, only return number value.
 * @param value
 * @param handleCount
 * @returns {*}
 */
function valueByHandleCount(value, handleCount) {
  if (handleCount === 1) {
    return value.low;
  }
  return value;
}

export default class Slider extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ...stateFromPropUpdates(Slider.propUpdates, {}, props, { scale: d3Scale.scaleLinear() }),
      render: false,
      snapTarget: {},
    };

    this.handleCount = Object.keys(this.state.indexes).length;

    bindAll(this, [
      'onHandleMove',
      'onHandleKeyDown',
      'onTrackClick',
      'trackRef',
      'doSetState',
    ]);
  }

  componentDidMount() {
    this.doSetState(this.receiveTrackWidth(this.state));
  }

  componentWillReceiveProps(nextProps) {
    let state = {
      range: this.state.range,
      scale: this.state.scale,
    };

    state = stateFromPropUpdates(Slider.propUpdates, this.props, nextProps, state);

    // If the extents or width changes, the scale and snapTarget must be recalculated.
    if (this.props.range !== nextProps.range) {
      state = this.receiveTrackWidth(state);
    }

    this.setState(state);
  }

  componentDidUpdate(prevProps) {
    if (this.props.width !== prevProps.width) {
      this.doSetState(this.receiveTrackWidth(this.state));
    }
  }

  onHandleMove(key, offset) {
    return (event) => {
      if (!event.dx) return;

      const { pageX, dx } = event;
      const { scale, indexes } = this.state;

      // Calculate next position, handle extent, and index value
      const nextPos = scale(indexes[key]) + dx;
      const handleExtent = nextPos - (offset * 2);
      const index = round(scale.invert(nextPos));

      // Check that the mouse X pos is within the handle extent,
      // and that the computed value is in the range list
      if (!inRange(pageX - handleExtent, nextPos - handleExtent) ||
            !this.state.range[index]) return;

      this.updateValueFromEvent(index, key);
    };
  }

  onHandleKeyDown(key) {
    return (event) => {
      let step;
      switch (event.keyCode) {
        case 37:
          step = -1;
          break;
        case 39:
          step = 1;
          break;
        default:
          return;
      }

      event.stopPropagation();
      event.preventDefault();

      const index = this.state.indexes[key] + step;

      this.updateValueFromEvent(index, key);
    };
  }

  onTrackClick(event) {
    const { scale, indexes } = this.state;

    const index = round(scale.invert(event.snap.x));

    /* Determine which handle is closer. 'low' == true, 'high' == false */
    const comp = indexes.high === undefined ||
      (Math.abs(indexes.low - index) < Math.abs(indexes.high - index) || indexes.low > index);

    const key = comp ? 'low' : 'high';

    this.updateValueFromEvent(index, key);
  }

  updateValueFromEvent(index, key) {
    if (index !== this.state.indexes[key] && this.state.range[index]) {
      const values = getValuesForIndexes({ ...this.state.indexes, [key]: index }, this.state.range);

      if (values.high === undefined || values.low <= values.high) {
        this.props.onChange(valueByHandleCount({ ...values }, this.handleCount), key);
      }
    }
  }

  receiveTrackWidth(state) {
    return {
      ...state,
      render: true,
      scale: state.scale.range([0, this._track.width]),
      snapTarget: { x: this._track.width / (state.range.length - 1) },
    };
  }

  doSetState(state) {
    this.setState(state);
  }

  trackRef(ref) {
    this._track = ref;
  }

  renderFill() {
    if (!this.state.render || !this.props.fill) return null;

    const { indexes, scale } = this.state;
    const { fillStyle, fillClassName } = this.props;

    return map(indexes, (index, key) => {
      const direction = key === 'low' ? 'left' : 'right';
      const position = scale(index);
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

    const { indexes, scale, snapTarget } = this.state;
    const { labelFunc, handleClassName, handleStyle } = this.props;

    return (
      <div className={style['handle-track']}>
        <div className={style['flag-base']}></div>
        {map(indexes, (index, key) => {
          const direction = key === 'low' ? 'left' : 'right';
          const position = scale(index);
          return (
            <ResponsiveContainer
              key={`handle:${key}`}
            >
              <Handle
                className={classNames(handleClassName,
                                      { [style.connected]: indexes.low === indexes.high })}
                style={handleStyle}
                onMove={this.onHandleMove}
                onKeyDown={this.onHandleKeyDown}
                name={key}
                direction={direction}
                position={position}
                label={this.state.range[index]}
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
    const { fontSize, width, wrapperClassName, wrapperStyle, ticks } = this.props;
    const { snapTarget } = this.state;

    const wrapperStyles = {
      fontSize: `${fontSize}`,
      width: `${width}px`,
      ...wrapperStyle,
    };

    return (
      <div
        className={classNames(style.slider, wrapperClassName)}
        style={wrapperStyles}
      >
        {this.renderHandles()}
        <Track
          ref={this.trackRef}
          className={this.props.trackClassName}
          style={this.props.trackStyle}
          onClick={this.onTrackClick}
          snapTarget={snapTarget}
          ticks={ticks}
          ticksClassName={this.props.ticksClassName}
          ticksStyle={this.props.ticksStyle}
          tickClassName={this.props.tickClassName}
          tickStyle={this.props.tickStyle}
        >
          {this.renderFill()}
        </Track>
      </div>
    );
  }
}

Slider.propTypes = {
  /* class name styles applied to outermost wrapper */
  wrapperClassName: CommonPropTypes.className,
  wrapperStyle: PropTypes.object,

  fontSize: PropTypes.string,

  /* width and height of Slider component. */
  width: PropTypes.number,

  /* extents of slider values. */
  range: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.shape({
      low: PropTypes.number,
      high: PropTypes.number,
      steps: PropTypes.number,
      precision: PropTypes.number,
    }),
  ]).isRequired,

  /*
   * Initial selected value.
   * If number, a single slider handle will be rendered.
   * If object with keys 'low' and 'high', two slider handles will be rendered.
   */
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.array,
    PropTypes.shape({
      low: PropTypes.number,
      high: PropTypes.number,
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

  handleClassName: CommonPropTypes.className,
  handleStyle: PropTypes.object,

  trackClassName: CommonPropTypes.className,
  trackStyle: PropTypes.object,

  /* include fill in the track to indicate value. */
  fill: PropTypes.bool,
  fillClassName: CommonPropTypes.className,
  fillStyle: PropTypes.object,

  /* show ticks in track */
  ticks: PropTypes.bool,
  ticksClassName: CommonPropTypes.className,
  ticksStyle: PropTypes.object,
  /* class name and style for each tick */
  tickClassName: CommonPropTypes.className,
  tickStyle: PropTypes.object,

  /*
   * callback function when value is changed.
   * Params:
   *   value - object with keys ['low'] and 'high'
   *   key - key of most recent value change.
   */
  onChange: PropTypes.func.isRequired,
};

Slider.defaultProps = {
  width: 200,
  labelFunc: identity,
};

Slider.propUpdates = {
  range: updateFunc((nextProp, propName, nextProps, state) => {
    let nextRange = nextProp;

    if (!Array.isArray(nextProp)) {
      const delta = nextProp.high - nextProp.low;
      const steps = nextProp.steps || delta + 1;
      nextRange = range(steps).map(
        (d) => round(d * delta / (steps - 1) + nextProp.low, nextProp.precision)
      );
    }

    return {
      range: nextRange,
      scale: state.scale.domain([0, nextRange.length - 1]),
    };
  }),
  value: updateFunc((nextProp, propName, nextProps, state) => {
    return { indexes: getIndexesForValues(getLowHighValues(nextProp), state.range) };
  }),
  width: updateFunc(() => {
    return { render: false };
  }),
};
