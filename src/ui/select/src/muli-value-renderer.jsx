import { PropTypes } from 'react';

const propTypes = {
  placeholder: PropTypes.string.isRequired
};

export default function multiValueRenderer(props) {
  return props.placeholder;
}

multiValueRenderer.propTypes = propTypes;
