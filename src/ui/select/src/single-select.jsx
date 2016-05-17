import React from 'react';
import Select, { propTypes } from 'ihme-react-select';

import { getWidestLabel } from './utils';

import style from './select.css';
import Menu from './menu';

const defaultProps = {
  placeholder: 'Select...'
};

export default class SingleSelect extends React.Component {
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
        className={style.select}
        autofocus
        clearable
        searchable
        wrapperStyle={this.state}
        menuRenderer={Menu}
        menuStyle={{ overflow: 'hidden' }}
        autosize={false}
        {...this.props}
      />
    );
  }
}

SingleSelect.propTypes = propTypes;
SingleSelect.defaultProps = defaultProps;
