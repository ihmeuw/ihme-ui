import React from 'react';
import Select from 'ihme-react-select';
import { getStringWidth } from '../../../utils';

import style from './select.css';
import Menu from './menu';

const defaultProps = {
  placeholder: 'Select...'
};

export default class SingleSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: `${this.getWidestLabel(props.options, props.labelKey, props.hierarchical)}px`
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.options !== this.props.options ||
      newProps.labelKey !== this.props.labelKey ||
      newProps.hierarchical !== this.props.hierarchical) {
      /* eslint-disable max-len */
      this.setState({
        width: `${this.getWidestLabel(newProps.options, newProps.labelKey, newProps.hierarchical)}px`
      });
      /* eslint-enable max-len */
    }
  }

  getWidestLabel(options, labelKey, hierarchical) {
    // find longest label,
    // then add 36px to account for width of padding, input box, etc
    return options.reduce((maxWidth, option) => {
      const labelWidth = getStringWidth(option[labelKey]);

      // take padding into account for hierarchically displayed list
      const fullWidth = hierarchical ? labelWidth + 5 * option.level : labelWidth;

      return Math.max(maxWidth, fullWidth);
    }, 0) + 36;
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

SingleSelect.defaultProps = defaultProps;
