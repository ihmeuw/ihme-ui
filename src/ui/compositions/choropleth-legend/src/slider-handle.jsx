import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import interact from 'interact.js';
import SvgText from '../../../svg-text';

import style from './slider-handle.css';

const propTypes = {
  ariaLabel: PropTypes.string,
  /* top margin applied within svg document handle is placed within; used to calc origin offset */
  marginTop: PropTypes.number,

  /* left margin applied within svg document handle is placed within; used to calc origin offset */
  marginLeft: PropTypes.number,

  minValue: PropTypes.number,
  maxValue: PropTypes.number,

  /* the height of element (path, line, rect) that the slider will sit atop, in px */
  height: PropTypes.number,

  /* position of handle along x-axis (in pixel space) */
  position: PropTypes.number,

  /* range extent value (in data space) */
  label: PropTypes.number,

  /* label format function; given props.label as argument; defaults to identity function */
  labelFormat: PropTypes.func,

  /* fn of signature function(mouse::clientX, whichSliderHandle) */
  onSliderMove: PropTypes.func,

  /* used for keyboard interaction */
  onSliderKeyboardMove: PropTypes.func,

  whichSliderHandle: PropTypes.oneOf(['x1', 'x2'])
};

const defaultProps = {
  ariaLabel: '',
  marginTop: 0,
  marginLeft: 0,
  minValue: 0,
  maxValue: 1,
  position: 0,
  height: 15,
  label: null,
  labelFormat: (n) => n,
  whichSliderHandle: 'x1'
};

export default class SliderHandle extends React.Component {
  constructor(props) {
    super(props);

    this.storeReference = this.storeReference.bind(this);
    this.onHandleMove = this.onHandleMove.bind(this);
    this.onSliderKeyDown = this.onSliderKeyDown.bind(this);
  }

  componentDidMount() {
    this.bindInteract(this._handle);
    this._handle.addEventListener('keydown', this.onSliderKeyDown);
  }

  componentWillUnmount() {
    this._interactable.unset();
  }

  onHandleMove(evt) {
    const { onSliderMove, whichSliderHandle } = this.props;
    onSliderMove(evt.dx, whichSliderHandle);
  }

  onSliderKeyDown(event) {
    event.stopImmediatePropagation();
    const { onSliderKeyboardMove, whichSliderHandle } = this.props;
    if (event.code === 'ArrowRight'
      || event.code === 'ArrowDown'
      || event.code === 'ArrowLeft'
      || event.code === 'ArrowUp'
      || event.code === 'PageUp'
      || event.code === 'PageDown'
    ) {
      onSliderKeyboardMove(event.code, whichSliderHandle);
    }
  }

  storeReference(el) {
    this._handle = el;
  }

  bindInteract(el) {
    const { marginTop, marginLeft } = this.props;
    this._interactable = interact(el)
      .origin({ x: marginLeft + el.getBoundingClientRect().width, y: marginTop })
      .draggable({
        max: Infinity
      })
      .preventDefault('always')
      .styleCursor(false)
      .on('dragmove', this.onHandleMove);
  }

  render() {
    const { position, whichSliderHandle, label, maxValue, minValue, labelFormat, height } = this.props;
    const handleHeight = height + 5;
    return (
      <g
        aria-label={this.props.ariaLabel}
        aria-valuemin={minValue}
        aria-valuenow={label}
        aria-valuetext={labelFormat(label)}
        aria-valuemax={maxValue}
        className={classNames(style.handle)}
        id={`slider-${whichSliderHandle}`}
        role="slider"
        ref={this.storeReference}
        tabIndex={0}
        onKeyDown={this.onSliderKeyDown}
      >
        <rect
          transform={`translate(${whichSliderHandle === 'x1' ? -5 : 0}, -2.5)`}
          x={`${position}px`}
          height={`${handleHeight}px`}
          stroke="none"
          fill="#000"
          width="5px"
        >
        </rect>
        <SvgText
          value={labelFormat(label)}
          anchor={whichSliderHandle === 'x1' ? 'end' : 'start'}
          x={position}
          dx={whichSliderHandle === 'x1' ? -8 : 8}
          y={14}
        />
      </g>
    );
  }
}

SliderHandle.propTypes = propTypes;
SliderHandle.defaultProps = defaultProps;
