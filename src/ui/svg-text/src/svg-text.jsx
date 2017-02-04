import React, { PropTypes } from 'react';

/**
 * `import SvgText from 'ihme-ui/ui/svg-text'`
 *
 *  A primitive wrapper around an SVG `<text>` element.
 */
const SvgText = (props) => {
  const {
    x,
    y,
    dx,
    dy,
    value,
    anchor,
    fill
  } = props;

  return (
    <text
      textAnchor={anchor}
      fill={fill}
      y={y}
      dy={dy}
      x={x}
      dx={dx}
    >
      {value}
    </text>
  );
};

SvgText.propTypes = {
  /**
   * Text to render.
   */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * Where to anchor text.
   */
  anchor: PropTypes.oneOf(['start', 'middle', 'end']).isRequired,

  /**
   * Position element in x direction.
   */
  x: PropTypes.number.isRequired,

  /**
   * Position element in y direction.
   */
  y: PropTypes.number,

  /**
   * Shift element in x direction.
   */
  dx: PropTypes.number,

  /**
   * Shift element in y direction.
   */
  dy: PropTypes.number,

  /**
   * Fill color of txt.
   */
  fill: PropTypes.string
};

SvgText.defaultProps = {
  fill: 'black'
};

export default SvgText;
