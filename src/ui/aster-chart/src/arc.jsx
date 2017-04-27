import React from 'react';
import classNames from 'classnames';

import {
  assign,
} from 'lodash';

import {
  CommonPropTypes,
  propsChanged,
  PureComponent,
  stateFromPropUpdates,
} from '../../../utils';

export default class AsterArc extends PureComponent {
  static getStyle({ datum, fill, selected, style, styleSelected }) {
    const baseStyle = { fill };
    const computedStyle = typeof style === 'function' ? style(datum) : style;
    let computedSelectedStyle = {};

    // if arc is selected, compute selectedStyle
    if (selected) {
      computedSelectedStyle = typeof selectedStyle === 'function' ?
        styleSelected(datum) : styleSelected;
    }
    return assign({}, baseStyle, computedStyle, computedSelectedStyle);
  }

  constructor(props) {
    super(props);

    this.state = stateFromPropUpdates(AsterArc.propUpdates, {}, props, {});
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      stateFromPropUpdates(
        AsterArc.propUpdates,
        this.props,
        nextProps,
        this.state,
        this
      )
    );
  }

  render() {
    const {
      className,
      classNameSelected,
      d,
      selected
    } = this.props;

    return (
      <path
        className={classNames(className, { [classNameSelected]: selected && classNameSelected })}
        d={d}
        style={this.state.style}
      />
    );
  }
}

AsterArc.propTypes = {
  /**
   * the css class of the arc
   */
  className: CommonPropTypes.className,

  /**
   * the css class of the arc when it is selected
   */
  classNameSelected: CommonPropTypes.className,

  /**
   * the d attribute of the path of the arc
   */
  d: React.PropTypes.string.isRequired,

  /**
   * Datum object corresponding to this AsterArc.
   * This object corresponds to the raw data that is bound to the d3.pie() data that
   * the Aster-Chart consumes.
   */
  datum: React.PropTypes.objectOf(React.PropTypes.string).isRequired,

  /**
   * the svg fill of the arc
   */
  fill: React.PropTypes.string,

  /**
   * Whether arc is selected.
   */
  selected: React.PropTypes.bool.isRequired,

  /**
   * Base inline styles applied to `<AsterArc />`s.
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<AsterArc />`.
   */
  style: CommonPropTypes.style,
};

AsterArc.defaultProps = {
  className: '',
  classNameSelected: '',
  fill: 'none',
  selected: false,
  styleSelected: {},
  style: {},
};

AsterArc.propUpdates = {
  // update style if datum, selected, selectedStyle, or style have changed
  style: (state, propName, prevProps, nextProps) => {
    if (!propsChanged(
      prevProps,
      nextProps, [
        'datum',
        'fill',
        'selected',
        'style',
        'styleSelected',
      ])) {
      return state;
    }

    return assign(state, {
      style: AsterArc.getStyle({
        datum: nextProps.datum,
        fill: nextProps.fill,
        selected: nextProps.selected,
        style: nextProps.style,
        styleSelected: nextProps.styleSelected,
      }),
    });
  },
};
