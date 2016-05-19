import React, { PropTypes } from 'react';
import { VirtualScroll } from 'react-virtualized';
import MultiOption from './multi-option';
import SingleOption from './single-option';

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
    labelKey,
    options,
    selectValue,
    valueArray,
    multi,
    hierarchical,
    optionRenderer,
    width
  } = props;
  const maxHeight = 200;
  const optionHeight = 23;

  const focusedOptionIndex = options.indexOf(focusedOption);
  const height = Math.min(maxHeight, options.length * optionHeight);
  const innerRowRenderer = multi ? MultiOption : SingleOption;

  function wrappedRowRenderer({ index }) {
    const option = options[index];

    return innerRowRenderer({
      focusedOption,
      focusedOptionIndex,
      focusOption,
      labelKey,
      option,
      options,
      selectValue,
      valueArray,
      hierarchical,
      optionRenderer
    });
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


export function menuWrapper({ width }) {
  return (menuProps) => {
    return <Menu width={width} {...menuProps} />;
  };
}
