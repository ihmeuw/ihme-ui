import React, { PropTypes } from 'react';

const propTypes = {
  // option object must have a 'level' key that determines how far down
  // in hierarchy it belongs
  option: PropTypes.shape({
    level: PropTypes.number.isRequired,
    bold: PropTypes.bool
  }),

  // key on option that holds its label
  labelKey: PropTypes.string
};

const HierarchicalOption = (props) => {
  return (
    <span
      style={{
        marginLeft: (props.option.level || 0) * 5,
        fontWeight: props.option.bold ? 'bold' : 'normal'
      }}
    >
      {props.option[props.labelKey]}
    </span>
  );
};

HierarchicalOption.propTypes = propTypes;

export default HierarchicalOption;
