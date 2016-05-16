import React, { PropTypes } from 'react';
import { AutoSizer, VirtualScroll } from 'react-virtualized';
import { getStringWidth } from '../../../utils';
import MultiOption from './multi-option';
import SingleOption from './single-option';

import style from './menu.css';

const propTypes = {
  focusedOption: PropTypes.object,
  focusOption: PropTypes.func,
  labelKey: PropTypes.string,
  options: PropTypes.array,
  selectValue: PropTypes.func,
  valueArray: PropTypes.array,
  multi: PropTypes.bool,
  hierarchical: PropTypes.bool,
  optionRenderer: PropTypes.func,
};

const Menu = (props) => {
  const {
    focusedOption,
    focusOption,
    labelKey,
    options,
    selectValue,
    valueArray,
    multi,
    hierarchical,
    optionRenderer
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
    <AutoSizer disableHeight>
      {
        ({ width }) => {
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
        }
      }
    </AutoSizer>
  );
};

Menu.propTypes = propTypes;

export default Menu;
