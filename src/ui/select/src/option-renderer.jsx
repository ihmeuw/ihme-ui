import React from 'react';

import SelectOption from './select-option';

export default function optionRenderer({ hierarchical, multi, optionStyle }) {
  return function optionRendererFn(passedProps) {
    const {
      key,
      option,
      style,
    } = passedProps;

    return (
      <div
        key={key}
        style={style}
        title={option.title}
      >
        <SelectOption
          {...passedProps}
          hierarchical={hierarchical}
          multi={multi}
          optionStyle={optionStyle}
        />
      </div>
    );
  };
}
