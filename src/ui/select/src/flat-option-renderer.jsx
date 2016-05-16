import { PropTypes } from 'react';

const propTypes = {
  // option object
  option: PropTypes.obj,

  // key on option that holds its label
  labelKey: PropTypes.string
};

const FlatOption = (props) => {
  return props.option[props.labelKey];
};

FlatOption.propTypes = propTypes;

export default FlatOption;
