import React from 'react';

// export default class AsterArc extends PureComponent {
//   render() {
//     const {
//       d,
//       fill,
//       key,
//     } = this.props;
//
//     return (
//       <path
//         d={d}
//         fill={fill}
//         key={key}
//       />
//     );
//   }
// }

export default function AsterArc(props) {
  const { className, d, fill, stroke } = props;

  return (
    <path
      className={className}
      d={d}
      fill={fill}
      stroke={stroke}
    />
  );
};

AsterArc.defaultProps = {
  fill: 'none',
  stroke: 'none',
};

AsterArc.propTypes = {
  /**
   * the css class of the arc
   */
  className: React.PropTypes.string,

  /**
   * the d attribute of the path of the arc
   */
  d: React.PropTypes.string,

  /**
   * the svg fill of the arc
   */
  fill: React.PropTypes.string,

  /**
   * the svg stroke attribute of the arc
   */
  stroke: React.PropTypes.string,
};
