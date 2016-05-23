import React, { PropTypes } from 'react';
import { VirtualScroll } from 'react-virtualized';
import SelectOption from './select-option';

import style from './menu.css';

const menuPropTypes = {
  focusedOption: PropTypes.object,
  focusOption: PropTypes.func,
  labelKey: PropTypes.string,
  options: PropTypes.array,
  selectValue: PropTypes.func,
  valueArray: PropTypes.array,
  multi: PropTypes.bool,
  hierarchical: PropTypes.bool,
  optionRenderer: PropTypes.func,
  width: PropTypes.number
};

export default function Menu(props) {
  /* eslint-disable react/prop-types */
  const {
    focusedOption,
    focusOption,
    hierarchical,
    labelKey,
    multi,
    options,
    optionRenderer,
    selectValue,
    valueArray,
    width
  } = props;
  const maxHeight = 200;
  const optionHeight = 23;

  const focusedOptionIndex = options.indexOf(focusedOption);
  const height = Math.min(maxHeight, options.length * optionHeight);

  function wrappedRowRenderer({ index }) {
    const option = options[index];

    return (
      <SelectOption
        focusedOption={focusedOption}
        focusedOptionIndex={focusedOptionIndex}
        focusOption={focusOption}
        labelKey={labelKey}
        multi={multi}
        option={option}
        options={options}
        selectValue={selectValue}
        valueArray={valueArray}
        hierarchical={hierarchical}
        optionRenderer={optionRenderer}
      />
    );
  }

  return (
    <VirtualScroll
      className={style.menu}
      height={height}
      width={width}
      rowHeight={optionHeight}
      rowRenderer={wrappedRowRenderer}
      rowCount={options.length}
      scrollToIndex={focusedOptionIndex}
    />
  );
  /* eslint-enable react/prop-types */
}

Menu.propTypes = menuPropTypes;

/**
 * wrapper for <Menu /> that provides it with a width
 * @param width {Number}
 * @returns {function()}
 */
export function menuWrapper({ width }) {
  return (menuProps) => {
    return <Menu width={width} {...menuProps} />;
  };
}
