import { PropTypes } from 'react';

const propTypes = {
  placeholder: PropTypes.string
};

const MultiValueRenderer = (props) => {
  return props.placeholder;
};

MultiValueRenderer.propTypes = propTypes;

export default MultiValueRenderer;
