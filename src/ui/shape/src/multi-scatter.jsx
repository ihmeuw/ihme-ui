import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { castArray, map, pick } from 'lodash';
import Scatter from './scatter';

import { propResolver, PureComponent, CommonDefaultProps, CommonPropTypes } from '../../../utils';

export default class MultiScatter extends PureComponent {
  render() {
    const {
      className,
      clipPathId,
      colorScale,
      data,
      fieldAccessors,
      scatterClassName,
      scatterValuesIteratee,
      selection,
      style,
      symbolScale,
      symbolStyle,
    } = this.props;

    const {
      color: colorField,
      data: dataField,
      key: keyField,
      symbol: symbolField,
    } = fieldAccessors;

    const childProps = pick(this.props, [
      'dataAccessors',
      'focus',
      'focusedClassName',
      'focusedStyle',
      'onClick',
      'onMouseLeave',
      'onMouseMove',
      'onMouseOver',
      'selectedClassName',
      'selectedStyle',
      'scales',
      'size',
      'symbolClassName',
      'symbolScale',
    ]);

    return (
      <g
        className={className && classNames(className)}
        clipPath={clipPathId && `url(#${clipPathId})`}
        style={style}
      >
        {
          map(data, (datum) => {
            const key = propResolver(datum, keyField);
            const values = propResolver(datum, dataField);

            const color = colorScale(colorField ? propResolver(datum, colorField) : key);

            const symbolType = symbolField && symbolScale(propResolver(datum, symbolField));

            const scatterValues = scatterValuesIteratee(values, key);

            return !!scatterValues ? (
              <Scatter
                className={scatterClassName}
                data={scatterValues}
                fill={color}
                key={`scatter:${key}`}
                selection={castArray(selection)}
                style={symbolStyle}
                symbolType={symbolType}
                {...childProps}
              />
            ) : null;
          })
        }
      </g>
    );
  }
}

MultiScatter.propTypes = {
  /* base classname to apply to mult-scatter <g> wrapper */
  className: CommonPropTypes.className,

  /* string id url for clip path */
  clipPathId: PropTypes.string,

  /* function for a scale of colors. If present, overrides fill */
  colorScale: PropTypes.func,

  /* array of datum objects */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,

  /*
   accessors on datum objects
     fill: property on data to provide fill (will be passed to colorScale)
     x: property on data to position in x-direction
     y: property on data to position in y-direction
   */
  dataAccessors: PropTypes.shape({
    fill: CommonPropTypes.dataAccessor,
    key: CommonPropTypes.dataAccessor,
    symbol: CommonPropTypes.dataAccessor,
    x: CommonPropTypes.dataAccessor,
    y: CommonPropTypes.dataAccessor,
  }).isRequired,

  /*
   key names containing fields for child component configuration
     color -> (optional) color data as input to color scale.
     data -> data provided to child components. default: 'values'
     key -> unique key to apply to child components. used as input to color scale if color field is not specified. default: 'key'
     symbol -> symbol data as input to the symbol scale.
   */
  fieldAccessors: PropTypes.shape({
    color: CommonPropTypes.dataAccessor,
    data: CommonPropTypes.dataAccessor.isRequired,
    key: CommonPropTypes.dataAccessor.isRequired,
    symbol: CommonPropTypes.dataAccessor,
  }),

  /* the symbol to focus */
  focus: PropTypes.object,

  /* classname to be applied if symbol has focus */
  focusedClassName: CommonPropTypes.className,

  /*
   inline-style object or function to be applied if symbol has focus;
   if a function, is called with datum
   can override style and selectedStyle
   */
  focusedStyle: CommonPropTypes.style,

  /* mouse events signature: function(event, data, instance) {...} */
  onClick: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseOver: PropTypes.func,

  /* scales */
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func,
  }).isRequired,

  /*
   classname to apply to Scatter's <g> wrapper;
   named 'scatterClassName' to disambiguate 'className' prop passed to Symbol
   */
  scatterClassName: CommonPropTypes.className,

  /*
   function to apply to the datum to transform scatter values. default: _.identity
   @param values
   @param key
   @return transformed data (or undefined)
   */
  scatterValuesIteratee: PropTypes.func,

  /* classname to be applied to Symbol if selected */
  selectedClassName: CommonPropTypes.className,

  /*
   inline-style object or function to be applied if symbol is selected;
   if a function, is called with datum
   can override style
   */
  selectedStyle: CommonPropTypes.style,

  /* a symbol that is selected, or an array of symbols selected */
  selection: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),

  /* size of symbols; see Symbol.propTypes */
  size: PropTypes.number,

  style: CommonPropTypes.style,

  /* base classname to apply to symbol */
  symbolClassName: CommonPropTypes.className,

  /* function to transform symbol value to a shape */
  symbolScale: PropTypes.func,

  /*
   inline-style object or function to be applied as base style for Symbols;
   if a function, is called with associated datum
   */
  symbolStyle: PropTypes.style,
};

MultiScatter.defaultProps = {
  colorScale() { return 'steelblue'; },
  fieldAccessors: {
    data: 'values',
    key: 'key',
  },
  scatterValuesIteratee: CommonDefaultProps.identity,
  size: 64,
  symbolField: 'type',
  symbolScale() { return 'circle'; },
};
