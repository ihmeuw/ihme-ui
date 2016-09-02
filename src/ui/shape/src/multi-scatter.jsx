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
      dataField,
      keyField,
      scatterClassName,
      scatterValuesIteratee,
      selection,
      style,
      symbolField,
      symbolScale,
      symbolStyle,
    } = this.props;

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
            const symbol = propResolver(datum, symbolField);
            const fill = colorScale(key);
            const symbolType = symbolScale(symbol);

            const scatterValues = scatterValuesIteratee(values, key);

            return !!scatterValues ? (
              <Scatter
                className={scatterClassName}
                data={scatterValues}
                fill={fill}
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
    x: CommonPropTypes.dataAccessor,
    y: CommonPropTypes.dataAccessor,
  }).isRequired,

  /* key that holds individual datum to be represented in the scatter plot */
  dataField: PropTypes.string,

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

  /* unique key that identifies the dataset to be plotted within the array of datasets */
  keyField: PropTypes.string,

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
  dataField: 'values',
  keyField: 'key',
  scatterValuesIteratee: CommonDefaultProps.identity,
  size: 64,
  symbolField: 'type',
  symbolScale() { return 'circle'; },
};
