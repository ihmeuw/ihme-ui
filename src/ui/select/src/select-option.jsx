import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { bindAll, includes } from 'lodash';

import { propsChanged } from '../../../utils';

import styles from './select-option.css';

import SelectOptionLabel from './select-option-label';

/**
 * Input box for multiselect
 */
function Input({ selected }) {
  return (
    <input
      type="checkbox"
      className={styles.input}
      checked={selected}
      readOnly
    />
  );
}

Input.propTypes = {
  selected: PropTypes.bool,
};

/**
 * SelectOption
 */
const propTypes = {
  focusedOption: PropTypes.object,
  focusOption: PropTypes.func,
  hierarchical: PropTypes.bool,
  labelKey: PropTypes.string,
  multi: PropTypes.bool,
  option: PropTypes.object,
  optionClassName: PropTypes.string,
  optionRenderer: PropTypes.func,
  optionStyle: PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.func,
  ]),
  selectValue: PropTypes.func,
  valueArray: PropTypes.array,
};

const defaultProps = {
  hierarchical: false,
};

export default class SelectOption extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      style: this.computeStyle(props.optionStyle, props.option),
    };

    bindAll(this, [
      'onClick',
      'onMouseOver',
    ]);
  }

  componentWillReceiveProps(nextProps) {
    if (propsChanged(this.props, nextProps, ['option', 'optionStyle'])) {
      this.setState({
        style: this.computeStyle(nextProps.optionStyle, nextProps.option),
      });
    }
  }

  onClick() {
    return this.props.selectValue(this.props.option);
  }

  onMouseOver() {
    return this.props.focusOption(this.props.option);
  }

  computeStyle(style, option) {
    if (typeof style === 'function') return style(option);
    return style;
  }

  render() {
    const {
      focusedOption,
      multi,
      option,
      valueArray,
    } = this.props;

    const {
      style,
    } = this.state;

    const isFocused = option === focusedOption;
    const isSelected = includes(valueArray, option);
    const isDisabled = Boolean(option.disabled);

    return (
      <div
        className={classNames(
          styles.option, {
            [styles.focused]: isFocused,
            [styles.selected]: isSelected,
            [styles.disabled]: isDisabled,
          }
        )}
        onClick={!isDisabled && this.onClick}
        onMouseOver={!isDisabled && this.onMouseOver}
        style={style}
      >
        {
          multi ? <Input selected={isSelected} /> : null
        }
        <SelectOptionLabel {...this.props} />
      </div>
    );
  }
}

SelectOption.propTypes = propTypes;
SelectOption.defaultProps = defaultProps;
