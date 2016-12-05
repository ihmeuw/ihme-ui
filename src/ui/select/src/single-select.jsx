import React, { PropTypes } from 'react';
import Select, { propTypes as baseProps } from 'ihme-react-select';
import { assign } from 'lodash';

import { stateFromPropUpdates, propsChanged } from '../../../utils';
import { getWidestLabel } from './utils';

import style from './select.css';
import { menuWrapper } from './menu';

export default class SingleSelect extends React.Component {
  constructor(props) {
    super(props);
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
        className={style.select}
        autofocus
        searchable
        wrapperStyle={wrapperStyle}
        menuRenderer={menuRenderer}
        menuStyle={menuStyle}
        menuContainerStyle={menuContainerStyle}
        autosize={false}
        {...this.props}
      />
    );
  }
}

const singleSelectPropTypes = {
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
    return assign({}, state, {
      menuContainerStyle: assign({}, {
        width: `${menuWidth}px`,
      }, nextProps.menuContainerStyle),
      menuRenderer: menuWrapper(menuWidth),
      menuStyle: assign({}, {
        overflow: 'hidden',
        width: `${menuWidth}px`,
      }, nextProps.menuStyle),
    });
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
