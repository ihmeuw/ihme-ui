import React from 'react';
import { map } from 'lodash';

import AsterArc from './aster-arc';

export default function AsterArcs(props) {
  const {
    arc,
    arcOutlineStroke,
    color,
    data,
  } = props;

  return (
    <g className="arc-group">
      {
        map(data, (d, i) => (
          <g key={i} className="arc-set">
            <AsterArc
              className="under-arc"
              d={arc.outlineFunction(d)}
            />
            <AsterArc
              className="arc"
              d={arc.arcValueFunction(d)}
              fill={color.colorScale(d.data[color.colorProp])}
            />
            <AsterArc
              className="over-arc"
              d={arc.outlineFunction(d)}
              stroke={arcOutlineStroke} // let this be modifiable -- and leave room for a selected arc { i === selected ? selectedStroke : strokeColor}
            />
          </g>
        ))
      }
    </g>
  );
};

AsterArcs.propTypes = {
  /**
   * arc object containing valueFunction, and outlineFunction
   */
  arc: React.PropTypes.object,

  /**
   * function to determine d attr of value arc
   */
  arcValueFunction: React.PropTypes.func,

  /**
   * non-selected outline stroke color
   */
  arcOutlineStroke: React.PropTypes.string,

  /**
   * non-selected outline selected stroke color
   */
  arcSelectedStroke: React.PropTypes.string,

  /**
   * color object containing colorScale and colorProp
   */
  color: React.PropTypes.object,

  /**
   * function to determine color from propertay of data
   */
  colorScale: React.PropTypes.func,

  /**
   * property to use for color function
   */
  colorProp: React.PropTypes.string,

  /**
   * the data to be displayed by arc
   */
  data: React.PropTypes.array,

  /**
   * function to determine d attr of outline arc
   */
  outlineFunction: React.PropTypes.array,
};

AsterArcs.defaultProps = {
  arcOutlineStroke: '#fff',
};
