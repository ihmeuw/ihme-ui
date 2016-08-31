import React, { PropTypes } from 'react';
import classNames from 'classnames';
import {
  assign,
  findIndex,
  isFinite,
  keyBy,
  map,
  noop,
  pick,
  sortBy,
} from 'lodash';
import {
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
      'symbolType',
    ]);

    return (
      <g className={className && classNames(className)} clipPath={`url(#${clipPathId})`}>
        {
          map(sortedData, (plotDatum) => {
            // value passed into colorScale
            // use dataAccessors.x as fail-over for backward compatibility
            const fillValue = propResolver(plotDatum, dataAccessors.fill || dataAccessors.x);

            // value passed into xScale
            const xValue = propResolver(plotDatum, dataAccessors.x);

            // value passed into yScale
            const yValue = propResolver(plotDatum, dataAccessors.y);
            const focusedDatumKey = focus ? propResolver(focus, dataAccessors.key) : null;
            const key = propResolver(plotDatum, dataAccessors.key);
            return (
              <Symbol
                className={symbolClassName}
                key={key}
                datum={plotDatum}
                fill={colorScale && isFinite(fillValue) ? colorScale(fillValue) : fill}
                focused={focusedDatumKey === key}
                selected={selectedDataMappedToKeys.hasOwnProperty(key)}
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
    fill: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    x: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    y: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  }).isRequired,

  /* string for the color of this data group */
  fill: PropTypes.string,

  /* the symbol to focus */
  focus: PropTypes.object,

  /* signature: function(event, data, Symbol) {...} */
  onClick: PropTypes.func,

  /* signature: function(event, data, Symbol) {...} */
  onMouseLeave: PropTypes.func,

  /* signature: function(event, data, Symbol) {...} */
  onMouseMove: PropTypes.func,

  /* signature: function(event, data, Symbol) {...} */
  onMouseOver: PropTypes.func,

  /* scales */
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func,
  }).isRequired,

  /* a symbol that is selected, or an array of symbols selected */
  selection: PropTypes.array,

  /* size of symbols; see Symbol.propTypes */
  size: PropTypes.number,

  /* base classname to apply to symbol */
  symbolClassName: CommonPropTypes.className,

  /* string for the type of symbol to be used */
  symbolType: PropTypes.string,
};

Scatter.defaultProps = {
  fill: 'steelblue',
  onClick: noop,
  onMouseLeave: noop,
  onMouseMove: noop,
  onMouseOver: noop,
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
