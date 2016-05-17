import React, { PropTypes } from 'react';
import Select, { propTypes } from 'ihme-react-select';

import { getWidestLabel } from './utils';

import style from './select.css';
import Menu from './menu';
import Value from './value';
import MultiValueRenderer from './muli-value-renderer';

const defaultProps = {
  placeholder: 'Add/remove'
};

export default class MultiSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: `${getWidestLabel(props.options, props.labelKey, props.hierarchical) + 50}px`
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.options !== this.props.options ||
        newProps.labelKey !== this.props.labelKey ||
        newProps.hierarchical !== this.props.hierarchical) {
      /* eslint-disable max-len */
      this.setState({
        width: `${getWidestLabel(newProps.options, newProps.labelKey, newProps.hierarchical) + 50}px`
      });
      /* eslint-enable max-len */
    }
  }

  render() {
    return (
      <Select
        autofocus
        clearable
        searchable
        multi
        wrapperStyle={this.state}
        className={style.select}
        menuRenderer={Menu}
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
