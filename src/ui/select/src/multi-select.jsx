import React from 'react';
import Select, { propTypes } from 'ihme-react-select';

import { getWidestLabel } from './utils';

import style from './select.css';
import { menuWrapper } from './menu';
import Value from './value';
import MultiValueRenderer from './muli-value-renderer';

const defaultProps = {
  placeholder: 'Add/remove'
};

export default class MultiSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: getWidestLabel(props.options, props.labelKey, props.hierarchical) + 60
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.options !== this.props.options ||
        newProps.labelKey !== this.props.labelKey ||
        newProps.hierarchical !== this.props.hierarchical) {
      this.setState({
        width: getWidestLabel(newProps.options, newProps.labelKey, newProps.hierarchical) + 60
      });
    }
  }

  render() {
    const { width } = this.state;
    return (
      <Select
        autofocus
        clearable
        searchable
        multi
        wrapperStyle={{ width: `${width}px` }}
        className={style.select}
        menuRenderer={menuWrapper(this.state)}
        valueComponent={Value}
        valueRenderer={MultiValueRenderer}
        menuStyle={{ overflow: 'hidden' }}
        resetValue={[]}
        autosize={false}
        {...this.props}
      />
    );
  }
}

MultiSelect.propTypes = propTypes;
MultiSelect.defaultProps = defaultProps;
