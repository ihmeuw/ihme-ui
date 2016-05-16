import React from 'react';
import Select from 'ihme-react-select';
import { getStringWidth } from '../../../utils';

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
      width: this.getWidestLabel(props.options, props.labelKey, props.hierarchical)
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.options !== this.props.options ||
        newProps.labelKey !== this.props.labelKey ||
        newProps.hierarchical !== this.props.hierarchical) {
      this.setState({
        width: this.getWidestLabel(newProps.options, newProps.labelKey, newProps.hierarchical)
      });
    }
  }

  getWidestLabel(options, labelKey, hierarchical) {
    // find longest label,
    // then add 50 px to account for width of padding, input box, etc
    return options.reduce((maxWidth, option) => {
      const labelWidth = getStringWidth(option[labelKey]);

      // take padding into account for hierarchically displayed list
      const fullWidth = hierarchical ? labelWidth + 5 * option.level : labelWidth;

      return Math.max(maxWidth, fullWidth);
    }, 0) + 50;
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

MultiSelect.defaultProps = defaultProps;
