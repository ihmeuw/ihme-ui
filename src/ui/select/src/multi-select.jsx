import React, { PropTypes } from 'react';
import Select, { propTypes as baseProps } from 'ihme-react-select';
import { assign } from 'lodash';

import { stateFromPropUpdates, propsChanged } from '../../../utils';
import { getWidestLabel } from './utils';

import style from './select.css';
import { menuWrapper } from './menu';
import Value from './value';
import multiValueRenderer from './muli-value-renderer';

export default class MultiSelect extends React.Component {
  constructor(props) {
    super(props);
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
        autofocus
        clearable
        searchable
        multi
        wrapperStyle={wrapperStyle}
        className={style.select}
        menuRenderer={menuRenderer}
        valueComponent={Value}
        valueRenderer={multiValueRenderer}
        menuStyle={menuStyle}
        menuContainerStyle={menuContainerStyle}
        resetValue={resetValue}
        autosize={false}
        {...this.props}
      />
    );
  }
}

const multiSelectPropTypes = {
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
