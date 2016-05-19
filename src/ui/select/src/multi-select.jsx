import React, { PropTypes } from 'react';
import Select, { propTypes as baseProps } from 'ihme-react-select';
import { assign } from 'lodash';

import { getWidestLabel } from './utils';

import style from './select.css';
import { menuWrapper } from './menu';
import Value from './value';
import multiValueRenderer from './muli-value-renderer';

const multiSelectPropTypes = {
  /* width added to widest label (in px) */
  widthPad: PropTypes.number
};

const defaultProps = {
  placeholder: 'Add/remove',
  widthPad: 60
};

export default class MultiSelect extends React.Component {
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
        autofocus
        clearable
        searchable
        multi
        wrapperStyle={{ width: `${width}px` }}
        className={style.select}
        menuRenderer={menuWrapper(this.state)}
        valueComponent={Value}
        valueRenderer={multiValueRenderer}
        menuStyle={{ overflow: 'hidden' }}
        resetValue={[]}
        autosize={false}
        {...this.props}
      />
    );
  }
}

MultiSelect.propTypes = assign({}, baseProps, multiSelectPropTypes);
MultiSelect.defaultProps = defaultProps;
