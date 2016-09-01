import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { scaleLinear } from 'd3-scale';
import { map, pick } from 'lodash';

import Area from './area';
import { propResolver, PureComponent, CommonDefaultProps, CommonPropTypes } from '../../../utils';

export default class MultiArea extends PureComponent {
  render() {
    const {
      areaClassName,
      areaStyle,
      areaValuesIteratee,
      className,
      colorScale,
      data,
      dataAccessors,
      dataField,
      keyField,
      scales,
      style,
    } = this.props;

    const mouseEvents = pick(this.props, [
      'onClick',
      'onMouseLeave',
      'onMouseMove',
      'onMouseOver',
    ]);

    return (
      <g className={className && classNames(className)} style={style}>
        {
          map(data, (datum) => {
            const key = propResolver(datum, keyField);
            const values = propResolver(datum, dataField);
            const color = colorScale(key);

            const areaValues = areaValuesIteratee(values, key);

            return (!!dataAccessors.x &&
                    !!dataAccessors.y0 &&
                    !!dataAccessors.y1 &&
                    !!areaValues) ? (
              <Area
                className={areaClassName}
                dataAccessors={dataAccessors}
                data={areaValues}
                key={`area:${key}`}
                scales={scales}
                style={{
                  fill: color,
                  stroke: color,
                  ...areaStyle,
                }}
                {...mouseEvents}
              />
            ) : null;
          })
        }
      </g>
    );
  }
}

MultiArea.propTypes = {
  /* base classname to apply to Areas that are children of MultiLine */
  areaClassName: CommonPropTypes.className,
  areaStyle: CommonPropTypes.style,

  /*
   function to apply to the datum to transform area values. default: _.identity
   @param values
   @param key
   @return transformed data (or undefined)
   */
  areaValuesIteratee: PropTypes.func,

  /* fn that accepts keyfield, and returns stroke color for line */
  colorScale: PropTypes.func,

  className: CommonPropTypes.className,

  /* array of objects
    e.g. [ {location: 'USA',values: []}, {location: 'Canada', values: []} ]
  */
  data: PropTypes.arrayOf(PropTypes.object),

  /*
    key names containing x, y data
      x -> accessor for xscale
      y0 -> accessor for yscale (when there're two; e.g., lower bound)
      y1 -> accessor for yscale (when there're two; e.g., upper bound)
  */
  dataAccessors: PropTypes.shape({
    x: CommonPropTypes.dataAccessor.isRequired,
    y0: CommonPropTypes.dataAccessor.isRequired,
    y1: CommonPropTypes.dataAccessor.isRequired,
  }).isRequired,

  /* key that holds values to be represented by individual lines */
  dataField: CommonPropTypes.dataAccessor,

  /* key that uniquely identifies dataset within array of datasets */
  keyField: CommonPropTypes.dataAccessor,

  /* signature: function(event, line data, Line instance) {...} */
  onClick: PropTypes.func,

  /* signature: function(event, line data, Line instance) {...} */
  onMouseLeave: PropTypes.func,

  /* signature: function(event, line data, Line instance) {...} */
  onMouseMove: PropTypes.func,

  /* signature: function(event, line data, Line instance) {...} */
  onMouseOver: PropTypes.func,

  /* scales from d3Scale */
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func,
  }).isRequired,

  style: CommonPropTypes.style,
};

MultiArea.defaultProps = {
  areaValuesIteratee: CommonDefaultProps.identity,
  colorScale: () => 'steelblue',
  dataField: 'values',
  keyField: 'key',
  scales: { x: scaleLinear(), y: scaleLinear() },
  showUncertainty: false,
  showLine: true,
};
