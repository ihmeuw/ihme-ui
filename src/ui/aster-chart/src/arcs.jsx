import React from 'react';
import { bindAll, noop } from 'lodash';

import { CommonPropTypes, PureComponent } from '../../../utils';
import AsterArc from './arc';

export default class AsterArcs extends PureComponent {
  constructor(props) {
    super(props);

    bindAll(this, [
      'onClick',
      'onMouseMove',
      'onMouseLeave',
      'onMouseOver'
    ]);
  }

  // e.g., select the arc
  onClick(e) {
    e.preventDefault();

    this.props.onClick(e, this.props.datum, this);
  }

  // e.g., destroy tooltip
  onMouseLeave(e) {
    e.preventDefault();

    this.props.onMouseLeave(e, this.props.datum, this);
  }

  // e.g., position tooltip
  onMouseMove(e) {
    e.preventDefault();

    this.props.onMouseMove(e, this.props.datum, this);
  }

  // e.g., init tooltip
  onMouseOver(e) {
    e.preventDefault();

    this.props.onMouseOver(e, this.props.datum, this);
  }

  render() {
    const {
      arcValueFunction,
      arcOutlineStroke,
      classNameArcGroup,
      classNameOver,
      classNameUnder,
      color,
      datum,
      outlineFunction,
      styles,
    } = this.props;

    return (
      <g
        className={classNameArcGroup}
        onClick={this.onClick}
        onMouseLeave={this.onMouseLeave}
        onMouseMove={this.onMouseMove}
        onMouseOver={this.onMouseOver}
        style={styles}
      >
        <AsterArc
          className={classNameUnder}
          d={outlineFunction(datum)}
        />
        <AsterArc
          d={arcValueFunction(datum)}
          fill={color.colorScale(datum.data[color.colorProp])}
        />
        <AsterArc
          className={classNameOver}
          d={outlineFunction(datum)}
          stroke={arcOutlineStroke}
        />
      </g>
    );
  }
}

AsterArcs.propTypes = {
  /**
   * non-selected outline stroke color
   */
  arcOutlineStroke: React.PropTypes.string,

  /**
   * name of css class for the group of arcs
   */
  classNameArcGroup: CommonPropTypes.className,

  /**
   * name of css class for the over arcs
   */
  classNameOver: CommonPropTypes.className,

  /**
   * name of css class for the under arcs
   */
  classNameUnder: CommonPropTypes.className,

  /**
   * - prop in data that maps to colorScale
   */
  colorProp: CommonPropTypes.dataAccessor.isRequired,

  /**
   * - scale function used with colorProp to determine appropriate color
   */
  colorScale: React.PropTypes.func.isRequired,

  /**
   * the data to be displayed by arc
   */
  datum: React.PropTypes.shape({
    endAngle: React.PropTypes.number,
    index: React.PropTypes.number,
    padAngle: React.PropTypes.number,
    startAngle: React.PropTypes.number,
    value: React.PropTypes.number,
    data: React.PropTypes.objectOf(
      React.PropTypes.oneOf([
        React.PropTypes.string,
        React.PropTypes.number,
      ])
    ).isRequired,
  }).isRequired,

  /**
   * event handler callback for onClick
   */
  onClick: React.PropTypes.func,

  /**
   * event handler callback for onMouseLeave
   */
  onMouseLeave: React.PropTypes.func,

  /**
   * event handler callback for onMouseMove
   */
  onMouseMove: React.PropTypes.func,

  /**
   * event handler callback for onMouseOver
   */
  onMouseOver: React.PropTypes.func,

  /**
   * css styles
   */
  styles: CommonPropTypes.style,
};

AsterArcs.defaultProps = {
  arcOutlineStroke: '#fff',
  onClick: noop,
  onMouseLeave: noop,
  onMouseMove: noop,
  onMouseOver: noop,
};
