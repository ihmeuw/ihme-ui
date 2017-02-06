import React, { PropTypes } from 'react';
import classNames from 'classnames';
import Select, { propTypes as baseProps } from 'ihme-react-select';
import { assign } from 'lodash';

import { stateFromPropUpdates, propsChanged, PureComponent } from '../../../utils';
import { FLIP_MENU_UPWARDS_INLINE_STYLE, getWidestLabel } from './utils';

import style from './select.css';
import { menuWrapper } from './menu';
import Value from './value';
import multiValueRenderer from './multi-value-renderer';

export default class MultiSelect extends PureComponent {
  constructor(props) {
    super(props);
    console.warn(
      'Deprecated: MultiSelect will not be available in future versions.'
      + ' Please use Select with prop `multi`.'
    );
    this.state = stateFromPropUpdates(MultiSelect.propUpdates, {}, props, {});
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      stateFromPropUpdates(MultiSelect.propUpdates, this.props, nextProps, {})
    );
  }

  render() {
    const {
      resetValue,
    } = this.props;

    const {
      menuContainerStyle,
      menuRenderer,
      menuStyle,
      wrapperStyle,
    } = this.state;

    return (
      <Select
        {...this.props}
        autofocus
        autosize={false}
        className={classNames(style.select, this.props.className)}
        clearable
        menuRenderer={menuRenderer}
        multi
        menuContainerStyle={menuContainerStyle}
        menuStyle={menuStyle}
        resetValue={resetValue}
        searchable
        valueComponent={Value}
        valueRenderer={multiValueRenderer}
        wrapperStyle={wrapperStyle}
      />
    );
  }
}

const multiSelectPropTypes = {
  /* drop down will flip up */
  menuUpward: PropTypes.bool,

  /* width applied to outermost wrapper */
  width: PropTypes.number,

  /* width added to widest label (in px) */
  widthPad: PropTypes.number,
};

MultiSelect.propTypes = assign({}, baseProps, multiSelectPropTypes);

MultiSelect.defaultProps = {
  placeholder: 'Add/remove',
  resetValue: [],
  widthPad: 60,
};

MultiSelect.propUpdates = {
  menu(state, _, prevProps, nextProps) {
    if (!propsChanged(prevProps, nextProps, [
      'hierarchical',
      'labelKey',
      'menuContainerStyle',
      'menuStyle',
      'options',
      'widthPad',
    ])) {
      return state;
    }

    const menuWidth = getWidestLabel(
      nextProps.options,
      nextProps.labelKey,
      nextProps.hierarchical
    ) + nextProps.widthPad;

    return assign(
      {},
      state,
      {
        menuContainerStyle: assign(
          {},
          { width: `${menuWidth}px` },
          nextProps.menuContainerStyle,
          nextProps.menuUpward && FLIP_MENU_UPWARDS_INLINE_STYLE
        ),
        menuRenderer: menuWrapper(menuWidth),
        menuStyle: assign(
          {},
          { overflow: 'hidden', width: `${menuWidth}px` },
          nextProps.menuStyle
        ),
      }
    );
  },

  wrapperStyle(state, _, prevProps, nextProps) {
    if (!propsChanged(prevProps, nextProps, ['width', 'wrapperStyle'])) {
      return state;
    }

    return assign({}, state, {
      wrapperStyle: assign({}, { width: `${nextProps.width}px` }, nextProps.wrapperStyle),
    });
  }
};
