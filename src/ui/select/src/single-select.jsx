import React, { PropTypes } from 'react';
import classNames from 'classnames';
import Select, { propTypes as baseProps } from 'ihme-react-select';
import { assign } from 'lodash';

import { stateFromPropUpdates, propsChanged, PureComponent } from '../../../utils';
import { FLIP_MENU_UPWARDS_INLINE_STYLE, getWidestLabel } from './utils';

import style from './select.css';
import { menuWrapper } from './menu';

export default class SingleSelect extends PureComponent {
  constructor(props) {
    super(props);
    console.warn(
      'Deprecated: SingleSelect will not be available in future versions.'
      + ' Please use Select.'
    );
    this.state = stateFromPropUpdates(SingleSelect.propUpdates, {}, props, {});
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      stateFromPropUpdates(SingleSelect.propUpdates, this.props, nextProps, {})
    );
  }

  render() {
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
        menuContainerStyle={menuContainerStyle}
        menuRenderer={menuRenderer}
        menuStyle={menuStyle}
        searchable
        wrapperStyle={wrapperStyle}
      />
    );
  }
}

const singleSelectPropTypes = {
  /* drop down will flip up */
  menuUpward: PropTypes.bool,

  /* width applied to outermost wrapper */
  width: PropTypes.number,

  /* width added to widest label (in px) */
  widthPad: PropTypes.number,
};

SingleSelect.propTypes = assign({}, baseProps, singleSelectPropTypes);

SingleSelect.defaultProps = {
  placeholder: 'Select...',
  widthPad: 50,
};

SingleSelect.propUpdates = {
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

    // if menu width changes, also set menuStyle and menuContainerStyle
    // also create new HoC for menuRenderer
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
