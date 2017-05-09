import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { scaleLinear } from 'd3';
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
  CommonDefaultProps,
  CommonPropTypes,
  propResolver,
  propsChanged,
  PureComponent,
  stateFromPropUpdates,
} from '../../../utils';

import Symbol from './symbol';

export default class Scatter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = stateFromPropUpdates(Scatter.propUpdates, {}, props, {});
  }

  componentWillReceiveProps(nextProps) {
    this.state = stateFromPropUpdates(Scatter.propUpdates, this.props, nextProps, this.state);
  }

  render() {
    const {
      className,
      clipPathId,
      colorScale,
      dataAccessors,
      fill,
      focus,
      scales,
      symbolClassName,
      symbolScale,
      symbolType,
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
      'size',
      'style',
    ]);

    return (
      <g
        className={className && classNames(className)}
        clipPath={clipPathId && `url(#${clipPathId})`}
      >
        {
          map(sortedData, (datum) => {
            // value passed into colorScale
            // use dataAccessors.x as fail-over for backward compatibility
            const key = propResolver(datum, dataAccessors.key);
            const fillValue = propResolver(datum, dataAccessors.fill || dataAccessors.x);

            const focusedDatumKey = focus ? propResolver(focus, dataAccessors.key) : null;

            const resolvedSymbolType = dataAccessors.symbol ?
              symbolScale(propResolver(datum, dataAccessors.symbol)) :
              symbolType;

            const xValue = propResolver(datum, dataAccessors.x);
            const yValue = propResolver(datum, dataAccessors.y);

            return (
              <Symbol
                className={symbolClassName}
                key={key}
                datum={datum}
                fill={colorScale && isFinite(fillValue) ? colorScale(fillValue) : fill}
                focused={focusedDatumKey === key}
                selected={selectedDataMappedToKeys.hasOwnProperty(key)}
                symbolType={resolvedSymbolType}
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

Scatter.propTypes = {
  /* base classname to apply to scatter <g> wrapper */
  className: CommonPropTypes.className,

  /* string id url for clip path */
  clipPathId: PropTypes.string,

  /* function for a scale of colors. If present, overrides fill */
  colorScale: PropTypes.func,

  /* array of datum objects */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,

  /*
    accessors on datum objects; each should be either
    a property on datum objects or function which accepts that datum object
      fill: property on datum to provide fill (will be passed to colorScale)
      key: unique dimension of datum (required)
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

  /* string for the color of this data group */
  fill: PropTypes.string,

  /* the symbol to focus */
  focus: PropTypes.object,

  /* mouse events signature: function(event, data, instance) {...} */
  onClick: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseOver: PropTypes.func,

  /* scales */
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func,
  }),

  /* a symbol that is selected, or an array of symbols selected */
  selection: PropTypes.array,

  /* size of symbols; see Symbol.propTypes */
  size: PropTypes.number,

  style: CommonPropTypes.style,

  /* base classname to apply to symbol */
  symbolClassName: CommonPropTypes.className,

  symbolScale: PropTypes.func,

  /* string for the type of symbol to be used */
  symbolType: PropTypes.string,
};

Scatter.defaultProps = {
  fill: 'steelblue',
  onClick: CommonDefaultProps.noop,
  onMouseLeave: CommonDefaultProps.noop,
  onMouseMove: CommonDefaultProps.noop,
  onMouseOver: CommonDefaultProps.noop,
  scales: { x: scaleLinear(), y: scaleLinear() },
  size: 64,
  symbolType: 'circle',
};

Scatter.propUpdates = {
  selections: (state, _, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, ['selection', 'dataAccessors'])) return state;
    return assign({}, state, {
      selectedDataMappedToKeys: keyBy(nextProps.selection, (selectedDatum) =>
        propResolver(selectedDatum, nextProps.dataAccessors.key)
      ),
    });
  },
  sortedData: (state, _, prevProps, nextProps) => {
    /* eslint-disable max-len, eqeqeq */
    if (!propsChanged(prevProps, nextProps, ['selection', 'data'])) return state;
    const keyField = nextProps.dataAccessors.key;
    return assign({}, state, {
      // sort data by whether or not datum is selected
      // this is a way of ensuring that selected symbols are rendered last
      // similar to, in a path click handler, doing a this.parentNode.appendChild(this)
      sortedData: sortBy(nextProps.data, (datum) =>
        findIndex(nextProps.selection, (selected) =>
          propResolver(datum, keyField) == propResolver(selected, keyField)
        )
      ),
    });
  },
};
