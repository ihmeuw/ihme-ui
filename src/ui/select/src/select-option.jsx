import React, { PropTypes } from 'react';
import classNames from 'classnames';
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
  selected: PropTypes.bool
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
  optionRenderer: PropTypes.func,
  selectValue: PropTypes.func,
  valueArray: PropTypes.array,
};

const defaultProps = {
  hierarchical: false,
};

export default function SelectOption(props) {
  const {
    focusedOption,
    focusOption,
    multi,
    option,
    selectValue,
    valueArray,
  } = props;
  const isFocused = option === focusedOption;
  const isSelected = valueArray ? valueArray.includes(option) : false;
  const onClick = () => { return selectValue(option); };
  const onMouseOver = () => { return focusOption(option); };

  return (
    <div
      className={classNames(
        styles.option, {
          [styles.focused]: isFocused,
          [styles.selected]: isSelected
        }
      )}
      onClick={onClick}
      onMouseOver={onMouseOver}
    >
      {
        multi ? <Input selected={isSelected} /> : null
      }
      <SelectOptionLabel {...props} />
    </div>
  );
}

SelectOption.propTypes = propTypes;
SelectOption.defaultProps = defaultProps;
