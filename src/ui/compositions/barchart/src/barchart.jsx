import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { scaleLinear, scaleBand } from 'd3';

import {
  castArray,
  get as getValue,
  map,
} from 'lodash';

import {
  isVertical,
  combineStyles,
  CommonDefaultProps,
  CommonPropTypes,
  memoizeByLastCall,
  propResolver,
  PureComponent,
  stackedDataArray,
} from '../../../../utils';

import styles from './style.css';




import AxisChart from './../../../axis-chart';
import { XAxis, YAxis } from './../../../axis';
import Bars from './../../../bar/src/bars';
import ResponsiveContainer from '../../../responsive-container';
import MultiBars from './../../../bar';
import Legend from './../../../legend';


export default class BarChart extends PureComponent {
  constructor(props) {
    super(props);

    this.combineStyles = memoizeByLastCall(combineStyles);
    this.castSelectionAsArray = memoizeByLastCall((selection) => castArray(selection));

  }


  renderTitle() {
    const {
      title,
      titleClassName,
      titleStyle,
    } = this.props;
    if (!title) return null;
    return (
      <div className={classNames(styles.title, titleClassName)} style={titleStyle}>
        <h2>
          {title}
        </h2>
      </div>
    )
  }

  renderLegend() {
    const {
      legendObject,
      labelKey,
      shapeColorKey,
      shapeTypeKey,
      legendClassName,
      legendStyle,
    } = this.props;

    return (
      <div className={classNames(styles.legend, legendClassName)} style={legendStyle}>
        <div className={styles['legend-wrapper']}>
          {/*<ResponsiveContainer disableHeight>*/}
            <Legend
              items={legendObject}
              labelKey={labelKey} // should default these to fit to one type of legend object config
              shapeColorKey={shapeColorKey}
              shapeTypeKey={shapeTypeKey}
            />
          {/*</ResponsiveContainer>*/}
        </div>
      </div>
    );
  }

  renderBarChart() {
    const {
      data,
      className,
      xDomain,
      yDomain,
      xScale,
      yScale,
      xLabel,
      yLabel,
      fill,
      fillField,
      stackField,
      valueField,
      barChartStyle
    } = this.props;



    return (
      <div className={classNames(styles.barchart, barChartStyle)}>
        {this.renderTitle()}
        <ResponsiveContainer>
          <AxisChart
            xDomain={xDomain}
            yDomain={yDomain}
            xScaleType={xScale}
            yScaleType={yScale}
          >
            <XAxis
              label={xLabel} // should default to domain field
            />
            <YAxis
              label={yLabel}
            />
            <Bars
            data={data}
            dataAccessors={{
            fill: fillField,
            key: 'id',
            stack: stackField,    // year_id
            value: valueField, // population
            }}
            // style={barChartStyle}
            // selection={this.state.selectedItems}
            >
            </Bars>
          </AxisChart>
        </ResponsiveContainer>
        {this.renderLegend()}
      </div>
    );
  }

  render() {

    const {className, style, data} = this.props;

    console.log(data);

    return(
      <div className={classNames(styles['barchart-container'], className)} style={style}>
        {/*{this.renderTitle()}*/}
        {this.renderBarChart()}
        {/*{this.renderLegend()}*/}
      </div>
    );
  }
}




// <AxisChart
//   height={300}
//   width={500}
//   xDomain={locationFieldDomain}
//   yDomain={populationFieldDomain}
//   xScaleType="band"
//   yScaleType="linear"
// >
//   <XAxis/>
//   <YAxis/>
//   <MultiBars
//     colorScale={colorScale}
//     data={locationData}
//     innerDomain={yearFieldDomain}
//     dataAccessors={{
//       fill: yearField,
//       key: 'id', // rename to relate to inner grouping
//       x: yearField, // field of nested data
//       y: populationField,
//     }}
//     fieldAccessors={{
//       data: 'values',
//       key: 'location',
//     }}
//     focus={this.state.focus}
//     focusedStyle={{
//       stroke: '#000',
//       strokeWidth: 2,
//     }}
//     onClick={this.onClick}
//     onMouseLeave={this.onMouseLeave}
//     onMouseMove={this.onMouseMove}
//     onMouseOver={this.onMouseOver}
//     selection={this.state.selectedItems}
//     selectedStyle={{
//       stroke: '#000',
//       strokeWidth: 1,
//     }}
//     type="grouped"
//   />
// </AxisChart>
