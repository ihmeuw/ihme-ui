import React, {PropTypes} from 'react';
import classNames from 'classnames';
import {scaleLinear, scaleBand} from 'd3';
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
  isDefault,
  isVertical,
  memoizeByLastCall,
  propResolver,
  propsChanged,
  PureComponent,
  stateFromPropUpdates,
} from '../../../utils';

import Bar from './bar';

/**
 * `import { Bars } from 'ihme-ui'`
 */
export default class Bars extends PureComponent {
  constructor(props) {
    super(props);

    this.combineStyles = memoizeByLastCall(combineStyles);
    this.state = stateFromPropUpdates(Bars.propUpdates, {}, props, {});
  }

  componentWillReceiveProps(nextProps) {
    this.setState(stateFromPropUpdates(Bars.propUpdates, this.props, nextProps, this.state));
  }

  render() {
    const {
      bandPadding,
      bandPaddingInner,
      bandPaddingOuter,
      categoryTranslate,
      className,
      clipPathId,
      colorScale,
      data,
      dataAccessors,
      fill,
      focus,
      height,
      layerOrdinal,
      orientation,
      scales,
      rectClassName,
      rectStyle,
      style,
      type,
      // ordinal,
      // linear,
      stacked,
      grouped,
      layerDomain,
    } = this.props;

    const { selectedDataMappedToKeys, sortedData } = this.state;

    const childProps = pick(this.props, [
      'categoryTranslate',
      'focusedClassName',
      'focusedStyle',
      'onClick',
      'onMouseLeave',
      'onMouseMove',
      'onMouseOver',
      'selectedClassName',
      'selectedStyle',
    ]);

    const ordinal = (isVertical(orientation) ? scales.x : scales.y);
    const linear = (isVertical(orientation) ? scales.y : scales.x);


    // update Domain


    //check padding proptypes and set accordingly, need to clean up code
    if (bandPaddingOuter !== undefined) {
      ordinal.paddingOuter(bandPaddingOuter);
    } else if (bandPaddingInner !== undefined) {
      ordinal.paddingInner(bandPaddingInner);
    } else {
      ordinal.padding(bandPadding);
    }

    return (
      <g
        className={className && classNames(className)}
        clipPath={clipPathId && `url(#${clipPathId})`}
        style={this.combineStyles(style, data)}
        transform={`translate(${isVertical(orientation) ? categoryTranslate : 0}, ${isVertical(orientation) ? 0 : categoryTranslate})`}
      >
        {
          map(sortedData, (datum) => {
            const key = propResolver(datum, dataAccessors.key);
            const fillValue = propResolver(datum, dataAccessors.fill || dataAccessors.x);
            const focusedDatumKey = focus ? propResolver(focus, dataAccessors.key) : null;

            // Calculates the appropriate x and y inputs or the scaling functions.
            // May need to add new value since grouped and stack typically has two categorical groups
            let xValue = grouped ? propResolver(datum, dataAccessors.layer) :
              stacked ? propResolver(datum.data, dataAccessors.stack) : propResolver(datum, dataAccessors.stack);
            // if (isVertical(orientation)) {
            //   if (stacked) {
            //     xValue = propResolver(datum.data, dataAccessors.stack);
            //   } else if (grouped) {
            //     xValue = propResolver(datum, dataAccessors.layer)
            //   }
            // } else {
            //     xValue = propResolver(datum, dataAccessors.value)
            // }

            const yValue = propResolver(datum, !stacked ? dataAccessors.value : 1);


            // console.log(yValue);
            // //
            // console.log(xValue);
            // console.log(linear(xValue));


            const xPosition =
                          !isVertical(orientation) && !stacked ? 0 :
                            isVertical(orientation) && !grouped ? ordinal(xValue) :
                            stacked ? linear(datum[0]) : layerOrdinal(xValue);

            const yPosition =
                          isVertical(orientation) && !stacked ? linear(yValue) :
                            !isVertical(orientation) && !grouped ? ordinal(xValue) :
                            stacked ? linear(datum[1]) : layerOrdinal(yValue);


            const barHeight =
                          isVertical(orientation) && !stacked ? height - linear(yValue) :
                            !isVertical(orientation) && !grouped ? ordinal.bandwidth() :
                            stacked ? linear(datum[0]) - linear(yValue) : layerOrdinal.bandwidth();

           // console.log(barHeight);
           // console.log(yValue);

            // conditions here needs to be cleaned
            const barWidth =
                          isVertical(orientation) && !grouped ? ordinal.bandwidth() :
                            isVertical(orientation) && grouped ? layerOrdinal.bandwidth() :
                            !isVertical(orientation) && grouped ? linear(xValue) :
                            !isVertical(orientation) && stacked ? linear(yValue) - linear(datum[0]) : linear(yValue);


                        // !isVertical(orientation) && !stacked ? linear(yValue) :
                        //   isVertical(orientation) && !grouped ? ordinal.bandwidth() :
                        //   stacked ? linear(yValue) - linear(datum[0]) : layerOrdinal.bandwidth();


            // console.log(datum);

            return (
              <Bar
                className={rectClassName}
                key={key}
                datum={datum}

                // normal vertical bar chart
                // x={ordinal(xValue)}
                // y={linear(yValue)}
                // rectHeight={height - linear(yValue)}
                // rectWidth={ordinal.bandwidth()}

                // normal horizontal bar chart
                // x={0}
                // y={ordinal(xValue)}
                // rectHeight={ordinal.bandwidth()}
                // rectWidth={linear(yValue)}

                // grouped vertical bar chart
                // x={layerOrdinal(xValue)}
                // y={linear(yValue)}
                // rectHeight={height - linear(yValue)}
                // rectWidth={layerOrdinal.bandwidth()}

                // grouped horizontal bar chart
                // x={0}
                // y={layerOrdinal(yValue)}
                // rectHeight={layerOrdinal.bandwidth()}
                // rectWidth={linear(xValue)}

                x={xPosition}
                y={yPosition}
                rectHeight={barHeight}
                rectWidth={barWidth}

                // stacked vertical bar chart
                // x={ordinal(datum.data.location)}
                // y={linear(datum[1])}
                // rectHeight={linear(datum[0]) - linear(datum[1])}
                // rectWidth={ordinal.bandwidth()}

                // x={ordinal(datum.data.category)}
                // y={linear(datum[1])}
                // rectHeight={linear(datum[0]) - linear(datum[1])}
                // rectWidth={ordinal.bandwidth()}


                fill={colorScale && isFinite(fillValue) ? colorScale(fillValue) : fill}
                // fill={fill}
                focused={focusedDatumKey === key}
                selected={selectedDataMappedToKeys.hasOwnProperty(key)}
                style={rectStyle}
                translateX={isVertical(orientation) && isFinite(xValue) ? ordinal(xValue) : 0}
                translateY={isVertical(orientation) && isFinite(yValue) ? 0 : ordinal(yValue)}
                {...childProps}
              />
            );
          })
        }
      </g>
    );
  }

}

Bars.propTypes = {

  /**
   * Ordinal scaleBand align property. Sets the alignment of `<Bars />`s to the to the
   * specified value which must be in the range [0, 1].
   * See https://github.com/d3/d3-scale/blob/master/README.md#scaleBand for reference.
   */
  align: PropTypes.number,

  /**
   * Ordinal scaleBand padding property. A convenience method for setting the inner and
   * outer padding of `<Bars />`s to the same padding value
   * See https://github.com/d3/d3-scale/blob/master/README.md#scaleBand for reference.
   */
  bandPadding: PropTypes.number,

  /**
   * Ordinal scaleBand paddingInner property. Sets the inner padding of `<Bars />`s to the
   * specified value which must be in the range [0, 1].
   * See https://github.com/d3/d3-scale/blob/master/README.md#scaleBand for reference.
   */
  bandPaddingInner: PropTypes.number,

  /**
   * Ordinal scaleBand paddingOuter property. Sets the outer padding of `<Bars />`s to the
   * specified value which must be in the range [0, 1].
   * See https://github.com/d3/d3-scale/blob/master/README.md#scaleBand for reference.
   */
  bandPaddingOuter: PropTypes.number,

  /**
   * Translation value scaled appropriately for the inner categorical data within a
   * grouped bar chart.
   */
  categoryTranslate: PropTypes.number,

  /**
   * className applied to outermost wrapping `<g>`.
   */
  className: CommonPropTypes.className,

  /**
   * If a clip path is applied to a container element (e.g., an `<AxisChart />`),
   * clip all children of `<Bars />` to that container by passing in the clip path URL id.
   */
  clipPathId: PropTypes.string,

  /**
   * If provided will determine color of rendered `<Bar />`s
   */
  colorScale: PropTypes.func,

  /**
   * Array of datum objects
   */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,

  /**
   * Accessors on datum objects
   *   fill: property on datum to provide fill (will be passed to `props.colorScale`)
   *   key: unique dimension of datum (required)
   *   shape: property on datum used to determine which type of shape to render (will be passed to `props.shapeScale`)
   *   x: property on datum to position scatter shapes in x-direction
   *   y: property on datum to position scatter shapes in y-direction
   *
   * Each accessor can either be a string or function. If a string, it is assumed to be the name of a
   * property on datum objects; full paths to nested properties are supported (e.g., { `x`: 'values.year', ... }).
   * If a function, it is passed datum objects as its first and only argument.
   */
  dataAccessors: PropTypes.shape({
    fill: CommonPropTypes.dataAccessor,
    key: CommonPropTypes.dataAccessor.isRequired,
    x: CommonPropTypes.dataAccessor,
    y: CommonPropTypes.dataAccessor,
  }).isRequired,

  /**
   * If `props.colorScale` is undefined, each `<Bar />` will be given this same fill value.
   */
  fill: PropTypes.string,

  /**
   * The datum object corresponding to the `<Bar />` currently focused.
   */
  focus: PropTypes.object,

  /**
   * className applied if `<Bar />` has focus.
   */
  focusedClassName: CommonPropTypes.className,

  /**
   * inline styles applied to focused `<Bar />`
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Bar />`,
   * and return value is spread into inline styles;
   * signature: (datum) => obj
   */
  focusedStyle: CommonPropTypes.style,

  /**
   * Inner ordinal scale for categorical data within a grouped bar chart.
   */
  layerOrdinal: PropTypes.func,

  /**
   * onClick callback.
   * signature: (SyntheticEvent, datum, instance) => {...}
   */
  onClick: PropTypes.func,

  /**
   * onMouseLeave callback.
   * signature: (SyntheticEvent, datum, instance) => {...}
   */
  onMouseLeave: PropTypes.func,

  /**
   * onMouseMove callback.
   * signature: (SyntheticEvent, datum, instance) => {...}
   */
  onMouseMove: PropTypes.func,

  /**
   * onMouseOver callback.
   * signature: (SyntheticEvent, datum, instance) => {...}
   */
  onMouseOver: PropTypes.func,

  /**
   * Orientation in which bars should be created.
   * Defaults to vertical, but option for horizontal orientation supported.
   */
  orientation: PropTypes.string,

  /**
   * className applied to each `<Bar />`
   */
  rectClassName: CommonPropTypes.className,

  /**
   * Inline styles passed to each `<Bar />`
   */
  rectStyle: CommonDefaultProps.style,

  /**
   * `x` and `y` scales for positioning `<Bar />`s.
   * Object with keys: `x`, and `y`.
   */
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func,
  }),

  /**
   * className applied to `<Bar />`s if selected
   */
  selectedClassName: CommonPropTypes.className,

  /**
   * Array of datum objects corresponding to selected `<Bar />`s
   */
  selection: PropTypes.array,

  /**
   * Inline styles applied to wrapping element (`<g>`) of scatter shapes
   */
  style: CommonPropTypes.style,

  /**
   * Type of bar chart to be created.
   * Default is a simple vertically oriented bar graph. Options for grouped and
   * stacked are also supported.
   */
  type: PropTypes.string,
};


Bars.defaultProps = {
  fill: 'steelblue',
  onClick: CommonDefaultProps.noop,
  onMouseLeave: CommonDefaultProps.noop,
  onMouseMove: CommonDefaultProps.noop,
  onMouseOver: CommonDefaultProps.noop,
  scales: { x: scaleBand(), y: scaleLinear() },
  bandPadding: 0.05,
  orientation: 'vertical',
  categoryTranslate: 0,
  layerOrdinal: scaleBand(),
  type: 'default'
};


// Need to reevaluate this portion
Bars.propUpdates = {
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
