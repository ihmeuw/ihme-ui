import React, { PropTypes } from 'react';
import classnames from 'classnames';
import style from './option.css';

const propTypes = {
  focusedOption: PropTypes.object,
  focusOption: PropTypes.func,
  labelKey: PropTypes.string,
  option: PropTypes.object,
  selectValue: PropTypes.func,
  valueArray: PropTypes.array,
  hierarchical: PropTypes.bool,
  optionRenderer: PropTypes.func,
};

const MultiOption = (props) => {
  const { focusedOption, focusOption, labelKey, option, selectValue, valueArray } = props;
  const isFocused = option === focusedOption;
  const isSelected = valueArray ? valueArray.includes(option) : false;
  const onClick = () => { return selectValue(option); };
  const onMouseOver = () => { return focusOption(option); };

  return (
    <div
      className={classnames(style.option, { [style.focused]: isFocused })}
      style={{ height: 20 }}
      onClick={onClick}
      onMouseOver={onMouseOver}
    >
      <input
        type="checkbox"
        checked={isSelected}
        readOnly
      />
      <span
        className={classnames({ [style.selected]: isSelected })}
        style={{ marginLeft: 20 }}
      >
        {option[labelKey]}
      </span>
    </div>
  );
};

MultiOption.propTypes = propTypes;

export default MultiOption;
