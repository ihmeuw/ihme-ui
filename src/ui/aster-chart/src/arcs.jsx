import React from 'react';
import classNames from 'classnames';

import {
  bindAll,
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
      outlineFunction,
      selected,
      styleArc,
      styleArcGroup,
      styleOverArc,
      styleSelectedArc,
      styleUnderArc,
    } = this.props;

    return (
      <g
        className={classNames(classNameArcGroup)}
        onClick={this.onClick}
        onMouseLeave={this.onMouseLeave}
        onMouseMove={this.onMouseMove}
        onMouseOver={this.onMouseOver}
        style={styleArcGroup}
      >
        <AsterArc
          className={classNames(classNameUnder)}
          d={outlineFunction(datum)}
          datum={datum}
          style={styleUnderArc}
        />
        <AsterArc
          className={classNames(classNameArc)}
          d={arcValueFunction(datum)}
          datum={datum}
          fill={colorScale(propResolver(datum.data, colorField))}
          style={styleArc}
        />
        <AsterArc
          className={classNames(classNameOver)}
          classNameSelected={classNames(classNameSelectedArcs)}
          d={outlineFunction(datum)}
          datum={datum}
          selected={selected}
          style={styleOverArc}
          styleSelected={styleSelectedArc}
        />
      </g>
    );
  }
}

AsterArcs.propTypes = {
  /**
   * This is a function that is provided by d3.arc() to calculate
   * the d attribute of the colored `value` portion of AsterArc path.
   *
   * This prop is automatically populated by the AsterChart that calls it
   */
  arcValueFunction: React.PropTypes.func.isRequired,

  /**
   * name of css class for the colored `value` arc of <AsterArcs />
   */
  classNameArc: CommonPropTypes.className,

  /**
   * name of css class for the returned group of arcs that make up <AsterArcs />
   */
  classNameArcGroup: CommonPropTypes.className,

  /**
   * name of css class for the over arcs
   */
  classNameOver: CommonPropTypes.className,

  /**
   * name of css class for the over arcs
   */
  classNameSelectedArcs: CommonPropTypes.className,

  /**
   * name of css class for the under arcs
   */
  classNameUnder: CommonPropTypes.className,

  /**
   * - prop in data that maps to colorScale
   */
  colorField: CommonPropTypes.dataAccessor.isRequired,

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
   * This is a function that is provided by d3.arc() to calculate
   * the d attribute of the full outline of the AsterArc path.
   *
   * This prop is automatically populated by the AsterChart that calls it
   */
  outlineFunction: React.PropTypes.func.isRequired,

  /**
   * Whether arc is selected.
   */
  selected: React.PropTypes.bool.isRequired,

  /**
   * Base inline styles applied to `<Arc />`s. (Controls color fill -- may have side effects since
   * fill is automatically chosen by the colorScale given to Aster-Chart)
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Arc />`
   * and return value spread into line styles;
   * signature: (datum) => obj
   */
  styleArc: CommonPropTypes.style,

  /**
   * Inline styles applied to main `g` element returned in `<Arc />`.
   * fill is automatically chosen by the colorScale given to Aster-Chart)
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Arc />`
   * and return value spread into line styles;
   * signature: (datum) => obj
   */
  styleArcGroup: CommonPropTypes.style,

  /**
   * Base inline styles applied to overlaying `<Arc />`s. (controls non-selected outline)
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Arc />`.
   */
  styleOverArc: CommonPropTypes.style,

  /**
   * Selected inline styles applied to overlaying `<Arc />`s. (Control's selected outline)
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Arc />`.
   */
  styleSelectedArc: CommonPropTypes.style,

  /**
   * Base inline styles applied to underlying `<Arc />`s. (Controls hover)
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Arc />`.
   */
  styleUnderArc: CommonPropTypes.style,
};

AsterArcs.defaultProps = {
  classNameArc: '',
  classNameArcGroup: '',
  classNameOver: '',
  classNameSelectedArcs: '',
  classNameUnder: '',
  onClick: noop,
  onMouseLeave: noop,
  onMouseMove: noop,
  onMouseOver: noop,
  styleArc: {},
  styleArcGroup: {},
  styleOverArc: {},
  styleSelectedArc: {},
  styleUnderArc: {},
};
