import React from 'react';

export default function inputRenderer(inputProps) {
  return (
    <div
      className={inputProps.className}
      key="input-wrap"
    >
      <input
        {...inputProps}
      />
    </div>
  );
}
