import React, {PropTypes} from 'react';
import classNames from 'classNames';
import {scaleLinear} from 'd3';
import {
  assign,
  findIndex,
  isFinite,
  keyBy,
  map,
  pick,
  sortBy,
} from 'lodash';

import {
  combineStyles,
  CommonDefaultProps,
  CommonPropTypes,
  memoizeByLastCall,
  propResolver,
  propsChanged,
  PureComponent,
  stateFromPropUpdates,
} from '../../../utils';

import Bar from './bar';

class Bars extends PureComponent {
  constructor(props) {
    super(props);

    this.combineStyles = memoizeByLastCall(combineStyles);
    this.state = stateFromPropUpdates(Bars.propUpdates, {}, props, {});

  }

  componentWillReceiveProps(nextProps) {
    this.state = stateFromPropUpdates(Bars.propUpdates, this.props, nextProps, this.state);
  }

  render() {
    const {
      className,
      colorScale,
      data,
      dataAccessors,
      fill,
      focus,
      scales,
      style,
    } = this.props;

    const { selectedDataMappedToKeys, sortedData } = this.state;

    const childProps = pick(this.props, [
      'focusedClassName',
      'focusedStyle',
      'onClick',
      'onMouseLeave',
      'onMouseMove',
      'onMouseOver',
      'selectedClassName',
      'selectedStyle',
    ]);

    return (
      <g
        className={className && classNames(className)}
        style={this.combineStyles(style, data)}
      >
        {
          map(sortedData, (datum) => {

            const key = propResolver(datum, dataAccessors.key);
            const fillValue = propResolver(datum, dataAccessors.fill || dataAccessors.x)

            const focusedDatumKey = focus ? propResolver(focus, dataAccessors.key) : null;

            const resolvedShapeType = dataAccessors.shape ?
              shapeScale(propResolver(datum, dataAccessors.shape)) :
              shapeType;

            const xValue = propResolver(datum, dataAccessors.x);
            const yValue = propResolver(datum, dataAccessors.y);

            return (
              <Bar
                className={shapeClassName}
                x
                key={key}
                datum={datum}
                fill={colorScale && isFinite(fillValue) ? colorScale(fillValue) : fill}
                focused={focusedDatumKey === key}
                selected={selectedDataMappedToKeys.hasOwnProperty(key)}
                shapeType={resolvedShapeType}
                style={shapeStyle}
                translateX={scales.x && isFinite(xValue) ? scales.x(xValue) : 0}
                translateY={scales.y && isFinite(yValue) ? scales.y(yValue) : 0}
                {...childProps}
              />
            );
          })


        }


      </g>
    );
  }






}
