import React from 'react';
import classNames from 'classnames';

import {
  bindAll,
  includes,
  map,
  noop,
} from 'lodash';

import {
  CommonPropTypes,
  propResolver,
  PureComponent,
} from '../../../utils';
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
      classNameArc,
      classNameArcGroup,
      classNameOver,
      classNameSelectedArcs,
      classNameUnder,
      colorField,
      colorScale,
      datum,
      keyField,
      outlineFunction,
      selectedArcs,
      underArcStyle,
    } = this.props;

    return (
      <g
        className={classNames(classNameArcGroup)}
        onClick={this.onClick}
        onMouseLeave={this.onMouseLeave}
        onMouseMove={this.onMouseMove}
        onMouseOver={this.onMouseOver}
      >
        <AsterArc
          className={classNames(classNameUnder)}
          d={outlineFunction(datum)}
          datum={datum}
          style={underArcStyle} // template to follow for style
        />
        <AsterArc
          className={classNames(classNameArc)}
          d={arcValueFunction(datum)}
          datum={datum}
          fill={colorScale(propResolver(datum.data, colorField))}
        />
        <AsterArc
          className={
            (includes(map(selectedArcs, selected =>
              propResolver(selected.data, keyField)), propResolver(datum.data, keyField)))
              ? classNames(classNameSelectedArcs)
              : classNames(classNameOver)
          }
          d={outlineFunction(datum)}
          datum={datum}
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
  colorKey: CommonPropTypes.dataAccessor.isRequired,

  /**
   * - scale function used with colorProp to determine appropriate color
   */
  colorScale: React.PropTypes.func.isRequired,

  /**
   * the data to be displayed by 'arc'. 'endAngle', 'index', 'padAngle', 'startAngle', 'value' are
   * determined by the d3.pie()function applied automatically by the aster-chart class.  The d3.pie()
   * function also holds a reference to the original 'data' used to make the datum object.  The only
   * field necessary in data is whichever property the colorKey was chosen.
   */
  datum: React.PropTypes.shape({
    data: React.PropTypes.objectOf(
      React.PropTypes.oneOf([
        React.PropTypes.string,
        React.PropTypes.number,
      ])
    ).isRequired,
    endAngle: React.PropTypes.number.isRequired,
    index: React.PropTypes.number.isRequired,
    padAngle: React.PropTypes.number.isRequired,
    startAngle: React.PropTypes.number.isRequired,
    value: React.PropTypes.number.isRequired,
  }).isRequired,

  /**
   * unique key of datum (if originally a function, string should be interpolated by parent)
   */
  keyField: React.PropTypes.oneOfType([
    React.PropTypes.string,
  ]).isRequired,

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
   * an array of the selected arcs key ids
   */
  selectedArcs: React.PropTypes.arrayOf(
    React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ])
  ),
};

AsterArcs.defaultProps = {
  onClick: noop,
  onMouseLeave: noop,
  onMouseMove: noop,
  onMouseOver: noop,
};
