import React from 'react';
import PropTypes from 'prop-types';
import { default as getValue } from 'lodash/get';

/**
 * Flat option label
 */
const flatOptionPropTypes = {
  // option object
  option: PropTypes.shape({
    bold: PropTypes.bool,
  }),

  // key on option that holds its label
  labelKey: PropTypes.string.isRequired,
};

export function FlatOptionLabel(props) {
  return (
    <span
      style={{
        fontWeight: props.option.bold ? 'bold' : 'normal',
      }}
    >
      {`${getValue(props.option, [props.labelKey], '')}`}
    </span>
  );
}

FlatOptionLabel.propTypes = flatOptionPropTypes;

/**
 * Hierarchical option label
 */
const hierarchicalOptionPropTypes = {
  // option object must have a 'level' key that determines how far down
  // in hierarchy it belongs
  option: PropTypes.shape({
    level: PropTypes.number.isRequired,
    bold: PropTypes.bool,
  }),

  // key on option that holds its label
  labelKey: PropTypes.string,
};

export function HierarchicalOptionLabel(props) {
  return (
    <span
      style={{
        marginLeft: `${(props.option.level || 0) * 5}px`,
        fontWeight: props.option.bold ? 'bold' : 'normal',
      }}
    >
      {`${getValue(props.option, [props.labelKey], '')}`}
    </span>
  );
}

HierarchicalOptionLabel.propTypes = hierarchicalOptionPropTypes;

/**
 * SelectOptionLabel
 */
const labelPropTypes = {
  hierarchical: PropTypes.bool,
  optionRenderer: PropTypes.func,
  option: PropTypes.object,
  labelKey: PropTypes.string,
};

export default function SelectOptionLabel(props) {
  const { optionRenderer, hierarchical, option, labelKey } = props;

  if (optionRenderer) return optionRenderer(props);
  if (hierarchical) return <HierarchicalOptionLabel option={option} labelKey={labelKey} />;
  return <FlatOptionLabel option={option} labelKey={labelKey} />;
}

SelectOptionLabel.propTypes = labelPropTypes;
