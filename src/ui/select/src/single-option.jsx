import React, { PropTypes } from 'react';
import classnames from 'classnames';
import style from './option.css';
import hierarchicalOption from './hierarchical-option-renderer';
import flatOption from './flat-option-renderer';

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

const defaultProps = {
  hierarchical: false,
};

const renderLabel = (props) => {
  const { optionRenderer, hierarchical, option, labelKey } = props;

  if (optionRenderer) return optionRenderer(props);
  if (hierarchical) return hierarchicalOption({ option, labelKey });
  return flatOption({ option, labelKey });
};


const SingleOption = (props) => {
  const {
    focusedOption,
    focusOption,
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
      className={classnames(
        style.option, {
          [style.focused]: isFocused,
          [style.selected]: isSelected
        }
      )}
      style={{ height: 20 }}
      onClick={onClick}
      onMouseOver={onMouseOver}
    >
      { renderLabel(props) }
    </div>
  );
};

SingleOption.propTypes = propTypes;
SingleOption.defaultProps = defaultProps;

export default SingleOption;
