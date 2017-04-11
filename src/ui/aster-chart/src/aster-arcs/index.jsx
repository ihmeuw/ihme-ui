import React from 'react';
import { bindAll, noop } from 'lodash';

import {
  // CommonPropTypes,
  // propsChanged,
  PureComponent,
  // stateFromPropUpdates,
} from '../../../../utils';
import AsterArc from './aster-arc';

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
      arc,
      arcOutlineStroke,
      color,
      datum,
      styles,
    } = this.props;

    return (
      <g
        className={styles.arcGroup}
        onClick={this.onClick}
        onMouseLeave={this.onMouseLeave}
        onMouseMove={this.onMouseMove}
        onMouseOver={this.onMouseOver}
      >
        <AsterArc
          className={styles.underArc || 'underArc'}
          d={arc.outlineFunction(datum)}
        />
        <AsterArc
          className={styles.arc || 'arc'}
          d={arc.arcValueFunction(datum)}
          fill={color.colorScale(datum.data[color.colorProp])}
        />
        <AsterArc
          className={styles.overArc || 'overArc'}
          d={arc.outlineFunction(datum)}
          stroke={arcOutlineStroke}
        />
      </g>
    );
  }
}

AsterArcs.propTypes = {
  /**
   * arc object containing valueFunction, and outlineFunction
   */
  arc: React.PropTypes.shape({
    arcValueFunction: React.PropTypes.func,
    outlineFunction: React.PropTypes.func
  }).isRequired,

  /**
   * non-selected outline stroke color
   */
  arcOutlineStroke: React.PropTypes.string,

  /**
   * color object containing colorScale and colorProp
   * - property to use for color function
   * - function to determine color from propertay of data
   */
  color: React.PropTypes.shape({
    colorProp: React.PropTypes.string,
    colorScale: React.PropTypes.func,
  }).isRequired,

  /**
   * the data to be displayed by arc
   */
  datum: React.PropTypes.shape({
    endAngle: React.PropTypes.number,
    index: React.PropTypes.number,
    padAngle: React.PropTypes.number,
    startAngle: React.PropTypes.number,
    value: React.PropTypes.number,
    data: React.PropTypes.objectOf(React.PropTypes.string),
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
   * css classNames
   */
  styles: React.PropTypes.shape({
    arcGroup: React.PropTypes.string,
    outerArc: React.PropTypes.string,
    overArc: React.PropTypes.string,
  }).isRequired,
};

AsterArcs.defaultProps = {
  arcOutlineStroke: '#fff',
  onClick: noop,
  onMouseLeave: noop,
  onMouseMove: noop,
  onMouseOver: noop,
};
