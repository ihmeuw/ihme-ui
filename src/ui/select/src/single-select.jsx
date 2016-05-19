import React, { PropTypes } from 'react';
import Select, { propTypes as baseProps } from 'ihme-react-select';
import { assign } from 'lodash';

import { getWidestLabel } from './utils';

import style from './select.css';
import { menuWrapper } from './menu';

const singleSelectPropTypes = {
  /* width added to widest label (in px) */
  widthPad: PropTypes.number
};

const defaultProps = {
  placeholder: 'Select...',
  widthPad: 50
};

export default class SingleSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: getWidestLabel(props.options, props.labelKey, props.hierarchical) + props.widthPad
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.options !== this.props.options ||
      newProps.labelKey !== this.props.labelKey ||
      newProps.hierarchical !== this.props.hierarchical) {
      this.setState({
        width: getWidestLabel(
          newProps.options,
          newProps.labelKey,
          newProps.hierarchical
        ) + newProps.widthPad
      });
    }
  }

  render() {
    const { width } = this.state;
    return (
      <Select
        className={style.select}
        autofocus
        clearable
        searchable
        wrapperStyle={{ width: `${width}px` }}
        menuRenderer={menuWrapper(this.state)}
        menuStyle={{ overflow: 'hidden' }}
        autosize={false}
        {...this.props}
      />
    );
  }
}

SingleSelect.propTypes = assign({}, baseProps, singleSelectPropTypes);
SingleSelect.defaultProps = defaultProps;
