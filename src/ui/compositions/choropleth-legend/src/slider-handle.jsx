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

  /* the height of element (path, line, rect) that the slider will sit atop, in px */
  height: PropTypes.number,

  /* position of handle along x-axis (in pixel space) */
  position: PropTypes.number,

  /* range extent value (in data space) */
  label: PropTypes.number,

  /* label format function; given props.label as argument; defaults to identity function */
  labelFormat: PropTypes.func,

  /* fn of signature function(mouse::clientX, whichHandle) */
  onSliderMove: PropTypes.func,

  /* used for keyboard interaction */
  onSliderKeyboardMove: PropTypes.func,

  which: PropTypes.oneOf(['x1', 'x2'])
};

const defaultProps = {
  ariaLabel: '',
  marginTop: 0,
  marginLeft: 0,
  position: 0,
  height: 15,
  label: null,
  labelFormat: (n) => n,
  which: 'x1'
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

    const sliderElement = document.querySelector(`#slider-${this.props.which}`);
    sliderElement.addEventListener('keydown', this.onSliderKeyDown);
  }

  componentWillUnmount() {
    this._interactable.unset();
  }

  onHandleMove(evt) {
    const { onSliderMove, which } = this.props;
    onSliderMove(evt.dx, which);
  }

  onSliderKeyDown(event) {
    event.stopImmediatePropagation();
    const { onSliderKeyboardMove, which } = this.props;
    if (event.code === 'ArrowRight'
      || event.code === 'ArrowDown'
      || event.code === 'ArrowLeft'
      || event.code === 'ArrowUp'
      || event.code === 'PageUp'
      || event.code === 'PageDown'
    ) {
      onSliderKeyboardMove(event.code, which);
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
    const { position, which, label, labelFormat, height } = this.props;
    const handleHeight = height + 5;

    return (
      <g
        aria-label={this.props.ariaLabel}
        className={classNames(style.handle)}
        id={`slider-${which}`}
        ref={this.storeReference}
        tabIndex={0}
        onKeyDown={this.onSliderKeyDown}
      >
        <rect
          transform={`translate(${which === 'x1' ? -5 : 0}, -2.5)`}
          x={`${position}px`}
          height={`${handleHeight}px`}
          stroke="none"
          fill="#000"
          width="5px"
        >
        </rect>
        <SvgText
          value={labelFormat(label)}
          anchor={which === 'x1' ? 'end' : 'start'}
          x={position}
          dx={which === 'x1' ? -8 : 8}
          y={14}
        />
      </g>
    );
  }
}

SliderHandle.propTypes = propTypes;
SliderHandle.defaultProps = defaultProps;
