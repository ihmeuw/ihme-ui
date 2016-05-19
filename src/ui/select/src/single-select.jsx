import React from 'react';
import Select, { propTypes } from 'ihme-react-select';

import { getWidestLabel } from './utils';

import style from './select.css';
import { menuWrapper } from './menu';

const defaultProps = {
  placeholder: 'Select...'
};

export default class SingleSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: getWidestLabel(props.options, props.labelKey, props.hierarchical) + 50
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.options !== this.props.options ||
      newProps.labelKey !== this.props.labelKey ||
      newProps.hierarchical !== this.props.hierarchical) {
      this.setState({
        width: getWidestLabel(newProps.options, newProps.labelKey, newProps.hierarchical) + 50
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

SingleSelect.propTypes = propTypes;
SingleSelect.defaultProps = defaultProps;
