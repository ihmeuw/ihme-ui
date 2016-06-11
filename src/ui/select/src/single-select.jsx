import React, { PropTypes } from 'react';
import Select, { propTypes as baseProps } from 'ihme-react-select';
import { assign } from 'lodash';

import { getWidestLabel } from './utils';

import style from './select.css';
import { menuWrapper } from './menu';

const singleSelectPropTypes = {
  /* width applied to outermost wrapper */
  width: PropTypes.number,

  /* width added to widest label (in px) */
  widthPad: PropTypes.number,
};

const defaultProps = {
  placeholder: 'Select...',
  widthPad: 50
};

export default class SingleSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuWidth: getWidestLabel(props.options, props.labelKey, props.hierarchical) + props.widthPad
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.options !== this.props.options ||
      newProps.labelKey !== this.props.labelKey ||
      newProps.hierarchical !== this.props.hierarchical) {
      this.setState({
        menuWidth: getWidestLabel(
          newProps.options,
          newProps.labelKey,
          newProps.hierarchical
        ) + newProps.widthPad
      });
    }
  }

  render() {
    const {
      menuContainerStyle,
      menuStyle,
      width,
      wrapperStyle,
    } = this.props;
    const { menuWidth } = this.state;

    return (
      <Select
        className={style.select}
        autofocus
        clearable
        searchable
        wrapperStyle={assign({}, { width: `${width}px` }, wrapperStyle)}
        menuRenderer={menuWrapper({ width: menuWidth })}
        menuStyle={assign({}, { overflow: 'hidden', width: `${menuWidth}px` }, menuStyle)}
        menuContainerStyle={assign({}, { width: `${menuWidth}px` }, menuContainerStyle)}
        autosize={false}
        {...this.props}
      />
    );
  }
}

SingleSelect.propTypes = assign({}, baseProps, singleSelectPropTypes);
SingleSelect.defaultProps = defaultProps;
