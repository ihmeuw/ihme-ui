import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import bindAll from 'lodash/bindAll';
import castArray from 'lodash/castArray';
import pick from 'lodash/pick';
import xor from 'lodash/xor';

import {
  combineStyles,
  CommonPropTypes,
  computeDataMax,
  memoizeByLastCall,
  isVertical,
  propsChanged,
  stateFromPropUpdates,
  computeStackMax,
} from '../../../../utils';

import styles from './style.css';
import AxisChart from './../../../axis-chart';
import { XAxis, YAxis } from './../../../axis';
import {
  Bars,
  GroupedBars,
  StackedBars,
} from '../../../bar';
import ResponsiveContainer from '../../../responsive-container';
import Legend from './../../../legend';

const FOCUSED_STYLE = {
  stroke: '#000',
  strokeWidth: 2,
};

export default class StackedBarChart extends React.PureComponent {
  constructor(props) {
    super(props);

    this.combineStyles = memoizeByLastCall(combineStyles);
    this.castSelectionAsArray = memoizeByLastCall((selection) => castArray(selection));
    const initialState = {
      selectedItems: [],
    };
    this.state = stateFromPropUpdates(StackedBarChart.propUpdates, {}, props, initialState);

    bindAll(this, [
      'onClick',
    ]);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      stateFromPropUpdates(StackedBarChart.propUpdates, this.props, nextProps, this.state)
    );
  }

  onClick(_, datum) {
    this.setState({
      selectedItems: xor(this.state.selectedItems, [datum]),
    });
  }

  renderTitle() {
    const {
      labelAccessors,
      titleClassName,
      titleStyle,
    } = this.props;
    if (!labelAccessors.title) return null;
    return (
      <div className={classNames(styles.title, titleClassName)} style={titleStyle}>
        {labelAccessors.title}
      </div>
    );
  }

  renderLegend() {
    const {
      legendItems,
      legendAccessors: {
        labelKey,
        shapeColorKey,
        shapeTypeKey,
      },
      legendClassName,
      legendStyle,
    } = this.props;
    if (!legendItems) return null;
    return (
      <div className={classNames(styles.legend, legendClassName)} style={legendStyle}>
        <div className={styles['legend-wrapper']}>
          <Legend
            items={legendItems}
            labelKey={labelKey}
            shapeColorKey={shapeColorKey}
            shapeTypeKey={shapeTypeKey}
          />
        </div>
      </div>
    );
  }

  renderBars() {
    const {
      type,
      chartStyle,
      onClick = this.onClick,
    } = this.props;

    const {
      rangeMax,
      selectedItems,
    } = this.state;

    const childProps = pick(this.props, [
      'align',
      'bandPadding',
      'bandPaddingInner',
      'bandPaddingOuter',
      'categories',
      'subcategories',
      'colorScale',
      'data',
      'dataAccessors',
      'fill',
      'focus',
      'onMouseMove',
      'onMouseOver',
      'onMouseLeave',
      'orientation',
    ]);

    switch (type) {
      case 'normal':
        return (
          <Bars
            focusedStyle={FOCUSED_STYLE}
            onClick={onClick}
            selection={selectedItems}
            style={chartStyle}
            {...childProps}
          />
        );
      case 'grouped':
        return (
          <GroupedBars
            focusedStyle={FOCUSED_STYLE}
            onClick={onClick}
            rangeMax={rangeMax}
            style={chartStyle}
            selection={selectedItems}
            {...childProps}
          />
        );
      case 'stacked':
        return (
          <StackedBars
            focusedStyle={FOCUSED_STYLE}
            onClick={onClick}
            rangeMax={rangeMax}
            style={chartStyle}
            selection={selectedItems}
            {...childProps}
          />
        );
      default:
        throw Error(`chart type ${type} invalid; must be one of: 'normal', 'grouped', 'stacked'`);
    }
  }

  renderChart() {
    const {
      categories,
      chartStyle,
      orientation,
      labelAccessors,
      padding,
    } = this.props;

    const { rangeMax } = this.state;

    const chartRange = [0, rangeMax];

    const vertical = isVertical(orientation);

    return (
      <div className={classNames(styles.chart, chartStyle)}>
        <ResponsiveContainer>
          <AxisChart
            padding={padding}
            xDomain={vertical ? categories : chartRange}
            yDomain={vertical ? chartRange : categories}
            xScaleType={vertical ? 'band' : 'linear'}
            yScaleType={vertical ? 'linear' : 'band'}
          >
            <XAxis label={labelAccessors.xLabel ? labelAccessors.xLabel : 'X Axis'} />
            <YAxis label={labelAccessors.yLabel ? labelAccessors.yLabel : 'Y Axis'} />
            {this.renderBars()}
          </AxisChart>
        </ResponsiveContainer>
      </div>
    );
  }

  render() {
    const { className, displayLegend, style } = this.props;
    return (
      <div className={classNames(styles['chart-container'], className)} style={style}>
        {this.renderTitle()}
        {this.renderChart()}
        {displayLegend ? this.renderLegend() : null}
      </div>
    );
  }
}

StackedBarChart.propUpdates = {
  // Compute the upper value for the chart range.
  rangeMax: (state, _, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, [
      'data', 'type', 'categories', 'subcategories', 'dataAccessors',
    ])) {
      return state;
    }
    const {
      data,
      categories,
      dataAccessors: {
        category: categoryAccessor,
        value: valueAccessor,
      },
      type,
    } = nextProps;

    // If it's a stacked bar chart, we need to compute the range by adding all the values in each
    // stack and then finding the max. Otherwise, we can just use the max data value.
    return {
      ...state,
      rangeMax: type === 'stacked'
        ? computeStackMax(data, categories, categoryAccessor, valueAccessor)
        : computeDataMax(data, valueAccessor),
    };
  },
};

StackedBarChart.propTypes = {
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
   * inline styles applied to div wrapping the chart
   */
  chartStyle: PropTypes.object,

  /**
   * If provided will determine color of rendered `<Bar />`s
   */
  colorScale: PropTypes.func,

  /**
   * applied to chart-container
   */
  className: PropTypes.string,

  /**
   * Array of datum objects
   */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,

  /**
   * Accessors on datum objects
   *   fill: property on datum to provide fill (will be passed to `props.colorScale`)
   *   key: unique dimension of datum (required)
   *   stack: property on datum to position bars svg element rect in x-direction
   *   value: property on datum to position bars svg element rect in y-direction
   *   layer: property on datum to position bars svg element rect in categorical format. (grouped/stacked)
   *
   * Each accessor can either be a string or function. If a string, it is assumed to be the name of a
   * property on datum objects; full paths to nested properties are supported (e.g., { `x`: 'values.year', ... }).
   * If a function, it is passed datum objects as its first and only argument.
   */
  dataAccessors: PropTypes.shape({
    fill: PropTypes.string,
    category: PropTypes.string.isRequired,
    subcategory: PropTypes.string,
    value: PropTypes.string.isRequired,
  }).isRequired,

  /**
   * Boolean to display Legend or not
   */
  displayLegend: PropTypes.bool,

  /**
   * If `props.colorScale` is undefined, each `<Bar />` will be given this same fill value.
   */
  fill: PropTypes.string,

  /**
   * The datum object corresponding to the `<Bar />` currently focused.
   */
  focus: PropTypes.object,

  /**
   * Accessors to label properties
   *    title: property used to access the title of the composite component
   *    xLabel: property used to access the xLabel of the composite component
   *    yLabel: property used to access the yLabel of the composite component
   */
  labelAccessors: PropTypes.shape({
    title: PropTypes.string,
    xLabel: PropTypes.string,
    yLabel: PropTypes.string
  }),

  /**
   * Domain use for the layerOrdinal prop that scales the layer categorical data together.
   */
  categories: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ])).isRequired,

  subcategories: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),

  /**
   * Accessors to legend properties
   *    labelKey: property used to access the path to label in item objects (e.g., 'name', 'properties.label')
   *    shapeColorKey: property used to access the path to shape color in item objects (e.g., 'color', 'properties.color')
   *    shapeTypeKey: property used to access the path to shape type in item objects (e.g., 'type', 'properties.type')
   */
  legendAccessors: PropTypes.shape({
    labelKey: PropTypes.string,
    shapeColorKey: PropTypes.string,
    shapeTypeKey: PropTypes.string
  }),

  legendItems: PropTypes.arrayOf(PropTypes.object),

  /**
   * className applied to div wrapping the title
   */
  legendClassName: CommonPropTypes.className,

  /**
   * inline styles applied to div wrapping the legend
   */
  legendStyle: PropTypes.object,

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
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),

  /**
   * padding around the chart contents
   */
  padding: PropTypes.shape({
    top: PropTypes.number,
    bottom: PropTypes.number,
    right: PropTypes.number,
    left: PropTypes.number,
  }),

  /**
   * Datum object or array of datum objects corresponding to selected `<Bar />`s
   */
  selection: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),

  /**
   * inline styles applied to div wrapping the chart-container
   */
  style: PropTypes.object,

  /**
   * className applied to div wrapping the title
   */
  titleClassName: CommonPropTypes.className,

  /**
   * inline styles applied to div wrapping the title
   */
  titleStyle: PropTypes.object,

  /**
   * Type of bar chart to be created.
   * Options for grouped and stacked
   */
  type: PropTypes.oneOf(['normal', 'stacked', 'grouped']),
};

StackedBarChart.defaultProps = {
  orientation: 'vertical',
  displayLegend: false,
  type: 'normal',
};
